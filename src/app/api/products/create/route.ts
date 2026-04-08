import { adminDb } from "@/lib/firebase/admin";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { invalidateProductsCache } from "@/lib/actions/products";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, slug, description, price, stock_quantity, category_id, is_featured, images } = body;
    
    const newProduct = {
      title, slug, description: description || null,
      price: parseFloat(price), stock_quantity: parseInt(stock_quantity),
      category_id: category_id || null, is_featured: is_featured || false,
      images: images || [],
      created_at: new Date().toISOString()
    };
    
    const docRef = await adminDb.collection("products").add(newProduct);
    invalidateProductsCache();
    revalidatePath("/dashboard/products");
    revalidatePath("/products");
    return NextResponse.json({ id: docRef.id, ...newProduct });
  } catch (error: any) {
    console.error("[CREATE PRODUCT ERROR]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
