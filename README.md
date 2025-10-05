
# PontoFito

Next.js + Firebase (Auth + Firestore) — Registro de ponto para COFFITO.

## Como rodar

1. `npm install`
2. Crie `firebase-key.pem` na raiz (conteúdo PEM real).
3. Copie `.env.example` para `.env.local` e preencha.
4. No Firebase Console, ative **Authentication → E-mail/senha** e crie um usuário.
5. `npm run dev` e acesse `http://localhost:3000/login`.

## Rotas
- `/` — Últimos 5 pontos + botão "Bater ponto"
- `/punches` — Lista por mês + alerta de dias ímpares
- `/punches/edit` — Editar pontos (marca `manual=true`)
- `/punches/export?month=YYYY-MM` — Exporta PDF
