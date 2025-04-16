import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPartDetail } from "../utils/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const Detail = () => {
  const { category, id } = useParams();
  const [part, setPart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const data = await fetchPartDetail(category, decodeURIComponent(id));
      setPart(data);
      setLoading(false);
    };
    fetch();
  }, [category, id]);

  if (loading) {
    return <div className="text-center text-gray-500">⏳ 로딩 중...</div>;
  }

  if (!part) {
    return <div className="text-center text-red-500">❌ 부품 정보를 찾을 수 없습니다.</div>;
  }

  const latestPrice = part.priceHistory?.[part.priceHistory.length - 1]?.price || "가격 정보 없음";

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">{part.name}</h2>

      <div className="flex items-start gap-4">
        {part.image && (
          <img
            src={part.image}
            alt={part.name}
            className="w-36 h-36 object-contain border rounded"
          />
        )}

        <div className="flex-1">
          <p className="mb-2">💰 현재 가격: {Number(latestPrice).toLocaleString()}원</p>

          {part.benchmarkScore && (
            <div className="mb-2">
              ⚙️ Geekbench 점수:
              <ul className="ml-5 list-disc text-sm">
                <li>싱글 코어: {part.benchmarkScore.singleCore}</li>
                <li>멀티 코어: {part.benchmarkScore.multiCore}</li>
              </ul>
            </div>
          )}

          {part.specSummary && (
            <div className="mb-2">
              📋 주요 사양 요약:
              <p className="ml-4 text-sm text-gray-800 whitespace-pre-line">
                {part.specSummary}
              </p>
            </div>
          )}

          {part.review && (
            <p className="italic text-blue-600 whitespace-pre-line mt-2">💬 {part.review}</p>
          )}
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-2">📈 가격 변동 추이</h3>
        {part.priceHistory?.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={part.priceHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(v) => `${v.toLocaleString()}원`} />
              <Tooltip formatter={(value) => `${Number(value).toLocaleString()}원`} />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#3b82f6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">가격 정보 없음</p>
        )}
      </div>
    </div>
  );
};

export default Detail;
