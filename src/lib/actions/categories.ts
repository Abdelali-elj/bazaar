"use server";
import { adminDb } from "@/lib/firebase/admin";
import { revalidatePath } from "next/cache";
import type { Category } from "@/lib/types";
import { MOCK_CATEGORIES } from "@/lib/mockData";

import { unstable_cache } from "next/cache";

async function getCategoriesInternal() {
  try {
    const snapshot = await adminDb.collection("categories").get();
    if (snapshot.empty) {
        return MOCK_CATEGORIES;
    }
    const categories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Category));
    
    return categories;
  } catch (error: any) {
    console.error("[getCategories ERROR]:", error);
    return MOCK_CATEGORIES;
  }
}

const getCachedCategories = unstable_cache(
  async () => getCategoriesInternal(),
  ['categories-list'],
  { revalidate: 60, tags: ['categories'] }
);

export async function getCategories() {
    return getCachedCategories();
}

export async function getCategoryBySlug(slug: string) {
  try {
    const snapshot = await adminDb.collection("categories").where("slug", "==", slug).limit(1).get();
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  } catch (error) {
    return null;
  }
}

export async function getCategoryById(id: string) {
  try {
    const doc = await adminDb.collection("categories").doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
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
    
    const docRef = await adminDb.collection("categories").add(newCategory);
    

    revalidatePath("/dashboard/categories");
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
    
    await adminDb.collection("categories").doc(id).update(updates);
    

    revalidatePath("/dashboard/categories");
    return { data: { id, ...updates } };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteCategory(id: string) {
  try {
    await adminDb.collection("categories").doc(id).delete();

    revalidatePath("/dashboard/categories");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
