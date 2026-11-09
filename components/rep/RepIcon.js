// Icons for rep pages: line icons (24×24, stroke = currentColor) for link rows
// and owner tools, plus filled platform logos for the social chip row.
//
// Links used to store an emoji in `icon`. Those still work: EMOJI_TO_ICON maps
// each one the industry defaults and setup ever wrote to a line icon. New links
// store the icon name itself (e.g. "calendar").

import { BRAND_PATHS } from './brandPaths';
import { socialPlatform } from '../../lib/repBlocks';

const LINE = {
  calendar: <><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>,
  phone: <path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A17 17 0 0 1 4.5 5.5a2 2 0 0 1 2-2z" />,
  chat: <path d="M4 5h16v11H9l-5 4z" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
  home: <><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /></>,
  image: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="M21 16l-5-5-9 9" /></>,
  camera: <><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></>,
  video: <><rect x="3" y="6" width="13" height="12" rx="2" /><path d="M16 10l5-3v10l-5-3" /></>,
  star: <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z" />,
  bolt: <path d="M13 3L5 13.5h6L10 21l8-10.5h-6z" />,
  dollar: <><path d="M12 3v18" /><path d="M16.5 7.5c-.6-1.5-2.3-2.5-4.5-2.5-2.6 0-4.5 1.4-4.5 3.4 0 4.6 9.5 2.3 9.5 7.2 0 2-2 3.4-5 3.4-2.4 0-4.2-1-4.8-2.6" /></>,
  chart: <path d="M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-3" />,
  doc: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4M9 12h6M9 16h6" /></>,
  book: <><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M4 21V5M19 19v2H6" /></>,
  shield: <path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z" />,
  tool: <path d="M14.5 5.5a4 4 0 0 0-5 5L4 16l4 4 5.5-5.5a4 4 0 0 0 5-5l-2.5 2.5-2.5-.5-.5-2.5z" />,
  leaf: <><path d="M5 19c0-9 6-14 15-14 0 9-5 15-14 15" /><path d="M5 19l8-8" /></>,
  heart: <path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.5 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z" />,
  graduation: <><path d="M2.5 9L12 4.5 21.5 9 12 13.5z" /><path d="M6.5 11v5c1.5 1.5 3.4 2.2 5.5 2.2s4-.7 5.5-2.2v-5M21.5 9v5" /></>,
  brush: <><path d="M14 4l6 6-7.5 7.5-6-6z" /><path d="M6.5 11.5c-2 0-3 1.5-3 3.5S3 19 2.5 20.5c2 .5 6.5 0 7.5-2.5" /></>,
  headphones: <><path d="M4 15v-3a8 8 0 0 1 16 0v3" /><rect x="3" y="14" width="4" height="6" rx="1.5" /><rect x="17" y="14" width="4" height="6" rx="1.5" /></>,
  lock: <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  box: <><path d="M3.5 7.5L12 3l8.5 4.5v9L12 21l-8.5-4.5z" /><path d="M3.5 7.5L12 12l8.5-4.5M12 12v9" /></>,
  pin: <><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  question: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17h.01" /></>,
  snow: <path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.5L12 7l2.5-2.5M9.5 19.5L12 17l2.5 2.5" />,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.7 3.5 5.7 3.5 9s-1 6.3-3.5 9c-2.5-2.7-3.5-5.7-3.5-9s1-6.3 3.5-9z" /></>,
  link: <><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></>,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M3 12.5h18" /></>,

  // Owner tools
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowLeft: <path d="M19 12H5M11 6l-6 6 6 6" />,
  chevronRight: <path d="M9 6l6 6-6 6" />,
  up: <path d="M12 19V5M6 11l6-6 6 6" />,
  down: <path d="M12 5v14M6 13l6 6 6-6" />,
  eye: <><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="3" /></>,
  eyeOff: <><path d="M4 4l16 16" /><path d="M10 6c.6-.1 1.3-.2 2-.2 6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.6 3.4M6.3 7.6A16 16 0 0 0 2.5 12s3.5 6.5 9.5 6.5c1.6 0 3-.4 4.2-1" /></>,
  trash: <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />,
  plus: <path d="M12 5v14M5 12h14" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  edit: <><path d="M4 20h4L19 9l-4-4L4 16v4z" /><path d="M13.5 6.5l4 4" /></>,
  undo: <><path d="M9 14L4 9l5-5" /><path d="M4 9h10a6 6 0 0 1 0 12h-3" /></>,
  palette: <><path d="M12 3a9 9 0 0 0 0 18c1.4 0 2-1 2-2s-1-1.5-1-2.5S14 15 15 15h2a4 4 0 0 0 4-4c0-4.4-4-8-9-8z" /><circle cx="7.5" cy="11" r="1" fill="currentColor" /><circle cx="10.5" cy="7" r="1" fill="currentColor" /><circle cx="15.5" cy="7.5" r="1" fill="currentColor" /></>,
  share: <><path d="M12 15V3M7 8l5-5 5 5" /><path d="M5 12v8h14v-8" /></>,
  qr: <><rect x="3.5" y="3.5" width="7" height="7" rx="1" /><rect x="13.5" y="3.5" width="7" height="7" rx="1" /><rect x="3.5" y="13.5" width="7" height="7" rx="1" /><path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 17h3v3" /></>,
  inbox: <><path d="M3 13l3-8h12l3 8v6H3z" /><path d="M3 13h5l1.5 2.5h5L16 13h5" /></>,
  logout: <path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10" />,
  external: <><path d="M14 4h6v6M20 4l-9 9" /><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></>,
  copy: <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" /></>,
  download: <><path d="M12 3v12M7 10l5 5 5-5" /><path d="M5 19h14" /></>,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  text: <path d="M5 6h14M5 12h14M5 18h9" />,
  hero: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 9h10M7 13h6" /></>,
  form: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h4" /></>,
  grid: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />,
  feed: <><rect x="4" y="3" width="16" height="8" rx="2" /><rect x="4" y="13" width="16" height="8" rx="2" /></>,
  sparkle: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7z" />,
};

// Icons a rep can pick for a link (owner editor), in display order.
export const LINK_ICON_CHOICES = [
  'calendar', 'phone', 'chat', 'mail', 'home', 'image', 'video', 'star',
  'dollar', 'chart', 'doc', 'book', 'shield', 'tool', 'bolt', 'leaf',
  'heart', 'graduation', 'brush', 'headphones', 'lock', 'box', 'pin',
  'question', 'globe', 'link',
];

const EMOJI_TO_ICON = {
  '📅': 'calendar', '📞': 'phone', '💬': 'chat', '📧': 'mail', '✉️': 'mail',
  '🏠': 'home', '🏡': 'home', '🏘️': 'home', '🪟': 'home',
  '📸': 'camera', '📷': 'camera', '🖼': 'image', '🖼️': 'image', '📹': 'video', '🎥': 'video', '🎵': 'video',
  '⭐': 'star', '⚡': 'bolt', '💰': 'dollar', '🧮': 'dollar', '📊': 'chart', '📈': 'chart',
  '📋': 'doc', '📄': 'doc', '✍️': 'doc', '📚': 'book', '📖': 'book',
  '🛡️': 'shield', '🔒': 'lock', '🛠️': 'tool', '🐜': 'shield', '🌱': 'leaf', '💉': 'heart',
  '🎓': 'graduation', '🎨': 'brush', '🎧': 'headphones', '📦': 'box', '❓': 'question',
  '❄️': 'snow', '🌐': 'globe', '🔗': 'link',
};

// Which line icon a link row shows: the URL wins for calls, email and booking
// links; then the stored icon (name or legacy emoji); then a plain link.
export function linkIconName(link) {
  const url = String(link?.url || '').toLowerCase();
  if (url.startsWith('tel:')) return 'phone';
  if (url.startsWith('sms:')) return 'chat';
  if (url.startsWith('mailto:')) return 'mail';
  if (/calendly\.com|cal\.com|acuityscheduling|squareup\.com\/appointments|youcanbook\.me/.test(url)) return 'calendar';
  const stored = String(link?.icon || '').trim();
  if (LINE[stored]) return stored;
  if (EMOJI_TO_ICON[stored]) return EMOJI_TO_ICON[stored];
  return 'link';
}

export default function RepIcon({ name, size = 22, strokeWidth = 2, style, className }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor"
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, ...style }} className={className}>
      {LINE[name] || LINE.link}
    </svg>
  );
}

// Filled platform logo, or a line fallback (LinkedIn, unknown platforms).
export function BrandIcon({ platform, size = 18 }) {
  const d = BRAND_PATHS[platform];
  if (!d) return <RepIcon name={platform === 'linkedin' ? 'briefcase' : 'globe'} size={size} />;
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} fill="currentColor" style={{ flexShrink: 0 }}>
      <path d={d} />
    </svg>
  );
}

export { socialPlatform };
