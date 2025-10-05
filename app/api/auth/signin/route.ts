
import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "session";
const EXPIRES_IN = 14 * 24 * 60 * 60 * 1000;

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();
    if (!idToken) return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn: EXPIRES_IN });
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: EXPIRES_IN / 1000,
      path: "/",
    });
    return res;
  } catch (e:any) {
    return NextResponse.json({ error: e?.message || "signin failed" }, { status: 401 });
  }
}
