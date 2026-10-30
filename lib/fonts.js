// Site typeface: Outfit (variable, self-hosted). See claude/BRAND.md.
//
// The three metric overrides center capitals in the line box the way the old
// Inter/Inter Tight setup did, so headline spacing and line breaks hold.
// A plain Google Fonts <link> can't set these, which is why this is local.
//
// Usage (pages/_app.js): add `outfit.variable` to a wrapping element's
// className; styles/tokens.css reads it through var(--font-outfit).
import localFont from 'next/font/local';

export const outfit = localFont({
  src: '../public/fonts/Outfit-Variable.woff2',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
  variable: '--font-outfit',
  declarations: [
    { prop: 'ascent-override', value: '94.3%' },
    { prop: 'descent-override', value: '26.7%' },
    { prop: 'line-gap-override', value: '0%' },
  ],
});
