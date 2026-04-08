
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const usersToCreate = [
  { email: "super.admin@bazaarstyle.ma", password: "password123", first: "Super", last: "Admin", role: "super_admin" },
  { email: "staff@bazaarstyle.ma", password: "password123", first: "Staff", last: "Member", role: "staff" }
];

async function seedUsers() {
  console.log("🚀 Starting User Seeding...");

  for (const user of usersToCreate) {
    console.log(`\nAttempting: ${user.email}`);
    
    // 1. Auth Sign Up
    const { data, error: sError } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
    });

    if (sError) {
      console.error(`Auth Error (${user.email}):`, sError.message);
      continue;
    }

    if (data.user) {
      console.log(`Auth Created: ${data.user.id}`);
      
      // 2. Profile Creation (Try with role first, then without)
      const profileData: any = {
        id: data.user.id,
        first_name: user.first,
        last_name: user.last,
        role: user.role
      };

      const { error: pError } = await supabase.from("profiles").upsert(profileData);

      if (pError) {
        console.warn(`Profile Error with role (${user.email}):`, pError.message);
        console.log("Retrying profile without 'role' column...");
        
        const { role, ...rest } = profileData;
        const { error: pError2 } = await supabase.from("profiles").upsert(rest);
        
        if (pError2) {
          console.error(`Final Profile Error (${user.email}):`, pError2.message);
        } else {
          console.log(`Profile Created (without role)!`);
        }
      } else {
        console.log(`Profile Created with role!`);
      }
    }
  }

  console.log("\n✅ Seeding Process Finished.");
}

seedUsers();
