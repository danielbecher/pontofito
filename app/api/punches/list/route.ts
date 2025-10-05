import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'
import { adminDb } from '@/lib/firebaseAdmin'

export async function GET(req: Request) {
  const u = await getSessionUser()
  if (!u) return new NextResponse('unauthorized', { status: 401 })
  const { searchParams } = new URL(req.url)
  const limit = Number(searchParams.get('limit') || 0)
  const month = searchParams.get('month')
  const id = searchParams.get('id')

  if (id) {
    const doc = await adminDb.collection('punches').doc(id).get()
    if (!doc.exists) return NextResponse.json({ items: [] })
    const d = { id: doc.id, ...doc.data() }
    if ((d as any).userId !== u.id && u.role !== 'admin') return new NextResponse('forbidden', { status: 403 })
    return NextResponse.json({ items: [d] })
  }

  if (month) {
    const q = await adminDb.collection('punches')
      .where('userId', '==', u.id)
      .where('dateKey', '>=', `${month}-01`)
      .where('dateKey', '<=', `${month}-31`)
      .get()
    const items = q.docs.map(d => ({ id: d.id, ...d.data() }))
    const days: Record<string, number> = {}
    for (const p of items) days[(p as any).dateKey] = (days[(p as any).dateKey] || 0) + 1
    const oddDays = Object.entries(days).filter(([_, c]) => c % 2 === 1).map(([k]) => k)
    return NextResponse.json({ items, oddDays })
  }

  const base = adminDb.collection('punches').where('userId', '==', u.id).orderBy('timestamp', 'desc')
  const q = limit > 0 ? await base.limit(limit).get() : await base.get()
  const items = q.docs.map(d => ({ id: d.id, ...d.data() }))
  return NextResponse.json({ items })
}
