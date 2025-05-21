import React, { useState } from "react";
import axios from "axios";

const Recommend = () => {
  const [budget, setBudget] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRecommend = async () => {
    if (!budget) return alert("예산을 입력해주세요!");
    setLoading(true);

    try {
      const res = await axios.post("https://pc-site-backend.onrender.com/api/recommend", {
        budget: Number(budget),
      });
      setResults(res.data.recommended);
    } catch (err) {
      alert("추천 실패 😢");
      console.error(err);
    }

    setLoading(false);
  };

  const renderPart = (label, part) => (
    <div className="border p-4 rounded shadow bg-white">
      <h2 className="text-lg font-semibold mb-1">🔧 {label}: {part?.name || "정보 없음"}</h2>
      {part?.image && <img src={part.image} alt={part.name} className="w-32 my-2" />}
      {part?.price && <p>💸 가격: {part.price.toLocaleString()}원</p>}
      {part?.benchmarkScore?.passmarkscore && (
        <p>🔥 PassMark: {part.benchmarkScore.passmarkscore}</p>
      )}
      {part?.benchmarkScore?.cinebenchSingle && (
        <p>🎯 Cinebench Single: {part.benchmarkScore.cinebenchSingle}</p>
      )}
      {part?.benchmarkScore?.cinebenchMulti && (
        <p>💪 Cinebench Multi: {part.benchmarkScore.cinebenchMulti}</p>
      )}
      {part?.reason && <p className="mt-2 text-sm italic text-gray-700">📝 {part.reason}</p>}
    </div>
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">💡 AI 기반 PC 견적 추천</h1>

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

      {results && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {renderPart("CPU", results.cpu)}
          {renderPart("GPU", results.gpu || { name: "정보 없음" })}
          {renderPart("메모리", results.memory || { name: "정보 없음" })}
          {renderPart("메인보드", results.mainboard || { name: "정보 없음" })}
          <div className="col-span-full border-t pt-4">
            <p className="text-lg font-semibold">💰 총합: {results.totalPrice?.toLocaleString()}원</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recommend;
