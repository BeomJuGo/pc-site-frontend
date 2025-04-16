import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPartDetail, fetchPriceHistory } from "../utils/api";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";

const Detail = () => {
  const { category, id } = useParams();
  const [part, setPart] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);

  useEffect(() => {
    const name = decodeURIComponent(id);
    fetchPartDetail(category, name).then(setPart);
    fetchPriceHistory(name).then(setPriceHistory);
  }, [category, id]);

  if (!part) return <p>❌ 부품 정보를 불러올 수 없습니다.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">{part.name}</h2>
      <p>💰 가격: {Number(part.price).toLocaleString()}원</p>
      <ul className="my-2 text-sm text-gray-700">
        <li>⚙️ Cinebench 싱글: {part.benchmarkScore.cinebenchSingle}</li>
        <li>⚙️ Cinebench 멀티: {part.benchmarkScore.cinebenchMulti}</li>
        <li>🧠 PassMark: {part.benchmarkScore.passmarkscore}</li>
      </ul>
      <p className="text-blue-600 italic mt-2">💬 {part.review}</p>
      <p className="mt-2 text-sm text-gray-800 whitespace-pre-line">{part.specSummary}</p>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">📈 가격 변동</h3>
        {priceHistory.length ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={priceHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(v) => `${v.toLocaleString()}원`} />
              <Tooltip formatter={(value) => `${Number(value).toLocaleString()}원`} />
              <Line dataKey="price" stroke="#3b82f6" />
            </LineChart>
          </ResponsiveContainer>
        ) : <p>가격 정보 없음</p>}
      </div>
    </div>
  );
};

export default Detail;
