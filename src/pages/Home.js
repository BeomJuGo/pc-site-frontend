import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-14">
          💻 최고의 가성비 PC 부품을 찾아보세요
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* 카테고리 카드 */}
          {[
            { to: "/category/cpu", icon: "🖥️", label: "CPU" },
            { to: "/category/gpu", icon: "🎮", label: "GPU" },
            { to: "/category/mainboard", icon: "🔧", label: "메인보드" },
            { to: "/category/memory", icon: "📀", label: "메모리" },
            { to: "/ai-recommend", icon: "🧠", label: "AI 추천" },
          ].map(({ to, icon, label }) => (
            <Link
              key={label}
              to={to}
              className="flex flex-col items-center justify-center bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl hover:bg-gray-50 p-8 transition-transform transform hover:-translate-y-2 duration-300"
            >
              <div className="text-5xl mb-4">{icon}</div>
              <div className="text-lg font-semibold text-gray-700">{label}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
