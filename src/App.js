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
      <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Global Interactive Background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/15 to-pink-900/10"></div>
        </div>

        <Header />
        <main className="flex-1 relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:category" element={<Category />} />
            <Route path="/detail/:category/:slug" element={<PartDetail />} />
            <Route path="/ai-recommend" element={<Recommend />} />
            <Route path="/recommended" element={<Navigate to="/ai-recommend" replace />} />
            <Route path="/cpu" element={<Navigate to="/category/cpu" replace />} />
            <Route path="/gpu" element={<Navigate to="/category/gpu" replace />} />
            <Route path="/motherboard" element={<Navigate to="/category/motherboard" replace />} />
            <Route path="/ram" element={<Navigate to="/category/memory" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
