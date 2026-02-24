import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-white/20 bg-white/30 backdrop-blur-sm">
      <div className="px-4 sm:px-6 lg:px-8 py-8 text-sm text-slate-600">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-blue-500">?“Š</span>
            <span>?°ì´??ì¶œì²˜: PassMark, 3DMark, Cinebench</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-purple-500">?’°</span>
            <span>ê°€ê²??•ë³´???˜ì§‘ ?œì ???°ë¼ ë³€?™ë  ???ˆìŠµ?ˆë‹¤.</span>
          </div>
          <div className="sm:text-right flex items-center justify-end space-x-2">
            <span className="text-pink-500">??/span>
            <span>Â© {new Date().getFullYear()} GoodPricePC</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-1 justify-center sm:justify-start border-t border-white/20 pt-4">
          <Link to="/about" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
            ?¬ì´???Œê°œ
          </Link>
          <Link to="/guide" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
            ê°€?´ë“œ
          </Link>
          <Link to="/privacy" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
            ê°œì¸?•ë³´ì²˜ë¦¬ë°©ì¹¨
          </Link>
          <Link to="/terms" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
            ?´ìš©?½ê?
          </Link>
          <a href="mailto:lom0097@naver.com" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
            ë¬¸ì˜
          </a>
        </div>
      </div>
    </footer>
  );
}
