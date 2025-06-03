import React, { useState } from "react";
import axios from "axios";
import PartCard from "../components/PartCard";

const Recommend = () => {
  const [budget, setBudget] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRecommend = async () => {
    if (!budget) return alert("예산을 입력해주세요!");
    setLoading(true);

    try {
      const res = await axios.post("https://pc-site-backend.onrender.com/api/recommend", {
        budget: Number(budget), // 예산을 100,000 단위로 곱하지 않음
      });
      setResults(res.data.recommended);
    } catch (err) {
      alert("추천 실패 😢");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">💡 AI 기반 PC 견적 추천</h1>

      <div className="flex flex-col gap-2 mb-6">
        <input
          type="number"
          step="100000" // 🔁 화살표 클릭 시 100,000원씩 증가/감소
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

      {results && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <PartCard label="CPU" part={{ ...results.cpu, category: "cpu", _id: results.cpu._id }} />
          <PartCard label="GPU" part={{ ...results.gpu, category: "gpu", _id: results.gpu._id }} />
          <PartCard label="메모리" part={{ ...results.memory, category: "memory", _id: results.memory._id }} />
          <PartCard label="메인보드" part={{ ...results.mainboard, category: "mainboard", _id: results.mainboard._id }} />

          <div className="col-span-full border-t pt-4">
            <p className="text-lg font-semibold">
              💰 총합: {results.totalPrice?.toLocaleString()}원
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recommend;
