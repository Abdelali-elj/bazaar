
import { adminDb } from "@/lib/firebase/admin";
;

/**
 * Sends a support message using the Admin SDK to bypass security rules.
 */
export async function sendMessageAction(data: {
  userId: string;
  userName: string;
  text: string;
  senderRole: 'customer' | 'admin';
}) {
  try {
    const message = {
      ...data,
      ...data,
      userName: data.userName || "Utilisateur Secret",
      createdAt: new Date().toISOString(), // Use ISO string for consistency
      read: false
    };

    const docRef = await adminDb.collection("messages").add(message);
    
    // We don't always need revalidatePath if the client is using onSnapshot, 
    // but it's good practice for other parts of the dashboard.
    
    
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error("[sendMessageAction] Error:", error.message);
    return { error: error.message };
  }
}
