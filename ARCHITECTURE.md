# Comfy Parking, technical handoff

## What is deployed

A React 18 / Vite 8 parking staff dashboard with four routes: `/` (overview), `/garage-map` (bays and realtime status), `/status` (bookings and CSV export), and `/driver-list` (driver search and access control). `/login` offers two intentionally different modes.

- **Public demo:** `visitor@comfy.demo` / `TryParking2026` are presentation fixtures, not a real account. Data is fictional, stored under `comfy-parking-demo-v2` in this browser. The optional simulator is explicitly started and paused. Reset affects only this demo storage key. BroadcastChannel and storage events synchronize same-origin browser tabs.
- **Team workspace:** Supabase email/password authentication, PostgreSQL data, row-level security and Supabase Realtime. Its initial garage, drivers and bookings are also fictional. No physical sensor or original backend data is connected.

No private administrator or database password is in this repository. Demo credentials do not authorize any Supabase request.

## Files and development

- `parking-main.jsx`: active React entry, screens, forms, accessible dialogs and CSV download.
- `parking-ui.css`: dark dashboard foundation, original opposing parking lanes and staggered car arrivals, mobile bottom navigation and account controls.
- `analytics-ui.css`: overview analytics and fluid/short-viewport login styling.
- `parking-analytics.js`: pure Cairo-date booking analytics, with no synthetic chart injection.
- `parking-data.js`: demo seed/persistence and shared Supabase adapter.
- `parking-schema.sql`: one-time initial database schema, authorization and realtime publication.
- `src/`: original project sources/assets retained as reference. The active `index.html` loads `parking-main.jsx`, not the old API-dependent entry.
- `vite.config.js`: React build only; the obsolete API proxy has been removed.
- `vercel.json`: SPA fallback so deep links work.

Use Node 22, `npm ci`, `npm run dev`, `npm run lint`, and `npm run build`. Lint targets the active application, not the archived old screens. PropTypes describe active component inputs. The React-refresh export rule is disabled only in the root entry, which mounts rather than exports components.

Vite environment overrides: `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. The default project URL and publishable key in the adapter are public client configuration. They carry no private privilege. Never add a service-role key or database password to a Vite variable, bundle, screenshot or repository. Changing projects requires applying the schema and assigning memberships in that project.

Deployment is from this repository's `main` branch through the existing Vercel connection.

## Shared database

Dedicated Supabase project: `comfy-parking`, reference `ohezipicitbvdrnucdsw`, Frankfurt, Free plan. Management: https://supabase.com/dashboard/project/ohezipicitbvdrnucdsw

The unrelated pre-existing project was not migrated or modified.

| Table | Purpose |
| --- | --- |
| `parking_sites` | Garage/workspace tenant |
| `parking_members` | Auth user to site membership, owner/staff/viewer |
| `parking_spaces` | Bay label, floor, type and availability |
| `parking_drivers` | Driver contact, vehicle and blocked flag |
| `parking_bookings` | Driver/bay, start/end time, amount and lifecycle status |
| `parking_events` | Recent audit/activity messages |

Every operational row has a `site_id`. Composite foreign keys keep booking references within a tenant. A partial unique index prevents more than one active booking for a space. The current client expects exactly one membership; it deliberately rejects unassigned or multi-workspace users rather than silently choosing a site.

### Authorization

- RLS is enabled on every table. Anonymous requests cannot read parking records or call the mutation RPC.
- Authenticated users read only their assigned site data. Membership lookup is limited to the current user's own memberships.
- Space changes use `parking_change_space(target_id, next_status, expected_status)`. It checks owner/staff membership, validates status, compares the expected previous status and writes an audit event in the same transaction. A stale edit fails instead of silently overwriting another staff member.
- Direct client updates to spaces are denied.
- Driver updates are restricted to the `blocked` column and staff authorization; a database trigger records access changes. Driver names/emails cannot be changed through that client grant.
- Booking creation, payment, deletion, public registration and customer self-service are not implemented by the dashboard.
- New team members must be provisioned through trusted administration and explicitly added to `parking_members`. Never expose membership writes to a browser client.

Do not re-run the initial schema against a populated production database as a migration. Future schema changes need versioned migrations, backup planning and review.

## Realtime and failure behavior

The publication contains `parking_spaces`, `parking_drivers`, `parking_bookings` and `parking_events`. The authenticated client subscribes to site-filtered PostgreSQL changes, then reloads through RLS-protected queries. A fresh subscription also refreshes the snapshot, covering changes during reconnection. Request sequence checks prevent an older refresh from replacing a newer response. The UI displays connection state and supports manual refresh; mutation errors are shown and dialogs stay open when a save fails.

Realtime is database synchronization, not a connection to physical parking hardware. The demo simulator is local and never writes to Supabase.

## Original API assessment

The original application used `comfyparking.tryasp.net`. Its Swagger document was reachable, but an unauthenticated `Spaces/GetSpaces` request returned HTTP 500 during the assessment. This establishes that the request failed, not that the whole service is permanently unavailable. No original server repository, working backend authorization or original records were available for a safe repair/migration. The replacement therefore uses an isolated Supabase schema and synthetic seed data, not recovered customer data.

## Verification record

- Production build and active-source lint pass.
- Production dependency audit reports zero vulnerabilities at the time of the update.
- Public demo tested: login, four routes, bay edit, reload persistence, simulator controls, driver search/access restoration, booking filters and CSV export.
- No document-level horizontal overflow across 320, 360, 390, 768, 1024 and 1440 pixel widths. Tables scroll inside their own cards.
- Eleven SQL checks cover anonymous denial, nonmember isolation, owner reads, column restrictions, direct-space-update denial, working RPC, stale-update rejection and four-table realtime publication. Mutation tests were rolled back.

These are point-in-time checks, not a claim of a full security audit. Actual cross-session realtime and deployed-browser results are recorded in `VERIFICATION.md` after deployment.

## Later customer-facing application

Build the user interface against the same site/space/booking identifiers, but do not reuse staff membership as customer authority. Add customer identity/ownership policies and a server-side booking workflow that atomically checks availability, blocked status and duplicate requests. Pricing, capacity holds, cancellation rules, payment webhooks and no-show handling must be designed before accepting real bookings or money. Store amounts in explicit currency/minor units when implementing payments; today's displayed synthetic amounts are not charges.

Use sensor/gateway service identities and server-side validation for physical occupancy updates, never a browser service-role key. Define whether a staff edit is an override or source-of-truth sensor state. Add paginated queries, search indexes, server-side exports, monitoring and retention rules before large real datasets. Current booking table display is capped at 100 rows; the starter workspace has six.

Split the root screen file into route/components modules as the product grows. Keep the data adapter as the boundary between screens and backend. Add automated tenant-isolation and transactional booking tests before enabling customer mutations.

## Approved dark UI and analytics revision

The original `src/Pages/CarMap` concept is preserved: opposing parking lanes, a central aisle, the original car asset, and staggered left/right arrivals. Replay affects presentation only, not occupancy. Status filters dim nonmatching bays in place to retain spatial meaning. Reduced motion disables arrivals.

The overview explicitly separates current occupancy from period-based booking records. Today, 7-day and 30-day periods use Africa/Cairo arrival-date boundaries; all-loaded includes all valid loaded arrivals. Completed revenue uses completed bookings only and is not a claim of payment reconciliation. Average completed stays omit invalid or negative durations. No prior-period rows means no percentage comparison. Zero chart buckets mean no matching loaded rows, not confirmed absence of business. This is bounded-record analysis, not a complete historical reporting system. The existing booking table displays up to 100 rows; future reliable historical analytics need paginated storage queries and aggregate endpoints.

Login grid/form items explicitly shrink, mobile form width is fluid, and inputs use 16px text to avoid mobile focus zoom. Short landscape and keyboard-height viewports remain scrollable. Keyboard-height tests simulate resized viewports, not a physical iOS keyboard. Authentication logic and the shared adapter were not changed by this UI revision.
