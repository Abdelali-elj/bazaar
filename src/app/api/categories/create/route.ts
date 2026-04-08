import { adminDb } from "@/lib/firebase/admin";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, slug, description, image_url } = body;
    const docRef = await adminDb.collection("categories").add({
      name, slug, description: description || null, image_url: image_url || null,
      created_at: new Date().toISOString()
    });
    revalidatePath("/dashboard/categories");
    return NextResponse.json({ id: docRef.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
