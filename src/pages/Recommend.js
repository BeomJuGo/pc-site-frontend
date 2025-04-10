import { useState } from "react";
import { fetchNaverPrice } from "../utils/api"; // ✅ api.js에 이미 있는 함수 사용

const Recommend = () => {
  const [budget, setBudget] = useState("");
  const [purpose, setPurpose] = useState("");
  const [recommendedParts, setRecommendedParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [overBudget, setOverBudget] = useState(false);

  const keywordsMap = {
    게이밍: ["게이밍 CPU", "게이밍 GPU", "게이밍 메모리"],
    코딩: ["사무용 CPU", "사무용 메모리"],
    방송: ["방송용 CPU", "방송용 GPU", "스트리밍 메모리"],
    음악: ["음악작업 CPU", "음악작업 메모리"],
  };

  const handleRecommend = async () => {
    if (!budget || !purpose) {
      alert("예산과 목적을 모두 입력해 주세요!");
      return;
    }

    setLoading(true);
    setRecommendedParts([]);

    try {
      const lowerPurpose = purpose.toLowerCase();
      const keywordList = Object.keys(keywordsMap).find(key =>
        lowerPurpose.includes(key)
      ) ? keywordsMap[Object.keys(keywordsMap).find(key => lowerPurpose.includes(key))] : ["가성비 CPU", "가성비 GPU"];

      const results = await Promise.all(
        keywordList.map(async (keyword) => {
          const data = await fetchNaverPrice(keyword);
          return {
            name: keyword,
            price: Number(data.price) || 0,
            image: data.image || "",
          };
        })
      );

      const total = results.reduce((sum, part) => sum + part.price, 0);
      setOverBudget(total > Number(budget));
      setRecommendedParts(results);
    } catch (err) {
      console.error("추천 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalBudget = recommendedParts.reduce((sum, part) => sum + part.price, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">🧠 AI 맞춤 부품 추천</h2>

        {/* 입력 폼 */}
        <div className="flex flex-col items-center gap-6 mb-10">
          <input
            type="number"
            placeholder="예산을 입력하세요 (예: 1200000)"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-72 border p-3 rounded-lg text-center placeholder-gray-400"
          />
          <input
            type="text"
            placeholder="목적을 입력하세요 (예: 게이밍, 코딩, 방송용, 음악작업 등)"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-72 border p-3 rounded-lg text-center placeholder-gray-400"
          />
          <button
            onClick={handleRecommend}
            className="w-72 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition"
          >
            추천 받기
          </button>
        </div>

        {/* 로딩 상태 */}
        {loading && (
          <div className="text-center text-gray-500">⏳ 추천 제품을 찾는 중...</div>
        )}

        {/* 추천 결과 */}
        {recommendedParts.length > 0 && !loading && (
          <div className="mt-10">
            <h3 className="text-2xl font-bold mb-6 text-center">🎯 추천 결과</h3>
            <div className="grid grid-cols-1 gap-6">
              {recommendedParts.map((part, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                  {part.image && (
                    <img src={part.image} alt={part.name} className="w-32 h-32 object-contain mx-auto mb-4" />
                  )}
                  <h4 className="text-xl font-semibold mb-2 text-center">{part.name}</h4>
                  <p className="text-center text-gray-700">💰 가격: {part.price.toLocaleString()}원</p>
                </div>
              ))}
            </div>

            {/* 총 합계 */}
            <div className="text-right mt-6 text-lg font-semibold text-gray-800">
              총 예상 가격: {totalBudget.toLocaleString()}원
            </div>

            {/* 예산 초과 경고 */}
            {overBudget && (
              <div className="text-center text-red-500 font-semibold mt-4">
                ⚠️ 예산을 초과했습니다! 부품 구성을 조정해 주세요.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommend;
