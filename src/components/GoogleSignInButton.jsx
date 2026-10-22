import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import GoogleIcon from '@/components/GoogleIcon';
import { backend } from '@/api/client';
import { accountsEnabled } from '@/lib/features';
import { isNative, isInApp, nativeGoogle } from '@/lib/platform';
import { appUrl } from '@/lib/utils';

// "Continue with Google" — web and iPhone use the Firebase popup. Google blocks
// popups inside Android web views, so the Android app shows the button only when
// it was built with native Google sign-in (android-config/google-services.json).
export default function GoogleSignInButton({ onError }) {
  const [busy, setBusy] = useState(false);
  if (!accountsEnabled || (!nativeGoogle && (isNative || isInApp))) return null;
  const go = async () => {
    setBusy(true);
    try { await backend.auth.loginWithGoogle(); window.location.href = appUrl('/'); }
    catch (e) { if (!e?.cancelled) onError?.(e.message); }
    finally { setBusy(false); }
  };
  return (
    <Button type="button" variant="outline" disabled={busy} onClick={go}
      className="w-full h-12 text-sm font-medium mb-3 glass hover:bg-cyan-500/10 border-cyan-500/20 text-foreground hover:text-cyan-400">
      <GoogleIcon className="w-5 h-5 mr-2" /> {busy ? 'Opening Google…' : 'Continue with Google'}
    </Button>
  );
}
