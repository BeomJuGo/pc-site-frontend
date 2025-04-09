import React from 'react';

const parts = [
  {
    name: "AMD Ryzen 5 5600X",
    price: 180000,
    score: 9.2,
    valueScore: 92,
    image: "https://via.placeholder.com/150",
  },
  {
    name: "Intel Core i5-12400F",
    price: 200000,
    score: 8.5,
    valueScore: 90,
    image: "https://via.placeholder.com/150",
  },
  {
    name: "NVIDIA GeForce RTX 3060",
    price: 450000,
    score: 9.0,
    valueScore: 88,
    image: "https://via.placeholder.com/150",
  },
  {
    name: "Samsung 970 EVO Plus SSD 1TB",
    price: 120000,
    score: 8.8,
    valueScore: 95,
    image: "https://via.placeholder.com/150",
  },
];

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold text-blue-600">GoodPricePC</h1>
          <nav className="space-x-4">
            <button className="hover:text-blue-500">CPU</button>
            <button className="hover:text-blue-500">GPU</button>
            <button className="hover:text-blue-500">RAM</button>
            <button className="hover:text-blue-500">SSD</button>
            <button className="bg-blue-500 text-white rounded-full px-4 py-2 hover:bg-blue-600">AI 추천받기</button>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4">
        <section className="bg-blue-100 text-center p-8 rounded-2xl mb-8">
          <h2 className="text-3xl font-bold mb-4">🎯 나에게 맞는 가성비 PC를 찾아보세요!</h2>
          <button className="bg-blue-500 text-white rounded-full px-6 py-3 hover:bg-blue-600">AI 추천받기</button>
        </section>

        <div className="flex justify-end space-x-4 mb-6">
          <select className="border rounded p-2">
            <option>가격순</option>
            <option>성능순</option>
            <option>가성비순</option>
          </select>
          <input type="range" min="100000" max="5000000" className="w-40" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {parts.map((part, index) => (
            <div key={index} className="bg-white p-4 rounded-2xl shadow hover:scale-105 transform transition">
              <img
                src={part.image}
                alt={part.name}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="font-bold text-lg mb-2">{part.name}</h3>
              <p>가격: {part.price.toLocaleString()}원</p>
              <p>성능: {part.score} / 가성비: {part.valueScore}</p>
              <div className="flex justify-between mt-4">
                <button className="text-blue-500 hover:underline">상세보기</button>
                <button className="bg-blue-500 text-white rounded-full px-4 py-2 hover:bg-blue-600">구매하기</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-gray-100 text-center p-4 text-sm mt-8">
        © 2025 GoodPricePC | About | Contact | Github
      </footer>
    </div>
  );
}

export default App;
