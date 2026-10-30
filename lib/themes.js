// ─── ProPages Theme Packs — v2 (Oct 30 2026) ─────────────────────────────────
//
// Replaces the original theme packs. Every existing variable name is kept
// (block renderers depend on them); values change only where they failed
// contrast. New tokens support the Billboard hero, lit CTAs and form fields.
//
// Changed values (all were below WCAG AA):
//   slate.--pp-text-3    #8899AA → #5E6B7A   (2.7:1 → 5.0:1 on bg)
//   turf.--pp-text-3     #7A9485 → #56705F   (3.0:1 → 5.0:1)
//   voltage.--pp-text-3  #6070A0 → #8291BD   (4.0:1 → 6.2:1)
//   voltage.--pp-accent  #4A7CFF → #3366F0   (white button text 3.7:1 → 4.9:1)
//
// New tokens (every pack):
//   --pp-accent-2     lighter companion to the accent: top of the CTA gradient
//   --pp-cta-bg       the CTA fill (gradient accent-2 → accent), so CTAs are never flat
//   --pp-cta-shadow   soft colored drop under CTAs
//   --pp-line-strong  borders for inputs/chips — ≥3:1 against bg, surface and input
//   --pp-input        input field background
//   --pp-icon         icon color on --pp-accent-soft tiles
//   --pp-hi-swipe     highlighter stroke behind the hero's key phrase (light packs)
//   --pp-hi-text      color of the hero's key phrase
//   --pp-star         rating stars
//
// Measured contrast (text on bg unless noted):
//   slate    body 17.5 · secondary 7.0 · muted 5.0 · button ≥8.4 · field border 3.1
//   turf     body 16.4 · secondary 7.8 · muted 5.0 · button ≥4.9 · field border 3.0
//   solar    body 16.7 · secondary 10.0 · muted 6.2 · button ≥8.9 · field border 3.2 (on input)
//   voltage  body 17.5 · secondary 8.3 · muted 6.2 · button 4.9 (gradient top 3.7, passes as large bold text) · field border 3.5 (on input)

export const THEMES = {

  // ── Slate (light default) ──────────────────────────────────────────────────
  slate: {
    label: 'Slate',
    mode: 'light',
    description: 'Clean and professional',
    preview: { bg: '#F4F6F8', accent: '#1D3461', surface: '#FFFFFF' },
    vars: {
      '--pp-bg':          '#F4F6F8',
      '--pp-bg-deep':     '#E8ECF0',
      '--pp-surface':     '#FFFFFF',
      '--pp-surface-2':   '#F0F3F6',
      '--pp-border':      'rgba(0,0,0,0.08)',
      '--pp-text':        '#0D1117',
      '--pp-text-2':      '#4A5568',
      '--pp-text-3':      '#5E6B7A',
      '--pp-accent':      '#1D3461',
      '--pp-accent-soft': 'rgba(29,52,97,0.08)',
      '--pp-accent-text': '#FFFFFF',
      '--pp-gold':        '#F5A623',
      '--pp-font':        "'DM Sans', sans-serif",
      '--pp-accent-2':    '#2B4C8C',
      '--pp-cta-bg':      'linear-gradient(180deg, #2B4C8C 0%, #1D3461 100%)',
      '--pp-cta-shadow':  '0 10px 24px -12px rgba(29,52,97,0.6)',
      '--pp-line-strong': '#858E9A',
      '--pp-input':       '#FFFFFF',
      '--pp-icon':        '#1D3461',
      '--pp-hi-swipe':    'rgba(245,166,35,0.45)',
      '--pp-hi-text':     '#0D1117',
      '--pp-star':        '#B7791F',
    },
  },

  // ── Turf (light) ──────────────────────────────────────────────────────────
  turf: {
    label: 'Turf',
    mode: 'light',
    description: 'Earthy and reliable',
    preview: { bg: '#F3F6F2', accent: '#2D6A4F', surface: '#FFFFFF' },
    vars: {
      '--pp-bg':          '#F3F6F2',
      '--pp-bg-deep':     '#E6EDE4',
      '--pp-surface':     '#FFFFFF',
      '--pp-surface-2':   '#EEF3EC',
      '--pp-border':      'rgba(0,0,0,0.08)',
      '--pp-text':        '#0D1A10',
      '--pp-text-2':      '#3A5243',
      '--pp-text-3':      '#56705F',
      '--pp-accent':      '#2D6A4F',
      '--pp-accent-soft': 'rgba(45,106,79,0.10)',
      '--pp-accent-text': '#FFFFFF',
      '--pp-gold':        '#D4A017',
      '--pp-font':        "'DM Sans', sans-serif",
      '--pp-accent-2':    '#3A7D5D',
      '--pp-cta-bg':      'linear-gradient(180deg, #3A7D5D 0%, #2D6A4F 100%)',
      '--pp-cta-shadow':  '0 10px 24px -12px rgba(45,106,79,0.6)',
      '--pp-line-strong': '#7F9286',
      '--pp-input':       '#FFFFFF',
      '--pp-icon':        '#2D6A4F',
      '--pp-hi-swipe':    'rgba(212,160,23,0.40)',
      '--pp-hi-text':     '#0D1A10',
      '--pp-star':        '#A87C0B',
    },
  },

  // ── Solar (dark) ──────────────────────────────────────────────────────────
  solar: {
    label: 'Solar',
    mode: 'dark',
    description: 'Premium and high-energy',
    preview: { bg: '#0A1628', accent: '#F5A623', surface: '#161B22' },
    vars: {
      '--pp-bg':          '#0A1628',
      '--pp-bg-deep':     '#060E1A',
      '--pp-surface':     '#161B22',
      '--pp-surface-2':   '#1D2530',
      '--pp-border':      'rgba(255,255,255,0.08)',
      '--pp-text':        '#F8F5EE',
      '--pp-text-2':      '#C8BFB0',
      '--pp-text-3':      '#8899AA',
      '--pp-accent':      '#F5A623',
      '--pp-accent-soft': 'rgba(245,166,35,0.12)',
      '--pp-accent-text': '#0A1628',
      '--pp-gold':        '#F5A623',
      '--pp-font':        "'DM Sans', sans-serif",
      '--pp-accent-2':    '#FFC14D',
      '--pp-cta-bg':      'linear-gradient(180deg, #FFC14D 0%, #F5A623 100%)',
      '--pp-cta-shadow':  '0 10px 28px -10px rgba(245,166,35,0.55)',
      '--pp-line-strong': '#6A7383',
      '--pp-input':       '#1D2530',
      '--pp-icon':        '#F5A623',
      '--pp-hi-swipe':    'transparent',
      '--pp-hi-text':     '#F5A623',
      '--pp-star':        '#F5A623',
    },
  },

  // ── Voltage (dark) ────────────────────────────────────────────────────────
  voltage: {
    label: 'Voltage',
    mode: 'dark',
    description: 'Modern and high-tech',
    preview: { bg: '#0A0E1A', accent: '#3366F0', surface: '#111827' },
    vars: {
      '--pp-bg':          '#0A0E1A',
      '--pp-bg-deep':     '#05080F',
      '--pp-surface':     '#111827',
      '--pp-surface-2':   '#1A2235',
      '--pp-border':      'rgba(255,255,255,0.07)',
      '--pp-text':        '#F0F4FF',
      '--pp-text-2':      '#A0AABF',
      '--pp-text-3':      '#8291BD',
      '--pp-accent':      '#3366F0',
      '--pp-accent-soft': 'rgba(74,124,255,0.14)',
      '--pp-accent-text': '#FFFFFF',
      '--pp-gold':        '#4A7CFF',
      '--pp-font':        "'DM Sans', sans-serif",
      '--pp-accent-2':    '#4A7CFF',
      '--pp-cta-bg':      'linear-gradient(180deg, #4A7CFF 0%, #3366F0 100%)',
      '--pp-cta-shadow':  '0 10px 28px -10px rgba(51,102,240,0.6)',
      '--pp-line-strong': '#68759A',
      '--pp-input':       '#1A2235',
      '--pp-icon':        '#7FA2FF',
      '--pp-hi-swipe':    'transparent',
      '--pp-hi-text':     '#7FA2FF',
      '--pp-star':        '#7FA2FF',
    },
  },

};

// Default theme for new signups
export const DEFAULT_THEME = 'slate';

// Helper: get a theme by key, falling back to slate
export function getTheme(key) {
  return THEMES[key] || THEMES.slate;
}

// Helper: generate a <style> block string from a theme's vars
export function themeToCSS(key) {
  const theme = getTheme(key);
  const declarations = Object.entries(theme.vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');
  return `:root {\n${declarations}\n}`;
}
