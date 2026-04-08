import { adminDb } from "@/lib/firebase/admin";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { invalidateProductsCache } from "@/lib/actions/products";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing product ID" }, { status: 400 });
    
    await adminDb.collection("products").doc(id).delete();
    invalidateProductsCache();
    revalidatePath("/dashboard/products");
    revalidatePath("/products");
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[DELETE PRODUCT ERROR]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
