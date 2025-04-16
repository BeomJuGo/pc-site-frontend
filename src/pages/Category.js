import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchFullPartData } from "../utils/api";

const Category = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("value");
  const [brandFilter, setBrandFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const enrichedParts = await fetchFullPartData(category);
      setParts(enrichedParts);
      setLoading(false);
    };
    fetchData();
  }, [category]);

  const filteredParts = parts
    .filter((part) => {
      const nameMatch = part.name.toLowerCase().includes(search.toLowerCase());
      const brandMatch =
        brandFilter === "all" ||
        (brandFilter === "intel" && part.name.toLowerCase().includes("intel")) ||
        (brandFilter === "amd" && part.name.toLowerCase().includes("amd"));
      return nameMatch && brandMatch;
    })
    .sort((a, b) => {
      const aPrice = Number(a.price || 0);
      const bPrice = Number(b.price || 0);
      const aScore = a.benchmarkScore?.passmarkscore || 0;
      const bScore = b.benchmarkScore?.passmarkscore || 0;
      const aValue = a.benchmarkScore?.cinebenchMulti / aPrice || 0;
      const bValue = b.benchmarkScore?.cinebenchMulti / bPrice || 0;

      if (sortBy === "price") return aPrice - bPrice;
      if (sortBy === "price-desc") return bPrice - aPrice;
      if (sortBy === "score") return bScore - aScore;
      if (sortBy === "value") return bValue - aValue;
      return a.name.localeCompare(b.name);
    });

  if (loading) {
    return <div className="text-center p-4 text-gray-500">⏳ 불러오는 중...</div>;
  }

  return (
    <div className="p-4 sm:p-8">
      <h2 className="text-3xl font-bold mb-6">{category.toUpperCase()} 목록</h2>

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
          <option value="value">💡 가성비순</option>
          <option value="price">💰 가격 낮은순</option>
          <option value="price-desc">💰 가격 높은순</option>
          <option value="score">📊 PassMark 점수순</option>
          <option value="name">🔤 이름순</option>
        </select>

        <div className="flex gap-2">
          <button
            onClick={() => setBrandFilter("all")}
            className={`px-3 py-2 border rounded-md ${brandFilter === "all" ? "bg-blue-500 text-white" : "bg-white"}`}
          >전체</button>
          <button
            onClick={() => setBrandFilter("intel")}
            className={`px-3 py-2 border rounded-md ${brandFilter === "intel" ? "bg-blue-500 text-white" : "bg-white"}`}
          >Intel</button>
          <button
            onClick={() => setBrandFilter("amd")}
            className={`px-3 py-2 border rounded-md ${brandFilter === "amd" ? "bg-blue-500 text-white" : "bg-white"}`}
          >AMD</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredParts.map((part) => (
          <div
            key={part.id}
            onClick={() => navigate(`/detail/${category}/${encodeURIComponent(part.name)}`)}
            className="cursor-pointer p-5 border border-gray-200 rounded-xl shadow-md bg-white hover:shadow-lg transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-semibold">{part.name}</h3>
              {part.image ? (
                <img
                  src={part.image}
                  alt={part.name}
                  className="w-20 h-20 object-contain rounded border"
                />
              ) : (
                <div className="w-20 h-20 border bg-gray-100 text-center text-xs flex items-center justify-center">
                  이미지 없음
                </div>
              )}
            </div>

            <p className="text-gray-700 mb-1">
              💰 가격: {isNaN(Number(part.price)) ? "가격 정보 없음" : `${Number(part.price).toLocaleString()}원`}
            </p>

            <div className="text-gray-700 mb-1 text-sm">
              🧠 Cinebench: 
              <ul className="ml-4 list-disc">
                <li>싱글: {part.benchmarkScore?.cinebenchSingle || "-"}</li>
                <li>멀티: {part.benchmarkScore?.cinebenchMulti || "-"}</li>
              </ul>
            </div>

            <p className="text-sm text-gray-600">
              📊 PassMark: {part.benchmarkScore?.passmarkscore?.toLocaleString() || "없음"}
            </p>

            <p className="text-blue-600 italic mt-2 text-sm">💬 {part.review}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
