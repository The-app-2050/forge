import { createClient } from "@base44/sdk";

const client = createClient({
  appId: import.meta.env.VITE_APP_ID,
});

export default client;
