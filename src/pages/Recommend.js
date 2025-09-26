// routes/recommend.js  (버전: low-budget friendly + multi-fallback)
import express from "express";
import { getDB } from "../db.js";

const router = express.Router();

/* ---------------------- 정규식/파서 ---------------------- */
const SOCKET_RX = /(AM5|AM4|LGA\s?1700|LGA\s?1200|s?TRX4|TR4)/i;
const DDR_RX = /\bDDR(4|5)\b/i;
const CAP_RX = /(\d+)\s?GB/i;

function parseSocketFromBoardInfo(info = "") {
  const m = (info || "").match(SOCKET_RX);
  return m ? m[1].replace(/\s+/g, "").toUpperCase() : "";
}

// CPU 이름에서 세대 기반으로 소켓 추정 (간단 휴리스틱)
function inferCpuSocket(cpuName = "") {
  const n = (cpuName || "").toUpperCase();

  // AMD
  if (/RYZEN\s*(7|9|5|3)\s*7\d{3}/i.test(n)) return "AM5";   // Ryzen 7000
  if (/RYZEN/i.test(n)) return "AM4";

  // Intel
  if (/I[3579]-1[2-4]\d{3}/i.test(n) || /1[2-4]\d{3}K?F?/i.test(n)) return "LGA1700"; // 12~14세대
  if (/I[3579]-10\d{3}|I[3579]-11\d{3}/i.test(n) || /10\d{3}|11\d{3}/i.test(n)) return "LGA1200";

  return "";
}

function parseDdrFromMemory(info = "") {
  const m = (info || "").match(DDR_RX);
  return m ? `DDR${m[1]}`.toUpperCase() : "";
}
function parseDdrFromBoard(info = "") {
  if (/DDR5/i.test(info)) return "DDR5";
  if (/DDR4/i.test(info)) return "DDR4";
  return "";
}
function parseCapacityGB(info = "") {
  const m = (info || "").match(CAP_RX);
  return m ? Number(m[1]) : 0;
}

/* ---------------------- 가격/점수 ---------------------- */
function recentMedianPrice(part = {}) {
  const hist = Array.isArray(part.priceHistory) ? part.priceHistory : [];
  if (hist.length === 0) return Number(part.price) || 0;
  const last = hist.slice(-7);
  const arr = last.map((x) => Number(x.price)).filter((n) => n > 0);
  if (!arr.length) return Number(part.price) || 0;
  arr.sort((a, b) => a - b);
  const mid = Math.floor(arr.length / 2);
  return arr.length % 2 ? arr[mid] : Math.round((arr[mid - 1] + arr[mid]) / 2);
}

function gpuPerf(part = {}) {
  const pm = Number(part?.benchmarkScore?.passmarkscore) || 0;
  if (pm) return pm;
  const ts = Number(part?.benchmarkScore?.timeSpyScore) || 0;
  return Math.round(ts * 5); // 근사 스케일
}
function cpuPerf(part = {}) {
  return (
    Number(part?.benchmarkScore?.passmarkscore) ||
    Number(part?.benchmarkScore?.cinebenchMulti) ||
    0
  );
}
function valueScore(score, price) {
  if (!price || price <= 0) return 0;
  return score / price;
}

/* ---------------------- 목적 프로파일 ---------------------- */
const PURPOSE = {
  "게임용": {
    budgetGuide: { cpu: [0.2, 0.35], gpu: [0.45, 0.6], memory: [0.05, 0.15], motherboard: [0.05, 0.12] },
    weights: { cpu: 1.0, gpu: 1.4, mem: 0.2, board: 0.1 },
    minMemGB: 16, recMemGB: 32, preferDDR: "DDR5",
  },
  "작업용": {
    budgetGuide: { cpu: [0.35, 0.55], gpu: [0.2, 0.4], memory: [0.1, 0.25], motherboard: [0.05, 0.15] },
    weights: { cpu: 1.4, gpu: 1.0, mem: 0.3, board: 0.1 },
    minMemGB: 32, recMemGB: 64, preferDDR: "DDR5",
  },
  "가성비": {
    budgetGuide: { cpu: [0.25, 0.4], gpu: [0.3, 0.5], memory: [0.05, 0.15], motherboard: [0.05, 0.12] },
    weights: { cpu: 1.1, gpu: 1.1, mem: 0.2, board: 0.1 },
    minMemGB: 16, recMemGB: 32, preferDDR: "", // DDR4 허용
  },
};
function pickProfile(purpose) {
  return PURPOSE[purpose] || PURPOSE["가성비"];
}

// 저예산일 때 자동 완화(핵심!)
function loosenProfileForLowBudget(prof, totalBudget) {
  const p = JSON.parse(JSON.stringify(prof));

  if (totalBudget <= 1500000) {
    // 예산 분배 가이드 범위 넓히기(각 파트 -5%p ~ +5%p)
    for (const k of Object.keys(p.budgetGuide)) {
      const [lo, hi] = p.budgetGuide[k];
      p.budgetGuide[k] = [Math.max(0, lo - 0.05), Math.min(0.8, hi + 0.05)];
    }
    // 메모리 최소치 완화
    p.minMemGB = Math.min(p.minMemGB, 16);
    // DDR 선호 완화(게임/작업도 DDR4 허용)
    p.preferDDR = "";
  }

  if (totalBudget <= 1000000) {
    // 더 과감히 느슨하게
    for (const k of Object.keys(p.budgetGuide)) {
      const [lo, hi] = p.budgetGuide[k];
      p.budgetGuide[k] = [Math.max(0, lo - 0.08), Math.min(0.85, hi + 0.08)];
    }
    p.minMemGB = Math.min(p.minMemGB, 16);
  }
  return p;
}

/* ---------------------- 호환성 ---------------------- */
function isCpuBoardCompatible(cpu, board) {
  const cpuSock = inferCpuSocket(cpu?.name || "");
  const mbSock = parseSocketFromBoardInfo(board?.info || "");
  if (!cpuSock || !mbSock) return true;
  return cpuSock === mbSock;
}
function isMemBoardCompatibleHard(mem, board) {
  const memDdr = parseDdrFromMemory(mem?.info || "");
  if (!memDdr) return true;
  const mbDdr = parseDdrFromBoard(board?.info || "");
  if (!mbDdr) return true;
  return memDdr === mbDdr;
}
// 소프트 매칭: 불일치 허용 + 점수 패널티
function memDdrPenalty(mem, board) {
  const memDdr = parseDdrFromMemory(mem?.info || "");
  const mbDdr = parseDdrFromBoard(board?.info || "");
  if (!memDdr || !mbDdr || memDdr === mbDdr) return 0;
  return 400; // 기본 가점 만큼의 페널티(= 가점 상쇄)
}

/* ---------------------- 스코어링 ---------------------- */
function comboScore({ cpu, gpu, memory, board, purpose, totalPrice, softMemPenalty = 0 }) {
  const prof = pickProfile(purpose);
  const cScore = cpuPerf(cpu);
  const gScore = gpuPerf(gpu);
  const mGB = parseCapacityGB(memory?.info || "");
  const w = prof.weights;

  let score = w.cpu * cScore + w.gpu * gScore;

  if (mGB >= prof.minMemGB) score += w.mem * mGB * 50;
  // preferDDR은 저예산 완화에서 비활성화될 수 있음
  const memDdr = parseDdrFromMemory(memory?.info || "");
  if (prof.preferDDR && memDdr === prof.preferDDR) score += 400;

  // 병목 패널티
  const ratio = (cScore && gScore) ? Math.max(cScore / gScore, gScore / cScore) : 1;
  if (ratio > 2.0) score *= 0.85;
  else if (ratio > 1.6) score *= 0.93;

  // 메모리-보드 DDR 불일치 시 소프트 패널티 반영
  if (softMemPenalty) score -= softMemPenalty;

  // 가격당 성능
  score += valueScore(score, totalPrice) * 2000;

  return Math.round(score);
}

function withinBudgetGuide(partPrice, totalBudget, [low, high]) {
  const ratio = partPrice / totalBudget;
  return ratio >= low && ratio <= high;
}

/* ---------------------- 응답 포맷 보조 ---------------------- */
function pickFields(p) {
  if (!p) return null;
  return {
    name: p.name,
    category: p.category,
    price: p._price || p.price,
    image: p.image,
    info: p.info,
    benchmarkScore: p.benchmarkScore || null,
  };
}
function buildResponse(builds) {
  const balanced = builds.find(b => b.label === "균형") || builds[0] || null;
  return { builds, recommended: balanced };
}

/* ---------------------- 메인 로직 ---------------------- */
router.post("/", async (req, res) => {
  try {
    const { budget = 0, purpose = "가성비", allowOver = 0 } = req.body;
    const totalBudget = Number(budget);
    let overRatio = Math.min(Math.max(Number(allowOver) || 0, 0), 0.1); // 기본 최대 +10%

    const db = getDB();
    const [cpus, gpus, mems, boards] = await Promise.all([
      db.collection("parts").find({ category: "cpu", price: { $gt: 0 } }).toArray(),
      db.collection("parts").find({ category: "gpu", price: { $gt: 0 } }).toArray(),
      db.collection("parts").find({ category: "memory", price: { $gt: 0 } }).toArray(),
      db.collection("parts").find({ category: "motherboard", price: { $gt: 0 } }).toArray(),
    ]);

    // 가격 안정화
    for (const x of [...cpus, ...gpus, ...mems, ...boards]) {
      x._price = recentMedianPrice(x);
    }

    // 목적 프로파일 + 저예산 완화
    const profRaw = pickProfile(purpose);
    const prof = loosenProfileForLowBudget(profRaw, totalBudget);

    // ------------- 1차: 완전 매칭 + 예산 가이드 -------------
    let builds = tryRecommend({
      cpus, gpus, mems, boards,
      totalBudget, overRatio,
      prof,
      hardDdr: true,
      useBudgetGuide: true,
      topN: 24
    });

    // ------------- 2차: DDR 소프트 매칭(패널티) -------------
    if (!builds.length) {
      builds = tryRecommend({
        cpus, gpus, mems, boards,
        totalBudget, overRatio,
        prof,
        hardDdr: false,          // DDR 불일치 허용
        useBudgetGuide: true,    // 가이드는 유지
        topN: 24
      });
    }

    // ------------- 3차: 예산 가이드 미적용 + 최저가 Top-N -------------
    if (!builds.length) {
      builds = tryRecommend({
        cpus, gpus, mems, boards,
        totalBudget, overRatio,
        prof,
        hardDdr: false,
        useBudgetGuide: false,   // 가이드 무시
        topN: 16                 // 더 공격적으로 얇은 후보군
      });
    }

    // ------------- 마지막: allowOver 10%로 재시도 -------------
    if (!builds.length && overRatio < 0.1) {
      builds = tryRecommend({
        cpus, gpus, mems, boards,
        totalBudget, overRatio: 0.1,
        prof,
        hardDdr: false,
        useBudgetGuide: false,
        topN: 16
      });
    }

    if (!builds.length) {
      return res.json({ builds: [], recommended: null, message: "예산/호환 조건을 완화했지만 조합을 찾지 못했습니다." });
    }

    return res.json(buildResponse(builds));

  } catch (err) {
    console.error("❌ [POST /recommend] error:", err);
    res.status(500).json({ error: "추천 실패" });
  }
});

/* ---------------------- 조합 생성기 ---------------------- */
function tryRecommend({
  cpus, gpus, mems, boards,
  totalBudget, overRatio,
  prof,
  hardDdr = true,
  useBudgetGuide = true,
  topN = 24,
}) {
  const budgetCap = totalBudget * (1 + overRatio);

  // 후보군 만들기
  let cpuCand = [...cpus];
  let gpuCand = [...gpus];
  let memCand = [...mems];
  let brdCand = [...boards];

  // 예산 가이드 기반 1차 슬라이싱(카테고리별)
  if (useBudgetGuide) {
    const bg = prof.budgetGuide;
    cpuCand = cpuCand.filter(c => withinBudgetGuide(c._price, totalBudget, bg.cpu));
    gpuCand = gpuCand.filter(g => withinBudgetGuide(g._price, totalBudget, bg.gpu));
    memCand = memCand.filter(m => withinBudgetGuide(m._price, totalBudget, bg.memory));
    brdCand = brdCand.filter(b => withinBudgetGuide(b._price, totalBudget, bg.motherboard));
  }

  // 후보가 텅 비면 최저가 Top-N으로 보충
  const ensureTopN = (arr) => {
    if (arr.length === 0) return [];
    return arr.sort((a,b)=>a._price - b._price).slice(0, topN);
  };

  // 최소 보장: 없으면 전체에서 최저가 Top-N
  if (cpuCand.length === 0) cpuCand = ensureTopN([...cpus]);
  else cpuCand = ensureTopN(cpuCand);
  if (gpuCand.length === 0) gpuCand = ensureTopN([...gpus]);
  else gpuCand = ensureTopN(gpuCand);
  if (memCand.length === 0) memCand = ensureTopN([...mems]);
  else memCand = ensureTopN(memCand);
  if (brdCand.length === 0) brdCand = ensureTopN([...boards]);
  else brdCand = ensureTopN(brdCand);

  const combos = [];

  for (const cpu of cpuCand) {
    for (const board of brdCand) {
      if (!isCpuBoardCompatible(cpu, board)) continue;

      for (const memory of memCand) {
        const hardOk = isMemBoardCompatibleHard(memory, board);
        if (hardDdr && !hardOk) continue; // 하드 모드면 반드시 일치

        for (const gpu of gpuCand) {
          const totalPrice = cpu._price + gpu._price + memory._price + board._price;
          if (totalPrice > budgetCap) continue;

          // 메모리 최소 용량
          const memGB = parseCapacityGB(memory?.info || "");
          if (memGB < prof.minMemGB) continue;

          const penalty = hardDdr ? 0 : memDdrPenalty(memory, board);
          const score = comboScore({
            cpu, gpu, memory, board,
            purpose: getPurposeFromProfile(prof),
            totalPrice,
            softMemPenalty: penalty,
          });

          combos.push({ cpu, gpu, memory, motherboard: board, totalPrice, score });
        }
      }
    }
  }

  if (!combos.length) return [];

  // 가성비/균형/고성능 3가지 셋 뽑기
  const byScore = [...combos].sort((a, b) => b.score - a.score);
  const byValue = [...combos].sort((a, b) => (b.score / b.totalPrice) - (a.score / a.totalPrice));

  const perf = byScore[0];
  const value = byValue[0];
  const balanced = byScore[Math.floor(byScore.length / 3)] || byScore[0];

  // 중복 제거
  const uniq = [];
  const seen = new Set();
  for (const x of [value, balanced, perf]) {
    const key = `${x.cpu?.name}|${x.gpu?.name}|${x.memory?.name}|${x.motherboard?.name}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniq.push(x);
    }
  }

  return uniq.map((b, i) => {
    const tag = i === 0 ? "가성비" : i === 1 ? "균형" : "고성능";
    const reasons = [];
    const cpuSock = inferCpuSocket(b.cpu.name);
    const mbSock = parseSocketFromBoardInfo(b.motherboard.info);
    if (cpuSock && mbSock) reasons.push(`소켓 호환: ${cpuSock} / ${mbSock}`);
    const memDdr = parseDdrFromMemory(b.memory.info) || "(표기없음)";
    const mbDdr = parseDdrFromBoard(b.motherboard.info) || "(표기없음)";
    reasons.push(`메모리·보드 규격: ${memDdr} / ${mbDdr}`);
    reasons.push(`가격 안정화(중위가) 기준: ${b.totalPrice.toLocaleString()}원`);

    return {
      label: tag,
      totalPrice: b.totalPrice,
      score: b.score,
      parts: {
        cpu: pickFields(b.cpu),
        gpu: pickFields(b.gpu),
        memory: pickFields(b.memory),
        motherboard: pickFields(b.motherboard),
      },
      reasons,
    };
  });
}

function getPurposeFromProfile(prof) {
  // 레이블이 필요하면 역매핑. 단, 여기선 점수 가중치만 쓰므로 임의 문자열 OK
  // 실제 목적 문자열은 상위에서 전달되나, 프로파일만 넘어오는 경로 보호용
  const key = Object.keys(PURPOSE).find(k => PURPOSE[k] === prof);
  return key || "가성비";
}

export default router;
