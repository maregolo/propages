// Block helpers for rep pages: the default stack, the Billboard hero
// conversion for older pages, and the rules for what visitors may see.
//
// Block shape (reps.blocks, jsonb): { id, type, visible, data }

export function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

// New pages: Hero → Links → Lead form → Reviews (the "Full rep page" board).
// Every block starts with empty data and falls back to industry defaults.
export function buildDefaultBlocks() {
  return [
    { id: generateId(), type: 'hero',         visible: true, data: {} },
    { id: generateId(), type: 'links',        visible: true, data: {} },
    { id: generateId(), type: 'lead_capture', visible: true, data: {} },
    { id: generateId(), type: 'testimonials', visible: true, data: {} },
  ];
}

const LEGACY_HERO_TYPES = ['profile', 'headline', 'stats'];

// Older pages have separate profile, headline and stats blocks. They render as
// one Billboard hero, at the position of the first of them. Nothing is written
// to the database here; the merged shape is saved the next time the rep edits.
//
// A page still in the old untouched default order (hero, form, reviews, links)
// also moves Links up under the hero, the new default. Any order the rep chose
// themselves is kept.
export function normalizeBlocks(blocks) {
  const list = Array.isArray(blocks) ? blocks : [];
  if (!list.some(b => LEGACY_HERO_TYPES.includes(b.type))) return list;

  const find = (type) => list.find(b => b.type === type);
  const profile = find('profile');
  const headline = find('headline');
  const stats = find('stats');
  const shown = (b) => b && b.visible !== false;

  const pd = profile?.data || {};
  const hd = headline?.data || {};
  const data = {};
  for (const k of ['headline', 'highlight', 'pitch', 'cta', 'ctaSub']) if (hd[k]) data[k] = hd[k];
  if (pd.photo_url) data.photo_url = pd.photo_url;
  if (shown(stats) && Array.isArray(stats.data?.stats) && stats.data.stats.length) data.stats = stats.data.stats;

  const hero = {
    id: (profile || headline || stats).id,
    type: 'hero',
    // Hidden only if the rep hid every part of it.
    visible: [profile, headline].some(shown) || (!profile && !headline),
    data,
  };

  const out = [];
  let placed = false;
  for (const b of list) {
    if (LEGACY_HERO_TYPES.includes(b.type)) {
      if (!placed) { out.push(hero); placed = true; }
      continue;
    }
    out.push(b);
  }

  const order = out.map(b => b.type).join(',');
  if (order === 'hero,lead_capture,testimonials,links') {
    return [out[0], out[3], out[1], out[2]];
  }
  return out;
}

// ── What visitors may see ──────────────────────────────────────────────────
// Stats, reviews and links come only from what the rep entered. Industry
// samples for these show up in edit mode as placeholders, never publicly.

export function cleanStats(stats) {
  return (Array.isArray(stats) ? stats : [])
    .filter(s => s && String(s.number || '').trim() && String(s.label || '').trim());
}

export function cleanTestimonials(list) {
  return (Array.isArray(list) ? list : [])
    .filter(t => t && String(t.text || '').trim() && String(t.name || '').trim());
}

// A link is real once it points somewhere ("#" and blanks are the samples).
export function isRealUrl(url) {
  const u = String(url || '').trim();
  return u !== '' && u !== '#';
}

export function cleanLinks(list) {
  return (Array.isArray(list) ? list : [])
    .filter(l => l && String(l.title || '').trim() && isRealUrl(l.url));
}

// Make a typed URL usable: bare domains get https://, phone numbers become tel:,
// emails become mailto:. Anything with a scheme other than http(s)/tel/mailto
// is dropped (no javascript: links on public pages).
export function normalizeUrl(raw) {
  const v = String(raw || '').trim();
  if (!v || v === '#') return '';
  if (/^(https?:|tel:|mailto:)/i.test(v)) return v;
  if (/^[a-z][a-z0-9+.-]*:/i.test(v)) return '';
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return `mailto:${v}`;
  if (/^\+?[\d\s().-]{7,}$/.test(v)) return `tel:${v.replace(/[^\d+]/g, '')}`;
  return `https://${v}`;
}

// ── Social profiles ────────────────────────────────────────────────────────
// Links to a social profile render as chips above the link rows.

const SOCIAL_HOSTS = [
  ['instagram', /(^|\.)instagram\.com$/],
  ['facebook', /(^|\.)(facebook\.com|fb\.com)$/],
  ['tiktok', /(^|\.)tiktok\.com$/],
  ['youtube', /(^|\.)(youtube\.com|youtu\.be)$/],
  ['x', /(^|\.)(x\.com|twitter\.com)$/],
  ['linkedin', /(^|\.)linkedin\.com$/],
  ['threads', /(^|\.)threads\.(net|com)$/],
  ['pinterest', /(^|\.)pinterest\.com$/],
  ['yelp', /(^|\.)yelp\.com$/],
  ['nextdoor', /(^|\.)nextdoor\.com$/],
];

export function socialPlatform(url) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    const hit = SOCIAL_HOSTS.find(([, re]) => re.test(host));
    return hit ? hit[0] : null;
  } catch {
    return null;
  }
}

// A profile link (instagram.com/name), not a single post or video.
export function isSocialProfile(url) {
  const platform = socialPlatform(url);
  if (!platform) return false;
  try {
    const path = new URL(url).pathname.replace(/\/+$/, '');
    const parts = path.split('/').filter(Boolean);
    if (platform === 'youtube') return parts.length <= 2 && !/watch|shorts|embed/.test(path);
    if (platform === 'linkedin') return parts[0] === 'in' || parts[0] === 'company';
    if (platform === 'facebook') return parts.length <= 1 || parts[0] === 'profile.php';
    return parts.length === 1;
  } catch {
    return false;
  }
}

export function initialsOf(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}

export function firstName(name) {
  return String(name || '').trim().split(/\s+/)[0] || '';
}
