// Quick diagnostic
const SUPABASE_URL = "https://lxuspkojgegjyhqmwxai.supabase.co";
const ANON_KEY = "sb_publishable_tjrGyf6xoeFLC2zz-Np0og_rbXFxAgb";

async function main() {
  // 1. Try raw profiles select
  console.log("=== Test 1: anon select all from profiles ===");
  const r1 = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=*&limit=5`, {
    headers: { "apikey": ANON_KEY, "Authorization": `Bearer ${ANON_KEY}` },
  });
  console.log(`Status: ${r1.status}`);
  console.log(`Body: ${(await r1.text()).slice(0, 400)}`);

  // 2. Check auth rate limit status
  console.log("\n=== Test 2: Check signup rate limit ===");
  const r2 = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "apikey": ANON_KEY },
    body: JSON.stringify({ email: "test.ratelimit.check@gmail.com", password: "TestPass123!" }),
  });
  console.log(`Status: ${r2.status}`);
  const d2 = await r2.json();
  console.log(`Response: ${JSON.stringify(d2).slice(0, 300)}`);

  // 3. Try signing in with admin@gmail.com to see if they exist
  console.log("\n=== Test 3: Can admin@gmail.com login to Supabase? ===");
  const r3 = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "apikey": ANON_KEY },
    body: JSON.stringify({ email: "admin@gmail.com", password: "admin123" }),
  });
  const d3 = await r3.json();
  console.log(`Status: ${r3.status}`);
  console.log(`Response: ${JSON.stringify(d3).slice(0, 200)}`);
  
  if (d3?.access_token) {
    console.log("✅ admin@gmail.com IS a real Supabase user!");
    
    // Try reading profiles with admin token
    const r4 = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=*&limit=10`, {
      headers: {
        "apikey": ANON_KEY,
        "Authorization": `Bearer ${d3.access_token}`,
      },
    });
    console.log(`\n=== Profiles with admin token: ${r4.status} ===`);
    console.log((await r4.text()).slice(0, 500));
  } else {
    console.log("❌ admin@gmail.com is NOT a real Supabase user - only cookie bypass");
  }
}

main().catch(console.error);
