import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-white/20 bg-white/30 backdrop-blur-sm">
      <div className="px-4 sm:px-6 lg:px-8 py-8 text-sm text-slate-600">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-blue-500">📊</span>
            <span>데이터 출처: PassMark, 3DMark, Cinebench</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-purple-500">💰</span>
            <span>가격 정보는 수집 시점에 따라 변동될 수 있습니다.</span>
          </div>
          <div className="sm:text-right flex items-center justify-end space-x-2">
            <span className="text-pink-500">✨</span>
            <span>© {new Date().getFullYear()} GoodPricePC</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-1 justify-center sm:justify-start border-t border-white/20 pt-4">
          <Link to="/about" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
            사이트 소개
          </Link>
          <Link to="/privacy" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
            개인정보처리방침
          </Link>
        </div>
      </div>
    </footer>
  );
}
