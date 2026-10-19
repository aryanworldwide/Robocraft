import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

//Create a client with authentication required
export const backend = createClient({
  appId,
  token,
  functionsVersion,
  // Web build: same-origin (''). Android build: set VITE_API_URL to the hosted
  // app URL so API calls leave the local WebView origin.
  serverUrl: import.meta.env.VITE_API_URL || '',
  requiresAuth: false,
  appBaseUrl
});
