import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testConnection() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error('Missing Supabase credentials');
    return;
  }

  const supabase = createClient(url, key);
  console.log('Testing connection to:', url);

  const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });

  if (error) {
    console.error('Connection error:', error.message);
  } else {
    console.log('Connection successful, profile count:', data);
  }
}

testConnection();
