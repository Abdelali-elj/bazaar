import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase/admin';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    const demoEmail = cookieStore.get('demo_user_email')?.value;

    // Demo admin user
    if (demoEmail === 'admin@gmail.com') {
      // Get or create the demo admin Firebase user
      let uid = 'demo-admin-uid-bazaarstyle';
      try {
        const user = await adminAuth.getUserByEmail(demoEmail);
        uid = user.uid;
      } catch {
        // user not found, use placeholder uid
      }
      const customToken = await adminAuth.createCustomToken(uid);
      return NextResponse.json({ customToken });
    }

    if (!sessionCookie) {
      return NextResponse.json({ customToken: null });
    }

    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    const customToken = await adminAuth.createCustomToken(decoded.uid);
    return NextResponse.json({ customToken });
  } catch (error: any) {
    console.error('[custom-token] error:', error.message);
    return NextResponse.json({ customToken: null });
  }
}
