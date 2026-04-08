const SUPABASE_URL = "https://lxuspkojgegjyhqmwxai.supabase.co";
const ANON_KEY = "sb_publishable_tjrGyf6xoeFLC2zz-Np0og_rbXFxAgb";

async function main() {
  console.log("Attempting to create admin@gmail.com...");
  const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": ANON_KEY,
    },
    body: JSON.stringify({ 
      email: "admin@gmail.com", 
      password: "Admin@Bazaar123!",
      options: {
        data: {
          first_name: "Admin",
          last_name: "Ritual"
        }
      }
    }),
  });
  
  const data = await res.json();
  console.log(data);
  
  if (data?.user?.id) {
    console.log("SUCCESS! User created:", data.user.id);
    
    // Attempt profile insert
    console.log("Inserting profile...");
    const pRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": ANON_KEY,
        "Authorization": `Bearer ${ANON_KEY}`,
      },
      body: JSON.stringify({
        id: data.user.id,
        first_name: "Admin",
        last_name: "Ritual",
        role: "super_admin"
      })
    });
    console.log("Profile insert status:", pRes.status);
    console.log(await pRes.text());
  }
}

main().catch(console.error);
