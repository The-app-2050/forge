import { createClient } from '@base44/sdk';
import
{appParams } from
const {appid, token, functionsersion, appBaseUr1 } = appParams;

//Create a
client with authentication required
export const base44 = createClient(€appid,
token,
functionsVersion,
serverUrl:",
requiresAuth: false,
appBaseUrl
});
