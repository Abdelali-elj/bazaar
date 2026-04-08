// Full diagnostic + user creation script
const SUPABASE_URL = "https://lxuspkojgegjyhqmwxai.supabase.co";
const ANON_KEY = "sb_publishable_tjrGyf6xoeFLC2zz-Np0og_rbXFxAgb";

async function checkProfiles() {
  console.log("\n=== 1. Check if anon can read profiles ===");
  const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=id,first_name,last_name,role&limit=10`, {
    headers: {
      "apikey": ANON_KEY,
      "Authorization": `Bearer ${ANON_KEY}`,
    },
  });
  const data = await res.json();
  console.log(`Status: ${res.status}`);
  console.log("Data:", JSON.stringify(data).slice(0, 300));
  return res.status === 200 && Array.isArray(data);
}

async function testSignup(email: string, password: string, firstName: string, lastName: string) {
  console.log(`\n=== Signing up: ${email} ===`);
  const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": ANON_KEY,
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (data?.error || data?.msg?.includes("rate_limit")) {
    console.log(`  ❌ Error: ${data.error_description ?? data.msg ?? JSON.stringify(data)}`);
    return null;
  }
  const userId = data?.user?.id ?? data?.id;
  if (userId) {
    console.log(`  ✅ Created user: ${userId}`);
    console.log(`  Confirmed: ${data?.user?.email_confirmed_at ? "YES" : "NO - needs confirmation"}`);
    return { userId, token: data?.access_token ?? null };
  }
  console.log(`  ❌ Unknown: ${JSON.stringify(data).slice(0, 200)}`);
  return null;
}

async function insertProfile(userId: string, firstName: string, lastName: string, role: string, token?: string) {
  const authHeader = token ? `Bearer ${token}` : `Bearer ${ANON_KEY}`;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": ANON_KEY,
      "Authorization": authHeader,
      "Prefer": "return=minimal,resolution=merge-duplicates",
    },
    body: JSON.stringify({ id: userId, first_name: firstName, last_name: lastName, role }),
  });
  if (res.ok || res.status === 201 || res.status === 204) {
    console.log(`  ✅ Profile inserted: ${firstName} ${lastName} (${role})`);
    return true;
  }
  const body = await res.text();
  console.log(`  ❌ Profile insert failed (${res.status}): ${body}`);
  return false;
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function main() {
  // Step 1: Check anon access to profiles
  const anonCanRead = await checkProfiles();
  
  const users = [
    { email: "admin.bazaar@gmail.com",   password: "Admin@Bazaar2024!",   firstName: "Admin",   lastName: "Bazaar",    role: "super_admin" },
    { email: "client1.bazaar@gmail.com", password: "Client1@Bazaar2024!", firstName: "Amina",   lastName: "Benali",    role: "customer" },
    { email: "client2.bazaar@gmail.com", password: "Client2@Bazaar2024!", firstName: "Fatima",  lastName: "El Idrissi", role: "customer" },
    { email: "staff1.bazaar@gmail.com",  password: "Staff1@Bazaar2024!",  firstName: "Youssef", lastName: "Moussaoui", role: "staff" },
  ];

  console.log("\n=== 2. Creating users ===");
  const results: { email: string; userId: string; role: string }[] = [];
  
  for (let i = 0; i < users.length; i++) {
    const u = users[i];
    const result = await testSignup(u.email, u.password, u.firstName, u.lastName);
    if (result?.userId) {
      await sleep(500);
      await insertProfile(result.userId, u.firstName, u.lastName, u.role, result.token ?? undefined);
      results.push({ email: u.email, userId: result.userId, role: u.role });
    }
    if (i < users.length - 1) {
      console.log("  ⏳ Waiting 5s...");
      await sleep(5000);
    }
  }

  console.log("\n=== Summary ===");
  if (results.length > 0) {
    console.log("✅ Created users:");
    console.table(results);
  }
  
  console.log("\n=== Credentials ===");
  console.table(users.map(u => ({ Email: u.email, Password: u.password, Role: u.role })));
  
  console.log(`\nAnon can read profiles: ${anonCanRead ? "YES" : "NO (RLS blocks anon)"}`);
  if (!anonCanRead) {
    console.log("\n⚠️  RLS blocks anon reads. Admin must log in with real Supabase account for users page to work.");
    console.log("   After creating admin.bazaar@gmail.com, update the auth bypass in auth.ts");
  }
}

main().catch(console.error);
