import React, { createContext, useState, useContext, useEffect } from 'react';
import { backend } from '@/api/client';
import { appParams } from '@/lib/app-params';
import { appUrl } from '@/lib/utils';
import { createAxiosClient } from '@base44/sdk/dist/utils/axios-client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [appPublicSettings, setAppPublicSettings] = useState(null); // Contains only { id, public_settings }

  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    try {
      setIsLoadingPublicSettings(true);
      setAuthError(null);
      
      // First, check app public settings (with token if available)
      // This will tell us if auth is required, user not registered, etc.
      const appClient = createAxiosClient({
        baseURL: `${import.meta.env.VITE_API_URL || ''}/api/apps/public`,
        headers: {
          'X-App-Id': appParams.appId
        },
        token: appParams.token, // Include token if available
        interceptResponses: true
      });
      
      try {
        const publicSettings = await appClient.get(`/prod/public-settings/by-id/${appParams.appId}`);
        setAppPublicSettings(publicSettings);
        
        // If we got the app public settings successfully, check if user is authenticated
        if (appParams.token) {
          await checkUserAuth();
        } else {
          // No token — check for guest session
          const guestSession = localStorage.getItem('robocraft_guest_session');
          if (guestSession) {
            setIsGuest(true);
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
          setIsLoadingAuth(false);
          setAuthChecked(true);
        }
        setIsLoadingPublicSettings(false);
      } catch (appError) {
        console.error('App state check failed:', appError);
        
        // Handle app-level errors
        if (appError.status === 403 && appError.data?.extra_data?.reason) {
          const reason = appError.data.extra_data.reason;
          if (reason === 'auth_required') {
            setAuthError({
              type: 'auth_required',
              message: 'Authentication required'
            });
          } else if (reason === 'user_not_registered') {
            setAuthError({
              type: 'user_not_registered',
              message: 'User not registered for this app'
            });
          } else {
            setAuthError({
              type: reason,
              message: appError.message
            });
          }
        } else {
          // Network / backend unreachable (offline, or the Android app without a
          // reachable backend). Lessons are bundled locally, so fall back to a
          // guest session instead of blocking the whole app.
          const guestSession = localStorage.getItem('robocraft_guest_session');
          setIsGuest(!!guestSession);
          setIsAuthenticated(!!guestSession);
        }
        setAuthChecked(true);
        setIsLoadingPublicSettings(false);
        setIsLoadingAuth(false);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setAuthError({
        type: 'unknown',
        message: error.message || 'An unexpected error occurred'
      });
      setIsLoadingPublicSettings(false);
      setIsLoadingAuth(false);
    }
  };

  const checkUserAuth = async () => {
    try {
      // Now check if the user is authenticated
      setIsLoadingAuth(true);
      const currentUser = await backend.auth.me();
      setUser(currentUser);
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
      setAuthChecked(true);
    } catch (error) {
      console.error('User auth check failed:', error);
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
      setAuthChecked(true);
      
      // If user auth fails, it might be an expired token
      if (error.status === 401 || error.status === 403) {
        setAuthError({
          type: 'auth_required',
          message: 'Authentication required'
        });
      }
    }
  };

  const continueAsGuest = () => {
    localStorage.setItem('robocraft_guest_session', 'active');
    setIsGuest(true);
    setIsAuthenticated(true);
    setAuthChecked(true);
  };

  const logout = () => {
    localStorage.removeItem('robocraft_guest_session');
    setIsGuest(false);
    setUser(null);
    setIsAuthenticated(false);
    // Sign out locally and stay inside the app (no external logout page)
    try { localStorage.removeItem('base44_access_token'); localStorage.removeItem('token'); } catch {}
    window.location.href = appUrl('/login');
  };

  const navigateToLogin = () => {
    // Use the app's own login screen (never the platform's hosted login page)
    const back = window.location.pathname + window.location.search;
    window.location.href = appUrl('/login') + (back && back !== '/' ? '?returnTo=' + encodeURIComponent(back) : '');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated,
      isGuest,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      authChecked,
      logout,
      continueAsGuest,
      navigateToLogin,
      checkUserAuth,
      checkAppState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};