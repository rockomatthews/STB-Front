// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project URL and anon key
const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = 'your-supabase-anon-key';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
