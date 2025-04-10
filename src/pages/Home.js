import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-4">💻 가성비 PC 부품 추천</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/category/cpu" className="p-4 bg-gray-100 rounded-lg text-center hover:bg-gray-200 transition">
          🖥️ CPU
        </Link>
        <Link to="/category/gpu" className="p-4 bg-gray-100 rounded-lg text-center hover:bg-gray-200 transition">
          🎮 GPU
        </Link>
        <Link to="/category/mainboard" className="p-4 bg-gray-100 rounded-lg text-center hover:bg-gray-200 transition">
          🔧 메인보드
        </Link>
        <Link to="/category/memory" className="p-4 bg-gray-100 rounded-lg text-center hover:bg-gray-200 transition">
          📀 메모리
        </Link>
        <Link to="/ai-recommend" className="p-4 bg-gray-100 rounded-lg text-center hover:bg-gray-200 transition">
          🧠 AI 추천 (ChatGPT)
        </Link>
      </div>
    </div>
  );
};

export default Home;
