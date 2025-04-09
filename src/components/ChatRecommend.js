import { useState } from "react";

const ChatRecommend = () => {
  const [purpose, setPurpose] = useState("");
  const [budget, setBudget] = useState("");
  const [result, setResult] = useState(null);

  const handleRecommend = () => {
    if (!purpose || !budget) {
      alert("사용 목적과 예산을 입력하세요.");
      return;
    }

    // 더미 추천 결과
    setResult({
      cpu: "Intel Core i5-12400F",
      gpu: "NVIDIA RTX 4060",
      ram: "Corsair Vengeance 16GB",
      ssd: "Samsung 970 EVO 1TB",
      comment: "게임용으로 가격 대비 훌륭한 구성을 추천합니다.",
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h3 className="text-2xl font-bold mb-6 text-center">🧠 AI 맞춤 추천</h3>

      <div className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="사용 목적 (예: 게임, 영상편집)"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          className="w-full border rounded-lg p-3"
        />
        <input
          type="number"
          placeholder="예산 (원)"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="w-full border rounded-lg p-3"
        />
        <button
          onClick={handleRecommend}
          className="w-full bg-blue-500 text-white rounded-lg py-3 hover:bg-blue-600 transition"
        >
          추천받기
        </button>
      </div>

      {result && (
        <div className="bg-gray-100 p-6 rounded-xl space-y-4">
          <h4 className="text-xl font-bold text-center mb-4">✨ 추천 구성</h4>
          <div className="grid grid-cols-2 gap-4 text-gray-800">
            <div>
              <p className="font-semibold">CPU:</p>
              <p>{result.cpu}</p>
            </div>
            <div>
              <p className="font-semibold">GPU:</p>
              <p>{result.gpu}</p>
            </div>
            <div>
              <p className="font-semibold">RAM:</p>
              <p>{result.ram}</p>
            </div>
            <div>
              <p className="font-semibold">SSD:</p>
              <p>{result.ssd}</p>
            </div>
          </div>
          <p className="text-blue-600 text-center italic mt-4">{result.comment}</p>
        </div>
      )}
    </div>
  );
};

export default ChatRecommend;
