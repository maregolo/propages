# ProPages — Design Reference Package
*For Claude Design onboarding — pre-launch redesign, July 2026*

This document is the input package for Claude Design's onboarding step. It captures the design philosophy, constraints, and current-state inventory that should shape every generated direction. Attach this alongside: `lib/themes.js`, `components/ThemePicker.js`, and web captures of the live surfaces listed in Section 4.

---

## 1. Product & audience

**What it is:** ProPages is "Linktree for business" — a ten-minute professional presence for people who have never had a website: sales reps, contractors, freelancers, independent operators. Channel-agnostic, not exclusive to any one vertical, though the initial ICP and origin story is door-to-door sales.

**Positioning line:** *A link-in-bio for sales pros — a foothold into the internet for people who've never had one, packaged as something simple, beautiful, and immediately useful.*

**Who's looking at it, and how:**
- The **rep** — sees it on setup, in the editor, on their dashboard. Wants to feel proud to share it. Likely mobile-first, likely not design-literate, values speed and confidence over customization depth.
- The **visitor / lead** (homeowner, client, prospect) — sees only the public rep page. Never sees the editor. Trust and legitimacy matter more to this audience than polish for its own sake.
- The **prospective rep** — sees the marketing homepage and ad landing pages before signing up. Needs to be sold in seconds, on mobile, often from an ad click.

Design should read as "professional, trustworthy, quietly confident" — not flashy SaaS, not generic Linktree clone.

---

## 2. Design philosophy (non-negotiable, carry into every direction)

- **Restraint as a feature.** Beautiful-by-default is the brand promise. Named theme packs only — no free-form color pickers, no user-exposed customization that could produce an ugly page. This constraint should survive the redesign; it is not up for exploration.
- **Dark theme as primary differentiator** — the default hardcoded aesthetic (pre-theme-system) was near-black with warm amber accents. Even where light packs exist, the brand's gravitational center is dark, moody, premium.
- **Patterns to actively steal / lean into:**
  - Social proof placed *above* the fold, not buried
  - Fused input + CTA (single combined element: `propages.com/yourname` field feeding directly into the button), not two separate buttons
  - Keyword underline accent on headlines (a single word or phrase gets an accent-color underline, not the whole headline)
  - An objection-buster ticker — a scrolling strip addressing doubts/objections in motion, not static text
  - Near-black backgrounds with negative letter-spacing on display type for a premium, tightened feel
- **Patterns to avoid:**
  - Full-pill border-radius on everything (reads generic/templated)
  - Radial "blob" gradient backgrounds (overused SaaS default)
  - 900-weight ultra-bold headlines (reads try-hard rather than confident)

---

## 3. Typography & the 4 theme packs (exact values from `lib/themes.js`)

- **Display font:** Bebas Neue — large headline type, names, stat numbers. Condensed, high letter-spacing on small labels.
- **Body font:** DM Sans — everything else. All 4 packs use the same font pairing (`--pp-font` is identical across packs); typography is not a per-pack variable today, only color.

### Slate — *"Clean and professional"* (light, default)
| Token | Value |
|---|---|
| Background | `#F4F6F8` / deep `#E8ECF0` |
| Surface | `#FFFFFF` / surface-2 `#F0F3F6` |
| Border | `rgba(0,0,0,0.08)` |
| Text | `#0D1117` primary, `#4A5568` secondary, `#8899AA` tertiary |
| Accent | `#1D3461` (navy), soft fill `rgba(29,52,97,0.08)`, on-accent text `#FFFFFF` |
| Gold | `#F5A623` |

### Turf — *"Earthy and reliable"* (light)
| Token | Value |
|---|---|
| Background | `#F3F6F2` / deep `#E6EDE4` |
| Surface | `#FFFFFF` / surface-2 `#EEF3EC` |
| Border | `rgba(0,0,0,0.08)` |
| Text | `#0D1A10` primary, `#3A5243` secondary, `#7A9485` tertiary |
| Accent | `#2D6A4F` (forest green), soft fill `rgba(45,106,79,0.08)`, on-accent text `#FFFFFF` |
| Gold | `#D4A017` |

### Solar — *"Premium and high-energy"* (dark)
| Token | Value |
|---|---|
| Background | `#0A1628` / deep `#060E1A` |
| Surface | `#161B22` / surface-2 `#1D2530` |
| Border | `rgba(255,255,255,0.08)` |
| Text | `#F8F5EE` primary, `#C8BFB0` secondary, `#8899AA` tertiary |
| Accent | `#F5A623` (amber), soft fill `rgba(245,166,35,0.10)`, on-accent text `#0A1628` |
| Gold | `#F5A623` (same as accent — this is the pack the original hardcoded aesthetic was drawn from) |

### Voltage — *"Modern and high-tech"* (dark)
| Token | Value |
|---|---|
| Background | `#0A0E1A` / deep `#05080F` |
| Surface | `#111827` / surface-2 `#1A2235` |
| Border | `rgba(255,255,255,0.07)` |
| Text | `#F0F4FF` primary, `#A0AABF` secondary, `#6070A0` tertiary |
| Accent | `#4A7CFF` (electric blue), soft fill `rgba(74,124,255,0.10)`, on-accent text `#FFFFFF` |
| Gold | `#4A7CFF` (same as accent — no separate warm tone in this pack) |

**Pattern across all 4 packs:** each defines exactly one accent shade — there is no separate two-tone gradient value (`--pp-gold` equals `--pp-accent` in both dark packs; in the light packs gold is a distinct warm tone, but still singular, not a gradient pair). This is *why* the CTA gradient currently goes flat on non-Slate themes at runtime — the two-tone `--sun`/`--sun-bright` gradient the rep-page CSS was originally written for only exists in the legacy hardcoded aesthetic, not in the pack system. **If a redesign direction wants a genuine two-tone/gradient CTA to survive across all themes, that requires adding a second accent-adjacent token to every pack in `lib/themes.js`** — worth deciding explicitly rather than let it be a repeat of the same simplification.

**Selection UI reference (`ThemePicker.js`):** each pack card shows a small preview swatch (background + surface block + accent bar), the pack label, a mode badge ("light"/"dark", teal on light packs, muted gray on dark packs), and the description string. Selected state uses a colored ring and checkmark in the pack's own accent color. This card pattern is worth preserving conceptually even if visually refreshed — it's the only place a rep chooses their entire page identity in one glance.

**Known technical constraint to flag to Claude Design:** legacy CSS variable names (`--sun`, `--sky`, `--accent`, `--muted`, `--card-bg`, `--card-border`, etc.) are used throughout the ~2,200-line rep page stylesheet. A live rep page's actual color output is determined by an override block (`themeOverrideCSS` in `_slug_.js`) that maps these legacy names to whichever `--pp-*` pack is active — not by any hardcoded values. Any redesign that touches the rep page needs to work through this variable system (either by extending it, or by finally migrating rules to reference `--pp-*` names directly), not by hardcoding new colors into individual rules.

---

## 4. Surface inventory (what to web-capture / screenshot for onboarding)

**Marketing:**
- `/` homepage — hero, proof bar, pain section, features, pricing, "how it works," invite form
- `/d2d` — D2D-specific ad landing page
- `/realestate` — real estate ad landing page
- `/coaches` — coaches ad landing page

**Signup & onboarding:**
- `/signup`
- `/setup` — 3-step flow: profile → theme picker → links

**App / product:**
- `/dashboard` — greeting, completion card, stats cards
- A live rep page (`/[slug]`) in **each** of the 4 theme packs — Slate, Turf, Solar, Voltage
- Rep page in **edit mode** — block-preview-editable states, add-block zones, owner menu open
- Owner menu with "Customize" theme picker panel expanded

Capturing all 4 theme states matters more than it might seem — a direction that looks strong in one pack can collapse in another (this has already happened once: a CTA gradient loses its two-tone effect on non-default themes because the packs only define one accent shade).

---

## 5. Explicit constraints for the redesign

These are architectural realities Claude Design won't infer from screenshots alone — worth stating directly in the onboarding prompt:

- Pages are built from a **JSONB block system** — each page is composed of reusable, independently-editable blocks (link block, testimonial block, lead form block, etc.), not a single static layout. A redesign needs to work at the *component* level, not just the page level.
- **Edit-in-place** is the core editing UX — blocks render as editable forms directly on the live page, not in a separate editor screen. Any visual direction needs a defined "editing" state, not just a "viewing" state.
- Theme switching happens **live, without page reload**, via CSS variable injection. New visual directions should be expressible as variable sets per pack, not one-off hardcoded designs.
- The **owner menu** and its controls are RLS-gated — only the page owner sees them. Visual treatment should make owner-only UI feel distinct from visitor-facing content.

---

## 6. Two-shot process note

This package supports a wide-exploration first pass (3–4 directions applied to a representative slice: homepage hero + one rep page in Slate + dashboard) followed by a narrowing decision, then a full-coverage second pass. See the surface inventory above for what "full coverage" includes once a direction is chosen.
