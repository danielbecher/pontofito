import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'
import { adminDb } from '@/lib/firebaseAdmin'
import { buildMonthPdf } from '@/lib/pdf'

export async function GET(req: Request) {
  const u = await getSessionUser()
  if (!u) return new NextResponse('unauthorized', { status: 401 })
  const { searchParams } = new URL(req.url)
  const month = searchParams.get('month')
  if (!month) return new NextResponse('month required', { status: 400 })

  const q = await adminDb.collection('punches')
    .where('userId', '==', u.id)
    .where('dateKey', '>=', `${month}-01`)
    .where('dateKey', '<=', `${month}-31`)
    .get()

  const items = q.docs.map(d => ({ id: d.id, ...(d.data() as any) }))
  const pdfBytes = await buildMonthPdf(`Pontos — ${month} — ${u.email}`, items)
  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      'content-type': 'application/pdf',
      'content-disposition': `inline; filename="pontos-${month}.pdf"`
    }
  })
}
