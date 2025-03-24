import { useState } from "react";

export default function ChatRecommend() {
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [parts, setParts] = useState([]);

  const extractParts = (text) => {
    const lines = text.split("\n").filter(Boolean);
    const parts = lines.map((line) => {
      const [type, name] = line.split(":").map((s) => s.trim());
      return { type, name };
    }).filter(part => part.type && part.name);
    return parts;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setReply("");
    setParts([]);

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

      const searchedParts = await Promise.all(
        extractedParts.map(async (part) => {
          const res = await fetch(`/api/naver-price?query=${encodeURIComponent(part.name)}&display=1&sort=asc`);
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
    } catch (err) {
      console.error("❌ 오류:", err);
      setReply("❌ 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-3">💡 AI 추천 받기</h2>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="예: 영상편집용 PC, 예산 80만 원"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {parts.map((part, idx) => (
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
      )}
    </div>
  );
}
