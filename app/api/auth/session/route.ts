import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { adminAuth } from "@/lib/firebaseAdmin"
const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "session"
export async function GET() {
  const token = cookies().get(COOKIE_NAME)?.value
  if (!token) return NextResponse.json({ ok: false }, { status: 401 })
  try{
    const decoded = await adminAuth.verifySessionCookie(token, true)
    return NextResponse.json({ ok: true, uid: decoded.uid, email: decoded.email || null }, { status: 200 })
  }catch{
    return NextResponse.json({ ok: false }, { status: 401 })
  }
}