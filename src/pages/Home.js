import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10">
      {/* 히어로 */}
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900">
          가성비 PC 부품 추천
        </h1>
        <p className="mt-2 text-slate-600">
          실제 커머스처럼 깔끔한 리스트 UI로 가격과 성능을 한눈에 보세요.
        </p>

        <div className="mt-5 flex justify-center gap-3">
          <Link
            to="/category/cpu"
            className="px-4 py-2 rounded-lg border border-slate-300 text-sm"
          >
            카테고리 보기
          </Link>
          <Link
            to="/ai-recommend"
            className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm"
          >
            AI 추천
          </Link>
        </div>
      </div>

      {/* 바로가기 타일(아이콘/이모지 제거, 심플 텍스트) */}
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { to: "/category/cpu", label: "CPU" },
          { to: "/category/gpu", label: "GPU" },
          { to: "/category/motherboard", label: "메인보드" },
          { to: "/category/memory", label: "메모리" },
        ].map((it) => (
          <Link
            key={it.to}
            to={it.to}
            className="border border-slate-200 rounded-xl p-4 text-center hover:border-slate-300"
          >
            <div className="text-sm font-semibold text-slate-900">
              {it.label}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
