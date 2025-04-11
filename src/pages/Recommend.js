import { useState } from "react";

const Recommend = () => {
  const [budget, setBudget] = useState("");
  const [purpose, setPurpose] = useState("");
  const [recommendedParts, setRecommendedParts] = useState([]);
  const [overBudget, setOverBudget] = useState(false);

  const handleRecommend = () => {
    if (!budget || !purpose) {
      alert("예산과 목적을 모두 입력해 주세요!");
      return;
    }

    const lowerPurpose = purpose.toLowerCase(); // 소문자 통일
    let parts = [];

    if (lowerPurpose.includes("게이밍")) {
      parts = [
        { category: "CPU", name: "Intel Core i5-14600K", price: 350000, review: "게이밍에 최적화된 CPU" },
        { category: "GPU", name: "NVIDIA RTX 4070", price: 750000, review: "부드러운 고해상도 게이밍" },
        { category: "메모리", name: "Corsair Vengeance 16GB", price: 80000, review: "고속 메모리" },
      ];
    } else if (lowerPurpose.includes("코딩")) {
      parts = [
        { category: "CPU", name: "Intel Core i5-13400", price: 250000, review: "빠른 개발 환경 제공" },
        { category: "GPU", name: "내장 GPU", price: 0, review: "그래픽 작업 없음" },
        { category: "메모리", name: "Corsair Vengeance 16GB", price: 80000, review: "쾌적한 멀티태스킹" },
      ];
    } else if (lowerPurpose.includes("방송")) {
      parts = [
        { category: "CPU", name: "Intel Core i7-14700K", price: 500000, review: "방송 스트리밍 최적화" },
        { category: "GPU", name: "NVIDIA RTX 4070 Super", price: 900000, review: "고화질 방송 지원" },
        { category: "메모리", name: "Corsair Vengeance 32GB", price: 150000, review: "대용량 메모리" },
      ];
    } else if (lowerPurpose.includes("음악")) {
      parts = [
        { category: "CPU", name: "AMD Ryzen 7 7700X", price: 400000, review: "음악 작업에 최적" },
        { category: "GPU", name: "내장 GPU", price: 0, review: "그래픽 작업 없음" },
        { category: "메모리", name: "Corsair Vengeance 32GB", price: 150000, review: "대규모 프로젝트 처리" },
      ];
    } else {
      parts = [
        { category: "CPU", name: "Intel Core i5-13400", price: 250000, review: "기본적인 사용에 적합" },
        { category: "GPU", name: "내장 GPU", price: 0, review: "그래픽 작업 없음" },
        { category: "메모리", name: "Corsair Vengeance 16GB", price: 80000, review: "일반 작업에 충분" },
      ];
    }

    const total = parts.reduce((sum, part) => sum + part.price, 0);
    setOverBudget(total > Number(budget));
    setRecommendedParts(parts);
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

        {/* 추천 결과 */}
        {recommendedParts.length > 0 && (
          <div className="mt-10">
            <h3 className="text-2xl font-bold mb-6 text-center">🎯 추천 결과</h3>
            <div className="grid grid-cols-1 gap-6">
              {recommendedParts.map((part) => (
                <div key={part.name} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                  <h4 className="text-xl font-semibold mb-2">{part.category}: {part.name}</h4>
                  <p className="text-gray-700 mb-1">💰 가격: {part.price.toLocaleString()}원</p>
                  <p className="text-blue-600 italic">{part.review}</p>
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
