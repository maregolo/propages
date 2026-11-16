// The site's public address. propages.pro is live (Nov 2026).
// NEXT_PUBLIC_SITE_URL overrides it (e.g. for a preview deploy).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://propages.pro').replace(/\/$/, '');
// What we print in front of a handle: "propages.pro/jake-rivera".
export const DOMAIN = SITE_URL.replace(/^https?:\/\//, '');

// Handles a rep can't take: every top-level page or route on the site.
export const RESERVED_SLUGS = [
  'api', 'certified', 'coaches', 'd2d', 'dashboard', 'privacy', 'realestate', 'reset',
  'setup', 'signup', 'terms', 'welcome', 'login', 'admin', 'leadmarket',
];
