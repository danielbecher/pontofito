// fix-key.js — versão CommonJS
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.resolve(".env.local") });

let key = process.env.FIREBASE_ADMIN_PRIVATE_KEY || "";

console.log("🔍 Original key (raw from .env.local):");
console.log(key.slice(0, 100) + "...\n");

if (key.includes("\\n")) {
    console.log("✅ Key contains \\n — converting to real newlines...");
    key = key.replace(/\\n/g, "\n");
}

const fixedFile = path.resolve("./fixed-key.pem");
fs.writeFileSync(fixedFile, key);
console.log(`✅ Fixed PEM written to: ${fixedFile}`);
