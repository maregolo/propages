// ─── ProPages Theme Packs ─────────────────────────────────────────────────────
//
// Each theme defines CSS variable values injected into the rep page at render.
// Variable names must stay stable — block renderers depend on them.
//
// Naming convention for accents: one named color pack per theme.
// Light themes: Slate, Turf
// Dark themes:  Solar, Voltage

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
      '--pp-text-3':      '#8899AA',
      '--pp-accent':      '#1D3461',
      '--pp-accent-soft': 'rgba(29,52,97,0.08)',
      '--pp-accent-text': '#FFFFFF',
      '--pp-gold':        '#F5A623',
      '--pp-font':        "'DM Sans', sans-serif",
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
      '--pp-text-3':      '#7A9485',
      '--pp-accent':      '#2D6A4F',
      '--pp-accent-soft': 'rgba(45,106,79,0.08)',
      '--pp-accent-text': '#FFFFFF',
      '--pp-gold':        '#D4A017',
      '--pp-font':        "'DM Sans', sans-serif",
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
      '--pp-accent-soft': 'rgba(245,166,35,0.10)',
      '--pp-accent-text': '#0A1628',
      '--pp-gold':        '#F5A623',
      '--pp-font':        "'DM Sans', sans-serif",
    },
  },

  // ── Voltage (dark) ────────────────────────────────────────────────────────
  voltage: {
    label: 'Voltage',
    mode: 'dark',
    description: 'Modern and high-tech',
    preview: { bg: '#0A0E1A', accent: '#4A7CFF', surface: '#111827' },
    vars: {
      '--pp-bg':          '#0A0E1A',
      '--pp-bg-deep':     '#05080F',
      '--pp-surface':     '#111827',
      '--pp-surface-2':   '#1A2235',
      '--pp-border':      'rgba(255,255,255,0.07)',
      '--pp-text':        '#F0F4FF',
      '--pp-text-2':      '#A0AABF',
      '--pp-text-3':      '#6070A0',
      '--pp-accent':      '#4A7CFF',
      '--pp-accent-soft': 'rgba(74,124,255,0.10)',
      '--pp-accent-text': '#FFFFFF',
      '--pp-gold':        '#4A7CFF',
      '--pp-font':        "'DM Sans', sans-serif",
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