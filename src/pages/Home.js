import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-slate-900">GoodPricePC</h1>
        <p className="mt-2 text-slate-600">
          가격과 성능 데이터를 기반으로 부품을 찾아보세요.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
        <Link
          to="/category/cpu"
          className="flex flex-col items-center bg-white border rounded-lg shadow hover:shadow-md p-6"
        >
          <span className="text-lg font-semibold">CPU</span>
        </Link>
        <Link
          to="/category/gpu"
          className="flex flex-col items-center bg-white border rounded-lg shadow hover:shadow-md p-6"
        >
          <span className="text-lg font-semibold">GPU</span>
        </Link>
        <Link
          to="/category/motherboard"
          className="flex flex-col items-center bg-white border rounded-lg shadow hover:shadow-md p-6"
        >
          <span className="text-lg font-semibold">메인보드</span>
        </Link>
        <Link
          to="/category/memory"
          className="flex flex-col items-center bg-white border rounded-lg shadow hover:shadow-md p-6"
        >
          <span className="text-lg font-semibold">메모리</span>
        </Link>
      </div>
    </div>
  );
}
