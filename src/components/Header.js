import { Link, NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const menuRef = useRef(null);

  const menuItems = [
    { to: "/category/cpu", label: "CPU", delay: "0ms" },
    { to: "/category/gpu", label: "GPU", delay: "100ms" },
    { to: "/category/motherboard", label: "메인보드", delay: "200ms" },
    { to: "/category/memory", label: "메모리", delay: "300ms" },
    { to: "/category/storage", label: "저장장치", delay: "400ms" },
    { to: "/category/case", label: "케이스", delay: "500ms" },
    { to: "/category/cooler", label: "쿨러", delay: "600ms" },
    { to: "/category/psu", label: "파워", delay: "700ms" },
  ];

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header ref={menuRef} className="relative bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo with staggered animation */}
        <Link
          to="/"
          className={`text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent hover:scale-105 transition-all duration-500 ${isLoaded ? 'animate-fade-in-left' : 'opacity-0'
            }`}
          style={{ animationDelay: '0ms' }}
        >
          GoodPricePC
        </Link>

        {/* Menu Toggle Button - Always visible */}
        <button
          className={`p-2 rounded-lg hover:bg-slate-100 transition-all duration-300 ${isLoaded ? 'animate-fade-in-right' : 'opacity-0 translate-x-4'
            }`}
          style={{
            animationDelay: '200ms',
            animationFillMode: 'forwards'
          }}
          onClick={toggleMenu}
        >
          <div className="w-6 h-6 flex flex-col justify-center space-y-1">
            <div className={`h-0.5 bg-slate-600 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
            <div className={`h-0.5 bg-slate-600 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
            <div className={`h-0.5 bg-slate-600 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
          </div>
        </button>
      </div>

      {/* Staggered Menu Dropdown */}
      <div className={`absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-white/20 shadow-lg transition-all duration-500 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}>
        <nav className="px-4 py-6">
          <div className="max-w-6xl mx-auto">
            {/* Main Navigation Items */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-4 mb-6">
              {menuItems.map((item, index) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `px-4 py-3 text-sm font-medium rounded-lg transition-all duration-500 relative overflow-hidden group ${isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    } ${isMenuOpen ? 'animate-fade-in-up' : 'opacity-0 translate-y-4'
                    }`
                  }
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'forwards'
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative z-10">{item.label}</span>
                </NavLink>
              ))}
            </div>

            {/* AI Recommend Section */}
            <div className={`border-t border-slate-200 pt-4 ${isMenuOpen ? 'animate-fade-in-up' : 'opacity-0 translate-y-4'
              }`}
              style={{
                animationDelay: `${menuItems.length * 100}ms`,
                animationFillMode: 'forwards'
              }}>
              <NavLink
                to="/ai-recommend"
                className="inline-flex items-center px-6 py-3 text-sm font-medium rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 transition-all duration-500 shadow-lg hover:shadow-xl relative overflow-hidden group"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-pink-600/20 to-rose-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10">✨ AI 추천 받기</span>
              </NavLink>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}