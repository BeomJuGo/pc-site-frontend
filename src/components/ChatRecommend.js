import { useState } from "react";

export default function ChatRecommend() {
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setReply("");

    try {
      const res = await fetch("/api/ai-recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setReply(data.reply || "AI로부터 응답을 받지 못했어요.");
    } catch (err) {
      setReply("❌ 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg max-w-xl mx-auto">
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
        <div className="bg-gray-100 p-3 rounded whitespace-pre-wrap">
          {reply}
        </div>
      )}
    </div>
  );
}
