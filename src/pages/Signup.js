import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">회원가입</h2>

        <input
          type="text"
          placeholder="이름"
          className="w-full border rounded-lg p-3 mb-4"
        />
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

        <button className="w-full bg-green-500 text-white rounded-lg py-3 hover:bg-green-600 transition">
          회원가입
        </button>

        <p className="text-center text-gray-500 text-sm mt-4">
          이미 계정이 있으신가요?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
