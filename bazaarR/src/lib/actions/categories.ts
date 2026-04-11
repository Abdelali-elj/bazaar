import { db } from "@/lib/firebase/config";
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  limit 
} from "firebase/firestore";
import type { Category } from "@/lib/types";
import { MOCK_CATEGORIES } from "@/lib/mockData";

export async function getCategories() {
  try {
    const snapshot = await getDocs(collection(db, "categories"));
    if (snapshot.empty) {
        return MOCK_CATEGORIES;
    }
    const categories = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    } as Category));
    
    return categories;
  } catch (error: any) {
    console.error("[getCategories ERROR]:", error);
    return MOCK_CATEGORIES;
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    const q = query(collection(db, "categories"), where("slug", "==", slug), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const docSnap = snapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    return null;
  }
}

export async function getCategoryById(id: string) {
  try {
    const docSnap = await getDoc(doc(db, "categories", id));
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    return null;
  }
}

export async function createCategory(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    
    const newCategory = {
      name,
      slug,
      description: formData.get("description") as string || null,
      image_url: formData.get("image_url") as string || null,
      created_at: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, "categories"), newCategory);
    
    return { data: { id: docRef.id, ...newCategory } };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateCategory(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    
    const updates = {
      name,
      slug,
      description: formData.get("description") as string || null,
      image_url: formData.get("image_url") as string || null,
    };
    
    await updateDoc(doc(db, "categories", id), updates);
    
    return { data: { id, ...updates } };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteCategory(id: string) {
  try {
    await deleteDoc(doc(db, "categories", id));
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
