import { adminDb } from "@/lib/firebase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId, role } = await req.json();
    if (!userId || !role) return NextResponse.json({ error: "Missing userId or role" }, { status: 400 });

    await adminDb.collection("users").doc(userId).update({ role });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
