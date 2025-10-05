import { NextResponse } from "next/server"
const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "session"
export async function POST() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 0, path: "/" })
  return res
}