import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const savedNickname = localStorage.getItem("nickname");
    if (savedNickname) {
      setNickname(savedNickname);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("nickname");
    setNickname("");
    navigate("/");
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <Link to="/" className="text-2xl font-bold text-gray-800">GoodPricePC</Link>

        <div className="flex-1 mx-6">
          <input
            type="text"
            placeholder="검색어를 입력하세요..."
            className="w-full border rounded-full px-5 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <div className="flex items-center space-x-4">
          {nickname ? (
            <>
              <span className="font-semibold text-gray-800">{nickname}님</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full px-5 py-2 transition"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-5 py-2 transition">
                로그인
              </Link>
              <Link to="/signup" className="bg-green-500 hover:bg-green-600 text-white rounded-full px-5 py-2 transition">
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
