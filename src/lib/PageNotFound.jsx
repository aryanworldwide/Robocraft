import { useLocation, useNavigate } from 'react-router-dom';
import { Bot, Home } from 'lucide-react';

export default function PageNotFound() {
  const location = useLocation();
  const navigate = useNavigate();
  const pageName = location.pathname.substring(1);

  return (
    <div className="min-h-screen animated-bg grid-pattern flex items-center justify-center p-6">
      <div className="max-w-sm w-full glass-strong rounded-3xl p-8 text-center animate-scale-in">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/15 flex items-center justify-center mx-auto mb-4">
          <Bot className="w-8 h-8 text-cyan-400" />
        </div>
        <h1 className="text-5xl font-bold gradient-text mb-2">404</h1>
        <h2 className="text-lg font-bold mb-2">Page not found</h2>
        <p className="text-sm text-muted-foreground mb-6">
          {pageName ? <>We couldn't find <span className="font-medium text-foreground">"{pageName}"</span>.</> : "We couldn't find that page."}
        </p>
        <button
          onClick={() => navigate('/')}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" /> Go Home
        </button>
      </div>
    </div>
  );
}
