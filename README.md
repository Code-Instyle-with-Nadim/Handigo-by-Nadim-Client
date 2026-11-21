# HandiGo! client

Next.js app with BetterAuth, MongoDB and role-based dashboards.

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

Fill in the values in `.env`:

- `BETTER_AUTH_SECRET` — a long random string used to sign sessions.
- `BETTER_AUTH_URL` — the app URL, e.g. `http://localhost:3000`.
- `MONGODB_URI` / `MONGODB_DB` — the MongoDB connection used by BetterAuth.
  Set `MONGODB_TRANSACTIONS=true` only when using a replica set (such as
  MongoDB Atlas); standalone local MongoDB needs it to stay `false`.
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — optional, enables Google sign-in.

Make sure MongoDB is running and the Google OAuth callback
`http://localhost:3000/api/auth/callback/google` is allowed in your Google
Cloud console if you enable social login.

## Auth notes

- Email/password sign-up offers the `customer` and `technician` roles only.
  The server normalizes anything else to `customer`, and roles cannot be
  changed through a profile update.
- New Google accounts default to `customer`.
- Admin accounts are promoted directly in MongoDB (`users.role = "admin"`);
  they are never selectable on the public sign-up form.
- Profile details (`name`, `image`, `phone`, `area`, `bio`) can be updated at
  `/dashboard/profile`.

## Scripts

```bash
npm run dev        # start the dev server
npm run build      # production build
npm run typecheck  # TypeScript checks
npm run lint       # ESLint
```
