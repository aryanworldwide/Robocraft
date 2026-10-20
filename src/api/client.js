import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';
import { backendEnabled } from '@/lib/features';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

// Without a configured backend no client is created at all, so the app makes
// no background requests (analytics, settings) to any server. Calls fail with
// a clear message instead.
const notConfigured = (what) => () => Promise.reject(Object.assign(
  new Error(`${what} aren't available yet.`), { status: 503, offline: true }
));
const offlineClient = {
  auth: new Proxy({}, { get: () => notConfigured('Accounts') }),
  integrations: { Core: new Proxy({}, { get: () => notConfigured('AI features') }) },
  entities: new Proxy({}, { get: () => new Proxy({}, { get: () => notConfigured('Online features') }) }),
  asServiceRole: { entities: new Proxy({}, { get: () => new Proxy({}, { get: () => notConfigured('Online features') }) }) },
};

export const backend = backendEnabled
  ? createClient({
      appId,
      token,
      functionsVersion,
      // Web build: same-origin (''). Android build: set VITE_API_URL to the hosted
      // app URL so API calls leave the local WebView origin.
      serverUrl: import.meta.env.VITE_API_URL || '',
      requiresAuth: false,
      appBaseUrl,
    })
  : offlineClient;
