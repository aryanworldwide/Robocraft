// Which online features are switched on for this build.
// Without them the app still runs fully in guest/offline mode and hides
// those features instead of showing errors.
import { firebaseConfig, aiServerUrl } from '@/config/services';

export const accountsEnabled = !!firebaseConfig?.apiKey;
export const aiEnabled = !!aiServerUrl;
export const backendEnabled = accountsEnabled || aiEnabled;
