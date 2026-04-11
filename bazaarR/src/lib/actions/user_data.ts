
import { adminDb } from "@/lib/firebase/admin";
;

/**
 * Saves the user's cart to Firestore.
 */
export async function syncCartAction(userId: string, items: any[]) {
    try {
        await adminDb.collection("users").doc(userId).update({
            cart: items,
            updatedAt: new Date().toISOString()
        });
        return { success: true };
    } catch (error: any) {
        console.error("[syncCartAction] Error:", error.message);
        return { error: error.message };
    }
}

/**
 * Fetches the user's cart from Firestore.
 */
export async function getCartAction(userId: string) {
    try {
        const doc = await adminDb.collection("users").doc(userId).get();
        if (doc.exists) {
            return { data: doc.data()?.cart || [] };
        }
        return { data: [] };
    } catch (error: any) {
        console.error("[getCartAction] Error:", error.message);
        return { error: error.message };
    }
}

/**
 * Saves the user's favorites to Firestore.
 */
export async function syncFavoritesAction(userId: string, favorites: string[]) {
    try {
        await adminDb.collection("users").doc(userId).update({
            favorites: favorites,
            updatedAt: new Date().toISOString()
        });
        return { success: true };
    } catch (error: any) {
        console.error("[syncFavoritesAction] Error:", error.message);
        return { error: error.message };
    }
}

/**
 * Fetches the user's favorites from Firestore.
 */
export async function getFavoritesAction(userId: string) {
    try {
        const doc = await adminDb.collection("users").doc(userId).get();
        if (doc.exists) {
            return { data: doc.data()?.favorites || [] };
        }
        return { data: [] };
    } catch (error: any) {
        console.error("[getFavoritesAction] Error:", error.message);
        return { error: error.message };
    }
}
