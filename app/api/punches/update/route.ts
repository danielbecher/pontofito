import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { adminAuth, adminDb } from "@/lib/firebaseAdmin"
const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "session"
export async function POST(req: Request) {
  const token = cookies().get(COOKIE_NAME)?.value
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  try{
    const decoded = await adminAuth.verifySessionCookie(token, true)
    const uid = decoded.uid
    const { id, timestamp } = await req.json()
    if(!id || !timestamp) return NextResponse.json({ error:"Missing data" }, { status:400 })
    const doc = await adminDb.collection("pontos").doc(id).get()
    if(!doc.exists || doc.data()?.userId !== uid){
      return NextResponse.json({ error:"Not found" }, { status:404 })
    }
    await adminDb.collection("pontos").doc(id).update({ timestamp, manual: true })
    return NextResponse.json({ ok:true }, { status:200 })
  }catch(e:any){
    return NextResponse.json({ error: e?.message||"Failed" }, { status:400 })
  }
}