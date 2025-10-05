
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const keyPath = process.env.FIREBASE_ADMIN_PRIVATE_KEY_PATH || "./firebase-key.pem";
if (!fs.existsSync(keyPath)) {
  throw new Error(`❌ Private key file not found at ${keyPath}`);
}
const privateKey = fs.readFileSync(keyPath, "utf-8");

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey,
      }),
    });

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
