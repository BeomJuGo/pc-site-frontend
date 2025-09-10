import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Category from "./pages/Category";
import PartDetail from "./pages/PartDetail";
import Recommend from "./pages/Recommend";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:category" element={<Category />} />
            <Route path="/detail/:category/:slug" element={<PartDetail />} />
            <Route path="/ai-recommend" element={<Recommend />} />
            {/* 과거 경로 호환 */}
            <Route path="/recommended" element={<Navigate to="/ai-recommend" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
