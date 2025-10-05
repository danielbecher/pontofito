import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebaseAdmin'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { type, timestamp, manual } = body
    const ip = req.headers.get('x-forwarded-for') || '::1'
    if (!type || !timestamp) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 })
    }

    const docRef = await adminDb.collection('pontos').add({
      type,
      timestamp,
      manual: !!manual,
      ip,
    })

    console.log(`✅ Ponto registrado: ${docRef.id} (${type}) — IP ${ip}`)
    return NextResponse.json({ ok: true, id: docRef.id })
  } catch (err: any) {
    console.error('❌ Erro em /api/punch:', err)
    return NextResponse.json({ error: err.message || 'Erro interno' }, { status: 400 })
  }
}
