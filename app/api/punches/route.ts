import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebaseAdmin'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const limitParam = searchParams.get('limit')
    const limitNum = limitParam ? parseInt(limitParam) : 5

    const snapshot = await adminDb
      .collection('pontos')
      .orderBy('timestamp', 'desc')
      .limit(limitNum)
      .get()

    const list = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        type: data.type || '',
        timestamp: data.timestamp || 0,
        manual: !!data.manual,
        ip: data.ip || ''
      }
    })

    console.log(`📦 ${list.length} registros retornados`)
    return NextResponse.json(list, { status: 200 })
  } catch (err: any) {
    console.error('❌ Erro em /api/punches:', err)
    return NextResponse.json({ error: err.message || 'Erro interno' }, { status: 400 })
  }
}
