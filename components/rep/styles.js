// Rep page styles.
//
// Two systems, kept apart on purpose:
//   .rp-*  the public page. Colors come only from the theme pack (--pp-*,
//          lib/themes.js, injected per page), type is the pack's --pp-font.
//          Built to the "Full rep page" boards (Billboard hero).
//   .ow-*  owner tools (edit bars, editors, menu, toasts). App chrome:
//          --site-* tokens + Outfit, the same look as setup and the dashboard,
//          so they read the same on every theme and never blend into the page.

export const REP_STYLES = `
  .rp {
    --rp-line2: color-mix(in srgb, var(--pp-text) 18%, transparent);
    min-height: 100vh; background: var(--pp-bg); color: var(--pp-text);
    font-family: var(--pp-font); -webkit-font-smoothing: antialiased;
  }
  html:has(.rp) { scroll-behavior: smooth; background: var(--pp-bg); }
  @media (prefers-reduced-motion: reduce) { html:has(.rp) { scroll-behavior: auto; } }
  .rp :where(a) { color: inherit; }
  .rp :focus-visible { outline: 3px solid var(--pp-icon); outline-offset: 2px; }
  .rp-main { max-width: 480px; margin: 0 auto; padding: 28px 20px 0; display: flex; flex-direction: column; gap: 56px; }
  .rp-main.is-owner { padding-top: 76px; }
  .rp-main.is-editing { padding-top: 84px; gap: 28px; }
  .rp-main > div:empty { display: none; }
  .rp-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

  /* ── Hero (Billboard) ── */
  .rp-hero { display: flex; flex-direction: column; gap: 22px; }
  .rp-id { display: flex; align-items: center; gap: 14px; }
  .rp-avatar { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; object-position: 50% 25%; flex-shrink: 0; display: block;
    box-shadow: 0 0 0 3px var(--pp-bg), 0 0 0 5px var(--pp-accent); }
  .rp-avatar--initials { display: flex; align-items: center; justify-content: center; background: var(--pp-accent-soft); color: var(--pp-icon);
    font-size: 22px; font-weight: 800; letter-spacing: -0.01em; }
  .rp-id-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .rp-name { font-size: 19px; font-weight: 700; letter-spacing: -0.01em; }
  .rp-role { font-size: 14px; font-weight: 500; color: var(--pp-text-2); }
  .rp-badge { align-self: flex-start; display: inline-flex; align-items: center; gap: 6px; margin-top: 4px; font-size: 12px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase; color: var(--pp-icon); }
  .rp-h1 { margin: 0; font-size: 46px; line-height: 45px; font-weight: 800; letter-spacing: -0.035em; text-wrap: balance; overflow-wrap: break-word; }
  .rp-hi { color: var(--pp-hi-text); background: linear-gradient(transparent 60%, var(--pp-hi-swipe) 60%); -webkit-box-decoration-break: clone; box-decoration-break: clone; }
  .rp-pitch { margin: 0; font-size: 17px; line-height: 1.55; color: var(--pp-text-2); }
  .rp-cta-wrap { display: flex; flex-direction: column; gap: 10px; }
  .rp-cta { min-height: 60px; padding: 10px 20px; border-radius: 14px; background: var(--pp-cta-bg); color: var(--pp-accent-text); text-decoration: none;
    display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 19px; font-weight: 700; text-align: center;
    box-shadow: var(--pp-cta-shadow); border: none; font-family: inherit; cursor: pointer; transition: transform .15s ease, filter .15s ease; }
  .rp-cta:hover { transform: translateY(-1px); filter: brightness(1.04); }
  .rp-cta:active { transform: translateY(0); }
  .rp-cta-sub { text-align: center; font-size: 14px; color: var(--pp-text-2); }
  .rp-stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border-top: 1px solid var(--rp-line2); padding-top: 16px; }
  .rp-stat { display: flex; flex-direction: column; gap: 2px; padding: 0 10px; border-left: 1px solid var(--rp-line2); min-width: 0; }
  .rp-stat:first-child { padding-left: 0; border-left: none; }
  .rp-stat-n { font-size: 24px; line-height: 28px; font-weight: 800; letter-spacing: -0.02em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .rp-stat-n .rp-star { color: var(--pp-star); }
  .rp-stat-l { font-size: 13px; line-height: 1.3; color: var(--pp-text-2); }

  /* ── Links ── */
  .rp-links { display: flex; flex-direction: column; gap: 10px; }
  .rp-chips { display: grid; gap: 8px; margin-bottom: 6px; }
  .rp-chip { min-height: 44px; padding: 0 8px; border-radius: 9999px; border: 1.5px solid var(--rp-line2); background: var(--pp-surface);
    color: var(--pp-text); text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 7px;
    font-size: 14px; font-weight: 600; white-space: nowrap; min-width: 0; transition: border-color .15s ease; }
  .rp-chip:hover { border-color: var(--pp-icon); }
  .rp-chip > span:first-child { color: var(--pp-icon); display: flex; }
  .rp-chip > span:last-child { overflow: hidden; text-overflow: ellipsis; }
  .rp-link { display: flex; align-items: center; gap: 14px; min-height: 72px; padding: 14px 16px; border-radius: 16px; background: var(--pp-surface);
    border: 1px solid var(--pp-border); text-decoration: none; color: var(--pp-text); transition: border-color .15s ease, transform .15s ease; }
  .rp-link:hover { border-color: var(--rp-line2); transform: translateY(-1px); }
  .rp-link-icon { width: 44px; height: 44px; border-radius: 12px; background: var(--pp-accent-soft); color: var(--pp-icon);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .rp-link-text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
  .rp-link-title { font-size: 16px; font-weight: 700; overflow-wrap: anywhere; }
  .rp-link-sub { font-size: 14px; color: var(--pp-text-2); overflow-wrap: anywhere; }
  .rp-link-go { color: var(--pp-text-2); display: flex; }

  /* ── Lead form ── */
  .rp-form { padding: 24px 20px; border-radius: 22px; background: var(--pp-surface); border: 1px solid var(--pp-border);
    display: flex; flex-direction: column; gap: 18px; scroll-margin-top: 20px; }
  .rp-form-head { display: flex; flex-direction: column; gap: 8px; }
  .rp-eyebrow { font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--pp-text-2); }
  .rp-h2 { margin: 0; font-size: 28px; line-height: 30px; font-weight: 800; letter-spacing: -0.025em; text-wrap: balance; }
  .rp-form-sub { margin: 0; font-size: 16px; line-height: 1.5; color: var(--pp-text-2); }
  .rp-fieldset { margin: 0; padding: 0; border: none; min-width: 0; }
  .rp-legend { padding: 0; margin-bottom: 10px; font-size: 16px; font-weight: 700; }
  .rp-opts { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
  .rp-opt { position: relative; min-height: 52px; border-radius: 14px; border: 2px solid var(--rp-line2); background: transparent; color: var(--pp-text);
    font-weight: 600; display: flex; align-items: center; justify-content: center; font-size: 16px; padding: 6px 10px; text-align: center; cursor: pointer; }
  .rp-opt.is-on { border-color: var(--pp-accent); background: var(--pp-accent-soft); font-weight: 700; }
  .rp-opt:focus-within { outline: 3px solid var(--pp-icon); outline-offset: 2px; }
  .rp-opt input { position: absolute; opacity: 0; width: 1px; height: 1px; }
  .rp-field { display: flex; flex-direction: column; gap: 8px; }
  .rp-label { font-size: 15px; font-weight: 600; }
  .rp-input { width: 100%; height: 54px; padding: 0 16px; border-radius: 12px; border: 1.5px solid var(--pp-line-strong); background: var(--pp-input);
    color: var(--pp-text); font-family: inherit; font-size: 17px; }
  .rp-input::placeholder { color: var(--pp-text-3); }
  .rp-input:focus { outline: none; border-color: var(--pp-icon); box-shadow: 0 0 0 3px var(--pp-accent-soft); }
  .rp-form-error { margin: 0; font-size: 15px; font-weight: 600; color: #D93A3A; }
  .rp[data-mode="dark"] .rp-form-error { color: #FF8A8A; }
  .rp-trust { display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 14px; color: var(--pp-text-2); text-align: center; }
  .rp-tcpa { margin: 0; font-size: 12px; line-height: 1.5; color: var(--pp-text-3); text-align: center; }
  .rp-tcpa a { text-decoration: underline; text-underline-offset: 2px; }
  .rp-done { display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center; padding: 12px 0 4px; }
  .rp-done-icon { width: 56px; height: 56px; border-radius: 50%; background: var(--pp-accent-soft); color: var(--pp-icon); display: flex; align-items: center; justify-content: center; }
  .rp-done p { margin: 0; font-size: 16px; color: var(--pp-text-2); line-height: 1.5; }

  /* ── Reviews ── */
  .rp-reviews { display: flex; flex-direction: column; gap: 14px; }
  .rp-reviews .rp-h2, .rp-section-h { font-size: 26px; line-height: 28px; letter-spacing: -0.02em; }
  .rp-review { margin: 0; padding: 20px; border-radius: 18px; background: var(--pp-surface); border: 1px solid var(--pp-border); display: flex; flex-direction: column; gap: 12px; }
  .rp-stars { color: var(--pp-star); font-size: 16px; letter-spacing: 2px; }
  .rp-review blockquote { margin: 0; font-size: 17px; line-height: 1.5; font-weight: 500; }
  .rp-review figcaption { display: flex; align-items: center; gap: 10px; }
  .rp-review-init { width: 36px; height: 36px; border-radius: 50%; background: var(--pp-accent-soft); color: var(--pp-icon); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; flex-shrink: 0; }
  .rp-review-who { display: flex; flex-direction: column; }
  .rp-review-name { font-size: 15px; font-weight: 700; }
  .rp-review-detail { font-size: 13px; color: var(--pp-text-2); }

  /* ── Other blocks ── */
  .rp-text { display: flex; flex-direction: column; gap: 10px; }
  .rp-text p { margin: 0; font-size: 17px; line-height: 1.6; color: var(--pp-text-2); white-space: pre-wrap; }
  .rp-video { position: relative; width: 100%; padding-top: 56.25%; border-radius: 16px; overflow: hidden; background: var(--pp-surface); border: 1px solid var(--pp-border); }
  .rp-video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
  .rp-caption { margin: 8px 0 0; font-size: 14px; color: var(--pp-text-2); text-align: center; }
  .rp-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
  .rp-grid img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 12px; display: block; }
  .rp-carousel { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 6px; scroll-snap-type: x mandatory; scrollbar-width: none; }
  .rp-carousel::-webkit-scrollbar { display: none; }
  .rp-carousel img { flex-shrink: 0; width: 220px; height: 220px; object-fit: cover; border-radius: 14px; scroll-snap-align: start; }
  .rp-block-stack { display: flex; flex-direction: column; gap: 14px; }

  /* ── Footer ── */
  .rp-footer { margin: 0 -20px; padding: 32px 20px 44px; border-top: 1px solid var(--pp-border); display: flex; flex-direction: column; align-items: center; gap: 16px; }
  .rp-footer-cta { min-height: 48px; padding: 0 20px; border-radius: 9999px; border: 1.5px solid var(--rp-line2); text-decoration: none; color: var(--pp-text);
    display: inline-flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600; transition: border-color .15s ease; }
  .rp-footer-cta:hover { border-color: var(--pp-icon); }
  .rp-made { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; color: var(--pp-text-2); text-decoration: none; }

  @media (max-width: 360px) {
    .rp-h1 { font-size: 40px; line-height: 40px; }
    .rp-opts { grid-template-columns: 1fr; }
  }

  /* ═════════ Owner tools (app chrome) ═════════ */
  .ow { font-family: var(--site-font); -webkit-font-smoothing: antialiased; }
  .ow :focus-visible { outline: 2px solid var(--site-mint); outline-offset: 2px; }
  .ow button { font-family: inherit; }

  /* Sample content in edit mode */
  .ow-sample { position: relative; border-radius: 18px; outline: 2px dashed color-mix(in srgb, var(--pp-text) 30%, transparent); outline-offset: 8px; }
  .ow-sample > .ow-sample-content { opacity: 0.55; }
  .ow-sample-tag { display: inline-flex; align-items: center; gap: 6px; margin-bottom: 14px; padding: 6px 12px; border-radius: 9999px;
    background: var(--site-dark-2); color: var(--site-on-dark); font-family: var(--site-font); font-size: 13px; font-weight: 600; }
  .ow-sample-tag b { color: var(--site-mint); font-weight: 700; }

  /* Block toolbar */
  .ow-slot { position: relative; }
  .ow-bar { display: flex; align-items: center; gap: 4px; padding: 4px 4px 4px 14px; margin-bottom: 12px; border-radius: 9999px;
    background: var(--site-dark-2); color: var(--site-on-dark); box-shadow: 0 6px 18px -10px rgba(0,0,0,0.5); }
  .ow-bar-name { flex: 1; min-width: 0; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--site-on-dark-2);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ow-bar-name em { font-style: normal; color: var(--site-coral); margin-left: 6px; }
  .ow-iconbtn { width: 36px; height: 36px; border-radius: 50%; border: none; background: transparent; color: var(--site-on-dark);
    display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: background .15s ease, color .15s ease; }
  .ow-iconbtn:hover:not(:disabled) { background: rgba(255,255,255,0.1); }
  .ow-iconbtn:disabled { opacity: 0.3; cursor: default; }
  .ow-iconbtn.is-danger:hover { color: #FF8A8A; }
  .ow-iconbtn.is-on { background: var(--site-mint); color: var(--site-frame); }
  .ow-editable { cursor: pointer; border-radius: 18px; transition: box-shadow .15s ease; }
  .ow-editable:hover { box-shadow: 0 0 0 3px var(--pp-bg), 0 0 0 5px var(--site-mint); }
  .ow-hidden { opacity: 0.4; }

  /* Editor card */
  .ow-editor { background: var(--site-dark); color: var(--site-on-dark); border-radius: 22px; padding: 22px 20px; display: flex; flex-direction: column; gap: 16px;
    box-shadow: 0 18px 40px -24px rgba(0,0,0,0.6); }
  .ow-editor-title { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.02em; }
  .ow-editor-note { margin: -8px 0 0; font-size: 14px; line-height: 1.5; color: var(--site-on-dark-2); }
  .ow-field { display: flex; flex-direction: column; gap: 7px; min-width: 0; }
  .ow-label { font-size: 14px; font-weight: 600; color: var(--site-on-dark); }
  .ow-label small { font-weight: 500; color: var(--site-on-dark-2); margin-left: 6px; }
  .ow-hint { font-size: 13px; line-height: 1.45; color: var(--site-on-dark-2); }
  .ow-input { width: 100%; min-height: 48px; padding: 10px 14px; border-radius: var(--site-r-field); border: 1.5px solid transparent; background: #FFFFFF;
    color: var(--site-ink); font-family: var(--site-font); font-size: 16px; }
  textarea.ow-input { min-height: 96px; resize: vertical; line-height: 1.5; }
  .ow-input::placeholder { color: #7A8590; }
  .ow-input:focus { outline: none; border-color: var(--site-mint); box-shadow: 0 0 0 3px rgba(142,240,184,0.35); }
  .ow-row { display: grid; grid-template-columns: 2fr 3fr; gap: 8px; }
  .ow-group { display: flex; flex-direction: column; gap: 10px; padding: 14px; border-radius: 16px; background: var(--site-dark-2); }
  .ow-group-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
  .ow-group-title { font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--site-on-dark-2); }
  .ow-textbtn { background: none; border: none; padding: 6px 0; color: var(--site-on-dark-2); font-size: 14px; font-weight: 600; cursor: pointer;
    display: inline-flex; align-items: center; gap: 6px; }
  .ow-textbtn:hover { color: var(--site-on-dark); }
  .ow-textbtn.is-danger:hover { color: #FF8A8A; }
  .ow-addrow { min-height: 46px; border-radius: 12px; border: 1.5px dashed rgba(238,241,244,0.3); background: transparent; color: var(--site-on-dark);
    font-size: 15px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; }
  .ow-addrow:hover { border-color: var(--site-mint); color: var(--site-mint); }
  .ow-check { display: flex; align-items: center; gap: 10px; font-size: 15px; cursor: pointer; }
  .ow-check input { width: 18px; height: 18px; accent-color: var(--site-mint); }
  .ow-error { margin: 0; font-size: 14px; font-weight: 600; color: #FF9C9C; }
  .ow-actions { display: flex; gap: 10px; margin-top: 4px; }
  .ow-btn { min-height: 50px; padding: 0 20px; border-radius: 9999px; font-size: 16px; font-weight: 700; cursor: pointer; display: inline-flex;
    align-items: center; justify-content: center; gap: 8px; border: none; text-decoration: none; }
  .ow-btn--primary { flex: 1; background: var(--site-cta-bg); color: var(--site-frame); box-shadow: var(--site-cta-shadow); }
  .ow-btn--primary:disabled { opacity: 0.6; cursor: default; }
  .ow-btn--line { background: transparent; color: var(--site-on-dark); border: 1.5px solid rgba(238,241,244,0.35); }
  .ow-btn--line:hover { border-color: var(--site-on-dark); }
  .ow-icons { display: grid; grid-template-columns: repeat(auto-fill, minmax(40px, 1fr)); gap: 6px; }
  .ow-iconpick { height: 40px; border-radius: 10px; border: 1.5px solid transparent; background: rgba(255,255,255,0.06); color: var(--site-on-dark);
    display: flex; align-items: center; justify-content: center; cursor: pointer; }
  .ow-iconpick.is-on { border-color: var(--site-mint); background: rgba(142,240,184,0.14); color: var(--site-mint); }

  /* Add-block zone */
  .ow-add { display: flex; align-items: center; gap: 10px; padding: 2px 0; }
  .ow-add-line { flex: 1; height: 1px; background: color-mix(in srgb, var(--pp-text) 16%, transparent); }
  .ow-add-btn { display: inline-flex; align-items: center; gap: 6px; height: 34px; padding: 0 14px 0 10px; border-radius: 9999px; border: none;
    background: var(--site-dark-2); color: var(--site-on-dark); font-size: 14px; font-weight: 600; cursor: pointer; opacity: 0.7; transition: opacity .15s ease; }
  .ow-add-btn:hover, .ow-add-btn[aria-expanded="true"] { opacity: 1; }
  .ow-picker { margin-top: 10px; background: var(--site-dark); color: var(--site-on-dark); border-radius: 20px; padding: 18px 16px; display: flex; flex-direction: column; gap: 16px; }
  .ow-picker-head { display: flex; align-items: center; justify-content: space-between; }
  .ow-picker-head b { font-size: 16px; }
  .ow-picker-group { display: flex; flex-direction: column; gap: 6px; }
  .ow-picker-cat { font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--site-on-dark-2); margin-bottom: 2px; }
  .ow-pick { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 14px; background: var(--site-dark-2); border: 1.5px solid transparent;
    color: var(--site-on-dark); text-align: left; cursor: pointer; width: 100%; }
  .ow-pick:hover:not(:disabled) { border-color: var(--site-mint); }
  .ow-pick:disabled { opacity: 0.45; cursor: default; }
  .ow-pick-icon { width: 38px; height: 38px; border-radius: 10px; background: rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: var(--site-mint); }
  .ow-pick-text { display: flex; flex-direction: column; gap: 1px; }
  .ow-pick-text b { font-size: 15px; }
  .ow-pick-text span { font-size: 13px; color: var(--site-on-dark-2); }
  .ow-soon { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; color: var(--site-coral); margin-left: 6px; }

  /* Owner menu */
  .ow-top { position: fixed; top: 14px; left: 50%; transform: translateX(-50%); z-index: 200; width: min(calc(100% - 24px), 520px);
    display: flex; align-items: center; gap: 8px; padding: 6px 6px 6px 16px; border-radius: 9999px; background: var(--site-dark); color: var(--site-on-dark);
    box-shadow: 0 10px 30px -12px rgba(0,0,0,0.55); }
  .ow-top-title { flex: 1; min-width: 0; font-size: 15px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ow-top-title small { display: block; font-size: 12px; font-weight: 500; color: var(--site-on-dark-2); }
  .ow-top .ow-btn { min-height: 40px; padding: 0 16px; font-size: 15px; }
  .ow-top .ow-btn--primary { flex: 0 0 auto; }
  .ow-fab { position: fixed; top: 16px; right: 16px; z-index: 200; height: 44px; padding: 0 16px 0 12px; border-radius: 9999px; border: none;
    background: var(--site-dark); color: var(--site-on-dark); display: inline-flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 700;
    cursor: pointer; box-shadow: 0 10px 30px -12px rgba(0,0,0,0.55); }
  .ow-menu { position: fixed; top: 68px; right: 12px; z-index: 201; width: min(calc(100vw - 24px), 340px); max-height: calc(100vh - 84px); overflow-y: auto;
    background: var(--site-dark); color: var(--site-on-dark); border-radius: 22px; padding: 8px; box-shadow: 0 18px 50px -16px rgba(0,0,0,0.6); }
  .ow-editing .ow-menu { top: 70px; }
  .ow-menu-item { display: flex; align-items: center; gap: 12px; width: 100%; padding: 12px; border-radius: 14px; background: transparent; border: none;
    color: var(--site-on-dark); font-size: 15px; font-weight: 600; text-align: left; cursor: pointer; text-decoration: none; }
  .ow-menu-item:hover:not(:disabled) { background: var(--site-dark-2); }
  .ow-menu-item:disabled { opacity: 0.35; cursor: default; }
  .ow-menu-item > svg { color: var(--site-on-dark-2); }
  .ow-menu-item small { display: block; font-size: 13px; font-weight: 500; color: var(--site-on-dark-2); }
  .ow-menu-sep { height: 1px; margin: 6px 8px; background: rgba(238,241,244,0.12); }
  .ow-panel { display: flex; flex-direction: column; gap: 14px; padding: 8px 8px 10px; }
  .ow-panel-title { margin: 0; font-size: 18px; font-weight: 700; }
  .ow-qr { align-self: center; width: 200px; height: 200px; padding: 12px; border-radius: 16px; background: #FFFFFF; }
  .ow-qr svg, .ow-qr img { width: 100%; height: 100%; display: block; }
  .ow-url { display: flex; align-items: center; gap: 8px; padding: 12px 14px; border-radius: 12px; background: var(--site-dark-2); font-size: 15px; font-weight: 600; word-break: break-all; }
  .ow-panel .ow-actions { flex-wrap: wrap; }
  .ow-panel .ow-btn { flex: 1 1 140px; }
  .ow-themes { display: flex; flex-direction: column; gap: 10px; }

  /* Toast + welcome */
  .ow-toast { position: fixed; left: 50%; bottom: 20px; transform: translateX(-50%); z-index: 300; width: min(calc(100% - 24px), 440px);
    display: flex; align-items: center; gap: 12px; padding: 12px 12px 12px 16px; border-radius: 18px; background: var(--site-dark); color: var(--site-on-dark);
    box-shadow: 0 16px 40px -14px rgba(0,0,0,0.6); animation: ow-up .35s ease both; }
  .ow-toast-text { flex: 1; min-width: 0; }
  .ow-toast-text b { display: block; font-size: 15px; color: var(--site-mint); white-space: nowrap; }
  .ow-toast-text span { display: block; font-size: 14px; color: var(--site-on-dark-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ow-toast .ow-btn { min-height: 40px; padding: 0 14px; font-size: 14px; }
  .ow-welcome { display: flex; gap: 12px; align-items: flex-start; padding: 16px; border-radius: 20px; background: var(--site-dark); color: var(--site-on-dark); }
  .ow-welcome-icon { width: 40px; height: 40px; border-radius: 12px; background: rgba(142,240,184,0.14); color: var(--site-mint); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .ow-welcome b { display: block; font-size: 16px; margin-bottom: 4px; }
  .ow-welcome p { margin: 0; font-size: 14px; line-height: 1.5; color: var(--site-on-dark-2); }
  @keyframes ow-up { from { opacity: 0; transform: translate(-50%, 12px); } to { opacity: 1; transform: translate(-50%, 0); } }
  @media (prefers-reduced-motion: reduce) { .ow-toast { animation: none; } .rp-cta, .rp-link { transition: none; } }
`;
