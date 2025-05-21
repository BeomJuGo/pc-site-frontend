// components/PartCard.js
import React from "react";
import { useRouter } from "next/router";

const PartCard = ({ part, label }) => {
  const router = useRouter();

  if (!part || part.name === "정보 없음") {
    return (
      <div className="border p-4 rounded shadow bg-gray-100 text-gray-500">
        <h2 className="text-lg font-semibold mb-1">🔧 {label}</h2>
        <p>추후에 추가될 예정입니다.</p>
      </div>
    );
  }

  return (
    <div
      className="cursor-pointer border p-4 rounded shadow bg-white hover:shadow-lg transition"
      onClick={() => router.push(`/detail/${part.category}/${part._id}`)}
    >
      <h2 className="text-lg font-semibold mb-1">🔧 {label}: {part.name}</h2>
      {part.image && <img src={part.image} alt={part.name} className="w-32 my-2" />}
      {part.price && <p>💸 가격: {part.price.toLocaleString()}원</p>}
      {part.benchmarkScore?.passmarkscore && (
        <p>🔥 PassMark: {part.benchmarkScore.passmarkscore}</p>
      )}
      {part.benchmarkScore?.cinebenchSingle && (
        <p>🎯 Cinebench Single: {part.benchmarkScore.cinebenchSingle}</p>
      )}
      {part.benchmarkScore?.cinebenchMulti && (
        <p>💪 Cinebench Multi: {part.benchmarkScore.cinebenchMulti}</p>
      )}
      {part.reason && <p className="mt-2 text-sm italic text-gray-700">📝 {part.reason}</p>}
    </div>
  );
};

export default PartCard;
