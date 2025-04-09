import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Category from "./pages/Category";
import Detail from "./pages/PartDetail";
import Recommend from "./pages/Recommend";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Header from "./components/Header";

const AppRouter = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:category" element={<Category />} />
        <Route path="/detail/:category/:id" element={<Detail />} />
        <Route path="/ai-recommend" element={<Recommend />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
