import React, { useState } from 'react';
import Head from 'next/head';
import SiteMeta from '../components/SiteMeta';
import Logo from '../components/Logo';
import { useRouter } from 'next/router';

// ─────────────────────────────────────────────────────────────────────────
// /realestate — standalone paid-ad landing page for Real Estate agents.
// Modeled on the existing /d2d ad page: wordmark-only nav, noindex, bypasses
// the waitlist (writes status: 'approved' directly), tags the lead source,
// and routes straight to /signup instead of the homepage invite queue.
// ─────────────────────────────────────────────────────────────────────────

export default function RealEstateLanding() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setLoading(true);

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    await supabase.from('invite_requests').insert([{
      name: formData.name,
      email: formData.email,
      industry: 'Real Estate',
      status: 'approved',   // ad traffic bypasses the manual invite queue
      source: 'realestate-ad',
    }]);

    await fetch('/api/notify-invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: formData.name, email: formData.email }),
    });

    setLoading(false);
    setSubmitted(true);
    setTimeout(() => router.push('/signup'), 1400);
  }

  return (
    <>
      <Head>
        <title>ProPages for Real Estate Agents – The link-in-bio that sells homes.</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;700;800&display=swap" rel="stylesheet" />
      </Head>
      <SiteMeta title="ProPages for Real Estate Agents – The link-in-bio that sells homes." path="/realestate" />

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --sky:        #0D1117;
          --sky-mid:    #131820;
          --sky-light:  #161B22;
          --white:      #F8F5EE;
          --muted:      #8899AA;
          --dim:        #445566;
          --dimmer:     #2A3441;
          --sun:        #F5A623;
          --sun-bright: #FFD166;
          --accent:     #00E5BE;
          --purple:     #7B6FE8;
          --card-bg:    rgba(255,255,255,0.04);
          --card-border:rgba(255,255,255,0.06);
        }
        html, body { height: 100%; }
        body {
          background: var(--sky);
          color: var(--white);
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* ── NAV (wordmark only, no nav links, no login) ── */
        .nav {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 16px 40px;
          background: rgba(13,17,23,0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(123,111,232,0.2);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        /* ── HERO ── */
        .hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: calc(100vh - 57px);
          overflow: hidden;
        }
        .hero-left {
          padding: 44px 40px 44px 56px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--purple);
          margin-bottom: 16px;
        }
        .eyebrow-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--accent);
          animation: blink 2s ease-in-out infinite;
        }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        .headline {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 56px;
          line-height: 1.0;
          letter-spacing: 1px;
          color: var(--white);
          margin-bottom: 4px;
        }
        .headline-b {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 56px;
          line-height: 1.0;
          letter-spacing: 1px;
          color: var(--purple);
          margin-bottom: 16px;
        }
        .hero-sub {
          font-size: 20px;
          color: var(--muted);
          line-height: 1.65;
          margin-bottom: 28px;
          max-width: 460px;
        }
        .hero-sub strong { color: var(--white); font-weight: 600; }
        .cta-row { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
        .cta-primary {
          background: linear-gradient(135deg, var(--sun), var(--sun-bright));
          color: var(--sky);
          font-size: 14px; font-weight: 700;
          padding: 13px 22px; border-radius: 10px; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif; text-decoration: none; white-space: nowrap;
        }
        .cta-primary:hover { box-shadow: 0 8px 24px rgba(245,166,35,0.35); }
        .hero-hint { font-size: 11px; color: var(--dim); }

        /* ── HERO RIGHT / PHONES ── */
        .hero-right {
          position: relative;
          background: var(--sky-mid);
          border-left: 1px solid var(--card-border);
          display: flex; align-items: center; justify-content: center;
        }
        .hero-bg-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(123,111,232,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(123,111,232,0.04) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .hero-bg-glow {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 60% 50%, rgba(123,111,232,0.06) 0%, transparent 70%);
        }
        .phone {
          position: absolute;
          width: 162px;
          background: linear-gradient(160deg, #1e2a3a 0%, var(--sky-light) 50%, #0f1922 100%);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 36px;
          padding: 16px 13px 18px;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.06), 0 0 0 3px rgba(0,0,0,0.6),
            0 0 0 4px rgba(255,255,255,0.04), 0 30px 60px rgba(0,0,0,0.7),
            inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.4);
        }
        .phone-back { top: 50%; left: 50%; transform: translate(-130%, -50%) rotate(-8deg) scale(1.2); opacity: 0.95; z-index: 2; }
        .phone-front { top: 50%; left: 50%; transform: translate(-190%, -50%) rotate(-20deg) scale(1.2); z-index: 3; }
        .phone-notch { width: 44px; height: 4px; background: rgba(255,255,255,0.07); border-radius: 2px; margin: 0 auto 12px; }
        .phone-brand { font-size: 7px; font-weight: 700; letter-spacing: 2px; color: var(--dimmer); text-align: center; margin-bottom: 10px; font-family: monospace; }
        .phone-avatar-wrap { display: flex; justify-content: center; margin-bottom: 7px; position: relative; }
        .phone-avatar { width: 40px; height: 40px; border-radius: 50%; background: #1D3461; border: 2px solid var(--sun); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: var(--sun); }
        .phone-status { position: absolute; bottom: 1px; right: calc(50% - 22px); width: 9px; height: 9px; background: var(--accent); border-radius: 50%; border: 2px solid var(--sky-light); }
        .phone-name { text-align: center; font-size: 11px; font-weight: 700; color: var(--white); margin-bottom: 2px; }
        .phone-title { text-align: center; font-size: 8px; color: var(--sun); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 3px; }
        .phone-verified { display: flex; align-items: center; justify-content: center; gap: 4px; font-size: 8px; color: var(--purple); font-weight: 600; margin-bottom: 10px; }
        .phone-verified-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--purple); }
        .phone-divider { height: 1px; background: rgba(255,255,255,0.05); margin-bottom: 9px; }
        .phone-field { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 6px; padding: 6px 8px; font-size: 9px; color: var(--dim); margin-bottom: 5px; }
        .phone-submit { width: 100%; background: var(--accent); color: var(--sky); font-size: 9px; font-weight: 700; padding: 7px; border-radius: 6px; text-align: center; margin-top: 2px; }
        .phone-url { text-align: center; font-size: 8px; color: var(--dimmer); margin-top: 9px; font-family: monospace; }

        /* ── PROOF BAR ── */
        .proof-bar {
          display: flex; align-items: center; justify-content: center; gap: 28px;
          padding: 14px 40px;
          border-top: 1px solid var(--card-border); border-bottom: 1px solid var(--card-border);
          background: rgba(255,255,255,0.01);
        }
        .proof-item { display: flex; align-items: center; gap: 8px; }
        .proof-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); flex-shrink: 0; }
        .proof-text { font-size: 13px; color: var(--muted); }
        .proof-text strong { color: var(--white); font-weight: 600; }
        .proof-sep { width: 1px; height: 14px; background: var(--card-border); }

        /* ── PAIN SECTION ── */
        .pain-section { padding: 80px 40px; border-bottom: 1px solid var(--card-border); max-width: 860px; margin: 0 auto; }
        .pain-section-label { font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--dim); margin-bottom: 40px; }
        .pain-headline { font-size: 40px; font-weight: 800; color: var(--white); letter-spacing: -1px; line-height: 1.1; margin-bottom: 32px; max-width: 680px; }
        .pain-headline .accent { color: var(--sun); }
        .pain-body-wrap { border-left: 2px solid rgba(245,166,35,0.25); padding-left: 24px; max-width: 560px; }
        .pain-body { font-size: 17px; color: var(--muted); line-height: 1.8; }
        .pain-closer { font-size: 18px; font-weight: 800; color: var(--sun); margin-top: 20px; }

        /* ── TRUST STRIP (3 steps) ── */
        .how-section { padding: 56px 40px; border-bottom: 1px solid var(--card-border); }
        .section-label { font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--dim); text-align: center; margin-bottom: 36px; }
        .steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; max-width: 960px; margin: 0 auto; }
        .step-card { background: var(--sky-light); border: 1px solid var(--card-border); border-radius: 14px; padding: 24px 20px; }
        .step-num { font-size: 11px; font-weight: 700; letter-spacing: 2px; color: var(--dim); margin-bottom: 14px; }
        .step-icon { width: 34px; height: 34px; border-radius: 9px; background: rgba(123,111,232,0.1); border: 1px solid rgba(123,111,232,0.15); display: flex; align-items: center; justify-content: center; font-size: 16px; margin-bottom: 14px; }
        .step-title { font-size: 15px; font-weight: 700; color: var(--white); margin-bottom: 8px; }
        .step-body { font-size: 13px; color: var(--muted); line-height: 1.6; }

        /* ── INLINE FORM ── */
        .invite-section { padding: 56px 40px 80px; }
        .invite-inner { max-width: 440px; margin: 0 auto; background: var(--sky-light); border: 1px solid var(--card-border); border-radius: 20px; padding: 36px 32px; }
        .invite-badge { display: inline-block; font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--purple); background: rgba(123,111,232,0.1); border: 1px solid rgba(123,111,232,0.2); padding: 3px 10px; border-radius: 20px; margin-bottom: 14px; }
        .invite-headline { font-size: 26px; font-weight: 800; color: var(--white); margin-bottom: 6px; letter-spacing: -0.5px; line-height: 1.2; }
        .invite-sub { font-size: 13px; color: var(--muted); margin-bottom: 22px; line-height: 1.6; }
        .invite-input { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid var(--card-border); border-radius: 10px; padding: 13px 14px; color: var(--white); font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; margin-bottom: 10px; appearance: none; }
        .invite-input:focus { border-color: var(--sun); }
        .invite-btn { width: 100%; background: linear-gradient(135deg, var(--sun), var(--sun-bright)); color: var(--sky); font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 700; padding: 14px; border-radius: 10px; border: none; cursor: pointer; margin-top: 4px; }
        .invite-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .invite-btn:hover:not(:disabled) { box-shadow: 0 8px 24px rgba(245,166,35,0.35); }
        .success-box { text-align: center; padding: 20px 0; }
        .success-icon { font-size: 44px; margin-bottom: 12px; }
        .success-title { font-family: 'Bebas Neue', sans-serif; font-size: 30px; color: var(--accent); margin-bottom: 8px; }
        .success-sub { font-size: 14px; color: var(--muted); line-height: 1.6; }

        /* ── FOOTER ── */
        .footer { text-align: center; padding: 36px 40px; }
        .footer-wordmark { font-size: 11px; font-weight: 700; letter-spacing: 4px; color: var(--dimmer); font-family: monospace; margin-bottom: 8px; }
        .footer-tag { font-size: 13px; color: #334455; margin-bottom: 12px; }
        .footer-copy { font-size: 11px; color: #1E2830; }

        @media (max-width: 860px) {
          .hero { grid-template-columns: 1fr; }
          .hero-right { min-height: 420px; }
          .steps-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* NAV — wordmark only, no site nav, no login (ad-traffic page) */}
      <nav className="nav">
        <Logo height={24} />
      </nav>

      {/* HERO */}
      <div className="hero">
        <div className="hero-left">
          <div className="eyebrow">
            <div className="eyebrow-dot"></div>
            For Real Estate Agents
          </div>
          <div className="headline">The only link-in-bio</div>
          <div className="headline-b">built to sell homes.</div>
          <p className="hero-sub">
            One link working around the clock — <strong>capturing buyer and seller leads, showcasing your listings, and building your reputation</strong> before you ever pick up the phone.
          </p>
          <div className="cta-row">
            <a href="#get-started" className="cta-primary">Claim Your Free Page →</a>
          </div>
          <p className="hero-hint">Free to start · Live in minutes</p>
        </div>

        <div className="hero-right">
          <div className="hero-bg-grid"></div>
          <div className="hero-bg-glow"></div>

          <div className="phone phone-back">
            <div className="phone-notch"></div>
            <div className="phone-brand">PROPAGES</div>
            <div className="phone-avatar-wrap">
              <div className="phone-avatar" style={{ background: '#1a3a2a', color: '#00E5BE', borderColor: '#00E5BE' }}>MD</div>
              <div className="phone-status"></div>
            </div>
            <div className="phone-name">Marcus Diaz</div>
            <div className="phone-title">Listing Agent · Round Rock, TX</div>
            <div className="phone-verified"><div className="phone-verified-dot"></div>Verified Agent</div>
            <div className="phone-divider"></div>
            <div className="phone-field">Your name</div>
            <div className="phone-field">Phone number</div>
            <div className="phone-submit" style={{ background: '#00E5BE' }}>See Active Listings</div>
            <div className="phone-url">propages.com/marcus-diaz</div>
          </div>

          <div className="phone phone-front">
            <div className="phone-notch"></div>
            <div className="phone-brand">PROPAGES</div>
            <div className="phone-avatar-wrap">
              <div className="phone-avatar">SC</div>
              <div className="phone-status"></div>
            </div>
            <div className="phone-name">Sarah Chen</div>
            <div className="phone-title">Real Estate Agent · Austin, TX</div>
            <div className="phone-verified"><div className="phone-verified-dot"></div>Verified Agent</div>
            <div className="phone-divider"></div>
            <div className="phone-field">Your name</div>
            <div className="phone-field">Phone number</div>
            <div className="phone-submit">Get My Free Home Valuation</div>
            <div className="phone-url">propages.com/sarah-chen</div>
          </div>
        </div>
      </div>

      {/* PROOF BAR */}
      <div className="proof-bar">
        <div className="proof-item"><div className="proof-dot"></div><div className="proof-text"><strong>180+</strong> agents on the waitlist</div></div>
        <div className="proof-sep"></div>
        <div className="proof-item"><div className="proof-dot"></div><div className="proof-text"><strong>1,400+</strong> leads captured</div></div>
        <div className="proof-sep"></div>
        <div className="proof-item"><div className="proof-dot"></div><div className="proof-text"><strong>4.9★</strong> average agent rating</div></div>
      </div>

      {/* PAIN SECTION */}
      <div style={{ borderBottom: '1px solid var(--card-border)' }}>
        <div className="pain-section">
          <div className="pain-section-label">The Problem</div>
          <div className="pain-headline">
            Every buyer and seller <span className="accent">starts their search online.</span> Is your name the one they find?
          </div>
          <div className="pain-body-wrap">
            <div className="pain-body">
              Your MLS profile looks like every other agent's. Your Instagram bio is a dead end. Meanwhile the agent with an actual page — listings, reviews, a lead form — is the one who gets the call.
            </div>
            <div className="pain-closer">One link changes that. →</div>
          </div>
        </div>
      </div>

      {/* TRUST STRIP */}
      <div className="how-section">
        <div className="section-label">Live in Minutes</div>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-num">01</div>
            <div className="step-icon">⚡</div>
            <div className="step-title">Claim Your Page</div>
            <div className="step-body">Pick your handle, add your listings and headshot, and your ProPage is live in minutes.</div>
          </div>
          <div className="step-card">
            <div className="step-num">02</div>
            <div className="step-icon">📲</div>
            <div className="step-title">Share It Everywhere</div>
            <div className="step-body">Put it in listing flyers, your email signature, and your social bio. Every touchpoint becomes a lead source.</div>
          </div>
          <div className="step-card">
            <div className="step-num">03</div>
            <div className="step-icon">🏡</div>
            <div className="step-title">Capture the Lead</div>
            <div className="step-body">Buyers and sellers fill out your form on their own time. You get notified instantly — no lead slips through.</div>
          </div>
        </div>
      </div>

      {/* INLINE FORM */}
      <div className="invite-section" id="get-started">
        <div className="invite-inner">
          <div className="invite-badge">Free To Start</div>
          <div className="invite-headline">Claim your page.</div>
          <p className="invite-sub">Built specifically for real estate agents. Drop your info and we'll get your page set up.</p>
          {submitted ? (
            <div className="success-box">
              <div className="success-icon">🎉</div>
              <div className="success-title">You're in!</div>
              <p className="success-sub">Taking you to set up your page now...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <input className="invite-input" type="text" name="name" placeholder="Your name" value={formData.name} onChange={handleChange} required />
              <input className="invite-input" type="email" name="email" placeholder="Email address" value={formData.email} onChange={handleChange} required />
              <button className="invite-btn" type="submit" disabled={loading}>
                {loading ? 'Setting Up...' : 'Claim My Free Page →'}
              </button>
              <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--dim)', marginTop: '12px' }}>Join 180+ agents already on ProPages</p>
            </form>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="footer">
        <div className="footer-wordmark" style={{ display: 'flex', justifyContent: 'center' }}><Logo height={22} glow={false} /></div>
        <p className="footer-tag">Built for the agents who show up every day.</p>
        <p className="footer-copy">© 2026 ProPages. All rights reserved.</p>
      </div>
    </>
  );
}