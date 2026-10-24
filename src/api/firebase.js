// Firebase (free Spark plan): accounts + Firestore. Loaded only when configured.
import { firebaseConfig } from '@/config/services';

let ready;
export function fb() {
  if (!ready) {
    ready = (async () => {
      const [{ initializeApp }, authMod, fsMod] = await Promise.all([
        import('firebase/app'), import('firebase/auth'), import('firebase/firestore'),
      ]);
      const app = initializeApp(firebaseConfig);
      // IndexedDB persistence keeps students signed in (also inside the Android app).
      //
      // The popup resolver has to be passed explicitly. getAuth() includes one;
      // initializeAuth() does not, and without it signInWithPopup fails with
      // auth/argument-error before a window ever opens — which is exactly what
      // "Continue with Google" was doing.
      let auth;
      try {
        auth = authMod.initializeAuth(app, {
          persistence: [authMod.indexedDBLocalPersistence, authMod.browserLocalPersistence],
          popupRedirectResolver: authMod.browserPopupRedirectResolver,
        });
      } catch {
        auth = authMod.getAuth(app);
      }
      const db = fsMod.getFirestore(app);
      return { app, auth, db, A: authMod, F: fsMod };
    })();
  }
  return ready;
}

// Wait until Firebase knows whether someone is signed in.
export async function currentFirebaseUser() {
  const { auth, A } = await fb();
  if (auth.currentUser) return auth.currentUser;
  return new Promise(resolve => {
    const off = A.onAuthStateChanged(auth, u => { off(); resolve(u); });
  });
}

export async function onUserChanged(cb) {
  const { auth, A } = await fb();
  return A.onAuthStateChanged(auth, cb);
}

// Friendly messages for Firebase error codes.
export function authError(e) {
  const code = e?.code || '';
  const map = {
    'auth/invalid-credential': ['Incorrect email or password.', 401],
    'auth/wrong-password': ['Incorrect email or password.', 401],
    'auth/user-not-found': ['No account found with this email.', 404],
    'auth/invalid-email': ['Please enter a valid email address.', 400],
    'auth/email-already-in-use': ['An account with this email already exists. Try logging in.', 409],
    'auth/weak-password': ['Password must be at least 6 characters.', 400],
    'auth/missing-password': ['Please enter your password.', 400],
    'auth/too-many-requests': ['Too many attempts. Please wait a few minutes and try again.', 429],
    'auth/network-request-failed': ['Network error. Check your internet connection.', 0],
    'auth/user-disabled': ['This account has been disabled.', 403],
    'auth/popup-closed-by-user': ['Sign-in was cancelled.', 400],
    'auth/requires-recent-login': ['Please log in again, then retry.', 401],
  };
  const [message, status] = map[code] || [e?.message?.replace(/^Firebase:\s*/, '') || 'Something went wrong. Please try again.', 500];
  return Object.assign(new Error(message), { status, code });
}
