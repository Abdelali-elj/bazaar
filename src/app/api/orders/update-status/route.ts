import { adminDb } from "@/lib/firebase/admin";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    await adminDb.collection("orders").doc(id).update({ status, updated_at: new Date().toISOString() });
    revalidatePath("/dashboard/orders");
    revalidatePath("/dashboard/historique");
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
