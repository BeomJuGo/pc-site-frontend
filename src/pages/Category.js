import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Category = () => {
  const { category } = useParams();
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ 카테고리별 검색 키워드 맵
  const keywordMap = {
    cpu: "AMD 인텔 CPU",
    gpu: "그래픽카드 GPU",
    memory: "DDR5 메모리",
    mainboard: "메인보드",
    ssd: "SSD 저장장치",
    hdd: "HDD 하드디스크",
  };

  useEffect(() => {
    const fetchNaverParts = async () => {
      setLoading(true);
      const query = keywordMap[category.toLowerCase()] || category;

      try {
        const res = await fetch(
          `/api/naver-price?query=${encodeURIComponent(query)}&display=20&sort=asc`
        );
        const data = await res.json();
        setParts(data.items || []);
      } catch (err) {
        console.error("❌ 네이버 검색 실패:", err);
        setParts([]);
      }

      setLoading(false);
    };

    fetchNaverParts();
  }, [category]);

  if (loading) {
    return <div className="text-center p-4 text-gray-500">⏳ 불러오는 중...</div>;
  }

  return (
    <div className="p-4 sm:p-8">
      <h2 className="text-3xl font-bold mb-6">{category.toUpperCase()} 검색 결과</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parts.map((part, idx) => (
          <div
            key={idx}
            className="cursor-pointer p-5 border border-gray-200 rounded-xl shadow-md bg-white hover:shadow-lg transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-md font-semibold" dangerouslySetInnerHTML={{ __html: part.title }} />
              {part.image && (
                <img
                  src={part.image}
                  alt={part.title}
                  className="w-20 h-20 object-contain rounded border"
                />
              )}
            </div>

            <p className="text-gray-700 mb-1">
              💰 가격: {Number(part.lprice).toLocaleString()}원
            </p>

            <a
              href={part.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 underline mt-2 inline-block"
            >
              🔗 쇼핑몰에서 보기
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
