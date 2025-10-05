
import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "session";

export async function POST() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  try {
    const decoded = await adminAuth.verifySessionCookie(token, true);
    const uid = decoded.uid;
    const ip = headers().get("x-forwarded-for")?.split(",")[0]?.trim() || "0.0.0.0";
    const now = Date.now();

    const start = new Date(); start.setHours(0,0,0,0);
    const end = new Date(); end.setHours(23,59,59,999);
    const snap = await adminDb.collection("pontos")
      .where("userId","==",uid)
      .where("timestamp",">=",start.getTime())
      .where("timestamp","<=",end.getTime())
      .orderBy("timestamp","asc")
      .get();
    const countToday = snap.size;
    const type = countToday % 2 === 0 ? "in" : "out";

    const doc = await adminDb.collection("pontos").add({
      userId: uid,
      timestamp: now,
      type,
      manual: false,
      ip,
      y: new Date(now).getFullYear(),
      m: new Date(now).getMonth()+1,
      d: new Date(now).getDate(),
      createdAt: now
    });

    return NextResponse.json({ ok: true, id: doc.id, type }, { status: 200 });
  } catch (e:any) {
    return NextResponse.json({ error: e?.message || "Failed" }, { status: 400 });
  }
}
