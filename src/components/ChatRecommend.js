import { useState, useEffect } from "react";

export default function ChatRecommend() {
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [parts, setParts] = useState([]);
  const [filter, setFilter] = useState("전체");
  const [page, setPage] = useState(1);

  const extractParts = (text) => {
    const lines = text.split("\n").filter(Boolean);
    const parts = lines.map((line) => {
      const [type, name] = line.split(":").map((s) => s.trim());
      return { type, name };
    }).filter(part => part.type && part.name);
    return parts;
  };

  const fetchPartsWithPagination = async (extractedParts, page) => {
    const searchedParts = await Promise.all(
      extractedParts.map(async (part) => {
        const res = await fetch(
          `/api/naver-price?query=${encodeURIComponent(part.name)}&display=5&start=${(page - 1) * 5 + 1}&sort=asc`
        );
        const data = await res.json();
        const item = data.items?.[0];
        return {
          ...part,
          image: item?.image,
          title: item?.title,
          link: item?.link,
          price: item?.lprice,
        };
      })
    );
    setParts(searchedParts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setReply("");
    setParts([]);
    setPage(1); // 페이지 초기화

    try {
      const res = await fetch("/api/ai-recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const replyText = data.reply || "AI로부터 응답을 받지 못했어요.";
      setReply(replyText);

      const extractedParts = extractParts(replyText);
      await fetchPartsWithPagination(extractedParts, 1);
    } catch (err) {
      console.error("❌ 오류:", err);
      setReply("❌ 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const filteredParts = filter === "전체"
    ? parts
    : parts.filter((part) =>
        part.type.toLowerCase().includes(filter.toLowerCase())
      );

  useEffect(() => {
    if (reply && parts.length > 0) {
      const extracted = extractParts(reply);
      fetchPartsWithPagination(extracted, page);
    }
  }, [page]);

  return (
    <div className="p-4 border rounded-lg max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-3">💡 AI 추천 받기</h2>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="예: 게임용 PC, 예산 100만원"
          className="flex-1 p-2 border rounded"
        />
        <button type="submit" className="px-4 bg-blue-500 text-white rounded">
          보내기
        </button>
      </form>

      {loading && <p className="text-gray-500">⏳ 추천 중입니다...</p>}

      {reply && (
        <div className="bg-gray-100 p-3 rounded whitespace-pre-wrap mb-4">
          {reply}
        </div>
      )}

      {parts.length > 0 && (
        <>
          {/* 🔍 필터 버튼 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {["전체", "CPU", "GPU", "RAM", "SSD", "메인보드"].map((label) => (
              <button
                key={label}
                onClick={() => setFilter(label)}
                className={`px-3 py-1 rounded ${
                  filter === label ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* 📦 결과 카드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredParts.map((part, idx) => (
              <div key={idx} className="border rounded p-3 shadow-sm">
                <h3 className="font-semibold mb-1">{part.type}</h3>
                {part.image && (
                  <img
                    src={part.image}
                    alt={part.title}
                    className="w-full h-32 object-contain mb-2"
                  />
                )}
                <p
                  dangerouslySetInnerHTML={{ __html: part.title }}
                  className="text-sm"
                />
                <p className="text-blue-600 font-bold mt-1">
                  {part.price
                    ? Number(part.price).toLocaleString() + "원"
                    : "가격 정보 없음"}
                </p>
                {part.link && (
                  <a
                    href={part.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 underline block mt-1"
                  >
                    🔗 쇼핑몰에서 보기
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* ⏩ 페이지네이션 */}
          <div className="flex justify-center mt-6 gap-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-1 bg-gray-200 rounded"
              disabled={page === 1}
            >
              ◀ 이전
            </button>
            <span className="self-center text-sm">페이지 {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-1 bg-gray-200 rounded"
            >
              다음 ▶
            </button>
          </div>
        </>
      )}
    </div>
  );
}
