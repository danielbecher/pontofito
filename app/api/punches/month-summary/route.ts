import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'
import { adminDb } from '@/lib/firebaseAdmin'

export async function GET(req: Request) {
  const u = await getSessionUser()
  if (!u) return new NextResponse('unauthorized', { status: 401 })
  const { searchParams } = new URL(req.url)
  const users = searchParams.get('users')
  if (users) {
    const q = await adminDb.collection('users').get()
    const list = q.docs.map(d => ({ id: d.id, ...d.data() }))
    return NextResponse.json({ users: list })
  }
  return NextResponse.json({})
}

export async function POST(req: Request) {
  const u = await getSessionUser()
  if (!u || u.role !== 'admin') return new NextResponse('forbidden', { status: 403 })
  const { searchParams } = new URL(req.url)
  const body = await req.json()

  if (searchParams.get('createUser')) {
    const ref = await adminDb.collection('users').add({
      email: body.email,
      name: body.name || '',
      role: body.role || 'employee',
      active: body.active ?? true
    })
    return NextResponse.json({ id: ref.id })
  }

  if (searchParams.get('toggleUser')) {
    await adminDb.collection('users').doc(body.id).update({ active: body.active })
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({})
}
