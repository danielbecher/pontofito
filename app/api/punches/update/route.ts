import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'
import { adminDb } from '@/lib/firebaseAdmin'
import { toDateKey } from '@/lib/time'

export async function POST(req: Request) {
  const u = await getSessionUser()
  if (!u) return new NextResponse('unauthorized', { status: 401 })
  const body = await req.json()
  const { id, timestamp } = body
  const doc = await adminDb.collection('punches').doc(id).get()
  if (!doc.exists) return new NextResponse('not found', { status: 404 })
  const data = doc.data()!
  if (data.userId !== u.id && u.role !== 'admin') return new NextResponse('forbidden', { status: 403 })
  await adminDb.collection('punches').doc(id).update({
    timestamp,
    dateKey: toDateKey(timestamp),
    manual: true
  })
  const updated = await adminDb.collection('punches').doc(id).get()
  return NextResponse.json({ item: { id, ...updated.data() } })
}
