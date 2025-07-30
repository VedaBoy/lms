// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Change process.env.VITE_SUPABASE_URL to import.meta.env.VITE_SUPABASE_URL
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://supabase.vedardha.shop/';
// Change process.env.VITE_SUPABASE_ANON_KEY to import.meta.env.VITE_SUPABASE_ANON_KEY
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE';

// Ensure these environment variables are set in your .env file:
// VITE_SUPABASE_URL="https://your-project-ref.supabase.co"
// VITE_SUPABASE_ANON_KEY="eyJ..."

export const supabase = createClient(supabaseUrl, supabaseAnonKey);