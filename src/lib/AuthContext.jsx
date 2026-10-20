import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { backend } from '@/api/client';
import { onUserChanged } from '@/api/firebase';
import { appUrl } from '@/lib/utils';
import { accountsEnabled } from '@/lib/features';

const AuthContext = createContext();
const GUEST_KEY = 'robocraft_guest_session';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [authError, setAuthError] = useState(null);

  const applyGuest = () => {
    let guest = false;
    try { guest = !!localStorage.getItem(GUEST_KEY); } catch {}
    setUser(null);
    setIsGuest(guest);
    setIsAuthenticated(guest);
  };

  useEffect(() => {
    if (!accountsEnabled) {
      applyGuest();
      setIsLoadingAuth(false);
      setAuthChecked(true);
      return;
    }
    let off = () => {};
    let cancelled = false;
    onUserChanged(async (fbUser) => {
      if (cancelled) return;
      if (fbUser) {
        try {
          const record = await backend.auth.me();
          try { localStorage.removeItem(GUEST_KEY); } catch {}
          setUser(record); setIsGuest(false); setIsAuthenticated(true);
        } catch {
          applyGuest();
        }
      } else {
        applyGuest();
      }
      setAuthError(null);
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }).then(fn => { off = fn; }).catch(() => {
      // Firebase couldn't load (e.g. offline on first launch): guest mode still works.
      applyGuest(); setIsLoadingAuth(false); setAuthChecked(true);
    });
    return () => { cancelled = true; off(); };
  }, []);

  const checkUserAuth = useCallback(async () => {
    if (!accountsEnabled) return;
    try {
      const record = await backend.auth.me();
      setUser(record); setIsAuthenticated(true); setIsGuest(false);
    } catch { applyGuest(); }
    setAuthChecked(true); setIsLoadingAuth(false);
  }, []);

  const continueAsGuest = () => {
    try { localStorage.setItem(GUEST_KEY, 'active'); } catch {}
    setIsGuest(true);
    setIsAuthenticated(true);
    setAuthChecked(true);
  };

  const logout = async () => {
    try { localStorage.removeItem(GUEST_KEY); } catch {}
    try { await backend.auth.logout(); } catch {}
    setIsGuest(false); setUser(null); setIsAuthenticated(false);
    window.location.href = appUrl('/login');
  };

  const navigateToLogin = () => { window.location.href = appUrl('/login'); };

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated, isGuest, isLoadingAuth,
      isLoadingPublicSettings: false, authError, appPublicSettings: null, authChecked,
      logout, continueAsGuest, navigateToLogin, checkUserAuth, checkAppState: checkUserAuth,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
