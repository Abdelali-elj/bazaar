import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Fallback to avoid breaking things entirely if imports exist, 
// though we will be removing them from actual logic
export const createBrowserSupabase = () => {
  return createClient(supabaseUrl, supabaseAnonKey)
}
