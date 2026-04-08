
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkEverything() {
  let log = "";
  
  // 1. Check Profiles Schema
  log += "Checking profiles table...\n";
  const { data: pData, error: pError } = await supabase.from("profiles").select("*").limit(5);
  if (pError) {
    log += `Profile error: ${JSON.stringify(pError, null, 2)}\n`;
  } else {
    log += `Profiles found: ${pData.length}\n`;
    if (pData.length > 0) {
      log += `Columns: ${Object.keys(pData[0]).join(", ")}\n`;
      log += `Sample data: ${JSON.stringify(pData, null, 2)}\n`;
    }
  }

  // 2. Try Login with admin@gmail.com / 123
  log += "\nTrying login: admin@gmail.com / 123 ...\n";
  const { data: lData, error: lError } = await supabase.auth.signInWithPassword({
    email: "admin@gmail.com",
    password: "123"
  });
  if (lError) {
    log += `Login result: FAIL - ${lError.message}\n`;
  } else {
    log += `Login result: SUCCESS - User ID: ${lData.user?.id}\n`;
  }

  // 3. Try Login with super.admin@bazaarstyle.ma / password123
  log += "\nTrying login: super.admin@bazaarstyle.ma / password123 ...\n";
  const { data: lData2, error: lError2 } = await supabase.auth.signInWithPassword({
    email: "super.admin@bazaarstyle.ma",
    password: "password123"
  });
  if (lError2) {
    log += `Login result: FAIL - ${lError2.message}\n`;
  } else {
    log += `Login result: SUCCESS - User ID: ${lData2.user?.id}\n`;
  }

  fs.writeFileSync("check_result.txt", log, "utf8");
  console.log("Check finished. Results in check_result.txt");
}

checkEverything();
