import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchFullPartData } from "../utils/api";

const Category = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("popularity");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const enrichedParts = await fetchFullPartData(category);
      setParts(enrichedParts);
      setLoading(false);
    };
    fetchData();
  }, [category]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const sortedParts = [...parts].sort((a, b) => {
    let aValue, bValue;

    if (sortBy === "popularity") {
      aValue = a.review.length;
      bValue = b.review.length;
    } else if (sortBy === "price") {
      aValue = Number(a.price) || 0;
      bValue = Number(b.price) || 0;
    } else if (sortBy === "value") {
      const aScore = category === "cpu" ? Number(a.benchmarkScore.singleCore) || 1 : 1;
      const bScore = category === "cpu" ? Number(b.benchmarkScore.singleCore) || 1 : 1;
      aValue = aScore / (Number(a.price) || 1);
      bValue = bScore / (Number(b.price) || 1);
    }

    return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
  });

  if (loading) {
    return <div className="text-center p-4 text-gray-500">⏳ 불러오는 중...</div>;
  }

  return (
    <div className="p-4 sm:p-8">
      <h2 className="text-3xl font-bold mb-6">{category.toUpperCase()} 목록</h2>

      {/* 정렬 버튼 */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button
          onClick={() => setSortBy("popularity")}
          className={`px-4 py-2 rounded ${sortBy === "popularity" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          인기순
        </button>
        <button
          onClick={() => setSortBy("price")}
          className={`px-4 py-2 rounded ${sortBy === "price" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          가격순
        </button>
        <button
          onClick={() => setSortBy("value")}
          className={`px-4 py-2 rounded ${sortBy === "value" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          가성비순
        </button>
        <button
          onClick={toggleSortOrder}
          className="px-3 py-2 rounded bg-gray-300 text-lg"
        >
          {sortOrder === "asc" ? "🔼" : "🔽"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedParts.map((part) => (
          <div
            key={part.id}
            onClick={() => navigate(`/detail/${category}/${part.id}`)}
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

            <p className="text-gray-700 mb-1">💰 가격: {Number(part.price).toLocaleString()}원</p>

            {category === "cpu" ? (
              <div className="text-gray-700 mb-1">
                ⚙️ Geekbench 점수:
                <ul className="ml-4 list-disc">
                  <li>싱글 코어: {part.benchmarkScore.singleCore}</li>
                  <li>멀티 코어: {part.benchmarkScore.multiCore}</li>
                </ul>
              </div>
            ) : (
              <p className="text-gray-700 mb-1">⚙️ 벤치마크 점수: {part.benchmarkScore}</p>
            )}

            <p className="text-blue-600 italic mt-2">💬 {part.review}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
