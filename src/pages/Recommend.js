// src/pages/Recommend.js (CORS 문제 해결 + 디버깅 강화 버전)
import React, { useState, useEffect } from "react";
import axios from "axios";
import PartCard from "../components/PartCard";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "pc_recommend_data";

export default function Recommend() {
  const [budget, setBudget] = useState(1500000);
  const [purpose, setPurpose] = useState("게임용");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [builds, setBuilds] = useState([]);
  const [serverMsg, setServerMsg] = useState("");
  const [loadingMessage, setLoadingMessage] = useState("추천 조합을 찾고 있습니다...");

  const navigate = useNavigate();

  // localStorage에서 견적 데이터 복원
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        // 저장된 데이터가 24시간 이내인지 확인
        const savedTime = data.timestamp || 0;
        const now = Date.now();
        const hoursSinceSave = (now - savedTime) / (1000 * 60 * 60);
        
        // 24시간 이내 데이터만 복원
        if (hoursSinceSave < 24) {
          if (data.budget) setBudget(data.budget);
          if (data.purpose) setPurpose(data.purpose);
          if (data.builds && Array.isArray(data.builds) && data.builds.length > 0) {
            setBuilds(data.builds);
            // 저장된 선택된 빌드 복원
            if (data.results) {
              setResults(data.results);
            } else if (data.builds.length > 0) {
              // 선택된 빌드가 없으면 첫 번째 빌드 선택
              setResults(data.builds[0]);
            }
          }
          if (data.serverMsg) setServerMsg(data.serverMsg);
          console.log("✅ 저장된 견적 데이터 복원 완료");
        } else {
          // 24시간 지난 데이터는 삭제
          localStorage.removeItem(STORAGE_KEY);
          console.log("🗑️ 오래된 견적 데이터 삭제");
        }
      }
    } catch (error) {
      console.error("견적 데이터 복원 실패:", error);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // 견적 데이터가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    if (builds.length > 0) {
      try {
        const dataToSave = {
          budget,
          purpose,
          builds,
          results,
          serverMsg,
          timestamp: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
        console.log("💾 견적 데이터 저장 완료");
      } catch (error) {
        console.error("견적 데이터 저장 실패:", error);
      }
    }
  }, [builds, results, budget, purpose, serverMsg]);

  // 백엔드 응답 파싱
  const parseRecommendResponse = (data) => {
    if (!data) return { builds: [], pick: null, message: "" };

    const list = Array.isArray(data.builds) ? data.builds : [];
    const recommended = data.recommended || null;

    const pick =
      list.find((b) => b?.label === recommended) ||
      list.find((b) => b?.label === "균형") ||
      (list.length > 0 ? list[0] : null);

    // 디버깅: AI 평가 데이터 확인
    if (pick) {
      console.log("🔍 파싱된 빌드 AI 평가:", {
        aiEvaluation: pick.aiEvaluation,
        aiStrengths: pick.aiStrengths,
        aiRecommendations: pick.aiRecommendations,
        hasAiEvaluation: !!pick.aiEvaluation,
        aiEvaluationLength: pick.aiEvaluation?.length || 0,
      });
    }

    return { builds: list, pick, message: data.message || "" };
  };

  // detail 페이지 네비게이션
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
    setLoadingMessage("추천 조합을 찾고 있습니다...");

    try {
      // 🆕 1단계: 서버 wake-up (슬립 모드 해제)
      console.log("🔄 서버 상태 확인 중...");
      setLoadingMessage("서버 연결 중... (첫 요청 시 최대 1분 소요)");

      // API URL 설정 (로컬 개발용)
      const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:10000";

      try {
        const healthCheck = await axios.get(
          `${API_BASE_URL}/api/health`,
          {
            timeout: 15000, // 15초 타임아웃
          }
        );
        console.log("✅ 서버 준비 완료:", healthCheck.data);
      } catch (wakeError) {
        console.warn("⚠️ 서버 wake-up 실패, 계속 진행...", wakeError.message);
        // wake-up 실패해도 메인 요청은 시도
      }

      // 🆕 2단계: 메인 추천 요청
      console.log("📤 추천 요청 전송 중...");
      console.log("   예산:", Number(budget).toLocaleString(), "원");
      console.log("   용도:", purpose);

      setLoadingMessage("최적의 조합을 계산하고 있습니다... (수천 가지 조합 검토 중)");

      const res = await axios.post(
        `${API_BASE_URL}/api/recommend`,
        {
          budget: Number(budget),
          purpose,
          allowOver: 0.05, // 예산 5% 초과 허용
        },
        {
          timeout: 90000, // 90초 타임아웃 (조합 생성 시간 고려)
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          withCredentials: false, // 🆕 credentials를 false로 설정 (CORS 단순화)
        }
      );

      console.log("✅ 응답 받음:", res.data);
      console.log("🔍 AI 평가 데이터 (첫 번째 빌드):", {
        hasAiEvaluation: !!res.data?.builds?.[0]?.aiEvaluation,
        aiEvaluation: res.data?.builds?.[0]?.aiEvaluation?.substring(0, 50) + "...",
        hasAiStrengths: Array.isArray(res.data?.builds?.[0]?.aiStrengths),
        aiStrengthsLength: res.data?.builds?.[0]?.aiStrengths?.length || 0,
        hasAiRecommendations: Array.isArray(res.data?.builds?.[0]?.aiRecommendations),
        aiRecommendationsLength: res.data?.builds?.[0]?.aiRecommendations?.length || 0,
      });

      const { builds: list, pick, message } = parseRecommendResponse(res.data);

      setBuilds(list);
      setResults(pick);
      setServerMsg(message || "");

      // 디버깅: 선택된 빌드의 AI 평가 데이터 확인
      if (pick) {
        console.log("📊 선택된 빌드 AI 평가:", {
          label: pick.label,
          hasAiEvaluation: !!pick.aiEvaluation,
          aiEvaluationLength: pick.aiEvaluation?.length || 0,
          aiEvaluationPreview: pick.aiEvaluation?.substring(0, 100) || "없음",
          hasAiStrengths: Array.isArray(pick.aiStrengths),
          aiStrengthsLength: pick.aiStrengths?.length || 0,
          hasAiRecommendations: Array.isArray(pick.aiRecommendations),
          aiRecommendationsLength: pick.aiRecommendations?.length || 0,
          allKeys: Object.keys(pick),
        });
      } else {
        console.warn("⚠️ 선택된 빌드가 없습니다!");
      }

      console.log("✅ 추천 완료:", list.length, "개 빌드");

      if (list.length === 0) {
        setServerMsg(message || "조건에 맞는 조합을 찾을 수 없습니다. 예산을 늘려보세요.");
      }

    } catch (e) {
      console.error("[Recommend] 요청 실패:", e);

      // 🆕 상세 에러 정보 로깅
      if (e.response) {
        console.error("응답 에러:", {
          status: e.response.status,
          statusText: e.response.statusText,
          data: e.response.data,
          headers: e.response.headers,
        });
      } else if (e.request) {
        console.error("요청 에러:", {
          readyState: e.request.readyState,
          status: e.request.status,
          responseURL: e.request.responseURL,
        });
      } else {
        console.error("설정 에러:", e.message);
      }

      // 🆕 에러 타입별 사용자 친화적 메시지
      let errorMsg = "";
      let errorDetail = "";

      if (e.code === 'ECONNABORTED' || e.message.includes('timeout')) {
        errorMsg = "서버 응답 시간 초과";
        errorDetail = "서버가 시작 중이거나 조합 계산에 시간이 오래 걸리고 있습니다. 잠시 후 다시 시도하거나 예산을 조정해보세요.";
      } else if (e.code === 'ERR_NETWORK') {
        errorMsg = "네트워크 연결 오류";
        errorDetail = "서버에 연결할 수 없습니다. 서버가 시작 중이거나 네트워크 문제일 수 있습니다. 1분 후 다시 시도해주세요.";
      } else if (e.response?.status === 500) {
        errorMsg = "서버 내부 오류";
        errorDetail = e.response.data?.message || "서버에서 오류가 발생했습니다. 관리자에게 문의하세요.";
      } else if (e.response?.status === 404) {
        errorMsg = "API 경로를 찾을 수 없음";
        errorDetail = "백엔드 API가 올바르게 배포되지 않았을 수 있습니다.";
      } else if (e.response) {
        errorMsg = `서버 오류 (${e.response.status})`;
        errorDetail = e.response.data?.message || e.response.statusText || "알 수 없는 오류";
      } else {
        errorMsg = "알 수 없는 오류";
        errorDetail = e.message;
      }

      alert(`❌ ${errorMsg}\n\n${errorDetail}`);

      setBuilds([]);
      setResults(null);
      setServerMsg(`오류: ${errorMsg}`);
    } finally {
      setLoading(false);
      setLoadingMessage("추천 조합을 찾고 있습니다...");
    }
  };

  // 빌드 비교를 위한 키 생성
  const getBuildKey = (build) => {
    const parts = build.parts || {};
    return `${parts.cpu?.name || ""}_${parts.gpu?.name || ""}_${parts.motherboard?.name || ""}`;
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">🤖 AI 견적 추천</h1>

      {/* 입력 영역 */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 shadow-sm">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              예산
            </label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="예: 1500000"
              step="100000"
              min="500000"
              max="10000000"
            />
            <p className="mt-1 text-xs text-slate-500">
              {Number(budget).toLocaleString()}원
            </p>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              용도
            </label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="게임용">게임용</option>
              <option value="작업용">작업용</option>
              <option value="사무용">사무용</option>
              <option value="가성비">가성비</option>
            </select>
            <p className="mt-1 text-xs text-slate-500">
              {purpose === "게임용" && "🎮 GPU 성능 중심"}
              {purpose === "작업용" && "💼 CPU 성능 중심"}
              {purpose === "사무용" && "📊 균형잡힌 구성"}
              {purpose === "가성비" && "💰 최적의 가격 대비 성능"}
            </p>
          </div>

          <button
            onClick={handleRecommend}
            className="bg-blue-600 text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "추천 중..." : "추천 받기"}
          </button>
        </div>

        {/* 🆕 도움말 */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            💡 <strong>첫 요청 시</strong> 서버 시작으로 최대 1분 소요될 수 있습니다.
            {" "}조합 계산에는 추가로 30초~1분 정도 걸립니다.
          </p>
        </div>
      </div>

      {/* 서버 메시지 */}
      {serverMsg && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">⚠️ {serverMsg}</p>
        </div>
      )}

      {/* 빌드 선택 탭 */}
      {builds?.length > 1 && (
        <div className="flex flex-wrap gap-3 mb-6">
          {builds.map((b, i) => {
            const active = results && getBuildKey(results) === getBuildKey(b);

            return (
              <button
                key={i}
                onClick={() => setResults(b)}
                className={`px-5 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${active
                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                  : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <span>
                    {b.label === "가성비" && "💰"}
                    {b.label === "균형" && "⚖️"}
                    {b.label === "고성능" && "🚀"}
                  </span>
                  <span>{b.label || `옵션${i + 1}`}</span>
                </div>
                {b.totalPrice && (
                  <div className={`text-xs mt-0.5 ${active ? "text-blue-100" : "text-slate-500"}`}>
                    {Number(b.totalPrice).toLocaleString()}원
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* 추천 결과 */}
      {results && (
        <div className="space-y-6">
          {/* 요약 카드 */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {results.label || "추천"} 빌드
                </h2>
                <p className="text-blue-100 text-sm">
                  {purpose} 최적화 견적
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">
                  {Number(results.totalPrice || 0).toLocaleString()}
                </div>
                <div className="text-sm text-blue-100">원</div>
              </div>
            </div>

            {results.score && (
              <div className="mt-4 pt-4 border-t border-blue-500">
                <div className="text-sm text-blue-100">종합 점수</div>
                <div className="text-xl font-semibold mt-1">
                  {Number(results.score).toLocaleString()} / 100,000
                </div>
              </div>
            )}
          </div>

          {/* 호환성 정보 */}
          {results.compatibility && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <span>✅</span>
                <span>호환성 검증</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.compatibility.socket && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 text-sm">🔌</span>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-0.5">CPU 소켓</div>
                      <div className="text-sm font-medium text-slate-900">
                        {results.compatibility.socket}
                      </div>
                    </div>
                  </div>
                )}

                {results.compatibility.ddr && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-sm">💾</span>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-0.5">메모리 타입</div>
                      <div className="text-sm font-medium text-slate-900">
                        {results.compatibility.ddr}
                      </div>
                    </div>
                  </div>
                )}

                {results.compatibility.power && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-yellow-600 text-sm">⚡</span>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-0.5">전력 소비</div>
                      <div className="text-sm font-medium text-slate-900">
                        {results.compatibility.power}
                      </div>
                    </div>
                  </div>
                )}

                {results.compatibility.formFactor && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-600 text-sm">📦</span>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-0.5">케이스 폼팩터</div>
                      <div className="text-sm font-medium text-slate-900">
                        {results.compatibility.formFactor}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* AI 평가 */}
          {results && (
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <span>🤖</span>
                <span>AI 전문가 평가</span>
                {!results.aiEvaluation && (!Array.isArray(results.aiStrengths) || results.aiStrengths.length === 0) && (
                  <span className="text-xs text-amber-600 ml-2">(평가 생성 중...)</span>
                )}
              </h3>

              {/* 전체 평가 */}
              {results.aiEvaluation ? (
                <div className="bg-white rounded-lg p-4 mb-4 border border-purple-100">
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {results.aiEvaluation}
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-lg p-4 mb-4 border border-amber-200 bg-amber-50">
                  <div className="flex items-start gap-2">
                    <span className="text-amber-600 text-lg">⚠️</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-amber-900 mb-1">
                        AI 평가를 생성하지 못했습니다
                      </p>
                      <p className="text-xs text-amber-700">
                        {results.aiError || "OpenAI API 설정에 문제가 있거나 할당량이 부족합니다."}
                      </p>
                      <p className="text-xs text-amber-600 mt-2">
                        💡 AI 평가 없이도 견적은 정상적으로 사용할 수 있습니다.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 장점 */}
              {Array.isArray(results.aiStrengths) && results.aiStrengths.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <span>✨</span>
                    <span>주요 장점</span>
                  </h4>
                  <ul className="space-y-2">
                    {results.aiStrengths.map((strength, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600 bg-white rounded-lg p-3 border border-green-100">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 추천사항 */}
              {Array.isArray(results.aiRecommendations) && results.aiRecommendations.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <span>💡</span>
                    <span>추천사항</span>
                  </h4>
                  <ul className="space-y-2">
                    {results.aiRecommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600 bg-white rounded-lg p-3 border border-blue-100">
                        <span className="text-blue-500 mt-0.5">→</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* 추천 근거 */}
          {Array.isArray(results.reasons) && results.reasons.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                📋 추천 근거
              </h3>
              <ul className="space-y-2.5">
                {results.reasons.map((r, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 부품 카드 8개 */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              🛠️ 부품 구성
            </h3>
            <div className="flex flex-col gap-4">
              {/* CPU */}
              {results.parts?.cpu && (
                <div className="relative">
                  <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium z-10">
                    CPU
                  </div>
                  <PartCard
                    part={results.parts.cpu}
                    onClick={() => goDetail(results.parts.cpu, "cpu")}
                  />
                </div>
              )}

              {/* GPU */}
              {results.parts?.gpu && (
                <div className="relative">
                  <div className="absolute -top-2 -left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium z-10">
                    GPU
                  </div>
                  <PartCard
                    part={results.parts.gpu}
                    onClick={() => goDetail(results.parts.gpu, "gpu")}
                  />
                </div>
              )}

              {/* Memory */}
              {results.parts?.memory && (
                <div className="relative">
                  <div className="absolute -top-2 -left-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-medium z-10">
                    메모리
                  </div>
                  <PartCard
                    part={results.parts.memory}
                    onClick={() => goDetail(results.parts.memory, "memory")}
                  />
                </div>
              )}

              {/* Motherboard */}
              {results.parts?.motherboard && (
                <div className="relative">
                  <div className="absolute -top-2 -left-2 bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full font-medium z-10">
                    메인보드
                  </div>
                  <PartCard
                    part={results.parts.motherboard}
                    onClick={() => goDetail(results.parts.motherboard, "motherboard")}
                  />
                </div>
              )}

              {/* PSU */}
              {results.parts?.psu && (
                <div className="relative">
                  <div className="absolute -top-2 -left-2 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full font-medium z-10">
                    파워
                  </div>
                  <PartCard
                    part={results.parts.psu}
                    onClick={() => goDetail(results.parts.psu, "psu")}
                  />
                </div>
              )}

              {/* Cooler */}
              {results.parts?.cooler && (
                <div className="relative">
                  <div className="absolute -top-2 -left-2 bg-cyan-500 text-white text-xs px-2 py-0.5 rounded-full font-medium z-10">
                    쿨러
                  </div>
                  <PartCard
                    part={results.parts.cooler}
                    onClick={() => goDetail(results.parts.cooler, "cooler")}
                  />
                </div>
              )}

              {/* Storage */}
              {results.parts?.storage && (
                <div className="relative">
                  <div className="absolute -top-2 -left-2 bg-indigo-500 text-white text-xs px-2 py-0.5 rounded-full font-medium z-10">
                    저장장치
                  </div>
                  <PartCard
                    part={results.parts.storage}
                    onClick={() => goDetail(results.parts.storage, "storage")}
                  />
                </div>
              )}

              {/* Case */}
              {results.parts?.case && (
                <div className="relative">
                  <div className="absolute -top-2 -left-2 bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full font-medium z-10">
                    케이스
                  </div>
                  <PartCard
                    part={results.parts.case}
                    onClick={() => goDetail(results.parts.case, "case")}
                  />
                </div>
              )}
            </div>
          </div>

          {/* 총합 */}
          <div className="bg-slate-900 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">총 견적</div>
              <div className="text-3xl font-bold">
                {Number(results.totalPrice || 0).toLocaleString()}원
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 초기 상태 */}
      {!loading && !results && !serverMsg && (
        <div className="mt-8">
          <div className="rounded-xl border-2 border-dashed border-slate-300 p-12 text-center bg-slate-50">
            <div className="text-6xl mb-4">🤖</div>
            <p className="text-slate-600 text-lg mb-2">
              예산과 용도를 선택하고
            </p>
            <p className="text-slate-900 text-xl font-semibold">
              "추천 받기" 버튼을 눌러주세요
            </p>
          </div>
        </div>
      )}

      {/* 로딩 */}
      {loading && (
        <div className="mt-8">
          <div className="rounded-xl border border-slate-200 p-12 text-center bg-white shadow-sm">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-slate-700 text-lg font-medium">
              {loadingMessage}
            </p>
            <p className="text-slate-500 text-sm mt-2">
              잠시만 기다려주세요...
            </p>
            {/* 🆕 진행 상황 표시 */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <span>서버 연결</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-100"></div>
                <span>부품 데이터 로드</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-200"></div>
                <span>호환성 체크</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
