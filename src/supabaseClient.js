import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Helper to check if the URL is a valid URL format
const isValidUrl = (url) => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};

// Check if credentials are properly configured (and not still the placeholder text)
export const isSupabaseConfigured = 
  supabaseUrl && 
  supabaseUrl !== 'your-supabase-project-url' && 
  isValidUrl(supabaseUrl) && 
  supabaseAnonKey && 
  supabaseAnonKey !== 'your-supabase-anon-key';

// Initialize the Supabase client safely
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
