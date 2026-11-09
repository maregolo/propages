// How a lead wants to be reached, and how a visitor can message a rep.
// Shared by the rep page form, its editor, the dashboard and the lead email.
//
// Two features:
//   A. Contact method on the lead form. The visitor picks call/text (always
//      offered), Instagram, Facebook, WhatsApp or email and leaves the matching
//      detail. Saved in leads.contact_method + leads.contact_handle.
//   B. "Message me" buttons. Deep links that open the visitor's own app in a
//      conversation with the rep. No API, nothing is sent by ProPages; taps are
//      counted in block_events (event_type 'dm_click', label = channel).
//
// Meta's messaging APIs can't start a conversation with someone who hasn't
// messaged first, so for A the rep always sends the first DM from their own app.

export const CONTACT_METHODS = {
  phone:     { label: 'Call or text', short: 'Call/text', icon: 'phone',     field: 'Phone number',       placeholder: '(555) 555-0100' },
  instagram: { label: 'Instagram',    short: 'Instagram', icon: 'instagram', field: 'Your Instagram',     placeholder: '@yourname' },
  facebook:  { label: 'Facebook',     short: 'Facebook',  icon: 'facebook',  field: 'Your Facebook name', placeholder: 'Name or profile link' },
  whatsapp:  { label: 'WhatsApp',     short: 'WhatsApp',  icon: 'whatsapp',  field: 'WhatsApp number',    placeholder: '(555) 555-0100' },
  email:     { label: 'Email',        short: 'Email',     icon: 'mail',      field: 'Email',              placeholder: 'you@example.com' },
};

// Offered on any form whose rep hasn't chosen yet (new and existing pages).
export const SUGGESTED_METHODS = ['phone', 'instagram', 'facebook', 'email'];

export const digits = (s) => String(s || '').replace(/\D/g, '');

// "@Kevin.M", "instagram.com/kevin.m/", "https://www.instagram.com/kevin.m?igsh=…" → "kevin.m"
export function cleanHandle(method, raw) {
  const v = String(raw || '').trim();
  if (!v) return '';
  if (method === 'instagram') {
    const m = v.match(/instagram\.com\/([A-Za-z0-9._]+)/i);
    return (m ? m[1] : v.replace(/^@+/, '')).replace(/[^A-Za-z0-9._]/g, '').slice(0, 30).toLowerCase();
  }
  if (method === 'facebook') {
    // Keep a profile link as a link; otherwise it's a name the rep searches for.
    const m = v.match(/(?:facebook|fb)\.com\/(.+)/i);
    if (m) {
      const [path, query = ''] = m[1].replace(/^\/+/, '').split('#')[0].split('?');
      // profile.php links need their ?id=…; vanity links don't need any query.
      const id = /^profile\.php/.test(path) && new URLSearchParams(query).get('id');
      return `https://www.facebook.com/${path.replace(/\/+$/, '')}${id ? `?id=${id}` : ''}`;
    }
    return v.replace(/^@+/, '').slice(0, 80);
  }
  if (method === 'phone' || method === 'whatsapp') return v.slice(0, 32);
  if (method === 'email') return v.toLowerCase().slice(0, 254);
  return v.slice(0, 80);
}

export function validateContact(method, value) {
  const v = String(value || '').trim();
  if (method === 'phone' || method === 'whatsapp') return digits(v).length >= 7 ? '' : 'Add a phone number we can reach you at.';
  if (method === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Add a valid email address.';
  if (method === 'instagram') return cleanHandle('instagram', v) ? '' : 'Add your Instagram username.';
  if (method === 'facebook') return v.length >= 2 ? '' : 'Add your Facebook name or profile link.';
  return '';
}

// Where the rep goes to reach this lead (dashboard + email).
export function leadContactLink(method, handle) {
  const h = String(handle || '').trim();
  if (!h) return null;
  if (method === 'instagram') return { href: `https://ig.me/m/${encodeURIComponent(h)}`, text: `@${h}`, action: 'Open DM' };
  if (method === 'facebook') {
    if (/^https?:\/\//.test(h)) return { href: h, text: h.replace(/^https?:\/\/(www\.)?/, ''), action: 'Open profile' };
    return { href: `https://www.facebook.com/search/people/?q=${encodeURIComponent(h)}`, text: h, action: 'Find on Facebook' };
  }
  if (method === 'whatsapp') return { href: `https://wa.me/${digits(h).length === 10 ? '1' + digits(h) : digits(h)}`, text: h, action: 'Open WhatsApp' };
  return null;
}

// ── "Message me" buttons (feature B) ─────────────────────────────────────────

// US numbers typed without a country code get +1 (ProPages is US-only today).
export function e164(raw) {
  const d = digits(raw);
  if (!d) return '';
  return d.length === 10 ? `1${d}` : d;
}

function instagramUser(url) {
  const m = String(url || '').match(/instagram\.com\/([A-Za-z0-9._]+)/i);
  return m ? m[1] : '';
}

function facebookUser(url) {
  try {
    const u = new URL(url);
    if (!/(^|\.)(facebook|fb)\.com$/i.test(u.hostname)) return '';
    const seg = u.pathname.split('/').filter(Boolean)[0] || '';
    if (!seg || seg === 'profile.php' || seg === 'people' || seg === 'pages') return '';
    return seg;
  } catch {
    return '';
  }
}

// Builds the rep's message buttons from the form settings and the rep's own
// profile links (Links block), so handles are never entered twice.
//   settings: { instagram: bool, facebook: bool, whatsapp: '555…', text: '555…' }
export function messageButtons(settings, profileLinks, greeting) {
  const s = settings || {};
  const find = (re) => (profileLinks || []).map(l => l.url).find(u => re.test(String(u)));
  const out = [];
  const ig = s.instagram && instagramUser(find(/instagram\.com/i));
  if (ig) out.push({ channel: 'instagram', label: 'Message on Instagram', href: `https://ig.me/m/${ig}` });
  const fb = s.facebook && facebookUser(find(/(facebook|fb)\.com/i));
  if (fb) out.push({ channel: 'facebook', label: 'Message on Messenger', href: `https://m.me/${fb}` });
  const wa = e164(s.whatsapp);
  if (wa) out.push({ channel: 'whatsapp', label: 'Message on WhatsApp', href: `https://wa.me/${wa}${greeting ? `?text=${encodeURIComponent(greeting)}` : ''}` });
  const tx = e164(s.text);
  // "?&body=" is the form both iOS and Android Messages accept.
  if (tx) out.push({ channel: 'text', label: 'Send a text', href: `sms:+${tx}${greeting ? `?&body=${encodeURIComponent(greeting)}` : ''}` });
  return out;
}

// Which of the rep's profiles can power a message button (editor hints).
export function messageSources(profileLinks) {
  const find = (re) => (profileLinks || []).map(l => l.url).find(u => re.test(String(u)));
  return { instagram: instagramUser(find(/instagram\.com/i)), facebook: facebookUser(find(/(facebook|fb)\.com/i)) };
}
