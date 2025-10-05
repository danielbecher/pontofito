import admin from "firebase-admin"

if (!admin.apps.length) {
    const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    if (!key) {
        throw new Error("❌ FIREBASE_SERVICE_ACCOUNT_KEY ausente no .env.local")
    }

    // Faz o parse e corrige as quebras de linha do private_key
    const serviceAccount = JSON.parse(key)
    if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n')
    } else {
        throw new Error("❌ private_key ausente no FIREBASE_SERVICE_ACCOUNT_KEY")
    }

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    })

    console.log(`✅ Firebase Admin conectado ao projeto: ${serviceAccount.project_id}`)
}

export const adminAuth = admin.auth()
export const adminDb = admin.firestore()
