import React, { useState } from 'react';
import Head from 'next/head';
import SiteMeta from '../components/SiteMeta';
import Logo from '../components/Logo';
import { useRouter } from 'next/router';

export default function D2DLanding() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', industry: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  }

  // Pre-fill name from hero input then scroll to form
  function handleClaimClick() {
    document.getElementById('lp-form').scrollIntoView({ behavior: 'smooth' });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.industry) {
      setError('Please fill out all fields.');
      return;
    }
    setLoading(true);

    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );

      await supabase.from('invite_requests').insert([{
        name: formData.name,
        email: formData.email,
        industry: formData.industry,
        status: 'pending',
        source: 'd2d-ad',
      }]);

      await fetch('/api/notify-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email }),
      });

      router.push('/signup');
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>ProPages — Your page stays open, even when the door closes.</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;700;800&display=swap" rel="stylesheet" />
      </Head>
      <SiteMeta title="ProPages — Your page stays open, even when the door closes." path="/d2d" />

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

        /* ── NAV — wordmark only, no links ── */
        .lp-nav {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 16px 40px;
          border-bottom: 1px solid var(--card-border);
        }

        /* ── HERO ── */
        .hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: calc(100vh - 53px);
          overflow: hidden;
        }
        .hero-left {
          padding: 44px 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        /* Social proof */
        .social-proof {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
        }
        .avatars { display: flex; }
        .av {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: 2px solid var(--sky);
          margin-left: -8px;
          font-size: 9px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          flex-shrink: 0;
        }
        .av:first-child { margin-left: 0; }
        .proof-copy { font-size: 12px; color: var(--dim); line-height: 1.3; }
        .proof-copy strong { color: var(--muted); font-weight: 600; }
        .proof-stars { color: var(--sun); font-size: 10px; letter-spacing: 1px; display: block; margin-bottom: 1px; }

        /* Eyebrow */
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
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--accent);
          animation: blink 2s ease-in-out infinite;
        }
        @keyframes blink {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.3; }
        }

        /* Headlines */
        .headline {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 56px;
          line-height: 0.97;
          letter-spacing: 1px;
          color: var(--white);
          margin-bottom: 2px;
        }
        .headline-b {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 56px;
          line-height: 0.97;
          letter-spacing: 1px;
          color: var(--white);
          display: inline-block;
          position: relative;
          margin-bottom: 20px;
        }
        .headline-b::after {
          content: '';
          position: absolute;
          left: 0; bottom: -4px;
          width: 100%; height: 4px;
          background: var(--sun);
          border-radius: 2px;
        }
        .hero-sub {
          font-size: 15px;
          color: var(--muted);
          line-height: 1.65;
          margin-bottom: 24px;
          max-width: 320px;
        }
        .hero-sub strong { color: var(--white); font-weight: 600; }

        /* Claim row */
        .claim-row {
          display: flex;
          align-items: center;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px;
          background: rgba(255,255,255,0.04);
          overflow: hidden;
          max-width: 380px;
          margin-bottom: 10px;
          transition: border-color 0.2s;
        }
        .claim-row:focus-within { border-color: rgba(245,166,35,0.5); }
        .claim-prefix {
          font-size: 12px;
          color: var(--dim);
          padding: 0 0 0 14px;
          white-space: nowrap;
          font-weight: 500;
          flex-shrink: 0;
        }
        .claim-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--white);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          padding: 13px 8px;
          min-width: 0;
        }
        .claim-input::placeholder { color: var(--dimmer); }
        .claim-btn {
          background: linear-gradient(135deg, var(--sun), var(--sun-bright));
          color: var(--sky);
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 700;
          padding: 13px 16px;
          border: none;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          border-radius: 0 10px 10px 0;
        }
        .claim-btn:hover { filter: brightness(1.05); }
        .hero-hint {
          font-size: 11px;
          color: var(--dimmer);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .hero-hint-sep { color: #1E2830; }

        /* ── HERO RIGHT ── */
        .hero-right {
          position: relative;
          background: var(--sky-mid);
          border-left: 1px solid var(--card-border);
          display: flex;
          align-items: center;
          justify-content: center;
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

        /* Phone mockups */
        .phone {
          position: absolute;
          width: 162px;
          background: linear-gradient(160deg, #1e2a3a 0%, var(--sky-light) 50%, #0f1922 100%);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 36px;
          padding: 16px 13px 18px;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.06),
            0 0 0 3px rgba(0,0,0,0.6),
            0 0 0 4px rgba(255,255,255,0.04),
            0 30px 60px rgba(0,0,0,0.7),
            inset 0 1px 0 rgba(255,255,255,0.1),
            inset 0 -1px 0 rgba(0,0,0,0.4);
        }
        .phone-back {
          top: 50%; left: 50%;
          transform: translate(-130%, -50%) rotate(-8deg) scale(1.2);
          opacity: 0.95;
          z-index: 2;
        }
        .phone-front {
          top: 50%; left: 50%;
          transform: translate(-190%, -50%) rotate(-20deg) scale(1.2);
          z-index: 3;
        }
        .phone-notch {
          width: 44px; height: 4px;
          background: rgba(255,255,255,0.07);
          border-radius: 2px;
          margin: 0 auto 12px;
        }
        .phone-brand {
          font-size: 7px; font-weight: 700;
          letter-spacing: 2px; color: var(--dimmer);
          text-align: center; margin-bottom: 10px;
          font-family: monospace;
        }
        .phone-avatar-wrap {
          display: flex; justify-content: center;
          margin-bottom: 7px; position: relative;
        }
        .phone-avatar {
          width: 40px; height: 40px;
          border-radius: 50%;
          background: #1D3461;
          border: 2px solid var(--sun);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; color: var(--sun);
        }
        .phone-status {
          position: absolute; bottom: 1px;
          right: calc(50% - 22px);
          width: 9px; height: 9px;
          background: var(--accent);
          border-radius: 50%;
          border: 2px solid var(--sky-light);
        }
        .phone-name {
          text-align: center; font-size: 11px;
          font-weight: 700; color: var(--white); margin-bottom: 2px;
        }
        .phone-title {
          text-align: center; font-size: 8px;
          color: var(--sun); letter-spacing: 1px;
          text-transform: uppercase; margin-bottom: 3px;
        }
        .phone-verified {
          display: flex; align-items: center;
          justify-content: center; gap: 4px;
          font-size: 8px; color: var(--purple);
          font-weight: 600; margin-bottom: 10px;
        }
        .phone-verified-dot {
          width: 5px; height: 5px;
          border-radius: 50%; background: var(--purple);
        }
        .phone-divider { height: 1px; background: rgba(255,255,255,0.05); margin-bottom: 9px; }
        .phone-field {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 6px; padding: 6px 8px;
          font-size: 9px; color: var(--dim); margin-bottom: 5px;
        }
        .phone-submit {
          width: 100%; background: var(--accent);
          color: var(--sky); font-size: 9px; font-weight: 700;
          padding: 7px; border-radius: 6px;
          text-align: center; margin-top: 2px;
        }
        .phone-url {
          text-align: center; font-size: 8px;
          color: var(--dimmer); margin-top: 9px; font-family: monospace;
        }

        /* ── TICKER ── */
        .ticker {
          background: var(--sun);
          padding: 9px 0;
          overflow: hidden;
          white-space: nowrap;
        }
        .ticker-track {
          display: inline-flex;
          animation: ticker-scroll 22s linear infinite;
        }
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-item {
          font-size: 11px; font-weight: 800;
          color: var(--sky); letter-spacing: 0.8px;
          text-transform: uppercase;
          padding: 0 28px;
          display: inline-flex; align-items: center; gap: 8px;
          flex-shrink: 0;
        }
        .ticker-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: rgba(13,17,23,0.25);
          flex-shrink: 0;
        }

        /* ── TRUST STRIP ── */
        .trust-strip {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border-bottom: 1px solid var(--card-border);
        }
        .trust-card {
          padding: 32px 28px;
          border-right: 1px solid var(--card-border);
        }
        .trust-card:last-child { border-right: none; }
        .trust-num {
          font-size: 11px; font-weight: 700;
          letter-spacing: 2px; color: var(--dim);
          margin-bottom: 12px;
        }
        .trust-icon {
          font-size: 22px; margin-bottom: 10px; display: block;
        }
        .trust-title {
          font-size: 15px; font-weight: 700;
          color: var(--white); margin-bottom: 6px;
        }
        .trust-body {
          font-size: 13px; color: var(--muted); line-height: 1.6;
        }

        /* ── FORM SECTION ── */
        .form-section {
          padding: 56px 40px;
        }
        .form-inner {
          max-width: 440px;
          margin: 0 auto;
          background: var(--sky-light);
          border: 1px solid var(--card-border);
          border-radius: 20px;
          padding: 36px 32px;
        }
        .form-badge {
          display: inline-block;
          font-size: 10px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase;
          color: var(--purple);
          background: rgba(123,111,232,0.1);
          border: 1px solid rgba(123,111,232,0.2);
          padding: 3px 10px; border-radius: 20px;
          margin-bottom: 14px;
        }
        .form-headline {
          font-size: 26px; font-weight: 800;
          color: var(--white); margin-bottom: 6px;
          letter-spacing: -0.5px; line-height: 1.2;
        }
        .form-sub {
          font-size: 13px; color: var(--muted);
          margin-bottom: 22px; line-height: 1.6;
        }
        .form-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--card-border);
          border-radius: 10px;
          padding: 13px 14px;
          color: var(--white);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          outline: none;
          margin-bottom: 10px;
          appearance: none;
        }
        .form-input:focus { border-color: var(--sun); }
        .form-input option { background: var(--sky-mid); }
        .form-error {
          font-size: 12px; color: #ff6b6b;
          margin-bottom: 10px;
        }
        .form-btn {
          width: 100%;
          background: linear-gradient(135deg, var(--sun), var(--sun-bright));
          color: var(--sky);
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 700;
          padding: 14px; border-radius: 10px;
          border: none; cursor: pointer; margin-top: 4px;
        }
        .form-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .form-btn:hover:not(:disabled) { box-shadow: 0 8px 24px rgba(245,166,35,0.35); }
        .form-fine {
          font-size: 11px; color: var(--dimmer);
          text-align: center; margin-top: 12px; line-height: 1.5;
        }

        /* ── MINIMAL FOOTER ── */
        .lp-footer {
          text-align: center;
          padding: 20px 40px;
          border-top: 1px solid var(--card-border);
        }
        .lp-footer-copy { font-size: 11px; color: #1E2830; }
      `}</style>

      {/* NAV — wordmark only */}
      <nav className="lp-nav">
        <Logo height={20} />
      </nav>

      {/* HERO */}
      <div className="hero">

        {/* LEFT */}
        <div className="hero-left">

          <div className="social-proof">
            <div className="avatars">
              <div className="av" style={{ background: '#1D3461' }}>JR</div>
              <div className="av" style={{ background: '#1a3a2a' }}>SM</div>
              <div className="av" style={{ background: '#2a1a3a' }}>DK</div>
              <div className="av" style={{ background: '#3a2a1a' }}>MC</div>
              <div className="av" style={{ background: '#1a2a3a' }}>AL</div>
            </div>
            <div className="proof-copy">
              <span className="proof-stars">★★★★★</span>
              <strong>240+ reps</strong> already on ProPages
            </div>
          </div>

          <div className="eyebrow">
            <div className="eyebrow-dot"></div>
            For Door-to-Door Sales Reps
          </div>
          <div className="headline">The door closes.</div>
          <div className="headline-b">Your page stays open.</div>
          <p className="hero-sub">
            Stop losing leads after the knock. <strong>One link that keeps working</strong> long after you've moved on to the next house.
          </p>

          <div className="claim-row">
            <span className="claim-prefix">propages.com/</span>
            <input
              className="claim-input"
              placeholder="yourname"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <button className="claim-btn" onClick={handleClaimClick}>
              Claim my page →
            </button>
          </div>
          <p className="hero-hint">
            Free to start <span className="hero-hint-sep">·</span> Takes 5 minutes <span className="hero-hint-sep">·</span> No credit card
          </p>
        </div>

        {/* RIGHT */}
        <div className="hero-right">
          <div className="hero-bg-grid"></div>
          <div className="hero-bg-glow"></div>
          <img
            src="/Young_Man_with_Clipboard.png"
            alt="Sales rep in the field"
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center top',
              opacity: 0.85,
            }}
          />

          {/* Back phone — Sara */}
          <div className="phone phone-back">
            <div className="phone-notch"></div>
            <div className="phone-brand">PROPAGES</div>
            <div className="phone-avatar-wrap">
              <div className="phone-avatar" style={{ background: '#1a3a2a', color: '#00E5BE', borderColor: '#00E5BE' }}>SM</div>
              <div className="phone-status"></div>
            </div>
            <div className="phone-name">Sara Mitchell</div>
            <div className="phone-title">Roofing · Denver</div>
            <div className="phone-verified">
              <div className="phone-verified-dot"></div>
              Verified Rep
            </div>
            <div className="phone-divider"></div>
            <div className="phone-field">Your name</div>
            <div className="phone-field">Phone number</div>
            <div className="phone-submit" style={{ background: '#00E5BE' }}>Get a Free Inspection</div>
            <div className="phone-url">propages.com/sara-mitchell</div>
          </div>

          {/* Front phone — Jake */}
          <div className="phone phone-front">
            <div className="phone-notch"></div>
            <div className="phone-brand">PROPAGES</div>
            <div className="phone-avatar-wrap">
              <div className="phone-avatar">JR</div>
              <div className="phone-status"></div>
            </div>
            <div className="phone-name">Jake Rivera</div>
            <div className="phone-title">Solar Consultant · Phoenix</div>
            <div className="phone-verified">
              <div className="phone-verified-dot"></div>
              Verified Rep
            </div>
            <div className="phone-divider"></div>
            <div className="phone-field">Your name</div>
            <div className="phone-field">Phone number</div>
            <div className="phone-submit">Get My Free Estimate</div>
            <div className="phone-url">propages.com/jake-rivera</div>
          </div>

        </div>
      </div>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-track">
          <span className="ticker-item"><span className="ticker-dot"></span>Looks pro on day one</span>
          <span className="ticker-item"><span className="ticker-dot"></span>Your own URL</span>
          <span className="ticker-item"><span className="ticker-dot"></span>Set up in 10 minutes</span>
          <span className="ticker-item"><span className="ticker-dot"></span>Captures leads 24/7</span>
          <span className="ticker-item"><span className="ticker-dot"></span>No contract ever</span>
          <span className="ticker-item"><span className="ticker-dot"></span>500+ reps on the waitlist</span>
          <span className="ticker-item"><span className="ticker-dot"></span>Looks pro on day one</span>
          <span className="ticker-item"><span className="ticker-dot"></span>Your own URL</span>
          <span className="ticker-item"><span className="ticker-dot"></span>Set up in 10 minutes</span>
          <span className="ticker-item"><span className="ticker-dot"></span>Captures leads 24/7</span>
          <span className="ticker-item"><span className="ticker-dot"></span>No contract ever</span>
          <span className="ticker-item"><span className="ticker-dot"></span>500+ reps on the waitlist</span>
        </div>
      </div>

      {/* TRUST STRIP — compressed How It Works */}
      <div className="trust-strip">
        <div className="trust-card">
          <div className="trust-num">01</div>
          <span className="trust-icon">⚡</span>
          <div className="trust-title">Live in 10 minutes</div>
          <div className="trust-body">Sign up, pick your handle, and your ProPage is ready to share before your next door.</div>
        </div>
        <div className="trust-card">
          <div className="trust-num">02</div>
          <span className="trust-icon">📲</span>
          <div className="trust-title">Share with one link</div>
          <div className="trust-body">Text it, drop it on a card, or let them scan your QR. One tap and they're on your page.</div>
        </div>
        <div className="trust-card">
          <div className="trust-num">03</div>
          <span className="trust-icon">🎯</span>
          <div className="trust-title">Leads come to you</div>
          <div className="trust-body">Homeowners fill out your form on their own time. You get notified. No lead slips through.</div>
        </div>
      </div>

      {/* FORM */}
      <div className="form-section" id="lp-form">
        <div className="form-inner">
          <div className="form-badge">Get Started Free</div>
          <div className="form-headline">Claim your ProPage.</div>
          <p className="form-sub">Your page. Your URL. Live in minutes. Join 240+ reps already closing more leads.</p>
          <form onSubmit={handleSubmit}>
            <input
              className="form-input"
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <select
              className="form-input"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              required
            >
              <option value="">What industry are you in?</option>
              <option value="Solar">Solar</option>
              <option value="Roofing">Roofing</option>
              <option value="Pest Control">Pest Control</option>
              <option value="Home Security">Home Security</option>
              <option value="Windows & Doors">Windows & Doors</option>
              <option value="HVAC">HVAC</option>
              <option value="Other">Other</option>
            </select>
            {error && <p className="form-error">{error}</p>}
            <button className="form-btn" type="submit" disabled={loading}>
              {loading ? 'Setting up your page...' : 'Get My ProPage →'}
            </button>
          </form>
          <p className="form-fine">No credit card required · Takes 5 minutes · Cancel anytime</p>
        </div>
      </div>

      {/* MINIMAL FOOTER */}
      <div className="lp-footer">
        <p className="lp-footer-copy">© 2026 ProPages. All rights reserved.</p>
      </div>
    </>
  );
}