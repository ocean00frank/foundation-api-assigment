This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Backend (Django) services

- Apps:
  - `auth_admin`, `auth_routes`, `auth_login`
  - `content` (assignments, resources, videos, live-classes, assessments, revision)
  - `payment` (transactions, subscriptions, gateways, webhooks)
  - `analytics` (reports/aggregations)

- API prefixes:
  - `/api/admin/auth/` (admin login/2FA/profile)
  - `/api/auth/` (user auth/profile)
  - `/api/content/` (content CRUD)
  - `/api/payment/` (initiate, webhook, transactions, subscriptions, summary)
  - `/api/analytics/` (payments by subject & grade)

## Payments quick start

1) Set environment variables on the backend (example):
```
PAY_WEBHOOK_SECRET=replace-with-strong-secret
PAY_MTN_API_KEY=...
PAY_MTN_API_USER=...
PAY_MTN_BASE_URL=https://sandbox.mtn...
PAY_MTN_PAYEE_MSISDN=+260762263901
PAY_MTN_PAYEE_NAME=Frank Mwelwa
PAY_AIRTEL_API_KEY=...
PAY_AIRTEL_CLIENT_ID=...
PAY_AIRTEL_BASE_URL=https://sandbox.airtel...
PAY_AIRTEL_PAYEE_MSISDN=+260976595045
PAY_AIRTEL_PAYEE_NAME=Frank Mwelwa
```

2) Expose webhook URL (public HTTPS):
```
POST https://<your-domain>/api/payment/webhook/
Header: X-Signature: <HMAC_SHA256(PAY_WEBHOOK_SECRET, raw_body)>
```

3) User payment (frontend): `dashboard/users/payment`
 - Picks grade, method (MTN/Airtel), phone → POST `/api/payment/initiate/`

4) Admin manual payment: `dashboard/admin/users`
 - Records payment for user (full name, email, phone, grade, subject, amount) using `method: "manual"`
 - Activates 30‑day subscription immediately and notifies user by email

5) Payment status & access
 - `GET /api/payment/summary/` → `{ grades: [...], tier: 0|1|2|3 }`
 - Frontend uses `tier` to unlock content and show Active in user dashboard

6) Analytics
 - `GET /api/analytics/payments/subjects-grades/` → counts per subject & grade for admin dashboard

## Security hardening (payments)

- Throttling: Initiate payment endpoint limited to 5 requests/min/user.
- Idempotency: Send an `Idempotency-Key` header on client retries; stored on transactions.
- Webhook verification:
  - HMAC SHA-256 of raw body with `PAY_WEBHOOK_SECRET` → provider must send `X-Signature` header.
  - Optional IP allowlist via `PAY_WEBHOOK_IP_WHITELIST=1.2.3.4,5.6.7.8`.
  - Enforce `Content-Type: application/json`.
- Input validation: grade/method/amount/subject are validated server-side; phone is required except for manual method.
- Least-privilege: users can see their own transactions; admins see all.
- Logging: rely on Django logging config; ensure logs do not include secrets.

## Admin features

- Manual payments: record subscription for a user by email (auto-create if missing). Optional subject.
- Email notifications: sent on manual activation and on successful webhook.
- Filters on payments (server-side and UI): search, grade, subject, status.

## Chat

- Backend app: `chat`
  - Models: `Conversation` (user↔admin), `Message`, `Presence` (is_online, last_seen)
  - Endpoints (auth required, throttled):
    - `GET /api/chat/conversations/` → list conversations (users see theirs; admins see all)
    - `GET /api/chat/conversations/{id}/messages/` → list messages ordered by time
    - `POST /api/chat/conversations/{id}/send/` → `{ text }` to send a message
    - `GET /api/chat/presence/` → upserts presence and marks online
    - `POST /api/chat/presence/heartbeat/` → mark online/refresh `last_seen`
    - `POST /api/chat/presence/offline/` → mark offline

- Frontend usage:
  - Users: `src/app/dashboard/users/chat/page.tsx` fetches conversations/messages and sends messages; presence heartbeat every 30s.
  - Admins: `src/app/dashboard/admin/messages/page.tsx` lists messages, supports reply via `send` endpoint.

- Security:
  - Auth-only chat endpoints.
  - Per-user throttling (30/min).
  - Users only access their own conversations; admins access all.


