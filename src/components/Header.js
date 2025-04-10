import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-gray-900 text-white p-4 flex justify-between">
      <h1 className="text-2xl font-bold">
        <Link to="/">💻 PC 추천 사이트</Link>
      </h1>
      <nav>
        <ul className="flex space-x-4">
          <li><Link to="/cpu">CPU</Link></li>
          <li><Link to="/gpu">GPU</Link></li>
          <li><Link to="/motherboard">메인보드</Link></li>
          <li><Link to="/ram">메모리</Link></li>
          <li><Link to="/recommended">AI 추천</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
