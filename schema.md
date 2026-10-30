# ProPages — Live Database Schema
> Captured directly from Supabase (`information_schema` + `pg_policies`), July 2026.
> This file is the source of truth for the live database — more authoritative than
> assumptions in ROADMAP.md or code comments, since it reflects what Postgres
> actually has, not what the app expects.
>
> **Refresh this file after any schema change** (new table, column, or policy).
> Regeneration queries are at the bottom.

---

## `reps`

| column | type | nullable | default |
|---|---|---|---|
| id | bigint | NO | — |
| created_at | timestamptz | NO | now() |
| slug | text | YES | — |
| name | text | YES | — |
| title | text | YES | — |
| city | text | YES | — |
| headline | text | YES | — |
| bio | text | YES | — |
| template | text | YES | — |
| verified | boolean | YES | — |
| photo_url | text | YES | — |
| industry | text | YES | — |
| employment_type | text | YES | — |
| auth_id | uuid | YES | — |
| stats | jsonb | YES | — |
| testimonials | jsonb | YES | — |
| links | jsonb | YES | — |
| pitch | text | YES | — |
| lead_capture | jsonb | YES | — |
| badge_tier | text | YES | — |
| tos_accepted_at | timestamptz | YES | — |
| phone | text | YES | — |
| blocks | jsonb | YES | — |
| accent | text | YES | 'slate' |
| theme | text | YES | 'light' |
| font_pair | text | YES | 'default' |
| referred_by | text | YES | — |

**Constraints:** PK `id` · UNIQUE `slug` · UNIQUE `auth_id`

**RLS:**
- SELECT: `Public can read reps` — `true` (fully public)
- UPDATE: `Reps can update own row` — `auth.uid() = auth_id`
- INSERT: `Authenticated users can insert reps` — `auth.uid() = auth_id`
- INSERT: `Prevent Duplicate Rep Rows` — blocks insert if a row with `auth.uid() = auth_id` already exists

**⚠️ Legacy columns** (pre-block-system era, likely dead): `stats`, `testimonials`, `links`, `pitch`, `lead_capture`, `template`, `employment_type`, `phone`, `badge_tier`. The block system (`blocks` jsonb) superseded these per ROADMAP.md Phase 5, but they were never dropped from the schema. Confirm nothing still reads/writes them before treating as safe to remove.

**⚠️ Badge ambiguity:** `badge_tier` here vs. the separate `rep_badges` table below — two possible sources for the same concept. Not yet confirmed which one `BadgePill` actually reads.

---

## `leads`

| column | type | nullable | default |
|---|---|---|---|
| id | bigint | NO | — |
| created_at | timestamptz | NO | now() |
| name | text | YES | — |
| phone | text | YES | — |
| owner_response | text | YES | — |
| rep_id | bigint | YES | — |
| notes | text | YES | — |
| email | text | YES | — |
| zip | text | YES | — |
| homeowner_referral_token | text | YES | — |

**Constraints:** PK `id` only — **no FK on `rep_id`**, relationship is app/RLS-enforced only.

**RLS:**
- INSERT: `Anyone can insert leads` — `true` (fully open, expected — public lead capture forms)
- SELECT: `Reps can read own leads` — `auth.uid() = (reps.auth_id where reps.id = leads.rep_id)`

No UPDATE/DELETE policy exists — leads are immutable from the client once created.

---

## `page_views`

| column | type | nullable | default |
|---|---|---|---|
| id | bigint | NO | — |
| rep_id | bigint | YES | — |
| viewed_at | timestamptz | YES | now() |
| referrer | text | YES | — |

**Constraints:** PK `id` · FK `rep_id → reps.id`

**RLS:**
- INSERT: `Allow anon insert` — `true`
- SELECT: `Reps read own views` — `rep_id = (reps.id where reps.auth_id = auth.uid())`

Logged server-side in `_slug_.js` `getServerSideProps`, fire-and-forget, with basic bot filtering via user-agent regex (`bot|crawl|spider|prerender|facebookexternalhit`).

---

## `homeowner_referrals`

| column | type | nullable | default |
|---|---|---|---|
| id | bigint | NO | — |
| token | text | NO | — |
| name | text | NO | — |
| email | text | NO | — |
| rep_id | bigint | YES | — |
| created_at | timestamptz | YES | now() |

**Constraints:** PK `id` · FK `rep_id → reps.id` · UNIQUE `token`

**RLS:**
- INSERT: `Anyone can insert homeowner referral` — `true`
- SELECT: `Rep reads own referrals` — `rep_id = (reps.id where reps.auth_id = auth.uid())`

---

## `rep_badges`

| column | type | nullable | default |
|---|---|---|---|
| id | uuid | NO | gen_random_uuid() |
| rep_id | bigint | NO | — |
| tier | text | NO | — |
| granted_at | timestamptz | NO | now() |
| revoked_at | timestamptz | YES | — |
| granted_by | text | YES | — |
| notes | text | YES | — |

**Constraints:** PK `id` · FK `rep_id → reps.id`

**RLS:**
- SELECT: `Public can read active badges` — `revoked_at IS NULL`

No INSERT/UPDATE policy exists for any role — badges can only be granted/revoked via the Supabase service role (dashboard or a server-side admin action), never from the client. This looks like an audit-trail table for admin-granted badges (PRO/VERIFIED/CERTIFIED), separate from — or possibly superseding — `reps.badge_tier`.

---

## `invite_requests`

| column | type | nullable | default |
|---|---|---|---|
| id | bigint | NO | — |
| created_at | timestamptz | NO | now() |
| name | text | YES | — |
| email | text | YES | — |
| industry | text | YES | — |
| status | text | YES | — |

**Constraints:** PK `id` only.

**RLS:** ✅ Fixed July 2026. Was found with RLS **disabled** — fully open to the anon key (any client could read/write/delete every waitlist entry, names and emails included). Confirmed via `index.js` line 25 that submission happens client-side through the anon client, so the fix mirrors the `leads`/`page_views` pattern:

```sql
alter table invite_requests enable row level security;

create policy "Anyone can insert invite request"
on invite_requests for insert
with check (true);
```

- INSERT: `Anyone can insert invite request` — `true` (public insert, matches the live form's needs)
- No SELECT/UPDATE/DELETE policy — anon key can no longer read, edit, or delete rows. Waitlist entries are read via the Supabase dashboard directly (an authenticated session), not through the app.
- Verified live post-fix: test invite submission still writes successfully with `status: 'pending'`.
- If an admin-facing "view pending invites" page gets built later, it will need its own scoped SELECT policy — not public. Not needed today.

---

## Known gaps in this file

- No `homeowner_referral_token` → `homeowner_referrals.token` FK (matches by value, not enforced)
- No view of Supabase Auth config, storage buckets, or Edge Functions (if any exist) — this file is public-schema tables only
- Table-level RLS status (`relrowsecurity`) confirmed **enabled on all six tables** as of the invite_requests fix (July 2026) — see check query below if this ever needs re-verifying

---

## Regeneration queries

Run each separately in the Supabase SQL Editor (multi-statement runs only return the last result):

```sql
-- Columns/types
select table_name, column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public'
order by table_name, ordinal_position;

-- Constraints
select tc.table_name, tc.constraint_type, tc.constraint_name, kcu.column_name
from information_schema.table_constraints tc
join information_schema.key_column_usage kcu
  on tc.constraint_name = kcu.constraint_name
where tc.table_schema = 'public'
order by tc.table_name;

-- RLS policies
select tablename, policyname, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
order by tablename;

-- Table-level RLS enabled/disabled
select relname, relrowsecurity
from pg_class
where relname in (
  select table_name from information_schema.tables where table_schema = 'public'
);
```