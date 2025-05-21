import React, { useState } from "react";
import axios from "axios";

const Recommend = () => {
  const [budget, setBudget] = useState("");
  const [purpose, setPurpose] = useState("가성비");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleRecommend = async () => {
    if (!budget) return alert("예산을 입력해주세요!");

    setLoading(true);
    try {
      const res = await axios.post("/api/recommend", { budget: Number(budget), purpose });
      setResults(res.data.recommendedCPUs);
    } catch (err) {
      alert("추천 실패 😢");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">💡 AI 맞춤 CPU 추천</h1>

      <div className="flex flex-col gap-2 mb-6">
        <input
          type="number"
          className="border p-2 rounded"
          placeholder="예산 입력 (예: 400000)"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
        >
          <option value="가성비">가성비</option>
          <option value="게이밍">게이밍</option>
          <option value="전문가용">전문가용</option>
        </select>
        <button
          onClick={handleRecommend}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {loading ? "추천 중..." : "추천 받기"}
        </button>
      </div>

      {results.length > 0 && (
        <div className="grid gap-4">
          {results.map((cpu, i) => (
            <div key={i} className="border p-4 rounded shadow">
              <h2 className="text-lg font-semibold">{cpu.name}</h2>
              <img src={cpu.image} alt={cpu.name} className="w-32 my-2" />
              <p>💸 가격: {cpu.price.toLocaleString()}원</p>
              <p>🔥 PassMark: {cpu.benchmarkScore?.passmarkscore || "N/A"}</p>
              <p>🎯 Cinebench Single: {cpu.benchmarkScore?.cinebenchSingle || "N/A"}</p>
              <p>💪 Cinebench Multi: {cpu.benchmarkScore?.cinebenchMulti || "N/A"}</p>
              <p className="mt-2 text-sm italic text-gray-700">📝 {cpu.review}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommend;
