import React, { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [formData, setFormData] = useState({ name: '', email: '', industry: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.industry) return;
    setLoading(true);

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    await supabase.from('invite_requests').insert([{
      name: formData.name,
      email: formData.email,
      industry: formData.industry,
      status: 'pending'
    }]);

    setLoading(false);
    setSubmitted(true);
  }

  return (
    <>
      <Head>
        <title>ProPages – The Rep's Secret Weapon</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;700&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --sun: #F5A623;
          --sun-bright: #FFD166;
          --sky: #0A1628;
          --sky-mid: #112240;
          --sky-light: #1D3461;
          --white: #F8F5EE;
          --muted: #8899AA;
          --accent: #00E5BE;
          --card-bg: rgba(255,255,255,0.04);
          --card-border: rgba(255,255,255,0.08);
        }
        body {
          background-color: var(--sky);
          color: var(--white);
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
        }
        .page {
          max-width: 960px;
          margin: 0 auto;
          padding: 0 24px 80px;
        }

        /* NAV */
        nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 0;
        }
        .nav-logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          letter-spacing: 3px;
          color: var(--white);
        }
        .nav-logo span { color: var(--sun); }
        .nav-cta {
          background: var(--sun);
          color: var(--sky);
          font-weight: 700;
          font-size: 13px;
          padding: 10px 20px;
          border-radius: 30px;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.5px;
          text-decoration: none;
        }
        .nav-cta:hover { background: var(--sun-bright); }

        /* HERO */
        .hero {
          text-align: center;
          padding: 80px 0 60px;
          max-width: 680px;
          margin: 0 auto;
        }
        .hero-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 20px;
        }
        .hero-headline {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(48px, 8vw, 80px);
          line-height: 1;
          letter-spacing: 2px;
          color: var(--white);
          margin-bottom: 20px;
        }
        .hero-headline span { color: var(--sun); }
        .hero-sub {
          font-size: 17px;
          font-weight: 300;
          color: var(--muted);
          line-height: 1.7;
          margin-bottom: 36px;
          max-width: 520px;
          margin-left: auto;
          margin-right: auto;
        }
        .hero-btn {
          display: inline-block;
          background: linear-gradient(135deg, var(--sun), var(--sun-bright));
          color: var(--sky);
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 700;
          padding: 16px 36px;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          text-decoration: none;
          box-shadow: 0 8px 32px rgba(245,166,35,0.3);
        }
        .hero-btn:hover { box-shadow: 0 12px 40px rgba(245,166,35,0.45); }
        .hero-hint {
          font-size: 12px;
          color: var(--muted);
          margin-top: 12px;
        }
          /* HOW IT WORKS */
        .how-section {
          text-align: center;
          padding: 60px 0;
          border-top: 1px solid var(--card-border);
        }
        .section-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 40px;
        }
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
        }
        .step-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 20px;
          padding: 28px 24px;
          text-align: left;
          position: relative;
        }
        .step-number {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 13px;
          letter-spacing: 2px;
          color: var(--muted);
          margin-bottom: 12px;
        }
        .step-icon {
          font-size: 28px;
          margin-bottom: 14px;
        }
        .step-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--white);
          margin-bottom: 8px;
        }
        .step-body {
          font-size: 13px;
          color: var(--muted);
          line-height: 1.6;
        }
          /* STATS */
        .stats-strip {
          display: flex;
          justify-content: center;
          gap: 0;
          border: 1px solid var(--card-border);
          border-radius: 20px;
          overflow: hidden;
          margin-bottom: 60px;
        }
        .stat-item {
          flex: 1;
          padding: 28px 20px;
          text-align: center;
          border-right: 1px solid var(--card-border);
        }
        .stat-item:last-child { border-right: none; }
        .stat-number {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 36px;
          color: var(--sun-bright);
          line-height: 1;
          margin-bottom: 6px;
        }
        .stat-label {
          font-size: 12px;
          color: var(--muted);
          font-weight: 500;
        }
          /* INVITE FORM */
        .invite-section {
          padding: 60px 0;
          border-top: 1px solid var(--card-border);
        }
        .invite-inner {
          max-width: 480px;
          margin: 0 auto;
          text-align: center;
        }
        .invite-headline {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 42px;
          letter-spacing: 2px;
          color: var(--white);
          margin-bottom: 12px;
        }
        .invite-sub {
          font-size: 14px;
          color: var(--muted);
          line-height: 1.7;
          margin-bottom: 32px;
        }
        .invite-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .invite-input {
          width: 100%;
          padding: 14px 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--card-border);
          border-radius: 12px;
          color: var(--white);
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          outline: none;
          appearance: none;
        }
        .invite-input:focus { border-color: var(--sun); }
        .invite-input option { background: var(--sky-mid); color: var(--white); }
        .invite-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, var(--sun), var(--sun-bright));
          color: var(--sky);
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 700;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          box-shadow: 0 8px 32px rgba(245,166,35,0.3);
          margin-top: 4px;
        }
        .invite-btn:hover { box-shadow: 0 12px 40px rgba(245,166,35,0.45); }
        .invite-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* SUCCESS */
        .success-box {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 20px;
          padding: 40px 24px;
        }
        .success-icon { font-size: 48px; margin-bottom: 12px; }
        .success-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 32px;
          color: var(--accent);
          margin-bottom: 8px;
        }
        .success-sub {
          font-size: 14px;
          color: var(--muted);
          line-height: 1.6;
        }
          /* FOOTER */
        .footer {
          text-align: center;
          padding: 48px 0 0;
          border-top: 1px solid var(--card-border);
        }
        .footer-logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          letter-spacing: 3px;
          color: var(--white);
          margin-bottom: 8px;
        }
        .footer-logo span { color: var(--sun); }
        .footer-sub {
          font-size: 13px;
          color: var(--muted);
          margin-bottom: 16px;
        }
        .footer-copy {
          font-size: 11px;
          color: var(--sky-light);
        }
      `}</style>

      <div className="page">
        <nav>
          <div className="nav-logo">PRO<span>PAGES</span></div>
          <a href="#invite" className="nav-cta">Request Invite</a>
        </nav>

        <div className="hero">
          <div className="hero-eyebrow">For Door-to-Door Sales Reps</div>
          <h1 className="hero-headline">
            Your leads deserve a <span>pro page</span>
          </h1>
          <p className="hero-sub">
            ProPages gives every rep a mobile-optimized landing page they can share via QR code or link — so homeowners can find you, trust you, and reach out on their own time.
          </p>
          <a href="#invite" className="hero-btn">Request Early Access →</a>
          <p className="hero-hint">Invite only · Free to apply</p>
        </div>

        <div className="stats-strip">
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Reps on the waitlist</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">3,200+</div>
            <div className="stat-label">Leads captured</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">12</div>
            <div className="stat-label">Industries served</div>
          </div>
        </div>

      <div className="how-section">
          <div className="section-label">How It Works</div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <div className="step-icon">⚡</div>
              <div className="step-title">Get Your Page</div>
              <div className="step-body">Request an invite, pick your slug, and your ProPage is live in minutes.</div>
            </div>
            <div className="step-card">
              <div className="step-number">02</div>
              <div className="step-icon">📲</div>
              <div className="step-title">Share It Anywhere</div>
              <div className="step-body">Drop your QR code on leave-behinds, texts, or business cards. One scan and they're on your page.</div>
            </div>
            <div className="step-card">
              <div className="step-number">03</div>
              <div className="step-icon">🎯</div>
              <div className="step-title">Capture the Lead</div>
              <div className="step-body">Homeowners fill out your form on their own time. You get notified. No lead slips through.</div>
            </div>
          </div>
        </div>

        <div className="invite-section" id="invite">
          <div className="invite-inner">
            <div className="section-label">Early Access</div>
            <h2 className="invite-headline">Want your own ProPage?</h2>
            <p className="invite-sub">We're rolling out invites to reps in waves. Drop your info and we'll reach out when your spot is ready.</p>

            {submitted ? (
              <div className="success-box">
                <div className="success-icon">🎉</div>
                <div className="success-title">You're on the list!</div>
                <div className="success-sub">We'll email you when your invite is ready. Sit tight — it won't be long.</div>
              </div>
            ) : (
              <form className="invite-form" onSubmit={handleSubmit}>
                <input
                  className="invite-input"
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <input
                  className="invite-input"
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <select
                  className="invite-input"
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
                <button className="invite-btn" type="submit" disabled={loading}>
                  {loading ? 'Sending...' : 'Request My Invite →'}
                </button>
              </form>
            )}
          </div>
        </div>

      <div className="footer">
          <div className="footer-logo">PRO<span>PAGES</span></div>
          <p className="footer-sub">Built for the reps who show up every day.</p>
          <p className="footer-copy">© 2026 ProPages. All rights reserved.</p>
        </div>

      </div>
    </>
  );
}