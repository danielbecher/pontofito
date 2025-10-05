
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "session";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit") || 0);
  const month = searchParams.get("month");

  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return NextResponse.json([], { status: 200 });

  try {
    const decoded = await adminAuth.verifySessionCookie(token, true);
    const uid = decoded.uid;

    let q:any = adminDb.collection("pontos").where("userId","==",uid);
    if (month){
      const [y,m] = month.split("-").map(Number);
      const start = new Date(y, m-1, 1).getTime();
      const end = new Date(y, m, 0, 23,59,59,999).getTime();
      q = q.where("timestamp", ">=", start).where("timestamp", "<=", end);
    }
    q = q.orderBy("timestamp","desc");
    if (limit>0){ q = q.limit(limit); }

    const snap = await q.get();
    const data = snap.docs.map((d:any)=>({ id:d.id, ...d.data() }));
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
