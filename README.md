# Comfy Parking

A responsive parking staff dashboard built with React and Supabase.

**Live:** https://parkink-plante-dashboard.vercel.app/

## Try the public demo

- Email: `visitor@comfy.demo`
- Password: `TryParking2026`

These are fictional presentation details, not a real account. Public demo changes are stored only in your browser. The simulator is optional and clearly labeled. Do not enter real customer data into the demo.

The separate **Team sign in** uses private Supabase authentication and a shared database. Its starter records are fictional too. No physical sensors or original API records are connected.

## Run

Use Node 22.

```sh
npm ci
npm run dev
npm run lint
npm run build
```

Optional environment overrides: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Only a publishable client key belongs here, never a database password or service-role key.

The active entry is `parking-main.jsx`. Original sources under `src/` remain as reference; they are no longer the dashboard entry.

## Handoff

- [Architecture, backend contract, schema/RLS, setup and next customer app](./ARCHITECTURE.md)
- [Initial schema and authorization SQL](./parking-schema.sql)
- [Verification record and known limits](./VERIFICATION.md)

This dashboard manages bay status and driver access, reads bookings, exports CSV and shows shared database changes through Supabase Realtime. It does not implement customer booking creation, payments or hardware integration.
