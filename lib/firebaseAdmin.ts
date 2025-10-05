import { getApps, initializeApp, applicationDefault, cert } from 'firebase-admin/app'
import { getAuth as getAdminAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: process.env.FIREBASE_ADMIN_PRIVATE_KEY
        ? cert({
            projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
            clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')
          })
        : applicationDefault(),
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID
    })

export const adminAuth = getAdminAuth(app)
export const adminDb = getFirestore(app)
