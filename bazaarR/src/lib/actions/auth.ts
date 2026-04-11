import { 
  auth, 
  db 
} from "@/lib/firebase/config";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  updateProfile
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc,
  collection,
  query,
  limit,
  getDocs
} from "firebase/firestore";

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("first_name") as string;
  const lastName = formData.get("last_name") as string;

  try {
    // 1. Create User in Firebase Auth (Client SDK)
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Update Display Name
    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`
    });

    // 3. User Role mapping logic
    const usersSnap = await getDocs(query(collection(db, "users"), limit(1)));
    const roleToAssign = usersSnap.empty ? "super_admin" : "customer";

    // 4. Create Profile in Firestore
    await setDoc(doc(db, "users", user.uid), {
      first_name: firstName,
      last_name: lastName,
      email: email,
      role: roleToAssign,
      created_at: new Date().toISOString()
    });

    return { success: true };
  } catch (error: any) {
    console.error("[signUp] error:", error);
    return { error: error.message || "Erreur lors de l'inscription." };
  }
}

export async function signIn(formData: FormData) {
  const email = (formData.get("email") as string)?.toLowerCase();
  const password = formData.get("password") as string;

  if (email === "admin@gmail.com" && password === "admin123") {
    // Demo admin logic - in SPA this is tricky if it needs to persist across reloads without real auth
    // For now we'll just handle it in the context or via a special flag
    localStorage.setItem("demo_admin", "true");
    return { success: true };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    localStorage.removeItem("demo_admin");
    return { success: true };
  } catch (error: any) {
    console.error("[signIn] error:", error.message);
    return { error: "Email ou mot de passe incorrect." };
  }
}

export async function signOut() {
  localStorage.removeItem("demo_admin");
  await firebaseSignOut(auth);
  // Redirection should be handled by the caller or a hook in React
}

export async function getUser(): Promise<any | null> {
  const isDemoAdmin = localStorage.getItem("demo_admin") === "true";
  
  if (isDemoAdmin) {
    return {
      uid: "00000000-0000-0000-0000-000000000000",
      id: "00000000-0000-0000-0000-000000000000",
      email: "admin@gmail.com",
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

  const currentUser = auth.currentUser;
  if (!currentUser) return null;

  try {
    const profileDoc = await getDoc(doc(db, "users", currentUser.uid));
    const profileData = profileDoc.exists() ? profileDoc.data() : null;

    return {
      uid: currentUser.uid,
      id: currentUser.uid,
      email: currentUser.email,
      displayName: currentUser.displayName,
      phoneNumber: currentUser.phoneNumber,
      photoURL: currentUser.photoURL,
      role: profileData?.role || 'customer',
      first_name: profileData?.first_name || '',
      last_name: profileData?.last_name || '',
      profile: profileData ? { id: currentUser.uid, ...profileData } : null
    };
  } catch (error) {
    return null;
  }
}
