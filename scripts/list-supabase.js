require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// Note: for listing buckets we might need service role key, but let's try anon first if allowed.
// Actually, usually service role is needed.

const supabase = createClient(supabaseUrl, supabaseKey);

async function listBuckets() {
  const { data, error } = await supabase.storage.listBuckets();
  if (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
  console.log("Buckets:", data.map(b => b.name));
  process.exit(0);
}

listBuckets();
