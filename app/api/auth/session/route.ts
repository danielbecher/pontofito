import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'

export async function GET() {
  const u = await getSessionUser()
  if (!u) return new NextResponse('unauthorized', { status: 401 })
  return NextResponse.json({ user: u })
}
