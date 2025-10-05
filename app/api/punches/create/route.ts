import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'
import { adminDb } from '@/lib/firebaseAdmin'
import { getClientIp } from '@/lib/ip'
import { nowTs, toDateKey } from '@/lib/time'

export async function POST() {
  const u = await getSessionUser()
  if (!u) return new NextResponse('unauthorized', { status: 401 })

  const ip = await getClientIp()
  const ts = nowTs()
  const dateKey = toDateKey(ts)

  const snap = await adminDb.collection('punches')
    .where('userId', '==', u.id)
    .where('dateKey', '==', dateKey)
    .orderBy('timestamp', 'desc')
    .limit(1)
    .get()

  const last = snap.docs[0]?.data() as any
  const nextType: 'in' | 'out' = last?.type === 'in' ? 'out' : 'in'

  const ref = await adminDb.collection('punches').add({
    userId: u.id,
    timestamp: ts,
    dateKey,
    type: nextType,
    manual: false,
    ip
  })

  const item = { id: ref.id, userId: u.id, timestamp: ts, dateKey, type: nextType, manual: false, ip }
  return NextResponse.json({ item })
}
