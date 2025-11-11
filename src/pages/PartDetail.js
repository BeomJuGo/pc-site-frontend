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

  if (loading) return <div className="text-center text-slate-300 p-8 text-lg">로딩 중...</div>;
  if (!part) return <div className="text-center text-red-400 p-8 text-lg font-semibold">부품 정보를 불러올 수 없습니다.</div>;

  const n = (v) => (Number.isFinite(Number(v)) ? Number(v).toLocaleString() : "정보 없음");

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-4xl mx-auto">
      <div className="flex items-start gap-5 mb-6">
        <div className="w-24 h-24 rounded-xl bg-slate-800/50 border border-slate-600 flex items-center justify-center overflow-hidden backdrop-blur-sm">
          {part.image ? (
            <img src={part.image} alt={part.name} className="w-full h-full object-contain" />
          ) : (
            <span className="text-xs text-slate-400">NO IMAGE</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-white mb-3 truncate">{part.name}</h1>
          <div className="mt-2 flex flex-wrap gap-2 text-sm">
            {category === "gpu" && (
              <span className="px-3 py-1.5 rounded-lg border border-slate-600 bg-slate-800/50 text-slate-200 backdrop-blur-sm font-medium">3DMark {n(part?.benchmarkScore?.["3dmarkscore"])}</span>
            )}
            {category === "cpu" && (
              <>
                <span className="px-3 py-1.5 rounded-lg border border-slate-600 bg-slate-800/50 text-slate-200 backdrop-blur-sm font-medium">
                  PassMark {n(part?.benchScore || part?.benchmarkScore?.passmarkscore)}
                </span>
                <span className="px-3 py-1.5 rounded-lg border border-slate-600 bg-slate-800/50 text-slate-200 backdrop-blur-sm font-medium">CB Single {n(part?.benchmarkScore?.cinebenchSingle)}</span>
                <span className="px-3 py-1.5 rounded-lg border border-slate-600 bg-slate-800/50 text-slate-200 backdrop-blur-sm font-medium">CB Multi {n(part?.benchmarkScore?.cinebenchMulti)}</span>
              </>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white mb-1">
            {Number.isFinite(Number(part.price)) ? `${Number(part.price).toLocaleString()}원` : "가격 정보 없음"}
          </div>
          {priceHistory?.length > 1 && <div className="text-sm text-slate-400 mt-1">최근 {priceHistory.length}개 시점 데이터</div>}
        </div>
      </div>

      {part.info && (
        <div className="mt-6">
          <h3 className="text-lg font-bold text-white mb-3">상세 정보</h3>
          <div className="border border-slate-600 rounded-xl p-5 bg-slate-800/30 backdrop-blur-sm">
            <pre className="whitespace-pre-wrap text-base text-slate-200 leading-relaxed font-medium">{part.info}</pre>
          </div>
        </div>
      )}

      {part.specSummary && (
        <div className="mt-6">
          <h3 className="text-lg font-bold text-white mb-3">주요 사양</h3>
          <div className="border border-slate-600 rounded-xl p-5 bg-slate-800/30 backdrop-blur-sm">
            <pre className="whitespace-pre-wrap text-base text-slate-200 leading-relaxed font-medium">{part.specSummary}</pre>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-lg font-bold text-white mb-3">가격 변동 추이</h3>
        <div className="border border-slate-600 rounded-xl bg-slate-800/30 backdrop-blur-sm p-4">
          {priceHistory?.length > 0 ? (
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="date" stroke="#cbd5e1" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
                  <YAxis tickFormatter={(v) => `${Number(v).toLocaleString()}원`} stroke="#cbd5e1" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
                  <Tooltip 
                    formatter={(v) => `${Number(v).toLocaleString()}원`}
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', color: '#e2e8f0' }}
                  />
                  <Line type="monotone" dataKey="price" stroke="#60a5fa" strokeWidth={3} dot={{ fill: '#60a5fa', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-slate-400 text-base p-4 text-center">가격 정보 없음</div>
          )}
        </div>
      </div>

      {part.review && (
        <div className="mt-8">
          <h3 className="text-lg font-bold text-white mb-3">참고</h3>
          <div className="border border-slate-600 rounded-xl p-5 bg-slate-800/30 backdrop-blur-sm text-base text-slate-200 leading-relaxed font-medium">{part.review}</div>
        </div>
      )}
    </div>
  );
}
