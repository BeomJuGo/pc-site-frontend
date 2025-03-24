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
      <h2 className="text-xl font-bold mb
