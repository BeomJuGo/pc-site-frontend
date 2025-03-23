import React from "react";
import ChatRecommend from "../components/ChatRecommend";

const Recommend = () => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">🧠 AI에게 부품 추천받기</h2>
      <ChatRecommend />
    </div>
  );
};

export default Recommend;
