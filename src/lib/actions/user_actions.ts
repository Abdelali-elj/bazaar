"use server";
import { adminDb } from "@/lib/firebase/admin";
import { revalidatePath } from "next/cache";

export async function updateProfileAvatar(userId: string, avatarUrl: string) {
  if (!userId || !avatarUrl) {
    return { error: "Paramètres manquants." };
  }

  try {
    await adminDb.collection("users").doc(userId).update({
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString()
    });

    revalidatePath("/");
    revalidatePath("/dashboard/settings");
    
    return { success: true };
  } catch (error: any) {
    console.error("[updateProfileAvatar] Error:", error);
    return { error: error.message || "Erreur lors de la mise à jour de la photo." };
  }
}
