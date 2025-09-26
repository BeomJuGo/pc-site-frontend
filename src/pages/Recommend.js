// src/pages/Recommend.js
import React, { useState } from "react";
import axios from "axios";
import PartCard from "../components/PartCard";
import { useNavigate } from "react-router-dom";

export default function Recommend() {
  const [budget, setBudget] = useState(1000000);
  const [purpose, setPurpose] = useState("작업용"); // "가성비" | "게임용" | "작업용"
  const [loading, setLoading] = useState(false);

  // 결과(선택된 빌드 1건)
  const [results, setResults] = useState(null);
  // 여러 빌드(가성비/균형/고성능) 배열
  const [builds, setBuilds] = useState([]);
  // 서버 메시지(조합 없음 등)
  const [serverMsg, setServerMsg] = useState("");

  const navigate = useNavigate();

  // 백엔드 응답을 신/구 포맷 모두 호환 처리
  const parseRecommendResponse = (data) => {
    if (!data) return { builds: [], pick: null, message: "" };

    // 신규 포맷: { builds: [...] , recommended?: {...} }
    const list = Array.isArray(data.builds) ? data.builds : [];
    const recommended = data.recommended || null;

    // 선택 규칙: recommended > "균형" 라벨 > 첫 번째
    const pick =
      recommended ||
      list.find((b) => b?.label === "균형") ||
      (list.length > 0 ? list[0] : null);

    return { builds: list, pick, message: data.message || "" };
  };

  // 일부 백엔드에서는 mainboard 라벨을 쓸 수 있어서 보정
  const pickMotherboard = (obj) => obj?.motherboard || obj?.mainboard || null;

  // detail 페이지 네비게이션 유틸
  const goDetail = (part, fallbackCategory) => {
    if (!part) return;
    const cat = part.category || fallbackCategory || "cpu";
    navigate(`/detail/${cat}/${encodeURIComponent(part.name)}`);
  };

  const handleRecommend = async () => {
    if (!budget) {
      alert("예산을 입력해주세요.");
      return;
    }
    setLoading(true);
    setServerMsg("");
    try {
      const res = await axios.post(
        "https://pc-site-backend.onrender.com/api/recommend",
        {
          budget: Number(budget),
          purpose,            // "가성비" | "게임용" | "작업용"
          // allowOver: 0.05,  // 필요 시 예산 +5% 허용
        }
      );

      const { builds: list, pick, message } = parseRecommendResponse(res.data);
      setBuilds(list);
      setResults(pick);
      setServerMsg(message || "");
    } catch (e) {
      console.error("[Recommend] 요청 실패:", e);
      alert("추천 실패");
      setBuilds([]);
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">AI 추천</h1>

      {/* 입력 영역 */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <label className="text-sm text-slate-600">예산</label>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2 text-[14px] w-56"
          placeholder="예: 1200000"
        />
        <label className="text-sm text-slate-600 ml-2">용도</label>
        <select
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2 text-[14px]"
        >
          <option value="가성비">가성비</option>
          <option value="게임용">게임용</option>
          <option value="작업용">작업용</option>
        </select>
        <button
          onClick={handleRecommend}
          className="ml-auto bg-slate-900 text-white rounded-lg px-4 py-2 text-sm hover:bg-slate-800"
          disabled={loading}
        >
          {loading ? "추천 중..." : "추천 받기"}
        </button>
      </div>

      {/* 서버 메시지(조합 없음 등) */}
      {serverMsg && (
        <div className="mb-3 text-sm text-slate-600">{serverMsg}</div>
      )}

      {/* 빌드 선택 탭(여러 빌드가 올 때) */}
      {builds?.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {builds.map((b, i) => {
            const active =
              results &&
              results.parts?.cpu?.name === b.parts?.cpu?.name &&
              pickMotherboard(results.parts)?.name === pickMotherboard(b.parts)?.name &&
              results.parts?.gpu?.name === b.parts?.gpu?.name &&
              results.parts?.memory?.name === b.parts?.memory?.name;

            return (
              <button
                key={i}
                onClick={() => setResults(b)}
                className={`px-3 py-1 rounded-lg border text-sm ${
                  active
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-800 border-slate-300 hover:bg-slate-50"
                }`}
                title={
                  b.totalPrice
                    ? `${(b.label || `옵션${i + 1}`)} · ${Number(
                        b.totalPrice
                      ).toLocaleString()}원`
                    : (b.label || `옵션${i + 1}`)
                }
              >
                {b.label || `옵션${i + 1}`}
              </button>
            );
          })}
        </div>
      )}

      {/* 단일 추천 결과 렌더 */}
      {results && (
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
          {/* 상단 메타 */}
          <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="text-[15px] font-semibold text-slate-900">
              {results.label ? `${results.label} 추천` : "추천 결과"}
            </div>
            {results.totalPrice != null && (
              <div className="text-[14px] text-slate-700">
                총합: {Number(results.totalPrice).toLocaleString()}원
              </div>
            )}
          </div>

          {/* 근거/설명 */}
          {Array.isArray(results.reasons) && results.reasons.length > 0 && (
            <div className="px-4 py-3 border-b border-slate-200">
              <ul className="list-disc pl-5 text-[13px] text-slate-600 space-y-1">
                {results.reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          {/* 부품 카드 4종 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3">
            {/* CPU */}
            <PartCard
              part={results.parts?.cpu || results.cpu}
              onClick={() =>
                goDetail(results.parts?.cpu || results.cpu, "cpu")
              }
            />
            {/* GPU */}
            <PartCard
              part={results.parts?.gpu || results.gpu}
              onClick={() =>
                goDetail(results.parts?.gpu || results.gpu, "gpu")
              }
            />
            {/* Memory */}
            <PartCard
              part={results.parts?.memory || results.memory}
              onClick={() =>
                goDetail(results.parts?.memory || results.memory, "memory")
              }
            />
            {/* Motherboard(Mainboard fallback) */}
            <PartCard
              part={pickMotherboard(results.parts) || results.motherboard || results.mainboard}
              onClick={() => {
                const mb =
                  pickMotherboard(results.parts) ||
                  results.motherboard ||
                  results.mainboard;
                if (mb) goDetail(mb, "motherboard");
              }}
            />
          </div>

          {/* 하단 총합 */}
          <div className="px-4 py-3 text-right text-[15px] font-semibold text-slate-900 border-t border-slate-200">
            총합: {Number(results.totalPrice || 0).toLocaleString()}원
          </div>
        </div>
      )}

      {/* 로딩/초기 상태 */}
      {!loading && !results && !serverMsg && (
        <div className="mt-8">
          <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center">
            <p className="text-slate-500 text-sm">
              예산과 용도를 입력하고 <b>“추천 받기”</b>를 눌러주세요.
            </p>
          </div>
        </div>
      )}

      {loading && (
        <div className="mt-6 text-sm text-slate-600">추천을 생성 중입니다...</div>
      )}
    </div>
  );
}
