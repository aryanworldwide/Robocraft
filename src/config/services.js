// Online services used by RoboCraft. These values are public (they identify
// the project, they are not passwords) and are safe to keep in the app.

// Firebase: accounts, login, password-reset emails, progress sync.
export const firebaseConfig = {
  apiKey: 'AIzaSyBg2gI3OHnDfN2Ay1Qo8zF_wVplYYEU3Jw',
  authDomain: 'robocraft-cec0f.firebaseapp.com',
  projectId: 'robocraft-cec0f',
  storageBucket: 'robocraft-cec0f.firebasestorage.app',
  messagingSenderId: '856516489922',
  appId: '1:856516489922:web:4d079745c5b26ddff8015b',
};

// Cloudflare Worker running backend/worker.js (free AI).
export const aiServerUrl = 'https://robocraft-ai.sonkermonika13.workers.dev';
