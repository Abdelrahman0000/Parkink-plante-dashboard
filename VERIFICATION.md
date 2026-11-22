# Verification record

Checked on 22 November 2026, Africa/Cairo.

## Deployed app

https://parkink-plante-dashboard.vercel.app/

Vercel production commit `e3e8532` was Ready. The deployed public demo passed browser checks for sign-in, all four routes, bay status edit, persistence after reload, simulator start/pause, driver search and access restoration, booking filters and CSV download. No page errors were observed. Document width stayed within the viewport at 320, 360, 390, 768, 1024 and 1440px. Wide tables use their own scroll container.

Desktop overview/garage and mobile overview/garage were visually inspected. Mobile account controls include Sign out and Reset demo. Confirmation dialogs support Escape, keyboard focus containment and focus restoration.

## Actual shared backend, separate from the local demo

A private Team account signed into the deployed application and loaded its assigned starter garage. Its data was read from Supabase, not localStorage.

Two-way, cross-session test:

1. In the deployed Team garage, bay A-01 changed from reserved to available through the normal UI.
2. An independent PostgreSQL connection confirmed the committed available status.
3. That separate session called the same staff-authorized RPC to restore reserved and committed the transaction.
4. The already-open browser received the reserved status automatically, with Realtime connected. The browser's navigation count remained 1 and its time origin did not change. There was no page reload or manual refresh between the database commit and the observed update.

The original bay state was restored. Audit events from these fictional-data checks remain as an honest test trail.

## Authorization checks

All eleven SQL assertions passed:

- Anonymous SELECT denied.
- Anonymous mutation RPC denied.
- Authenticated nonmember sees no drivers.
- Authenticated nonmember sees no spaces.
- Assigned owner sees all 48 bays.
- Assigned owner sees all eight synthetic drivers.
- Driver email edits denied by column grants.
- Direct space updates denied.
- Staff-authorized atomic bay RPC succeeds.
- Stale expected-status update fails.
- All four operational tables are in the Realtime publication.

Mutating SQL assertions were rolled back. Public signups were disabled in the project's Authentication settings, then verified disabled. No public-demo credential is an Auth user.

## Build

`npm run lint` and `npm run build` pass for the active application. `npm audit --omit=dev --audit-level=moderate` reported zero production vulnerabilities at this check. Dependencies and the Node engine are pinned through package metadata/lockfile; audit again when updating them.

## Boundaries

This is a working shared staff starter, not a migrated production parking system. Initial rows are fictional. No original API records were recovered, no physical sensors are attached, no payment is collected and no customer reservation workflow is enabled. The booking list currently displays at most 100 rows and is not a large-dataset/paginated view. Team accounts require an explicit workspace membership. Historical aggregate charts are illustrative only in public demo mode, not invented Team analytics.

These checks do not replace an independent security review or production load testing.
