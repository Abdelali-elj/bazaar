import { adminDb } from "@/lib/firebase/admin";
import UsersClient from "./UsersClient";

export default async function UsersPage() {
  try {
    const snapshot = await adminDb.collection("users").orderBy("created_at", "desc").get();
    const profiles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return <UsersClient initialProfiles={profiles} />;
  } catch (error) {
    console.error("[UsersPage] Error:", error);
    return <UsersClient initialProfiles={[]} />;
  }
}
