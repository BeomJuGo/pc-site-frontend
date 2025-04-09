import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">로그인</h2>

        <input
          type="email"
          placeholder="이메일"
          className="w-full border rounded-lg p-3 mb-4"
        />
        <input
          type="password"
          placeholder="비밀번호"
          className="w-full border rounded-lg p-3 mb-6"
        />

        <button className="w-full bg-blue-500 text-white rounded-lg py-3 hover:bg-blue-600 transition">
          로그인
        </button>

        <p className="text-center text-gray-500 text-sm mt-4">
          계정이 없으신가요?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
