import { cookies } from 'next/headers'
import { adminAuth, adminDb } from './firebaseAdmin'

export async function getSessionUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('__session')?.value
  if (!token) return null
  const decoded = await adminAuth.verifyIdToken(token).catch(() => null)
  if (!decoded) return null
  const snap = await adminDb.collection('users').doc(decoded.uid).get()
  if (!snap.exists) return null
  const data = snap.data()!
  if (!data.active) return null
  return { id: decoded.uid, email: decoded.email, name: data.name || '', role: data.role || 'employee', active: !!data.active }
}
