import { useState } from "react";

const Recommend = () => {
  const [budget, setBudget] = useState("");
  const [purpose, setPurpose] = useState("");
  const [recommendedParts, setRecommendedParts] = useState([]);
  const [error, setError] = useState("");

  const handleRecommend = () => {
    if (!budget || !purpose) {
      setError("예산과 목적을 모두 입력하세요!");
      return;
    }

    setError("");

    // 더미 추천 데이터 (나중에 네이버 쇼핑 API 연결 가능)
    const dummyParts = [
      { category: "CPU", name: "Intel Core i5-14600K", price: 350000 },
      { category: "GPU", name: "NVIDIA RTX 4070", price: 750000 },
      { category: "메모리", name: "Corsair 16GB", price: 80000 },
    ];

    setRecommendedParts(dummyParts);
  };

  const totalPrice = recommendedParts.reduce((sum, part) => sum + part.price, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow">
        <h1 className="text-3xl font-bold text-center mb-8">🧠 AI 맞춤 부품 추천</h1>

        {/* 입력폼 */}
        <div className="flex flex-col gap-4 mb-8">
          <input
            type="number"
            placeholder="예산을 입력하세요 (예: 1200000)"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-72 border p-3 rounded-lg text-center placeholder-gray-400"
            step="100000" // 🔥 여기 핵심! 10만 원 단위로 증가
          />
          <input
            type="text"
            placeholder="목적을 입력하세요 (예: 게이밍, 코딩, 방송용 등)"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-72 border p-3 rounded-lg text-center placeholder-gray-400"
          />
          <button
            onClick={handleRecommend}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold p-3 rounded-lg"
          >
            추천 받기
          </button>
        </div>

        {/* 에러 메시지 */}
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {/* 추천 결과 */}
        {recommendedParts.length > 0 && (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">🎯 추천 결과</h2>
            <div className="flex flex-col gap-4">
              {recommendedParts.map((part, index) => (
                <div key={index} className="border rounded-lg p-4 shadow">
                  <div className="text-lg font-bold">{part.category}: {part.name}</div>
                  <div className="text-gray-700">💰 가격: {part.price.toLocaleString()}원</div>
                </div>
              ))}
            </div>

            {/* 총 가격 */}
            <div className="text-right font-semibold text-gray-800 mt-6">
              총 합계: {totalPrice.toLocaleString()}원
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommend;
