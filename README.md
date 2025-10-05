# PontoFito

Next.js (App Router) + Firebase (Auth + Firestore).
All function names and internal code are in English. UI strings are in Portuguese, per requirement.

## Setup

1. Copy `.env.example` to `.env.local` and fill Firebase keys.
2. `npm i`
3. `npm run dev`

### Firebase
- Enable Authentication (Email/Password).
- Create Firestore (production mode).
- Create at least one user in Auth (email/password).
- Create a document in `users` with id equal to the Firebase Auth UID, or use the Admin users page to add entries (note: this sample stores app users in Firestore; adjust to your policy). Document fields:  
  `{ name, email, role: 'employee' | 'admin', active: true }`

### Notes
- "Bater ponto" toggles between `in` and `out` based on last punch of the day.
- Manual edits are highlighted with yellow background.
- PDF export available per month.
