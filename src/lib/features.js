// Which online features are switched on for this build.
// Login/accounts and AI need a backend; without one the app runs fully in
// guest/offline mode and hides those features instead of showing errors.
export const backendEnabled = !!import.meta.env.VITE_APP_ID;
export const accountsEnabled = backendEnabled;
export const aiEnabled = backendEnabled;
