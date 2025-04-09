import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { fetchFullPartData } from "../utils/api";

const categories = ["cpu", "gpu", "memory", "ssd", "mainboard"];

const Category = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);

  const activeCategory = category?.toLowerCase();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const enrichedParts = await fetchFullPartData(category);
      setParts(enrichedParts);
      setLoading(false);
    };

    fetchData();
  }, [category, location.key]);

  if (loading) {
    return <div className="text-center p-4 text-gray-500">⏳ 불러오는 중...</div>;
  }

  return (
    <div className="p-4 sm:p-8">
      <h2 className="text-3xl font-bold mb-6">{activeCategory?.toUpperCase()} 목록</h2>

      {/* ✅ 카테고리 버튼 */}
      <div className="flex flex-wrap gap-3 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => navigate(`/category/${cat}`)}
            className={`px-4 py-2 rounded-full ${
              activeCategory === cat ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            } hover:bg-blue-400 transition`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parts.map((part) => (
          <div
            key={part.id}
            onClick={() => navigate(`/detail/${category}/${part.id}`)}
            className="cursor-pointer p-5 border border-gray-200 rounded-xl shadow-md bg-white hover:shadow-lg transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-semibold">{part.name}</h3>
              {part.image && (
                <img src={part.image} alt={part.name} className="w-20 h-20 object-contain rounded border" />
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
