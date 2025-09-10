import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-slate-900">GoodPricePC</h1>
        <p className="mt-2 text-slate-600">가격과 성능 데이터를 기반으로 부품을 찾아보세요.</p>
        <div className="mt-5 flex justify-center">
          <Link to="/ai-recommend" className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm">
            AI 추천
          </Link>
        </div>
      </div>
    </div>
  );
}
