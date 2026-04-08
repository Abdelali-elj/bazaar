// Check existing users and insert profiles directly
const SUPABASE_URL = "https://lxuspkojgegjyhqmwxai.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_tjrGyf6xoeFLC2zz-Np0og_rbXFxAgb";

async function main() {
  // Try to sign in as client1 to see if they exist
  const users = [
    { email: "client1@bazaarstyle.ma", password: "BazaarClient1!" },
    { email: "client2@bazaarstyle.ma", password: "BazaarClient2!" },
    { email: "staff1@bazaarstyle.ma", password: "BazaarStaff1!" },
  ];

  for (const user of users) {
    console.log(`\nChecking: ${user.email}`);
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ email: user.email, password: user.password }),
    });
    const data = await res.json();
    if (data.access_token) {
      console.log(`  ✅ EXISTS - User ID: ${data.user?.id}`);
      // Check profile
      const profileRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${data.user.id}`, {
        headers: {
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${data.access_token}`,
        },
      });
      const profile = await profileRes.json();
      console.log(`  Profile: ${JSON.stringify(profile)}`);
    } else {
      console.log(`  ❌ NOT EXISTS or wrong password: ${data.error || data.error_description}`);
    }
  }
}

main().catch(console.error);
