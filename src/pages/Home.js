import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useState, useEffect } from "react";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  const categories = [
    {
      title: "CPU",
      description: "프로세서 성능과 가격을 비교해보세요",
      href: "/category/cpu",
      icon: "🖥️",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "GPU",
      description: "그래픽카드 성능과 가격을 확인하세요",
      href: "/category/gpu",
      icon: "🎮",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "메모리",
      description: "RAM 용량과 속도를 비교해보세요",
      href: "/category/memory",
      icon: "💾",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      title: "메인보드",
      description: "호환성과 확장성을 고려한 선택",
      href: "/category/motherboard",
      icon: "🔌",
      gradient: "from-orange-500 to-red-500"
    },
    {
      title: "저장장치",
      description: "SSD와 HDD의 속도와 용량 비교",
      href: "/category/storage",
      icon: "💿",
      gradient: "from-indigo-500 to-blue-500"
    },
    {
      title: "케이스",
      description: "PC 케이스 크기와 쿨링 성능",
      href: "/category/case",
      icon: "📦",
      gradient: "from-gray-500 to-slate-500"
    },
    {
      title: "쿨러",
      description: "CPU 쿨러와 케이스 팬 성능",
      href: "/category/cooler",
      icon: "❄️",
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      title: "파워",
      description: "파워서플라이 효율과 안정성",
      href: "/category/psu",
      icon: "⚡",
      gradient: "from-yellow-500 to-orange-500"
    }
  ];

  const features = [
    {
      title: "실시간 가격 비교",
      description: "다양한 품목들의 최신 가격을 실시간으로 비교합니다",
      icon: "📊"
    },
    {
      title: "성능 데이터",
      description: "벤치마크 점수와 실제 성능 데이터를 제공합니다",
      icon: "⚡"
    },
    {
      title: "AI 추천",
      description: "사용자 요구사항에 맞는 최적의 부품을 추천합니다",
      icon: "🤖"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Interactive Iridescence Background */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/30 to-pink-900/20"></div>

        {/* Mouse-following orb */}
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl transition-all duration-1000 ease-out animate-gradient"
          style={{
            background: `radial-gradient(circle, 
              rgba(59, 130, 246, 0.4) 0%, 
              rgba(147, 51, 234, 0.3) 25%, 
              rgba(236, 72, 153, 0.2) 50%, 
              rgba(34, 197, 94, 0.1) 75%, 
              rgba(251, 191, 36, 0.05) 100%)`,
            left: `${mousePosition.x - 192}px`,
            top: `${mousePosition.y - 192}px`,
            transform: 'translate(-50%, -50%)',
          }}
        ></div>

        {/* Secondary orbs with different animations */}
        <div
          className="absolute w-64 h-64 rounded-full blur-2xl transition-all duration-2000 ease-out animate-float"
          style={{
            background: `radial-gradient(circle, 
              rgba(236, 72, 153, 0.3) 0%, 
              rgba(59, 130, 246, 0.2) 50%, 
              rgba(34, 197, 94, 0.1) 100%)`,
            left: `${mousePosition.x * 0.3}px`,
            top: `${mousePosition.y * 0.7}px`,
            transform: 'translate(-50%, -50%)',
          }}
        ></div>

        <div
          className="absolute w-80 h-80 rounded-full blur-3xl transition-all duration-1500 ease-out animate-shimmer"
          style={{
            background: `radial-gradient(circle, 
              rgba(147, 51, 234, 0.35) 0%, 
              rgba(236, 72, 153, 0.25) 30%, 
              rgba(59, 130, 246, 0.15) 60%, 
              rgba(251, 191, 36, 0.1) 100%)`,
            left: `${mousePosition.x * 1.2}px`,
            top: `${mousePosition.y * 0.4}px`,
            transform: 'translate(-50%, -50%)',
          }}
        ></div>

        {/* Additional dynamic orbs */}
        <div
          className="absolute w-48 h-48 rounded-full blur-xl transition-all duration-3000 ease-out"
          style={{
            background: `radial-gradient(circle, 
              rgba(34, 197, 94, 0.25) 0%, 
              rgba(251, 191, 36, 0.15) 50%, 
              rgba(236, 72, 153, 0.1) 100%)`,
            left: `${mousePosition.x * 0.8}px`,
            top: `${mousePosition.y * 1.1}px`,
            transform: 'translate(-50%, -50%)',
          }}
        ></div>

        <div
          className="absolute w-56 h-56 rounded-full blur-2xl transition-all duration-2500 ease-out"
          style={{
            background: `radial-gradient(circle, 
              rgba(251, 191, 36, 0.3) 0%, 
              rgba(34, 197, 94, 0.2) 40%, 
              rgba(59, 130, 246, 0.1) 80%, 
              rgba(147, 51, 234, 0.05) 100%)`,
            left: `${mousePosition.x * 1.5}px`,
            top: `${mousePosition.y * 0.2}px`,
            transform: 'translate(-50%, -50%)',
          }}
        ></div>

        {/* Animated background orbs with complex gradients */}
        <div className="absolute top-20 left-20 w-72 h-72 rounded-full blur-3xl animate-pulse animate-iridescence animate-morphing" style={{
          background: `radial-gradient(circle, 
            rgba(59, 130, 246, 0.3) 0%, 
            rgba(147, 51, 234, 0.2) 30%, 
            rgba(236, 72, 153, 0.15) 60%, 
            rgba(34, 197, 94, 0.1) 100%)`
        }}></div>

        <div className="absolute top-40 right-20 w-96 h-96 rounded-full blur-3xl animate-pulse animate-float" style={{
          animationDelay: '2s',
          background: `radial-gradient(circle, 
            rgba(236, 72, 153, 0.25) 0%, 
            rgba(251, 191, 36, 0.2) 25%, 
            rgba(34, 197, 94, 0.15) 50%, 
            rgba(59, 130, 246, 0.1) 75%, 
            rgba(147, 51, 234, 0.05) 100%)`
        }}></div>

        <div className="absolute bottom-20 left-1/3 w-80 h-80 rounded-full blur-3xl animate-pulse animate-shimmer" style={{
          animationDelay: '4s',
          background: `radial-gradient(circle, 
            rgba(34, 197, 94, 0.3) 0%, 
            rgba(59, 130, 246, 0.2) 40%, 
            rgba(147, 51, 234, 0.15) 70%, 
            rgba(236, 72, 153, 0.1) 100%)`
        }}></div>

        {/* Additional floating orbs */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full blur-2xl animate-float" style={{
          animationDelay: '1s',
          background: `radial-gradient(circle, 
            rgba(251, 191, 36, 0.2) 0%, 
            rgba(236, 72, 153, 0.15) 50%, 
            rgba(59, 130, 246, 0.1) 100%)`
        }}></div>

        <div className="absolute bottom-1/4 right-1/3 w-56 h-56 rounded-full blur-xl animate-gradient" style={{
          animationDelay: '3s',
          background: `radial-gradient(circle, 
            rgba(147, 51, 234, 0.25) 0%, 
            rgba(34, 197, 94, 0.15) 60%, 
            rgba(251, 191, 36, 0.1) 100%)`
        }}></div>

        {/* Floating particles with enhanced effects */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-float"
              style={{
                width: `${2 + Math.random() * 4}px`,
                height: `${2 + Math.random() * 4}px`,
                background: `rgba(${Math.random() > 0.5 ? '59, 130, 246' : Math.random() > 0.5 ? '236, 72, 153' : '34, 197, 94'}, ${0.3 + Math.random() * 0.4})`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
                boxShadow: `0 0 ${10 + Math.random() * 20}px rgba(59, 130, 246, 0.3)`,
              }}
            ></div>
          ))}
        </div>

        {/* Glowing lines */}
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-px h-full opacity-20 animate-shimmer"
              style={{
                background: `linear-gradient(to bottom, 
                  transparent 0%, 
                  rgba(59, 130, 246, 0.5) 50%, 
                  transparent 100%)`,
                left: `${20 + i * 20}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: '4s',
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <Badge variant="secondary" className="mb-4 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 transition-all duration-300 animate-fade-in-up">
                ✨ 새로운 PC 부품 비교 사이트
              </Badge>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              GoodPricePC
            </h1>
            <p className="text-xl text-slate-200 leading-relaxed mb-8 max-w-2xl mx-auto font-medium animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              신뢰할 수 있는 가격과 성능 데이터를 바탕으로 PC 부품을 탐색할 수 있는 사이트입니다.
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold"> 최적의 가성비</span>를 찾아보세요.
            </p>

          </div>
        </section>

        {/* Categories Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-white">
                카테고리별 탐색
              </h2>
              <p className="text-lg text-slate-300 font-medium">
                원하는 부품 카테고리를 선택하여 상세 정보를 확인하세요
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-xl transition-all duration-500 cursor-pointer bg-white/80 backdrop-blur-sm border-slate-200/50 hover:bg-white hover:scale-105 hover:-translate-y-2 animate-fade-in-up hover-lift"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-800 group-hover:text-slate-900">
                      {category.title}
                    </CardTitle>
                    <CardDescription className="text-slate-600 font-medium">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center pt-0">
                    <Button
                      variant="outline"
                      className={`w-full bg-gradient-to-r ${category.gradient} text-white border-0 hover:shadow-lg group-hover:shadow-xl transition-all duration-300 hover:scale-105`}
                      onClick={() => window.location.href = category.href}
                    >
                      탐색하기
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-white">
                주요 기능
              </h2>
              <p className="text-lg text-slate-300 font-medium">
                GoodPricePC만의 특별한 기능들을 만나보세요
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="text-center bg-white/70 backdrop-blur-sm border-slate-200/50 hover:bg-white hover:shadow-xl transition-all duration-500 hover:scale-105 animate-fade-in-up hover-lift"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <CardHeader>
                    <div className="text-4xl mb-3">{feature.icon}</div>
                    <CardTitle className="text-xl font-bold text-slate-800">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-base text-slate-600 font-medium">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 animate-fade-in-up hover-lift">
              <CardHeader>
                <CardTitle className="text-4xl mb-4 font-bold">
                  🚀 지금 시작하세요
                </CardTitle>
                <CardDescription className="text-blue-100 text-xl font-medium">
                  AI 추천을 통해 최적의 PC 구성을 찾아보세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8 py-4 bg-white text-purple-600 hover:bg-blue-50 hover:text-purple-700 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                  onClick={() => window.location.href = "/ai-recommend"}
                >
                  ✨ AI 추천 받기
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
