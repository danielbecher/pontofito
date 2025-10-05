
const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const fs = require("fs");
require("dotenv").config({ path: ".env.local" });

const key = fs.readFileSync("./firebase-key.pem", "utf-8");

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: key,
  }),
});

const auth = getAuth(app);

auth.createUser({ email: "admin@coffito.gov.br", password: "123456" })
  .then((u)=>{ console.log("✅ Usuário criado:", u.uid); process.exit(0); })
  .catch((e)=>{ console.error(e); process.exit(1); });
