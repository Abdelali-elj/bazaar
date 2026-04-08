import { adminDb } from "@/lib/firebase/admin";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing category ID" }, { status: 400 });
    await adminDb.collection("categories").doc(id).delete();
    revalidatePath("/dashboard/categories");
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
