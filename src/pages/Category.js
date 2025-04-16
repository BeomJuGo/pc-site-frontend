import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchFullPartData } from "../utils/api";

const Category = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [parts, setParts] = useState([]);
  const [sortBy, setSortBy] = useState("value");

  useEffect(() => {
    fetchFullPartData(category).then(setParts);
  }, [category]);

  const sorted = [...parts].sort((a, b) => {
    const priceA = Number(a.price) || 1;
    const priceB = Number(b.price) || 1;
    const scoreA = a.benchmarkScore?.cinebenchMulti || 0;
    const scoreB = b.benchmarkScore?.cinebenchMulti || 0;

    if (sortBy === "value") return scoreB / priceB - scoreA / priceA;
    if (sortBy === "price") return priceA - priceB;
    if (sortBy === "score") return scoreB - scoreA;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">{category.toUpperCase()} 목록</h2>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="border p-2 rounded mb-4"
      >
        <option value="value">💡 가성비</option>
        <option value="price">💰 가격순</option>
        <option value="score">⚙️ Cinebench 멀티코어순</option>
        <option value="name">🔤 이름순</option>
      </select>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sorted.map((part) => (
          <div
            key={part.id}
            onClick={() => navigate(`/detail/${category}/${encodeURIComponent(part.name)}`)}
            className="border p-4 rounded shadow hover:shadow-lg cursor-pointer"
          >
            <h3 className="text-xl font-semibold mb-2">{part.name}</h3>
            <p>💰 가격: {Number(part.price).toLocaleString()}원</p>
            <p>⚙️ Cinebench 멀티: {part.benchmarkScore.cinebenchMulti}</p>
            <p>🧠 PassMark: {part.benchmarkScore.passmarkscore}</p>
            <p className="text-sm text-blue-600 mt-2">💬 {part.review}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
