"use server";
import { adminDb } from "@/lib/firebase/admin";
import { revalidatePath } from "next/cache";
import { MOCK_PRODUCTS } from "@/lib/mockData";



import { unstable_cache } from "next/cache";

async function getProductsInternal(options?: { featured?: boolean; categoryId?: string; limit?: number }) {
  try {
    let query: FirebaseFirestore.Query = adminDb.collection("products").orderBy("created_at", "desc");

    if (options?.featured) {
      query = query.where("is_featured", "==", true);
    }
    if (options?.categoryId) {
      query = query.where("category_id", "==", options.categoryId);
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const snapshot = await query.get();
    
    if (snapshot.empty) {
        console.log("No products found in Firestore, using mock fallback.");
        return MOCK_PRODUCTS.map(p => ({ ...p, categories: null }));
    }

    // Fetch categories once for mapping
    const categorySnapshot = await adminDb.collection("categories").get();
    const categoriesMap = new Map();
    categorySnapshot.docs.forEach(doc => {
      categoriesMap.set(doc.id, { id: doc.id, ...doc.data() });
    });

    const products = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        categories: data.category_id ? categoriesMap.get(data.category_id) || null : null
      };
    });

    return products;
  } catch (error: any) {
    console.error("[getProducts ERROR]:", error);
    return MOCK_PRODUCTS.map(p => ({ ...p, categories: null }));
  }
}

const getCachedProducts = unstable_cache(
  async (options?: { featured?: boolean; categoryId?: string; limit?: number }) => getProductsInternal(options),
  ['products-list'],
  { revalidate: 60, tags: ['products'] }
);

export async function getProducts(options?: { featured?: boolean; categoryId?: string; limit?: number }) {
    return getCachedProducts(options);
}

export async function getProductBySlug(slug: string) {
  try {
    const snapshot = await adminDb.collection("products").where("slug", "==", slug).limit(1).get();
    if (snapshot.empty) {
      return null;
    }
    
    const product = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as any;
    
    if (product.category_id) {
      const catDoc = await adminDb.collection("categories").doc(product.category_id).get();
      if (catDoc.exists) {
        product.categories = { id: catDoc.id, ...catDoc.data() };
      }
    }
    
    return product;
  } catch (error) {
    console.error("[getProductBySlug ERROR]:", error);
    return null;
  }
}

export async function getProductById(id: string) {
  try {
    const doc = await adminDb.collection("products").doc(id).get();
    if (!doc.exists) {
      return null;
    }
    
    const product = { id: doc.id, ...doc.data() } as any;
    
    if (product.category_id) {
      const catDoc = await adminDb.collection("categories").doc(product.category_id).get();
      if (catDoc.exists) {
        product.categories = { id: catDoc.id, ...catDoc.data() };
      }
    }
    
    return product;
  } catch (error) {
    console.error("[getProductById/Slug ERROR]:", error);
    return null;
  }
}

export async function createProduct(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    
    const newProduct = {
      title,
      slug,
      description: formData.get("description") as string || null,
      price: parseFloat(formData.get("price") as string),
      stock_quantity: parseInt(formData.get("stock_quantity") as string),
      category_id: formData.get("category_id") as string || null,
      is_featured: formData.get("is_featured") === "true",
      images: [], // Handled separately 
      created_at: new Date().toISOString()
    };

    const docRef = await adminDb.collection("products").add(newProduct);


    revalidatePath("/dashboard/products");
    revalidatePath("/products");
    return { data: { id: docRef.id, ...newProduct } };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    
    const updates = {
      title,
      slug,
      description: formData.get("description") as string || null,
      price: parseFloat(formData.get("price") as string),
      stock_quantity: parseInt(formData.get("stock_quantity") as string),
      category_id: formData.get("category_id") as string || null,
      is_featured: formData.get("is_featured") === "true",
    };

    await adminDb.collection("products").doc(id).update(updates);


    revalidatePath("/dashboard/products");
    revalidatePath("/products");
    return { data: { id, ...updates } };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteProduct(id: string) {
  try {
    await adminDb.collection("products").doc(id).delete();

    revalidatePath("/dashboard/products");
    revalidatePath("/products");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function invalidateProductsCache() {
  // Cache removed
}
