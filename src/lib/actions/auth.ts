"use server";
import { redirect } from "next/navigation";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { cookies } from "next/headers";

const FIREBASE_API_KEY = "AIzaSyBNH1Zx6tmDjSOxaQewC2pvNoodqWzTjX8"; // from user's config

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("first_name") as string;
  const lastName = formData.get("last_name") as string;

  const cookieStore = await cookies();
  cookieStore.delete("session");
  cookieStore.delete("demo_user_email");

  try {
    // 1. Create User in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });

    // 2. Check if first user (to make admin)
    const usersSnap = await adminDb.collection("users").limit(1).get();
    const roleToAssign = usersSnap.empty ? "super_admin" : "customer";

    // 3. Create Profile in Firestore
    await adminDb.collection("users").doc(userRecord.uid).set({
      first_name: firstName,
      last_name: lastName,
      email: email,
      role: roleToAssign,
      created_at: new Date().toISOString()
    });

    // 4. Login immediately via REST API to get ID Token
    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error.message);

    // 5. Create Session Cookie (expires in 14 days)
    const expiresIn = 60 * 60 * 24 * 14 * 1000;
    const sessionCookie = await adminAuth.createSessionCookie(data.idToken, { expiresIn });
    
    cookieStore.set("session", sessionCookie, { maxAge: expiresIn / 1000, httpOnly: true, secure: process.env.NODE_ENV === "production", path: "/" });

    return { success: true };
  } catch (error: any) {
    console.error("[signUp] Firebase error:", error);
    return { error: error.message || "Erreur lors de l'inscription." };
  }
}

export async function signIn(formData: FormData) {
  const email = (formData.get("email") as string)?.toLowerCase();
  const password = formData.get("password") as string;
  const cookieStore = await cookies();

  if (email === "admin@gmail.com" && password === "admin123") {
    cookieStore.set("demo_user_email", email, { maxAge: 60 * 60 * 24, path: "/", httpOnly: true, secure: process.env.NODE_ENV === "production" });
    return { success: true };
  }

  cookieStore.delete("demo_user_email");

  try {
    // Login via REST API to get ID Token
    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "Identifiants invalides");

    // Create Firebase Session Cookie
    const expiresIn = 60 * 60 * 24 * 14 * 1000; // 14 days
    const sessionCookie = await adminAuth.createSessionCookie(data.idToken, { expiresIn });
    
    cookieStore.set("session", sessionCookie, { maxAge: expiresIn / 1000, httpOnly: true, secure: process.env.NODE_ENV === "production", path: "/" });

    return { success: true };
  } catch (error: any) {
    console.error("[signIn] Firebase error:", error.message);
    return { error: "Email ou mot de passe incorrect." };
  }
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete("demo_user_email");
  cookieStore.delete("session");
  redirect("/");
}

export async function getUser(): Promise<any | null> {
  const cookieStore = await cookies();
  const demoEmail = cookieStore.get("demo_user_email")?.value;
  
  if (demoEmail === "admin@gmail.com") {
    return {
      uid: "00000000-0000-0000-0000-000000000000",
      id: "00000000-0000-0000-0000-000000000000",
      email: demoEmail,
      role: "super_admin",
      profile: {
        id: "00000000-0000-0000-0000-000000000000",
        first_name: "Admin",
        last_name: "Bazaar",
        role: "super_admin",
        avatar_url: null
      }
    };
  }

  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    const userRecord = await adminAuth.getUser(decodedClaims.uid);
    
    // Fetch profile from Firestore
    const profileDoc = await adminDb.collection("users").doc(userRecord.uid).get();
    const profileData = profileDoc.exists ? profileDoc.data() : null;

    // Must return a plain JSON object
    return {
      uid: userRecord.uid,
      id: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      phoneNumber: userRecord.phoneNumber,
      photoURL: userRecord.photoURL,
      disabled: userRecord.disabled,
      emailVerified: userRecord.emailVerified,
      role: profileData?.role || 'customer',
      first_name: profileData?.first_name || '',
      last_name: profileData?.last_name || '',
      profile: profileData ? { id: userRecord.uid, ...profileData } : null
    };
  } catch (error) {
    // Session invalid or expired
    return null;
  }
}
