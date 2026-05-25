/**
 * Base44 SDK Client
 * Initializes the Base44 client with authentication and app parameters
 */

import { createClient } from '@base44/sdk';
import { appParams } from '@shared/config/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

/**
 * Base44 client instance
 * Used for all Base44-related API calls
 */
export const base44 = createClient({
  appId,
  token,
  functionsVersion,
  serverUrl: '',
  requiresAuth: false,
  appBaseUrl
});

export default base44;
