import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPartDetail, fetchPriceHistory } from "../utils/api";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function PartDetail() {
  const { category, slug } = useParams();
  const [part, setPart] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const detail = await fetchPartDetail(category, slug);
      const history = await fetchPriceHistory(category, slug);
      setPart(detail);
      setPriceHistory(history || []);
      setLoading(false);
    };
    load();
  }, [category, slug]);

  if (loading) return <div className="text-center text-slate-500 p-8">로딩 중...</div>;
  if (!part) return <div className="text-center text-rose-600 p-8">부품 정보를 불러올 수 없습니다.</div>;

  const n = (v) => (Number.isFinite(Number(v)) ? Number(v).toLocaleString() : "정보 없음");

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-4xl mx-auto">
      <div className="flex items-start gap-5">
        <div className="w-24 h-24 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden">
          {part.image ? (
            <img src={part.image} alt={part.name} className="w-full h-full object-contain" />
          ) : (
            <span className="text-xs text-slate-400">NO IMAGE</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-slate-900 truncate">{part.name}</h1>
          <div className="mt-2 flex flex-wrap gap-2 text-[12px] text-slate-600">
            {category === "gpu" && (
              <span className="px-2 py-1 rounded-lg border border-slate-300">3DMark {n(part?.benchmarkScore?.["3dmarkscore"])}</span>
            )}
            {category === "cpu" && (
              <>
                <span className="px-2 py-1 rounded-lg border border-slate-300">
                  PassMark {n(part?.benchScore || part?.benchmarkScore?.passmarkscore)}
                </span>
                <span className="px-2 py-1 rounded-lg border border-slate-300">CB Single {n(part?.benchmarkScore?.cinebenchSingle)}</span>
                <span className="px-2 py-1 rounded-lg border border-slate-300">CB Multi {n(part?.benchmarkScore?.cinebenchMulti)}</span>
              </>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-slate-900">
            {Number.isFinite(Number(part.price)) ? `${Number(part.price).toLocaleString()}원` : "가격 정보 없음"}
          </div>
          {priceHistory?.length > 1 && <div className="text-[12px] text-slate-500 mt-1">최근 {priceHistory.length}개 시점 데이터</div>}
        </div>
      </div>

      {part.info && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-2">상세 정보</h3>
          <div className="border border-slate-200 rounded-xl p-4 bg-white">
            <pre className="whitespace-pre-wrap text-[14px] text-slate-700">{part.info}</pre>
          </div>
        </div>
      )}

      {part.specSummary && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-2">주요 사양</h3>
          <div className="border border-slate-200 rounded-xl p-4 bg-white">
            <pre className="whitespace-pre-wrap text-[14px] text-slate-700">{part.specSummary}</pre>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-sm font-semibold text-slate-900 mb-2">가격 변동 추이</h3>
        <div className="border border-slate-200 rounded-xl bg-white p-3">
          {priceHistory?.length > 0 ? (
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(v) => `${Number(v).toLocaleString()}원`} />
                  <Tooltip formatter={(v) => `${Number(v).toLocaleString()}원`} />
                  <Line type="monotone" dataKey="price" stroke="#0f172a" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-slate-500 text-sm p-4">가격 정보 없음</div>
          )}
        </div>
      </div>

      {part.review && (
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-slate-900 mb-2">참고</h3>
          <div className="border border-slate-200 rounded-xl p-4 bg-white text-[14px] text-slate-700">{part.review}</div>
        </div>
      )}
    </div>
  );
}
