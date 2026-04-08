import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function checkDatabase() {
  console.log("Checking Supabase connection for project:", process.env.NEXT_PUBLIC_SUPABASE_URL);

  const { data: profiles, error: pError } = await supabase.from('profiles').select('*');
  console.log("Profiles count:", profiles?.length || 0);
  if (profiles && profiles.length > 0) {
    console.log("Last 3 profiles:", profiles.slice(-3).map(p => ({ first_name: p.first_name, email: p.email, role: p.role })));
  }

  const { data: orders, error: oError } = await supabase.from('orders').select('*');
  console.log("Orders count:", orders?.length || 0);
  
  const { data: users, error: uError } = await supabase.auth.admin.listUsers();
  if (uError) {
    console.log("Auth users check (Requires Service Role Key, skipping or failing):", uError.message);
  } else {
    console.log("Auth Users count:", users.users.length);
  }
}

checkDatabase();
