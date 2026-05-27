import { createClient } from '@supabase/supabase-js';

// These variables will be securely injected by Vercel in production
// and loaded locally via a hidden .env file. They will never be stored in GitHub.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a single, secure client for the entire app to use
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
