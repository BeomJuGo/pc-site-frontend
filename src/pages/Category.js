// ✅ src/pages/Category.js
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchFullPartData(category);
      setParts(data);
      setLoading(false);
    };
    loadData();
  }, [category]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortBy, brandFilter]);

  // 브랜드 필터 옵션: GPU는 nvidia/amd, 나머지는 intel/amd
  const brandOptions =
    category === "gpu" ? ["all", "nvidia", "amd"] : ["all", "intel", "amd"];

  const filtered = parts
    .filter((part) => {
      const nameMatch = part.name.toLowerCase().includes(search.toLowerCase());
      const brandMatch =
        brandFilter === "all" ||
        (brandFilter === "intel" && part.name.toLowerCase().includes("intel")) ||
        (brandFilter === "amd" && part.name.toLowerCase().includes("amd")) ||
        (brandFilter === "nvidia" && part.name.toLowerCase().includes("nvidia"));
      return nameMatch && brandMatch;
    })
    .sort((a, b) => {
      const aP = Number(a.price || 0), bP = Number(b.price || 0);
      const aS = a.benchmarkScore?.passmarkscore || 0;
      const bS = b.benchmarkScore?.passmarkscore || 0;
      const aV = a.benchmarkScore?.cinebenchMulti / aP || 0;
      const bV = b.benchmarkScore?.cinebenchMulti / bP || 0;

      if (sortBy === "price") return aP - bP;
      if (sortBy === "price-desc") return bP - aP;
      if (sortBy === "score") return bS - aS;
      if (sortBy === "value") return bV - aV;
      return a.name.localeCompare(b.name);
    });

  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIdx, startIdx + itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="p-4 sm:p-8">
      <h2 className="text-3xl font-bold mb-6">{category.toUpperCase()} 목록</h2>

      {/* 🔍 검색 및 필터 */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md shadow-sm"
        >
          ⬅️ 홈으로
        </button>

        <input
          type="text"
          placeholder="🔍 이름 검색"
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

        {/* 브랜드 필터 버튼 */}
        <div className="flex gap-2">
          {brandOptions.map((brand) => (
            <button
              key={brand}
              onClick={() => setBrandFilter(brand)}
              className={`px-3 py-2 border rounded-md ${
                brandFilter === brand ? "bg-blue-500 text-white" : "bg-white"
              }`}
            >
              {brand === "all" ? "전체" : brand.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* 💻 부품 카드 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginated.map((part) => (
          <div
            key={part.id}
            onClick={() => navigate(`/detail/${category}/${encodeURIComponent(part.name)}`)}
            className="cursor-pointer p-5 border rounded-xl shadow bg-white hover:shadow-lg transition-all"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold">{part.name}</h3>
              {part.image ? (
                <img
                  src={part.image}
                  alt={part.name}
                  className="w-20 h-20 object-contain border rounded"
                />
              ) : (
                <div className="w-20 h-20 border flex items-center justify-center text-sm bg-gray-100">
                  이미지 없음
                </div>
              )}
            </div>

            <p className="text-gray-700">
              💰 가격:{" "}
              {isNaN(part.price)
                ? "가격 정보 없음"
                : `${Number(part.price).toLocaleString()}원`}
            </p>

            <ul className="text-sm ml-4 list-disc text-gray-600 mt-1">
              <li>
                PassMark:{" "}
                {part.benchmarkScore.passmarkscore != null
                  ? part.benchmarkScore.passmarkscore.toLocaleString()
                  : "정보 없음"}
              </li>
              <li>
                Cinebench Single:{" "}
                {part.benchmarkScore.cinebenchSingle || "정보 없음"}
              </li>
              <li>
                Cinebench Multi:{" "}
                {part.benchmarkScore.cinebenchMulti || "정보 없음"}
              </li>
            </ul>

            <p className="text-blue-600 mt-2 italic text-sm">
              💬 {part.review || "리뷰 없음"}
            </p>
          </div>
        ))}
      </div>

      {/* 📄 페이지네이션 */}
      <div className="flex justify-center mt-8 gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          ◀ 이전
        </button>
        <span className="px-4 py-1">
          {currentPage} / {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          다음 ▶
        </button>
      </div>
    </div>
  );
};

export default Category;
