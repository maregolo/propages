import Head from 'next/head';
import React from 'react';

export default function Certified() {
  return (
    <>
      <Head>
        <title>ProPages Certified – Trust & Verification</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,300&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --sun: #F5A623; --sun-bright: #FFD166; --sky: #0A1628;
          --sky-mid: #112240; --sky-light: #1D3461; --white: #F8F5EE;
          --muted: #8899AA; --accent: #00E5BE; --danger: #FF6B6B;
          --card-bg: rgba(255,255,255,0.04); --card-border: rgba(255,255,255,0.08);
        }
        html { scroll-behavior: smooth; }
        body { background-color: var(--sky); color: var(--white); font-family: 'DM Sans', sans-serif; min-height: 100vh; overflow-x: hidden; }

        .bg-atmosphere { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
        .bg-atmosphere::before { content: ''; position: absolute; top: -20%; left: -10%; width: 70%; height: 70%; background: radial-gradient(ellipse, rgba(245,166,35,0.10) 0%, transparent 70%); }
        .bg-atmosphere::after { content: ''; position: absolute; bottom: -10%; right: -10%; width: 60%; height: 60%; background: radial-gradient(ellipse, rgba(0,229,190,0.06) 0%, transparent 70%); }

        .page { position: relative; z-index: 1; max-width: 560px; margin: 0 auto; padding: 0 20px 80px; }

        .topbar { display: flex; justify-content: center; padding: 28px 0 0; }
        .propages-badge { font-family: 'Bebas Neue', sans-serif; font-size: 13px; letter-spacing: 3px; color: var(--muted); border: 1px solid var(--card-border); padding: 4px 12px; border-radius: 20px; background: var(--card-bg); text-decoration: none; }
        .propages-badge:hover { color: var(--white); }

        .hero { text-align: center; padding: 48px 0 40px; }
        .hero-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--accent); margin-bottom: 14px; }
        .hero-headline { font-family: 'Bebas Neue', sans-serif; font-size: 48px; letter-spacing: 2px; line-height: 1; color: var(--white); margin-bottom: 16px; }
        .hero-sub { font-size: 15px; color: var(--muted); line-height: 1.7; max-width: 420px; margin: 0 auto; }

        .tiers { display: flex; flex-direction: column; gap: 16px; margin-bottom: 48px; }

        .tier-card { border-radius: 20px; padding: 28px 24px; border: 1px solid var(--card-border); background: var(--card-bg); scroll-margin-top: 80px; }
        .tier-card.pro       { border-color: rgba(136,153,170,0.3); }
        .tier-card.verified  { border-color: rgba(0,229,190,0.3); }
        .tier-card.certified { border-color: rgba(255,209,102,0.35); }

        .tier-pill { display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 20px; margin-bottom: 16px; }
        .tier-pill.pro       { background: rgba(136,153,170,0.12); border: 1px solid rgba(136,153,170,0.3); }
        .tier-pill.verified  { background: rgba(0,229,190,0.10); border: 1px solid rgba(0,229,190,0.3); }
        .tier-pill.certified { background: rgba(255,209,102,0.10); border: 1px solid rgba(255,209,102,0.35); }
        .tier-pill-dot { font-size: 11px; }
        .tier-pill.pro       .tier-pill-dot { color: #8899AA; }
        .tier-pill.verified  .tier-pill-dot { color: var(--accent); }
        .tier-pill.certified .tier-pill-dot { color: var(--sun-bright); }
        .tier-pill-label { font-family: 'Bebas Neue', sans-serif; font-size: 13px; letter-spacing: 2px; }
        .tier-pill.pro       .tier-pill-label { color: #8899AA; }
        .tier-pill.verified  .tier-pill-label { color: var(--accent); }
        .tier-pill.certified .tier-pill-label { color: var(--sun-bright); }

        .tier-headline { font-size: 18px; font-weight: 700; color: var(--white); margin-bottom: 8px; }
        .tier-desc { font-size: 14px; color: var(--muted); line-height: 1.6; margin-bottom: 16px; }

        .tier-checklist { display: flex; flex-direction: column; gap: 8px; }
        .tier-check { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: var(--white); line-height: 1.5; }
        .tier-check-icon { flex-shrink: 0; margin-top: 1px; font-size: 13px; }

        .divider { height: 1px; background: var(--card-border); margin: 48px 0; }

        .disclaimer-section { margin-bottom: 48px; }
        .disclaimer-label { font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--muted); margin-bottom: 12px; }
        .disclaimer-text { font-size: 13px; color: var(--muted); line-height: 1.7; }

        .cta-section { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 20px; padding: 36px 28px; text-align: center; }
        .cta-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--sun); margin-bottom: 12px; }
        .cta-headline { font-family: 'Bebas Neue', sans-serif; font-size: 34px; letter-spacing: 1px; color: var(--white); margin-bottom: 10px; }
        .cta-sub { font-size: 14px; color: var(--muted); line-height: 1.6; margin-bottom: 24px; max-width: 360px; margin-left: auto; margin-right: auto; }
        .cta-btn { display: inline-block; padding: 15px 32px; background: linear-gradient(135deg, var(--sun), var(--sun-bright)); color: var(--sky); font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 700; border: none; border-radius: 12px; cursor: pointer; text-decoration: none; box-shadow: 0 8px 32px rgba(245,166,35,0.3); transition: transform 0.15s ease, box-shadow 0.15s ease; }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(245,166,35,0.45); }
        .cta-soon { display: inline-block; margin-top: 12px; font-size: 12px; color: var(--muted); }

        .footer { text-align: center; margin-top: 48px; }
        .footer-powered { font-size: 11px; color: var(--muted); letter-spacing: 1px; }
        .footer-powered span { color: var(--sun); font-weight: 700; font-family: 'Bebas Neue', sans-serif; letter-spacing: 2px; font-size: 13px; }
      `}</style>

      <div className="bg-atmosphere" />

      <div className="page">

        <div className="topbar">
          <a href="/" className="propages-badge">PROPAGES</a>
        </div>

        <div className="hero">
          <div className="hero-eyebrow">Trust & Verification</div>
          <div className="hero-headline">Know Who's At Your Door</div>
          <div className="hero-sub">
            ProPages badges help homeowners identify legitimate, accountable sales professionals. Here's what each tier means and how reps earn it.
          </div>
        </div>

        <div className="tiers">

          {/* PRO */}
          <div className="tier-card pro" id="pro">
            <div className="tier-pill pro">
              <span className="tier-pill-dot">✦</span>
              <span className="tier-pill-label">PROPAGES PRO</span>
            </div>
            <div className="tier-headline">Active & Accountable</div>
            <div className="tier-desc">
              PRO reps have an active ProPages subscription and have agreed to our Terms of Service. They're real people with a real page — not a burner link.
            </div>
            <div className="tier-checklist">
              <div className="tier-check"><span className="tier-check-icon">✓</span> Active ProPages subscription</div>
              <div className="tier-check"><span className="tier-check-icon">✓</span> Agreed to ProPages Terms of Service</div>
              <div className="tier-check"><span className="tier-check-icon">✓</span> Permanent, shareable profile page</div>
            </div>
          </div>

          {/* VERIFIED */}
          <div className="tier-card verified" id="verified">
            <div className="tier-pill verified">
              <span className="tier-pill-dot">✦</span>
              <span className="tier-pill-label">PROPAGES VERIFIED</span>
            </div>
            <div className="tier-headline">Identity Confirmed</div>
            <div className="tier-desc">
              VERIFIED reps have had their identity and company affiliation reviewed by ProPages. We've confirmed they are who they say they are.
            </div>
            <div className="tier-checklist">
              <div className="tier-check"><span className="tier-check-icon">✓</span> Everything in PRO</div>
              <div className="tier-check"><span className="tier-check-icon">✓</span> Government ID reviewed</div>
              <div className="tier-check"><span className="tier-check-icon">✓</span> Company affiliation confirmed</div>
              <div className="tier-check"><span className="tier-check-icon">✓</span> Badge can be revoked for misconduct</div>
            </div>
          </div>

          {/* CERTIFIED */}
          <div className="tier-card certified" id="certified">
            <div className="tier-pill certified">
              <span className="tier-pill-dot">✦</span>
              <span className="tier-pill-label">PROPAGES CERTIFIED</span>
            </div>
            <div className="tier-headline">Verified & Proven</div>
            <div className="tier-desc">
              CERTIFIED is the highest tier. These reps have passed identity verification and met a performance threshold based on customer ratings.
            </div>
            <div className="tier-checklist">
              <div className="tier-check"><span className="tier-check-icon">✓</span> Everything in VERIFIED</div>
              <div className="tier-check"><span className="tier-check-icon">✓</span> Minimum 4.5★ Google rating</div>
              <div className="tier-check"><span className="tier-check-icon">✓</span> Demonstrated track record</div>
              <div className="tier-check"><span className="tier-check-icon">✓</span> Annual review to maintain status</div>
            </div>
          </div>

        </div>

        <div className="divider" />

        <div className="disclaimer-section">
          <div className="disclaimer-label">Important Disclaimer</div>
          <div className="disclaimer-text">
            ProPages badges confirm identity and company affiliation only. They do not constitute an endorsement of a representative's services, guarantee their licensing or certifications, or verify the accuracy of any claims made on their page. ProPages is not responsible for the conduct of any representative before, during, or after an interaction with a homeowner. Always exercise your own judgment. If you have a concern about a representative, contact us at support@propages.com.
          </div>
        </div>

        <div className="cta-section">
          <div className="cta-eyebrow">For Sales Professionals</div>
          <div className="cta-headline">Get Your Badge</div>
          <div className="cta-sub">
            Build trust with every door you knock. ProPages badges signal professionalism before you say a word.
          </div>
          <a href="/signup" className="cta-btn">Apply for Verification →</a>
          <div className="cta-soon" style={{ marginTop: '16px' }}>Full verification program launching soon.</div>
        </div>

        <div className="footer">
          <div className="footer-powered">Powered by <span>PROPAGES</span></div>
        </div>

      </div>
    </>
  );
}