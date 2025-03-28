import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchFullPartData } from "../utils/api";

const Category = () => {
  const { category } = useParams();
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const enrichedParts = await fetchFullPartData(category);
      setParts(enrichedParts);
      setLoading(false);
    };

    fetchData();
  }, [category]);

  if (loading) {
    return <div className="text-center p-4 text-gray-500">⏳ 불러오는 중...</div>;
  }

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-bold mb-4">{category.toUpperCase()} 목록</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {parts.map((part) => (
          <div
            key={part.id}
            className="w-full max-w-sm mx-auto p-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:shadow-md transition"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-base font-semibold text-gray-800">{part.name}</h3>
              {part.image && (
                <img
                  src={part.image}
                  alt={part.name}
                  className="w-20 h-20 object-contain ml-3 rounded"
                />
              )}
            </div>

            <p className="text-sm text-gray-700 mb-1">
              💰 <span className="font-medium">가격:</span>{" "}
              {isNaN(Number(part.price)) ? part.price : `${Number(part.price).toLocaleString()}원`}
            </p>

            {category === "cpu" ? (
              <div className="text-sm text-gray-700 mb-1">
                ⚙️ <span className="font-medium">Geekbench 점수:</span>
                <ul className="ml-4 list-disc">
                  <li>싱글 코어: {part.benchmarkScore.singleCore}</li>
                  <li>멀티 코어: {part.benchmarkScore.multiCore}</li>
                </ul>
              </div>
            ) : (
              <p className="text-sm text-gray-700 mb-1">
                ⚙️ 벤치마크 점수: {part.benchmarkScore}
              </p>
            )}

            <p className="text-sm text-blue-600 italic mt-2 whitespace-pre-line break-words leading-snug">
              💬 AI 한줄평: {part.review}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
