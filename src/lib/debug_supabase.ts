import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local manually for this test
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Testing with URL:', url);
console.log('Testing with Key (preview):', key?.substring(0, 15) + '...');

if (!url || !key) {
  console.error('Missing environment variables!');
  process.exit(1);
}

const supabase = createClient(url, key);

async function test() {
  console.log('Attempting to fetch one product...');
  const { data: pData, error: pError } = await supabase.from('products').select('*').limit(1);
  if (pError) console.error('Fetch Error:', JSON.stringify(pError, null, 2));
  else console.log('SUCCESS: Fetch works.');

  console.log('Attempting to check auth status...');
  const { data: { user }, error: aError } = await supabase.auth.getUser();
  if (aError) console.error('Auth Error:', JSON.stringify(aError, null, 2));
  else console.log('Auth check returned user:', user ? user.id : 'null');
}

test();
