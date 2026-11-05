// The site's public address. propages.pro is live (Nov 2026).
// NEXT_PUBLIC_SITE_URL overrides it (e.g. for a preview deploy).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://propages.pro').replace(/\/$/, '');
// What we print in front of a handle: "propages.pro/jake-rivera".
export const DOMAIN = SITE_URL.replace(/^https?:\/\//, '');
