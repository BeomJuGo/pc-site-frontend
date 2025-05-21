// pages/recommend.js
import React, { useState } from "react";
import axios from "axios";

const Recommend = () => {
  const [budget, setBudget] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRecommend = async () => {
    if (!budget) return alert("예산을 입력해주세요!");
    setLoading(true);
    try {
      const res = await axios.post("https://pc-site-backend.onrender.com/api/recommend", {
        budget: Number(budget),
      });
      setResult(res.data.recommended);
    } catch (err) {
      alert("추천 실패 😢");
      console.error(err);
    }
    setLoading(false);
  };

  const renderPart = (label, data) => (
    <div className="border p-4 rounded shadow bg-white">
      <h2 className="text-lg font-bold">{label}</h2>
      <p>🖥️ 모델명: {data.name || "정보 없음"}</p>
      {data.price !== undefined && <p>💸 가격: {data.price.toLocaleString()}원</p>}
      <p className="text-sm italic text-gray-700 mt-1">📝 {data.reason || "이유 없음"}</p>
    </div>
  );

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">💡 AI 기반 전체 PC 견적 추천</h1>
      <div className="flex flex-col gap-2 mb-6">
        <input
          type="number"
          className="border p-2 rounded"
          placeholder="예산 입력 (예: 1000000)"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
        <button
          onClick={handleRecommend}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {loading ? "추천 중..." : "추천 받기"}
        </button>
      </div>

      {result && (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {renderPart("🔧 CPU", result.cpu)}
          {renderPart("🎮 GPU", result.gpu)}
          {renderPart("💾 메모리", result.memory)}
          {renderPart("🧩 메인보드", result.mainboard)}
          <div className="col-span-full text-right font-semibold text-lg">
            💰 총합: {result.totalPrice?.toLocaleString() || "정보 없음"}원
          </div>
        </div>
      )}
    </div>
  );
};

export default Recommend;
