// Emails a rep when a new lead is saved.
//
// Called by a Supabase Database Webhook on INSERT into public.leads (not by
// the browser), so it fires no matter which form saved the lead and can't be
// triggered by outsiders. Supabase sends the new row as `record`.
//
// Env vars (Vercel → Settings → Environment Variables):
//   LEAD_WEBHOOK_SECRET        shared secret; Supabase sends it in the
//                              x-webhook-secret header
//   SUPABASE_SERVICE_ROLE_KEY  server-only; reads the rep and their login email
//   RESEND_API_KEY             already set (invite emails)
//   LEADS_FROM_EMAIL           optional, default "ProPages <leads@propages.pro>"
//                              (the domain must be verified in Resend)
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { buildLeadEmail } from '../../lib/leadEmail';
import { SITE_URL } from '../../lib/site';

// Stop emailing a rep after this many leads in an hour. The lead form is
// public, so this keeps a spam burst from flooding someone's inbox.
// The leads themselves are still saved and visible on the dashboard.
const MAX_EMAILS_PER_HOUR = 20;

function secretOk(req) {
  const expected = process.env.LEAD_WEBHOOK_SECRET || '';
  const got = String(req.headers['x-webhook-secret'] || '');
  if (!expected || got.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(got), Buffer.from(expected));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!secretOk(req)) return res.status(401).json({ error: 'Unauthorized' });

  const { type, table, record: lead } = req.body || {};
  if (type !== 'INSERT' || table !== 'leads' || !lead?.rep_id) {
    return res.status(200).json({ skipped: 'not a new lead' });
  }

  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: rep, error: repError } = await admin
    .from('reps').select('id, name, slug, auth_id').eq('id', lead.rep_id).maybeSingle();
  if (repError) return res.status(500).json({ error: 'rep lookup failed' });
  if (!rep?.auth_id) return res.status(200).json({ skipped: 'no rep account' });

  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await admin
    .from('leads').select('id', { count: 'exact', head: true })
    .eq('rep_id', rep.id).gte('created_at', hourAgo);
  if ((count || 0) > MAX_EMAILS_PER_HOUR) return res.status(200).json({ skipped: 'hourly cap' });

  let to = null;
  try {
    const { data: userData } = await admin.auth.admin.getUserById(rep.auth_id);
    to = userData?.user?.email || null;
  } catch (err) {
    console.error('notify-lead user lookup failed', err);
  }
  if (!to) return res.status(200).json({ skipped: 'no email on account' });

  const email = buildLeadEmail({ lead, rep, siteUrl: SITE_URL });
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error: sendError } = await resend.emails.send({
    from: process.env.LEADS_FROM_EMAIL || 'ProPages <leads@propages.pro>',
    to,
    subject: email.subject,
    html: email.html,
    text: email.text,
    ...(email.replyTo && { replyTo: email.replyTo }),
  });
  if (sendError) {
    console.error('notify-lead send failed', sendError);
    return res.status(502).json({ error: 'send failed' });
  }
  return res.status(200).json({ sent: true });
}
