import { db } from "@/lib/firebase/config";
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  Timestamp 
} from "firebase/firestore";
import { MOCK_PRODUCTS } from "@/lib/mockData";

async function getProductsInternal(options?: { featured?: boolean; categoryId?: string; limitCount?: number }) {
  try {
    let q = query(collection(db, "products"), orderBy("created_at", "desc"));

    if (options?.featured) {
      q = query(q, where("is_featured", "==", true));
    }
    if (options?.categoryId) {
      q = query(q, where("category_id", "==", options.categoryId));
    }
    if (options?.limitCount) {
      q = query(q, limit(options.limitCount));
    }

    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
        console.log("No products found in Firestore, using mock fallback.");
        return MOCK_PRODUCTS.map(p => ({ ...p, categories: null }));
    }

    // Fetch categories once for mapping
    const categorySnapshot = await getDocs(collection(db, "categories"));
    const categoriesMap = new Map();
    categorySnapshot.docs.forEach(docSnap => {
      categoriesMap.set(docSnap.id, { id: docSnap.id, ...docSnap.data() });
    });

    const products = snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
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

export async function getProducts(options?: { featured?: boolean; categoryId?: string; limit?: number }) {
    // In React, we don't have unstable_cache, so we just call the internal function
    return getProductsInternal({ ...options, limitCount: options?.limit });
}

export async function getProductBySlug(slug: string) {
  try {
    const q = query(collection(db, "products"), where("slug", "==", slug), limit(1));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return null;
    }
    
    const docSnap = snapshot.docs[0];
    const product = { id: docSnap.id, ...docSnap.data() } as any;
    
    if (product.category_id) {
      const catSnap = await getDoc(doc(db, "categories", product.category_id));
      if (catSnap.exists()) {
        product.categories = { id: catSnap.id, ...catSnap.data() };
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
    const docSnap = await getDoc(doc(db, "products", id));
    if (!docSnap.exists()) {
      return null;
    }
    
    const product = { id: docSnap.id, ...docSnap.data() } as any;
    
    if (product.category_id) {
      const catSnap = await getDoc(doc(db, "categories", product.category_id));
      if (catSnap.exists()) {
        product.categories = { id: catSnap.id, ...catSnap.data() };
      }
    }
    
    return product;
  } catch (error) {
    console.error("[getProductById ERROR]:", error);
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
      images: [], 
      created_at: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, "products"), newProduct);

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

    await updateDoc(doc(db, "products", id), updates);

    return { data: { id, ...updates } };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteProduct(id: string) {
  try {
    await deleteDoc(doc(db, "products", id));
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function invalidateProductsCache() {
  // Not needed in React SPA
}
