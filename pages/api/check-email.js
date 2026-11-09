// Tells the signup page whether an email already has an account, so it can
// show "Create your password" or "Sign in".
//
// Why a server route: the browser can't tell. Supabase answers a sign-in for
// an unknown email with the same "Invalid login credentials" error as a wrong
// password, so the old client-side check sent every new user to sign-in.
//
// Uses the Auth admin API (service role, server-only). `filter` narrows the
// search; the exact match below is what decides, so a loose filter is harmless.
//
// Env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (both already set).

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const email = String(req.body?.email || '').trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 320) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) return res.status(500).json({ error: 'Not configured' });

  try {
    const url = `${base}/auth/v1/admin/users?per_page=1000&filter=${encodeURIComponent(email)}`;
    const r = await fetch(url, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
    if (!r.ok) return res.status(502).json({ error: 'Lookup failed' });
    const { users = [] } = await r.json();
    const exists = users.some(u => (u.email || '').toLowerCase() === email);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ exists });
  } catch {
    return res.status(502).json({ error: 'Lookup failed' });
  }
}
