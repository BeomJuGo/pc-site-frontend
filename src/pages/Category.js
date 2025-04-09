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
      <h2 className="text-3xl font-bold mb-6">{category?.toUpperCase()} 목록</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parts.map((part) => (
          <div
            key={part.id}
            onClick={() => navigate(`/detail/${category}/${part.id}`)}
            className="cursor-pointer p-5 border border-gray-200 rounded-xl shadow-md bg-white hover:shadow-lg transition-all duration-300"
          >
            <h3 className="text-xl font-semibold">{part.name}</h3>
            <p className="text-gray-700 mt-2">💰 {Number(part.price).toLocaleString()}원</p>
            <p className="text-gray-600 mt-1">{part.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
