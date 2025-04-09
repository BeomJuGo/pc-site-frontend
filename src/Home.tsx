import { useState } from "react";

const tabs = ["CPU", "GPU", "메모리", "메인보드"];

const allParts = {
  CPU: [
    {
      id: 1,
      name: "AMD Ryzen 5 5600X",
      price: 180000,
      valueScore: 92,
      sales: 15000,
      image: "https://via.placeholder.com/100",
      description: "6코어 12스레드, 뛰어난 게이밍 성능",
    },
    {
      id: 2,
      name: "Intel Core i5-12400F",
      price: 200000,
      valueScore: 90,
      sales: 20000,
      image: "https://via.placeholder.com/100",
      description: "인텔 12세대 가성비 게이밍 CPU",
    },
  ],
  GPU: [
    {
      id: 3,
      name: "NVIDIA GeForce RTX 3060",
      price: 450000,
      valueScore: 85,
      sales: 18000,
      image: "https://via.placeholder.com/100",
      description: "1080p 게이밍에 최적화된 그래픽카드",
    },
  ],
  메모리: [
    {
      id: 4,
      name: "Corsair Vengeance 16GB",
      price: 70000,
      valueScore: 88,
      sales: 22000,
      image: "https://via.placeholder.com/100",
      description: "고성능 DDR4 메모리",
    },
  ],
  메인보드: [
    {
      id: 5,
      name: "ASUS PRIME B550M-A",
      price: 130000,
      valueScore: 82,
      sales: 12000,
      image: "https://via.placeholder.com/100",
      description: "AMD B550 칩셋 Micro-ATX 보드",
    },
  ],
};

function Home() {
  const [selectedTab, setSelectedTab] = useState("CPU");
  const [sortOption, setSortOption] = useState("가성비순");

  const sortedParts = [...(allParts[selectedTab] || [])].sort((a, b) => {
    if (sortOption === "가격순") {
      return a.price - b.price;
    } else if (sortOption === "판매순") {
      return b.sales - a.sales;
    } else {
      return b.valueScore - a.valueScore;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* 탭 */}
      <div className="flex space-x-6 justify-center mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`text-lg font-semibold pb-2 ${
              selectedTab === tab
                ? "border-b-4 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 정렬 드롭다운 */}
      <div className="flex justify-end mb-4">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border rounded-full px-4 py-2"
        >
          <option value="가성비순">가성비순</option>
          <option value="가격순">가격순</option>
          <option value="판매순">판매순</option>
        </select>
      </div>

      {/* 제품 리스트 */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        {sortedParts.map((part) => (
          <div key={part.id} className="flex items-center border-b last:border-0 py-4">
            <img
              src={part.image}
              alt={part.name}
              className="w-24 h-24 object-cover rounded-lg mr-6 border"
            />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800">{part.name}</h3>
              <p className="text-gray-500">{part.description}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-blue-600">
                {part.price.toLocaleString()}원
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
