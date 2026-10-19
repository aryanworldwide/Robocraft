import React from 'react';
import { WifiOff, RotateCw } from 'lucide-react';

export default function OfflineScreen({ onRetry }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-6 bg-background">
      <div className="text-center max-w-sm animate-scale-in">
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-5">
          <WifiOff className="w-9 h-9 text-red-400" />
        </div>
        <h1 className="text-xl font-bold mb-2">You're offline</h1>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          RoboCraft needs an internet connection to load your lessons and sync progress. Check your connection and try again.
        </p>
        <button
          onClick={onRetry || (() => window.location.reload())}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold hover:neon-glow transition-all flex items-center gap-2 mx-auto"
        >
          <RotateCw className="w-4 h-4" /> Retry
        </button>
      </div>
    </div>
  );
}
