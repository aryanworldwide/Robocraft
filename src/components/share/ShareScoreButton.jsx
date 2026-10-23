import React, { useState } from 'react';
import { Share2, Loader2, Check } from 'lucide-react';
import { shareScoreCard } from '@/lib/scoreCard';

/** "Share my score" — makes a picture of the result that can be sent anywhere. */
export default function ShareScoreButton({ card, label = 'Share my score', className = '' }) {
  const [state, setState] = useState(null);
  const go = async () => {
    setState('busy');
    try { const r = await shareScoreCard(typeof card === 'function' ? card() : card); setState(r === 'cancelled' ? null : 'done'); }
    catch { setState(null); }
    setTimeout(() => setState(s => (s === 'done' ? null : s)), 2500);
  };
  return (
    <button aria-label="Mark done" onClick={go} disabled={state === 'busy'} className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl glass text-cyan-400 text-xs font-bold ${className}`}>
      {state === 'busy' ? <Loader2 className="w-4 h-4 animate-spin" /> : state === 'done' ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
      {state === 'done' ? 'Done' : label}
    </button>
  );
}
