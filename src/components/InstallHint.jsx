import React, { useEffect, useState } from 'react';
import { Share, PlusSquare, X } from 'lucide-react';

// Shows iPhone/iPad users (in Safari, not yet installed) how to add RoboCraft
// to the home screen. Hidden in the Android app and once dismissed.
const KEY = 'robocraft_install_hint_closed';

export default function InstallHint() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const ua = navigator.userAgent;
      const isIOS = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      const standalone = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
      const native = !!window.Capacitor?.isNativePlatform?.();
      if (isIOS && !standalone && !native && !localStorage.getItem(KEY)) {
        const t = setTimeout(() => setShow(true), 2500);
        return () => clearTimeout(t);
      }
    } catch {}
  }, []);

  if (!show) return null;
  const close = () => { setShow(false); try { localStorage.setItem(KEY, '1'); } catch {} };

  return (
    <div className="fixed inset-x-3 z-[90] glass-strong rounded-2xl p-4 shadow-2xl animate-slide-up"
      style={{ bottom: 'calc(env(safe-area-inset-bottom) + 76px)' }}>
      <button onClick={close} aria-label="Close" className="absolute top-2 right-2 p-1.5 text-muted-foreground"><X className="w-4 h-4" /></button>
      <p className="text-sm font-bold mb-2 pr-6">Install RoboCraft on your iPhone</p>
      <ol className="text-xs text-muted-foreground space-y-1.5">
        <li className="flex items-center gap-1.5">1. Tap <Share className="w-4 h-4 text-cyan-400 inline" /> <b className="text-foreground">Share</b> in Safari (bottom bar, or ••• first)</li>
        <li className="flex items-center gap-1.5">2. Tap <PlusSquare className="w-4 h-4 text-cyan-400 inline" /> <b className="text-foreground">Add to Home Screen</b></li>
        <li>3. Tap <b className="text-foreground">Add</b> — RoboCraft opens like an app, even offline.</li>
      </ol>
    </div>
  );
}
