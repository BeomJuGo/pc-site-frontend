import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchFullPartData } from "../utils/api";

const Category = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await fetchFullPartData(category);
      setParts(data);
      setLoading(false);
    };
    fetchData();
  }, [category]);

  const filteredParts = parts
    .filter((part) =>
      part.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "score")
        return (b.benchmarkScore?.multiCore || 0) - (a.benchmarkScore?.multiCore || 0);
      return a.name.localeCompare(b.name);
    });

  if (loading) {
    return <div className="text-center p-4 text-gray-500">⏳ 불러오는 중...</div>;
  }

  return (
    <div className="p-4 sm:p-8">
      <h2 className="text-3xl font-bold mb-6">{category.toUpperCase()} 목록</h2>

      {/* 🔍 검색 + 정렬 */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="🔍 부품 이름 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-md shadow-sm w-64"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border px-2 py-2 rounded-md shadow-sm"
        >
          <option value="name">이름순</option>
          <option value="price">💰 가격 낮은순</option>
          <option value="score">⚙️ 벤치마크 높은순</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredParts.map((part) => (
          <div
            key={part.id}
            onClick={() =>
              navigate(`/detail/${category}/${encodeURIComponent(part.name)}`)
            }
            className="cursor-pointer p-5 border border-gray-200 rounded-xl shadow-md bg-white hover:shadow-lg transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-semibold">{part.name}</h3>
              {part.image && (
                <img
                  src={part.image}
                  alt={part.name}
                  className="w-20 h-20 object-contain rounded border"
                />
              )}
            </div>

            <p className="text-gray-700 mb-1">
              💰 가격: {Number(part.price).toLocaleString()}원
            </p>

            {category === "cpu" && part.benchmarkScore && (
              <div className="text-gray-700 mb-1">
                ⚙️ Geekbench 점수:
                <ul className="ml-4 list-disc">
                  <li>싱글 코어: {part.benchmarkScore.singleCore}</li>
                  <li>멀티 코어: {part.benchmarkScore.multiCore}</li>
                </ul>
              </div>
            )}

            <p className="text-blue-600 italic mt-2 whitespace-pre-line">
              💬 {part.review}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
