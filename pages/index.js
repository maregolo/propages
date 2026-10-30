import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [formData, setFormData] = useState({ name: '', email: '', industry: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const fhItemRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = fhItemRefs.current.indexOf(entry.target);
            if (index !== -1) setActiveFeature(index);
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    fhItemRefs.current.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);

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

    await fetch('/api/notify-invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: formData.name, email: formData.email }),
    });

    setLoading(false);
    setSubmitted(true);
  }

  return (
    <>
      <Head>
        <title>ProPages – The only link-in-bio built for sales.</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;700;800&display=swap" rel="stylesheet" />
      </Head>

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
        #features, #pricing, #how-it-works, #invite { scroll-margin-top: 64px; }
        body {
          background: var(--sky);
          color: var(--white);
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* ── NAV ── */
        .nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 40px;
          background: rgba(13,17,23,0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(123,111,232,0.2);
          box-shadow: 0 1px 0 rgba(123,111,232,0.06), 0 4px 24px rgba(0,0,0,0.4);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          text-decoration: none;
        }
        .nav-logo-text {
          font-size: 16px;
          font-weight: 800;
          color: var(--white);
          letter-spacing: -0.3px;
          font-family: 'DM Sans', sans-serif;
        }
        .nav-logo-text span { color: var(--purple); }
        .nav-links { display: flex; align-items: center; gap: 24px; }
        .nav-link {
          font-size: 13px;
          font-weight: 500;
          color: var(--muted);
          text-decoration: none;
          transition: color 0.15s ease;
        }
        .nav-link:hover { color: var(--white); }
        .nav-link-soon {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 500;
          color: var(--muted);
          cursor: default;
        }
        .nav-badge-soon {
          background: rgba(245,166,35,0.12);
          color: var(--sun);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          padding: 3px 7px;
          border-radius: 20px;
          white-space: nowrap;
        }
        @media (max-width: 860px) {
          .nav-links { display: none; }
        }
        .nav-right { display: flex; align-items: center; gap: 20px; }
        .nav-login {
          font-size: 13px;
          color: var(--muted);
          font-weight: 500;
          text-decoration: none;
        }
        .nav-login:hover { color: var(--white); }
        .nav-btn {
          background: var(--purple);
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          padding: 8px 18px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          text-decoration: none;
          box-shadow: 0 2px 12px rgba(123,111,232,0.3);
        }
        .nav-btn:hover { background: #6a5fd6; box-shadow: 0 4px 16px rgba(123,111,232,0.45); }

        /* ── HERO ── */
        .hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: calc(100vh - 49px);
          overflow: hidden;
        }
        .hero-left {
          padding: 44px 65px;
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
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--accent);
          animation: blink 2s ease-in-out infinite;
        }
        @keyframes blink {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.3; }
        }
        .headline {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 60px;
          line-height: 1.0;
          letter-spacing: 1px;
          color: var(--white);
          margin-bottom: 4px;
        }
        .headline-b {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 60px;
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
        .cta-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }
        .cta-primary {
          background: linear-gradient(135deg, var(--sun), var(--sun-bright));
          color: var(--sky);
          font-size: 14px;
          font-weight: 700;
          padding: 13px 22px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          text-decoration: none;
          white-space: nowrap;
        }
        .cta-primary:hover { box-shadow: 0 8px 24px rgba(245,166,35,0.35); }
        .cta-secondary {
          font-size: 13px;
          color: var(--muted);
          font-weight: 500;
          padding: 13px 16px;
          border-radius: 10px;
          border: 1px solid var(--card-border);
          background: transparent;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          text-decoration: none;
          white-space: nowrap;
        }
        .cta-secondary:hover { border-color: rgba(255,255,255,0.15); color: var(--white); }
        .hero-hint { font-size: 11px; color: var(--dim); }

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
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(123,111,232,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(123,111,232,0.04) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .hero-bg-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 60% 50%, rgba(123,111,232,0.06) 0%, transparent 70%);
        }

        /* ── PHONE MOCKUP ── */
        .phone {
          position: absolute;
          width: 162px;
          background: linear-gradient(160deg, #1e2a3a 0%, var(--sky-light) 50%, #0f1922 100%);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 26px;
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
          top: 50%;
          left: 50%;
          transform: translate(-130%, -50%) rotate(-8deg) scale(1.5);
          opacity: 0.95;
          z-index: 2;
        }
        .phone-front {
          top: 50%;
          left: 50%;
          transform: translate(-190%, -50%) rotate(-20deg) scale(1.5);
          z-index: 3;
        }
        .phone-notch {
          width: 44px;
          height: 4px;
          background: rgba(255,255,255,0.07);
          border-radius: 3px;
          margin: 0 auto 12px;
        }
        .phone-brand {
          font-size: 7px;
          font-weight: 700;
          letter-spacing: 2px;
          color: var(--dimmer);
          text-align: center;
          margin-bottom: 10px;
          font-family: monospace;
        }
        .phone-avatar-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 7px;
          position: relative;
        }
        .phone-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #1D3461;
          border: 2px solid var(--sun);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          color: var(--sun);
        }
        .phone-status {
          position: absolute;
          bottom: 1px;
          right: calc(50% - 22px);
          width: 9px;
          height: 9px;
          background: var(--accent);
          border-radius: 50%;
          border: 2px solid var(--sky-light);
        }
        .phone-name {
          text-align: center;
          font-size: 11px;
          font-weight: 700;
          color: var(--white);
          margin-bottom: 2px;
        }
        .phone-title {
          text-align: center;
          font-size: 8px;
          color: var(--sun);
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 3px;
        }
        .phone-verified {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          font-size: 8px;
          color: var(--purple);
          font-weight: 600;
          margin-bottom: 10px;
        }
        .phone-verified-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--purple);
        }
        .phone-divider {
          height: 1px;
          background: rgba(255,255,255,0.05);
          margin-bottom: 9px;
        }
        .phone-field {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 5px;
          padding: 6px 8px;
          font-size: 9px;
          color: var(--dim);
          margin-bottom: 5px;
        }
        .phone-submit {
          width: 100%;
          background: var(--accent);
          color: var(--sky);
          font-size: 9px;
          font-weight: 700;
          padding: 7px;
          border-radius: 5px;
          text-align: center;
          margin-top: 2px;
        }
        .phone-url {
          text-align: center;
          font-size: 8px;
          color: var(--dimmer);
          margin-top: 9px;
          font-family: monospace;
        }

        /* ── Light-theme phone variant (Slate) — used to break up the two-dark-phone stack ── */
        .phone-light {
          background: linear-gradient(160deg, #FFFFFF 0%, #F4F6F8 55%, #E8ECF0 100%);
          border: 1px solid rgba(13,17,23,0.10);
        }
        .phone-light .phone-notch { background: rgba(13,17,23,0.12); }
        .phone-light .phone-brand { color: #8899AA; }
        .phone-light .phone-avatar { background: #EFF3F7; border-color: #1D3461; color: #1D3461; }
        .phone-light .phone-status { background: #1D3461; border-color: #FFFFFF; }
        .phone-light .phone-name { color: #0D1117; }
        .phone-light .phone-divider { background: rgba(13,17,23,0.07); }
        .phone-light .phone-field { background: rgba(13,17,23,0.03); border-color: rgba(13,17,23,0.10); color: #4A5568; }
        .phone-light .phone-submit { background: #1D3461; color: #FFFFFF; }
        .phone-light .phone-url { color: #8899AA; }


        /* ── PROOF BAR ── */
        .proof-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 28px;
          padding: 14px 40px;
          border-top: 1px solid var(--card-border);
          border-bottom: 1px solid var(--card-border);
          background: rgba(255,255,255,0.01);
        }
        .proof-item { display: flex; align-items: center; gap: 8px; }
        .proof-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); flex-shrink: 0; }
        .proof-text { font-size: 13px; color: var(--muted); }
        .proof-text strong { color: var(--white); font-weight: 600; }
        .proof-sep { width: 1px; height: 14px; background: var(--card-border); }

        /* ── PRICING (ITEMIZED LEDGER) ── */
        .pricing-section {
          padding: 80px 40px;
          border-bottom: 1px solid var(--card-border);
          max-width: 640px;
          margin: 0 auto;
        }
        .pricing-section-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--dim);
          margin-bottom: 16px;
          text-align: center;
        }
        .pricing-headline {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 32px;
          letter-spacing: 0.5px;
          color: var(--white);
          text-align: center;
          margin-bottom: 32px;
        }
        .ledger-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 14px;
          padding: 20px 24px;
          max-width: 460px;
          margin: 0 auto;
        }
        .ledger-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 7px 0;
        }
        .ledger-row + .ledger-row {
          border-top: 1px solid var(--card-border);
        }
        .ledger-feature { font-size: 13px; color: var(--white); font-weight: 500; }
        .ledger-feature-note { font-size: 10.5px; color: var(--dim); margin-top: 1px; }
        .ledger-cost { font-size: 13px; color: var(--muted); font-variant-numeric: tabular-nums; }
        .ledger-subtotal-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 12px 0 0;
          margin-top: 4px;
          border-top: 1px dashed var(--card-border);
        }
        .ledger-subtotal-label { font-size: 11px; color: var(--dim); text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; }
        .ledger-subtotal-value {
          font-size: 14px;
          color: var(--dim);
          text-decoration: line-through;
          text-decoration-color: rgba(245,166,35,0.4);
          font-variant-numeric: tabular-nums;
        }
        .ledger-final-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 20px;
          margin-top: 12px;
          background: rgba(245,166,35,0.08);
          border: 1px solid rgba(245,166,35,0.25);
          border-radius: 10px;
        }
        .ledger-final-label { font-size: 13px; font-weight: 700; color: var(--white); }
        .ledger-final-price { font-family: 'Bebas Neue', sans-serif; font-size: 52px; color: var(--sun); letter-spacing: 0.5px; line-height: 1; }
        .ledger-final-price span { font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; color: var(--dim); margin-left: 4px; }
        .pricing-fineprint { text-align: center; font-size: 13px; color: var(--dim); margin-top: 20px; }
        .pricing-cta-row { text-align: center; margin-top: 28px; }

        /* ── HOW IT WORKS ── */
        .how-section {
          padding: 56px 40px;
          border-bottom: 1px solid var(--card-border);
        }
        .section-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--dim);
          text-align: center;
          margin-bottom: 36px;
        }
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          max-width: 960px;
          margin: 0 auto;
        }
        .step-card {
          background: var(--sky-light);
          border: 1px solid var(--card-border);
          border-radius: 14px;
          padding: 24px 20px;
        }
        .step-num {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          color: var(--dim);
          margin-bottom: 14px;
        }
        .step-icon {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          background: rgba(123,111,232,0.1);
          border: 1px solid rgba(123,111,232,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          margin-bottom: 14px;
        }
        .step-title { font-size: 15px; font-weight: 700; color: var(--white); margin-bottom: 8px; }
        .step-body { font-size: 13px; color: var(--muted); line-height: 1.6; }

        /* ── PAIN SECTION ── */
        .pain-section {
          padding: 80px 40px;
          border-bottom: 1px solid var(--card-border);
          max-width: 860px;
          margin: 0 auto;
        }
        .pain-section-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--dim);
          margin-bottom: 40px;
        }
        .pain-headline {
          font-size: 42px;
          font-weight: 800;
          color: var(--white);
          letter-spacing: -1px;
          line-height: 1.1;
          margin-bottom: 32px;
          max-width: 680px;
        }
        .pain-headline .accent { color: var(--sun); }
        .pain-body-wrap {
          border-left: 2px solid rgba(245,166,35,0.25);
          padding-left: 24px;
          max-width: 560px;
        }
        .pain-body {
          font-size: 17px;
          color: var(--muted);
          line-height: 1.8;
          margin-bottom: 0;
        }
        .pain-closer {
          font-size: 18px;
          font-weight: 800;
          color: var(--sun);
          margin-top: 20px;
        }

        /* ── FEATURES SECTION ── */
        .features-section {
          padding: 80px 40px;
          border-bottom: 1px solid var(--card-border);
          max-width: 1040px;
          margin: 0 auto;
        }
        .features-section-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--dim);
          margin-bottom: 56px;
        }
        .hero-feature {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 56px;
          align-items: center;
          margin-bottom: 72px;
          padding-bottom: 72px;
          border-bottom: 1px solid var(--card-border);
        }
        .hero-feature:last-of-type {
          border-bottom: none;
          margin-bottom: 56px;
          padding-bottom: 0;
        }
        .feat-eyebrow {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--purple);
          margin-bottom: 12px;
        }
        .feat-headline {
          font-size: 28px;
          font-weight: 800;
          color: var(--white);
          letter-spacing: -0.5px;
          line-height: 1.2;
          margin-bottom: 14px;
        }
        .feat-body {
          font-size: 15px;
          color: var(--muted);
          line-height: 1.8;
          margin-bottom: 18px;
        }
        .feat-kicker {
          font-size: 13px;
          font-weight: 700;
          color: var(--sun);
        }
        .feat-visual {
          background: var(--sky-mid);
          border: 1px solid var(--card-border);
          border-radius: 16px;
          padding: 28px;
          min-height: 220px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Lead capture visual */
        .form-card {
          width: 100%;
          background: var(--sky);
          border: 1px solid var(--card-border);
          border-radius: 12px;
          padding: 18px;
        }
        .form-header {
          font-size: 13px;
          font-weight: 700;
          color: var(--white);
          margin-bottom: 4px;
        }
        .form-sub {
          font-size: 11px;
          color: var(--dim);
          margin-bottom: 14px;
          font-family: monospace;
        }
        .form-field {
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--card-border);
          border-radius: 6px;
          padding: 9px 11px;
          font-size: 12px;
          color: var(--dim);
          margin-bottom: 7px;
        }
        .form-btn {
          background: var(--sun);
          color: var(--sky);
          font-size: 12px;
          font-weight: 800;
          padding: 10px;
          border-radius: 6px;
          text-align: center;
          margin-top: 4px;
        }
        .form-notify {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(0,229,190,0.05);
          border: 1px solid rgba(0,229,190,0.12);
          border-radius: 8px;
          padding: 9px 11px;
          margin-top: 10px;
        }
        .form-notify-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          flex-shrink: 0;
        }
        .form-notify-text {
          font-size: 11px;
          color: var(--accent);
        }

        /* Page visual (mini phone) */
        .feat-mini-phone {
          width: 130px;
          background: linear-gradient(160deg, #1e2a3a 0%, var(--sky-light) 50%, #0f1922 100%);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 24px;
          padding: 14px 11px 16px;
          margin: 0 auto;
          box-shadow: 0 30px 60px rgba(0,0,0,0.5);
        }
        .feat-phone-notch {
          width: 32px;
          height: 3px;
          background: rgba(255,255,255,0.06);
          border-radius: 2px;
          margin: 0 auto 10px;
        }
        .feat-phone-brand {
          font-size: 6px;
          font-weight: 700;
          letter-spacing: 2px;
          color: var(--dimmer);
          text-align: center;
          margin-bottom: 9px;
          font-family: monospace;
        }
        .feat-phone-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #1D3461;
          border: 2px solid var(--sun);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          color: var(--sun);
          margin: 0 auto 5px;
        }
        .feat-phone-name {
          text-align: center;
          font-size: 9px;
          font-weight: 700;
          color: var(--white);
          margin-bottom: 2px;
        }
        .feat-phone-title {
          text-align: center;
          font-size: 7px;
          color: var(--sun);
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .feat-phone-divider {
          height: 1px;
          background: rgba(255,255,255,0.05);
          margin-bottom: 8px;
        }
        .feat-phone-field {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 4px;
          padding: 5px 7px;
          font-size: 7px;
          color: var(--dim);
          margin-bottom: 4px;
        }
        .feat-phone-btn {
          background: var(--sun);
          color: var(--sky);
          font-size: 7px;
          font-weight: 700;
          padding: 5px;
          border-radius: 4px;
          text-align: center;
          margin-top: 4px;
        }
        .feat-phone-url {
          text-align: center;
          font-size: 6px;
          color: var(--dimmer);
          margin-top: 8px;
          font-family: monospace;
        }

        /* Referral visual */
        .ref-visual { width: 100%; }
        .ref-link-row {
          font-size: 12px;
          font-weight: 700;
          color: var(--purple);
          background: rgba(123,111,232,0.06);
          border: 1px solid rgba(123,111,232,0.12);
          border-radius: 8px;
          padding: 9px 13px;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .ref-link-copy { font-size: 11px; color: var(--dim); font-weight: 400; }
        .ref-chain { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .ref-av {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 700;
        }
        .ref-arrow { font-size: 12px; color: var(--dimmer); }
        .ref-label { font-size: 12px; color: var(--muted); }

        /* ── FEATURE HIGHLIGHT ── */
        .fh-section {
          display: flex;
          gap: 56px;
          align-items: flex-start;
          margin-top: 48px;
          width: 100%;
        }
        .fh-visual-col {
          width: 380px;
          flex-shrink: 0;
          position: sticky;
          top: 100px;
        }
        .fh-visual-frame {
          background: var(--sky-mid);
          border: 1px solid var(--card-border);
          border-radius: 16px;
          padding: 32px 28px;
          min-height: 340px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .fh-list {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .fh-item {
          padding: 26px 0 26px 24px;
          border-left: 2px solid transparent;
          cursor: pointer;
          transition: border-color 0.2s, opacity 0.2s;
          opacity: 0.3;
        }
        .fh-item.active {
          opacity: 1;
          border-left-color: var(--purple);
        }
        .fh-item.active.gateway {
          border-left-color: var(--sun);
        }
        .fh-eyebrow {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--purple);
          margin-bottom: 7px;
        }
        .fh-item.active.gateway .fh-eyebrow { color: var(--sun); }
        .fh-title {
          font-size: 20px;
          font-weight: 700;
          color: var(--white);
          margin-bottom: 6px;
        }
        .fh-body {
          font-size: 15px;
          color: var(--muted);
          line-height: 1.6;
          max-width: 420px;
        }
        /* Visual: URL card */
        .vis-url-card {
          width: 100%;
          background: var(--sky);
          border: 1px solid rgba(123,111,232,0.2);
          border-radius: 12px;
          padding: 26px 22px;
        }
        .vis-url-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--dim);
          margin-bottom: 12px;
        }
        .vis-url-pill {
          background: rgba(123,111,232,0.1);
          border: 1px solid rgba(123,111,232,0.25);
          border-radius: 8px;
          padding: 13px 16px;
          font-size: 15px;
          color: var(--purple);
          font-family: monospace;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .vis-url-copy {
          font-size: 12px;
          color: var(--dim);
          font-family: 'DM Sans', sans-serif;
        }
        .vis-url-note {
          font-size: 12px;
          color: var(--dim);
          text-align: center;
          margin-top: 4px;
        }
        /* Visual: Analytics */
        .vis-analytics {
          width: 100%;
        }
        .vis-chart {
          display: flex;
          align-items: flex-end;
          gap: 6px;
          height: 110px;
          margin-bottom: 16px;
        }
        .vis-bar-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          height: 100%;
          justify-content: flex-end;
        }
        .vis-bar {
          width: 100%;
          border-radius: 4px 4px 0 0;
          background: rgba(123,111,232,0.25);
          transition: background 0.2s;
        }
        .vis-bar.highlight { background: var(--purple); }
        .vis-bar-label {
          font-size: 10px;
          color: var(--dim);
          text-align: center;
        }
        .vis-stat-row {
          display: flex;
          gap: 8px;
        }
        .vis-stat {
          flex: 1;
          background: var(--sky);
          border: 1px solid var(--card-border);
          border-radius: 8px;
          padding: 9px 10px;
        }
        .vis-stat-num {
          font-size: 20px;
          font-weight: 700;
          color: var(--white);
          margin-bottom: 3px;
        }
        .vis-stat-label {
          font-size: 10px;
          color: var(--dim);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        /* Visual: Customization */
        .vis-blocks {
          width: 100%;
        }
        .vis-block-item {
          background: var(--sky);
          border: 1px solid var(--card-border);
          border-radius: 8px;
          padding: 13px 15px;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .vis-block-icon {
          font-size: 20px;
          flex-shrink: 0;
        }
        .vis-block-text { flex: 1; }
        .vis-block-name {
          font-size: 14px;
          font-weight: 700;
          color: var(--white);
          margin-bottom: 2px;
        }
        .vis-block-sub {
          font-size: 12px;
          color: var(--dim);
        }
        .vis-block-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--purple);
          opacity: 0.5;
          flex-shrink: 0;
        }
        /* Visual: Live in Minutes */
        .vis-steps {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .vis-step-row {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--sky);
          border: 1px solid var(--card-border);
          border-radius: 8px;
          padding: 14px 16px;
        }
        .vis-step-row.done {
          border-color: rgba(0,229,190,0.2);
          background: rgba(0,229,190,0.04);
        }
        .vis-step-row.active-step {
          border-color: rgba(245,166,35,0.25);
          background: rgba(245,166,35,0.06);
        }
        .vis-step-num {
          font-size: 10px;
          font-weight: 700;
          color: var(--dim);
          width: 16px;
          flex-shrink: 0;
        }
        .vis-step-row.done .vis-step-num { color: var(--accent); }
        .vis-step-row.active-step .vis-step-num { color: var(--sun); }
        .vis-step-label {
          font-size: 14px;
          font-weight: 700;
          color: var(--muted);
        }
        .vis-step-row.done .vis-step-label { color: var(--accent); }
        .vis-step-row.active-step .vis-step-label { color: var(--sun); }
        .vis-step-check {
          margin-left: auto;
          font-size: 12px;
        }
        /* Visual: Gateway */
        .vis-gateway {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .vis-gw-row {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--sky);
          border: 1px solid var(--card-border);
          border-radius: 8px;
          padding: 14px 16px;
          transition: border-color 0.2s, background 0.2s;
        }
        .vis-gw-row.lit {
          border-color: rgba(245,166,35,0.22);
          background: rgba(245,166,35,0.05);
        }
        .vis-gw-icon { font-size: 20px; flex-shrink: 0; }
        .vis-gw-text { flex: 1; }
        .vis-gw-name {
          font-size: 14px;
          font-weight: 700;
          color: var(--muted);
        }
        .vis-gw-row.lit .vis-gw-name { color: var(--sun); }
        .vis-gw-sub {
          font-size: 12px;
          color: var(--dim);
          margin-top: 2px;
        }
        .vis-gw-arrow { font-size: 11px; color: var(--dimmer); }
        .vis-gw-row.lit .vis-gw-arrow { color: var(--sun); opacity: 0.6; }

        /* ── INVITE FORM ── */
        /* ── INVITE FORM ── */
        .invite-section {
          padding: 56px 40px;
          border-bottom: 1px solid var(--card-border);
        }
        .invite-inner {
          max-width: 440px;
          margin: 0 auto;
          background: var(--sky-light);
          border: 1px solid var(--card-border);
          border-radius: 20px;
          padding: 36px 32px;
        }
        .invite-badge {
          display: inline-block;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--purple);
          background: rgba(123,111,232,0.1);
          border: 1px solid rgba(123,111,232,0.2);
          padding: 3px 10px;
          border-radius: 20px;
          margin-bottom: 14px;
        }
        .invite-headline {
          font-size: 26px;
          font-weight: 800;
          color: var(--white);
          margin-bottom: 6px;
          letter-spacing: -0.5px;
          line-height: 1.2;
        }
        .invite-sub {
          font-size: 13px;
          color: var(--muted);
          margin-bottom: 22px;
          line-height: 1.6;
        }
        .invite-input {
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
        .invite-input:focus { border-color: var(--sun); }
        .invite-input option { background: var(--sky-mid); }
        .invite-btn {
          width: 100%;
          background: linear-gradient(135deg, var(--sun), var(--sun-bright));
          color: var(--sky);
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 700;
          padding: 14px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          margin-top: 4px;
        }
        .invite-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .invite-btn:hover:not(:disabled) { box-shadow: 0 8px 24px rgba(245,166,35,0.35); }

        /* ── SUCCESS ── */
        .success-box {
          text-align: center;
          padding: 20px 0;
        }
        .success-icon { font-size: 44px; margin-bottom: 12px; }
        .success-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 30px;
          color: var(--accent);
          margin-bottom: 8px;
        }
        .success-sub { font-size: 14px; color: var(--muted); line-height: 1.6; }

        /* ── FOOTER ── */
        .footer {
          text-align: center;
          padding: 36px 40px;
        }
        .footer-wordmark {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 4px;
          color: var(--dimmer);
          font-family: monospace;
          margin-bottom: 8px;
        }
        .footer-tag { font-size: 13px; color: #334455; margin-bottom: 12px; }
        .footer-copy { font-size: 11px; color: #1E2830; }

        /* ══════════════════════════════════════════════════
           MOBILE OVERRIDES
           Placed last on purpose: base rules for .features-section,
           .hero-feature, .fh-section, etc. are declared further up
           the file, and with equal specificity, source order decides
           the winner regardless of @media nesting. Keep this block
           last so it always wins the cascade on mobile.
           ══════════════════════════════════════════════════ */
        @media (max-width: 860px) {
          /* Hero + phone mockups */
          .hero {
            grid-template-columns: 1fr;
            min-height: auto;
          }
          .hero-left {
            padding: 40px 24px 32px;
          }
          .headline, .headline-b {
            font-size: 40px;
          }
          .hero-sub {
            font-size: 16px;
            max-width: 100%;
          }
          .hero-right {
            border-left: none;
            border-top: 1px solid var(--card-border);
            min-height: 300px;
            padding: 60px 20px;
            overflow: hidden;
          }
          .phone {
            width: 128px;
          }
          .phone-back {
            transform: translate(-80%, -50%) rotate(-8deg) scale(1);
          }
          .phone-front {
            transform: translate(-20%, -50%) rotate(-14deg) scale(1);
          }

          /* Features section */
          .features-section {
            padding: 56px 20px;
          }
          .features-section-label {
            margin-bottom: 40px;
          }
          .hero-feature {
            grid-template-columns: 1fr;
            gap: 28px;
            margin-bottom: 48px;
            padding-bottom: 48px;
          }
          .hero-feature > div:not(.feat-visual) {
            order: 1;
          }
          .hero-feature > .feat-visual {
            order: 2;
          }
          .feat-headline {
            font-size: 24px;
          }
          .feat-visual {
            padding: 20px;
            min-height: 0;
          }

          /* Feature Highlight sticky showcase — stack instead of side-by-side */
          .fh-section {
            flex-direction: column;
            gap: 28px;
            margin-top: 32px;
          }
          .fh-visual-col {
            width: 100%;
            position: sticky;
            top: 64px;
            z-index: 2;
          }
          .fh-visual-frame {
            min-height: 0;
            padding: 20px 16px;
          }
          .fh-item {
            padding: 20px 0 20px 18px;
          }
          .fh-title {
            font-size: 18px;
          }
          .fh-body {
            max-width: 100%;
          }
        }
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <a href="/" className="nav-logo">
          <span className="nav-logo-text">pro<span>pages</span></span>
        </a>
        <div className="nav-links">
          <a href="#features" className="nav-link">Features</a>
          <a href="#pricing" className="nav-link">Pricing</a>
          <a href="#how-it-works" className="nav-link">How It Works</a>
          <span className="nav-link-soon" title="LeadMarket — coming soon">
            LeadMarket
            <span className="nav-badge-soon">Coming soon</span>
          </span>
        </div>
        <div className="nav-right">
          <a href="/signup" className="nav-login">Log in</a>
          <a href="#invite" className="nav-btn">Request Invite</a>
        </div>
      </nav>

      {/* HERO */}
      <div className="hero">

        {/* LEFT */}
        <div className="hero-left">
          <div className="eyebrow">
            <div className="eyebrow-dot"></div>
            For Reps, Contractors &amp; Closers
          </div>
          <div className="headline">The only link-in-bio</div>
          <div className="headline-b">built for sales.</div>
          <p className="hero-sub">
            One link working around the clock — <strong>capturing leads, building your reputation, and starting conversations</strong> before you ever pitch.
          </p>
          <div className="cta-row">
            <a href="#invite" className="cta-primary">Request Early Access →</a>
            <a href="/jake-rivera" target="_blank" className="cta-secondary">See an example ↗</a>
          </div>
          <p className="hero-hint">Invite only · Free to apply</p>
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
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
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

          {/* Front phone — Jake (light theme, Variant A) */}
          <div className="phone phone-front phone-light">
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

        </div> {/* end hero-right */}
      </div> {/* end hero */}

      {/* PROOF BAR */}
      <div className="proof-bar">
        <div className="proof-item">
          <div className="proof-dot"></div>
          <div className="proof-text"><strong>500+</strong> reps on the waitlist</div>
        </div>
        <div className="proof-sep"></div>
        <div className="proof-item">
          <div className="proof-dot"></div>
          <div className="proof-text"><strong>3,200+</strong> leads captured</div>
        </div>
        <div className="proof-sep"></div>
        <div className="proof-item">
          <div className="proof-dot"></div>
          <div className="proof-text"><strong>12</strong> industries served</div>
        </div>
      </div>

      {/* PAIN SECTION */}
      <div style={{ borderBottom: '1px solid var(--card-border)' }}>
        <div className="pain-section">
          <div className="pain-section-label">The Problem</div>
          <div className="pain-headline">
            The internet is the <span className="accent">greatest wealth-generating machine ever built.</span> You're not plugged into it.
          </div>
          <div className="pain-body-wrap">
            <div className="pain-body">
              Creators have it. Online stores have it. Every brand on the internet has it — a way to capture leads, grow an audience, and make money while they sleep. You've been doing it the hard way.
            </div>
            <div className="pain-closer">One link changes that. →</div>
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div id="features" style={{ borderBottom: '1px solid var(--card-border)' }}>
        <div className="features-section">
          <div className="features-section-label">How It Works For You</div>

          {/* Feature 1: Lead Capture */}
          <div className="hero-feature">
            <div>
              <div className="feat-eyebrow">Always On</div>
              <div className="feat-headline">24/7 lead capture.</div>
              <div className="feat-body">Amazon never closes. Neither does your ProPage. The biggest brands in the world have a digital salesman working around the clock — capturing leads, qualifying prospects, filling the pipeline. Now you have one too.</div>
              <div className="feat-kicker">The door closes. Your page stays open. →</div>
            </div>
            <div className="feat-visual">
              <div className="form-card">
                <div className="form-header">Get a Free Quote</div>
                <div className="form-sub">propages.com/jake-rivera</div>
                <div className="form-field">Full name</div>
                <div className="form-field">Phone number</div>
                <div className="form-field">What's your biggest concern? ↓</div>
                <div className="form-btn">Send My Info →</div>
                <div className="form-notify">
                  <div className="form-notify-dot"></div>
                  <div className="form-notify-text">New lead — Marcus T. just submitted · 2 min ago</div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2: The Page */}
          <div className="hero-feature">
            <div className="feat-visual">
              <div className="feat-mini-phone">
                <div className="feat-phone-notch"></div>
                <div className="feat-phone-brand">PROPAGES</div>
                <div className="feat-phone-avatar">JR</div>
                <div className="feat-phone-name">Jake Rivera</div>
                <div className="feat-phone-title">Solar · Phoenix, AZ</div>
                <div className="feat-phone-divider"></div>
                <div className="feat-phone-field">Your name</div>
                <div className="feat-phone-field">Phone number</div>
                <div className="feat-phone-btn">Get My Free Estimate</div>
                <div className="feat-phone-url">propages.com/jake-rivera</div>
              </div>
            </div>
            <div>
              <div className="feat-eyebrow">Your Digital Presence</div>
              <div className="feat-headline">A page you're actually proud to share.</div>
              <div className="feat-body">Not a generic form. Not a basic link tree. A real, designed page with your name, your industry, your story — that you'd send to your best prospect without hesitation. First impressions happen online now. Make yours count.</div>
              <div className="feat-kicker">propages.com/yourname — live in minutes. →</div>
            </div>
          </div>

          {/* Feature 3: Referrals */}
          <div className="hero-feature">
            <div>
              <div className="feat-eyebrow">Word of Mouth, Automated</div>
              <div className="feat-headline">Give your best customers something to send.</div>
              <div className="feat-body">The best lead you'll ever get is a warm referral. But referrals die without a destination. ProPages gives every satisfied customer a link to share and a form that captures their neighbor the moment they're ready. Word of mouth, finally working at scale.</div>
              <div className="feat-kicker">Your reputation, shareable. →</div>
            </div>
            <div className="feat-visual">
              <div className="ref-visual">
                <div className="ref-link-row">
                  <span>propages.com/jake?ref=sandra</span>
                  <span className="ref-link-copy">Copy</span>
                </div>
                <div className="ref-chain">
                  <div className="ref-av" style={{ background: 'rgba(245,166,35,0.12)', color: 'var(--sun)' }}>JR</div>
                  <div className="ref-arrow">→</div>
                  <div className="ref-av" style={{ background: 'rgba(0,229,190,0.08)', color: 'var(--accent)' }}>SK</div>
                  <div className="ref-arrow">→</div>
                  <div className="ref-av" style={{ background: 'rgba(123,111,232,0.08)', color: 'var(--purple)' }}>+3</div>
                </div>
                <div className="ref-label">Sandra referred 3 neighbors this month</div>
              </div>
            </div>
          </div>

          {/* Feature Highlight */}
          <div className="fh-section">

            {/* Left: sticky visual */}
            <div className="fh-visual-col">
              <div className="fh-visual-frame">
                {activeFeature === 0 && (
                  <div className="vis-url-card">
                    <div className="vis-url-label">Your Link</div>
                    <div className="vis-url-pill">
                      <span>propages.com/yourname</span>
                      <span className="vis-url-copy">Copy</span>
                    </div>
                    <div className="vis-url-note">Permanent. Professional. Yours.</div>
                  </div>
                )}
                {activeFeature === 1 && (
                  <div className="vis-analytics">
                    <div className="vis-chart">
                      {[30,55,45,70,60,88,75].map((h,i) => (
                        <div key={i} className="vis-bar-col">
                          <div className="vis-bar" style={{ height: h + '%', ...(i === 5 ? { background: 'var(--purple)' } : {}) }} />
                          <div className="vis-bar-label">{['M','T','W','T','F','S','S'][i]}</div>
                        </div>
                      ))}
                    </div>
                    <div className="vis-stat-row">
                      <div className="vis-stat">
                        <div className="vis-stat-num">247</div>
                        <div className="vis-stat-label">Page Views</div>
                      </div>
                      <div className="vis-stat">
                        <div className="vis-stat-num">18%</div>
                        <div className="vis-stat-label">Conversion</div>
                      </div>
                      <div className="vis-stat">
                        <div className="vis-stat-num">44</div>
                        <div className="vis-stat-label">Leads</div>
                      </div>
                    </div>
                  </div>
                )}
                {activeFeature === 2 && (
                  <div className="vis-blocks">
                    {[
                      { icon: '🔧', name: 'Services', sub: '3 offerings listed' },
                      { icon: '⭐', name: 'Reviews', sub: '12 verified reviews' },
                      { icon: '📜', name: 'Certifications', sub: 'NABCEP · EPA 608' },
                      { icon: '📷', name: 'Gallery', sub: '8 project photos' },
                    ].map((b,i) => (
                      <div key={i} className="vis-block-item">
                        <div className="vis-block-icon">{b.icon}</div>
                        <div className="vis-block-text">
                          <div className="vis-block-name">{b.name}</div>
                          <div className="vis-block-sub">{b.sub}</div>
                        </div>
                        <div className="vis-block-dot" />
                      </div>
                    ))}
                  </div>
                )}
                {activeFeature === 3 && (
                  <div className="vis-steps">
                    <div className="vis-step-row done">
                      <div className="vis-step-num">01</div>
                      <div className="vis-step-label">Claim your handle</div>
                      <div className="vis-step-check">✓</div>
                    </div>
                    <div className="vis-step-row done">
                      <div className="vis-step-num">02</div>
                      <div className="vis-step-label">Customize your page</div>
                      <div className="vis-step-check">✓</div>
                    </div>
                    <div className="vis-step-row active-step">
                      <div className="vis-step-num">03</div>
                      <div className="vis-step-label">Share your link</div>
                      <div className="vis-step-check">→</div>
                    </div>
                  </div>
                )}
                {activeFeature === 4 && (
                  <div className="vis-gateway">
                    {[
                      { icon: '🔗', name: 'Your Page', sub: 'Live & capturing leads', lit: true },
                      { icon: '🔧', name: 'Services', sub: 'Add offerings anytime', lit: true },
                      { icon: '⭐', name: 'Reviews', sub: 'Build social proof', lit: true },
                      { icon: '🏢', name: 'Full Business', sub: 'Booking, offers & more', lit: false },
                    ].map((r,i) => (
                      <div key={i} className={`vis-gw-row${r.lit ? ' lit' : ''}`}>
                        <div className="vis-gw-icon">{r.icon}</div>
                        <div className="vis-gw-text">
                          <div className="vis-gw-name">{r.name}</div>
                          <div className="vis-gw-sub">{r.sub}</div>
                        </div>
                        <div className="vis-gw-arrow">{r.lit ? '→' : '·'}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: feature list */}
            <div className="fh-list">
              {[
                {
                  eyebrow: 'Your URL',
                  title: 'Your handle. Your brand.',
                  body: 'One permanent link that is always yours. Send it in a text, add it to your card, drop it in your bio — it goes everywhere you do.',
                },
                {
                  eyebrow: 'Analytics',
                  title: "See what's working.",
                  body: "Page views, lead conversions, weekly trends. Know exactly how many people your pitch is reaching, even when you're not in the room.",
                },
                {
                  eyebrow: 'Make It Yours',
                  title: 'Built around your business.',
                  body: 'Add services, reviews, certifications, and photos. No two ProPages look the same — yours reflects who you are and what you sell.',
                },
                {
                  eyebrow: 'Live in Minutes',
                  title: 'No designer. No developer.',
                  body: "Claim your handle, pick a theme, and you're live. The whole setup takes less time than writing a follow-up email.",
                },
                {
                  eyebrow: 'Your Gateway',
                  title: 'Your page grows with you.',
                  body: 'Start with lead capture. Add services, reviews, and offers as your business grows. ProPages is the digital foundation you build on — one link that gets more powerful over time.',
                  gateway: true,
                },
              ].map((f, i) => (
                <div
                  key={i}
                  ref={(el) => (fhItemRefs.current[i] = el)}
                  className={`fh-item${activeFeature === i ? ' active' : ''}${f.gateway ? ' gateway' : ''}`}
                  onClick={() => setActiveFeature(i)}
                >
                  <div className="fh-eyebrow">{f.eyebrow}</div>
                  <div className="fh-title">{f.title}</div>
                  {activeFeature === i && <div className="fh-body">{f.body}</div>}
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>

      {/* PRICING */}
      <div id="pricing" className="pricing-section">
        <div className="pricing-section-label">Simple Pricing</div>
        <div className="pricing-headline">What you're actually getting.</div>

        <div className="ledger-card">
          <div className="ledger-row">
            <div>
              <div className="ledger-feature">Your Page + Lead Capture</div>
              <div className="ledger-feature-note">Website builder + form tool, typically</div>
            </div>
            <div className="ledger-cost">$20/mo</div>
          </div>
          <div className="ledger-row">
            <div>
              <div className="ledger-feature">Verified Badge</div>
              <div className="ledger-feature-note">Trust signal, standalone tools charge for this</div>
            </div>
            <div className="ledger-cost">$8/mo</div>
          </div>
          <div className="ledger-row">
            <div>
              <div className="ledger-feature">SMS Lead Alerts</div>
              <div className="ledger-feature-note">Typical CRM alert add-on</div>
            </div>
            <div className="ledger-cost">$25/mo</div>
          </div>
          <div className="ledger-row">
            <div>
              <div className="ledger-feature">Conversion Analytics</div>
              <div className="ledger-feature-note">Standalone analytics tool, entry tier</div>
            </div>
            <div className="ledger-cost">$19/mo</div>
          </div>
          <div className="ledger-row">
            <div>
              <div className="ledger-feature">A/B Testing Tools</div>
              <div className="ledger-feature-note">Standalone optimization tool</div>
            </div>
            <div className="ledger-cost">$39/mo</div>
          </div>

          <div className="ledger-subtotal-row">
            <div className="ledger-subtotal-label">Elsewhere</div>
            <div className="ledger-subtotal-value">$111/mo</div>
          </div>

          <div className="ledger-final-row">
            <div className="ledger-final-label">ProPages</div>
            <div className="ledger-final-price">$19<span>/mo</span></div>
          </div>
        </div>

        <p className="pricing-fineprint">7-day free trial · Cancel anytime · No setup fee</p>

        <div className="pricing-cta-row">
          <a href="#invite" className="cta-primary">Request Your Invite →</a>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div id="how-it-works" className="how-section">
        <div className="section-label">Up and Running in Minutes</div>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-num">01</div>
            <div className="step-icon">⚡</div>
            <div className="step-title">Get Your Page</div>
            <div className="step-body">Request an invite, pick your handle, and your ProPage is live in minutes.</div>
          </div>
          <div className="step-card">
            <div className="step-num">02</div>
            <div className="step-icon">📲</div>
            <div className="step-title">Share It Anywhere</div>
            <div className="step-body">Drop your QR code on leave-behinds, texts, or cards. One scan and they're on your page.</div>
          </div>
          <div className="step-card">
            <div className="step-num">03</div>
            <div className="step-icon">🎯</div>
            <div className="step-title">Capture the Lead</div>
            <div className="step-body">Interested leads fill out your form on their own time. You get notified. No lead slips through.</div>
          </div>
        </div>
      </div>

      {/* INVITE FORM */}
      <div className="invite-section" id="invite">
        <div className="invite-inner">
          <div className="invite-badge">Early Access</div>
          <div className="invite-headline">Claim your page.</div>
          <p className="invite-sub">We're rolling out invites in waves. Drop your info and we'll reach out when your spot is ready.</p>
          {submitted ? (
            <div className="success-box">
              <div className="success-icon">🎉</div>
              <div className="success-title">You're on the list!</div>
              <p className="success-sub">We'll email you when your invite is ready. Sit tight — it won't be long.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <input className="invite-input" type="text" name="name" placeholder="Your name" value={formData.name} onChange={handleChange} required />
              <input className="invite-input" type="email" name="email" placeholder="Email address" value={formData.email} onChange={handleChange} required />
              <select className="invite-input" name="industry" value={formData.industry} onChange={handleChange} required>
                <option value="">What industry are you in?</option>
                <option value="Solar">Solar</option>
                <option value="Roofing">Roofing</option>
                <option value="Pest Control">Pest Control</option>
                <option value="Home Security">Home Security</option>
                <option value="Windows & Doors">Windows & Doors</option>
                <option value="HVAC">HVAC</option>
                 <option value="Lawn Care & Landscaping">Lawn Care & Landscaping</option>
                <option value="Moving Services">Moving Services</option>
                <option value="Gutters/Siding/Exterior Remodel">Gutters, Siding & Exterior Remodel</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Mortgage/Lending">Mortgage / Lending</option>
                <option value="Property Management">Property Management</option>
                <option value="Short-Term Rentals/Investing">Short-Term Rentals & Property Investing</option>
                <option value="Financial Advising">Financial Advising</option>
                <option value="Insurance">Insurance</option>
                <option value="Life/Business Coaching">Life & Business Coaching</option>
                <option value="Fitness/Health Coaching">Fitness & Health Coaching</option>
                <option value="Sales Coaching/Training">Sales Coaching & Training</option>
                <option value="Career/Executive Coaching">Career & Executive Coaching</option>
                <option value="Marketing Consulting">Marketing Consulting</option>
                <option value="Web/Graphic Design">Web & Graphic Design</option>
                <option value="Photography/Video">Photography & Video</option>
                <option value="Copywriting/Content">Copywriting & Content</option>
                <option value="Personal Training">Personal Training</option>
                <option value="Med Spa/Aesthetics">Med Spa & Aesthetics</option>
                <option value="Other">Other</option>
              </select>
              <button className="invite-btn" type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Request My Invite →'}
              </button>
              <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--dim)', marginTop: '12px' }}>Join 500+ reps already on the list</p>
            </form>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="footer">
        <div className="footer-wordmark">PROPAGES</div>
        <p className="footer-tag">Built for the reps who show up every day.</p>
        <p className="footer-copy">© 2026 ProPages. All rights reserved.</p>
      </div>
    </>
  );
}