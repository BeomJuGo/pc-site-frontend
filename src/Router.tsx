import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Category from "./pages/Category";
import Detail from "./pages/PartDetail";
import Recommend from "./pages/Recommend";
import Login from "./pages/Login"; // 추가
import Signup from "./pages/Signup"; // 추가

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:category" element={<Category />} />
        <Route path="/detail/:category/:id" element={<Detail />} />
        <Route path="/ai-recommend" element={<Recommend />} />
        <Route path="/login" element={<Login />} /> {/* 추가 */}
        <Route path="/signup" element={<Signup />} /> {/* 추가 */}
      </Routes>
    </Router>
  );
};

export default AppRouter;
