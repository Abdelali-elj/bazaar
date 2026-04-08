// Create users one by one with delay to avoid rate limit
const SUPABASE_URL = "https://lxuspkojgegjyhqmwxai.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_tjrGyf6xoeFLC2zz-Np0og_rbXFxAgb";

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

const usersToCreate = [
  { email: "amina.benali@bazaarstyle.ma", password: "BazaarAmina123!", firstName: "Amina", lastName: "Benali", role: "customer" },
  { email: "fatima.elidrissi@bazaarstyle.ma", password: "BazaarFatima123!", firstName: "Fatima", lastName: "El Idrissi", role: "customer" },
  { email: "youssef.staff@bazaarstyle.ma", password: "BazaarYoussef123!", firstName: "Youssef", lastName: "Moussaoui", role: "staff" },
];

async function createAndUpdateProfile(userData: typeof usersToCreate[0]) {
  console.log(`\n→ Creating: ${userData.email}`);

  // Sign up
  const signupRes = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      email: userData.email,
      password: userData.password,
    }),
  });

  const signupData = await signupRes.json();

  if (signupData?.error || signupData?.error_description) {
    const msg = signupData.error_description ?? signupData.msg ?? JSON.stringify(signupData);
    console.error(`  ❌ Signup error: ${msg}`);
    return false;
  }

  const userId = signupData?.user?.id ?? signupData?.id;
  if (!userId) {
    console.error(`  ❌ No user ID returned: ${JSON.stringify(signupData).slice(0, 200)}`);
    return false;
  }

  console.log(`  ✅ User created: ${userId}`);
  await sleep(1000);

  // Now sign in to get access token (bypass works for @bazaarstyle.ma)
  const signinRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ email: userData.email, password: userData.password }),
  });

  const signinData = await signinRes.json();
  const token = signinData?.access_token;

  if (!token) {
    console.log(`  ⚠️  Cannot sign in yet (email not confirmed) - inserting profile with anon key`);
    // Try to upsert profile directly
    const profileRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Prefer": "return=minimal,resolution=merge-duplicates",
      },
      body: JSON.stringify({
        id: userId,
        first_name: userData.firstName,
        last_name: userData.lastName,
        role: userData.role,
      }),
    });
    
    if (profileRes.ok || profileRes.status === 201 || profileRes.status === 204) {
      console.log(`  ✅ Profile inserted with role: ${userData.role}`);
      return true;
    } else {
      const body = await profileRes.text();
      console.error(`  ❌ Profile error (${profileRes.status}): ${body}`);
      return false;
    }
  }

  // Insert/update profile with own token
  const profileRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${token}`,
      "Prefer": "return=minimal,resolution=merge-duplicates",
    },
    body: JSON.stringify({
      id: userId,
      first_name: userData.firstName,
      last_name: userData.lastName,
      role: userData.role,
    }),
  });

  if (profileRes.ok || profileRes.status === 201 || profileRes.status === 204) {
    console.log(`  ✅ Profile created with role: ${userData.role}`);
    return true;
  } else {
    const body = await profileRes.text();
    console.error(`  ❌ Profile error: ${body}`);
    return false;
  }
}

async function main() {
  console.log("🚀 Creating 3 users for Bazaar Style...\n");

  for (let i = 0; i < usersToCreate.length; i++) {
    const user = usersToCreate[i];
    await createAndUpdateProfile(user);
    if (i < usersToCreate.length - 1) {
      console.log("  ⏳ Waiting 3s to avoid rate limit...");
      await sleep(3000);
    }
  }

  console.log("\n✅ Script complete!");
  console.log("\n📋 User Credentials:");
  console.table(usersToCreate.map(u => ({ Email: u.email, Mot_de_passe: u.password, Rôle: u.role })));
}

main().catch(console.error);
