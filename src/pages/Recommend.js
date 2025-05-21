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

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">💡 AI 맞춤 CPU 추천</h1>

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
        <div className="grid gap-6">
          {["가성비", "게이밍", "전문가용"].map((key) => (
            <div key={key} className="border p-4 rounded shadow">
              <h2 className="text-lg font-bold mb-2">🔹 {key} 추천</h2>
              <ul className="list-disc list-inside text-gray-800">
                {results[key]?.map((cpu, i) => (
                  <li key={i}>
                    <strong>{cpu.name}</strong>: {cpu.reason}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommend;
