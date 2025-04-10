import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">💻 가성비 PC 부품 추천</h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {/* 카테고리 카드 */}
          <Link
            to="/category/cpu"
            className="flex flex-col items-center justify-center bg-white rounded-xl shadow-md hover:shadow-lg p-6 transition-all hover:-translate-y-1"
          >
            <div className="text-4xl mb-4">🖥️</div>
            <div className="text-lg font-semibold">CPU</div>
          </Link>

          <Link
            to="/category/gpu"
            className="flex flex-col items-center justify-center bg-white rounded-xl shadow-md hover:shadow-lg p-6 transition-all hover:-translate-y-1"
          >
            <div className="text-4xl mb-4">🎮</div>
            <div className="text-lg font-semibold">GPU</div>
          </Link>

          <Link
            to="/category/mainboard"
            className="flex flex-col items-center justify-center bg-white rounded-xl shadow-md hover:shadow-lg p-6 transition-all hover:-translate-y-1"
          >
            <div className="text-4xl mb-4">🔧</div>
            <div className="text-lg font-semibold">메인보드</div>
          </Link>

          <Link
            to="/category/memory"
            className="flex flex-col items-center justify-center bg-white rounded-xl shadow-md hover:shadow-lg p-6 transition-all hover:-translate-y-1"
          >
            <div className="text-4xl mb-4">📀</div>
            <div className="text-lg font-semibold">메모리</div>
          </Link>

          <Link
            to="/ai-recommend"
            className="flex flex-col items-center justify-center bg-white rounded-xl shadow-md hover:shadow-lg p-6 transition-all hover:-translate-y-1"
          >
            <div className="text-4xl mb-4">🧠</div>
            <div className="text-lg font-semibold">AI 추천</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
