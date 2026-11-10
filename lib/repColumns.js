// The `reps` columns the browser (anon / authenticated keys) is allowed to read.
//
// The database enforces this with column-level grants (SQL in SCHEMA_final.md):
// everything else on `reps` — the rep's private phone number, Terms acceptance,
// referral source, legacy columns — is readable only by the server's secret key.
//
// Two rules that follow from that:
//   - Never `select('*')` from reps in client or anon-key code; it fails with
//     "permission denied". List columns from here instead.
//   - A new `reps` column the app needs to read must be added here AND granted:
//     grant select (new_column) on public.reps to anon, authenticated;
export const PUBLIC_REP_COLUMNS = [
  'id', 'slug', 'auth_id', 'name', 'title', 'city', 'industry', 'photo_url',
  'blocks', 'accent', 'theme', 'badge_tier', 'lead_capture',
];
