import Head from 'next/head';
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function RepPage({ rep }) {
  if (!rep) {
    return (
      <div style={{ fontFamily: 'sans-serif', textAlign: 'center', padding: '60px 20px', background: '#0A1628', color: '#F8F5EE', minHeight: '100vh' }}>
        <h1>Page not found</h1>
        <p style={{ color: '#8899AA' }}>This ProPages link doesn't exist yet.</p>
      </div>
    );
  }

  const initials = rep.name
    ? rep.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <>
      <Head>
        <title>ProPages – {rep.name}</title>
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
        .bg-atmosphere::before { content: ''; position: absolute; top: -20%; left: -10%; width: 70%; height: 70%; background: radial-gradient(ellipse, rgba(245,166,35,0.12) 0%, transparent 70%); animation: breathe 8s ease-in-out infinite alternate; }
        .bg-atmosphere::after { content: ''; position: absolute; bottom: -10%; right: -10%; width: 60%; height: 60%; background: radial-gradient(ellipse, rgba(0,229,190,0.07) 0%, transparent 70%); animation: breathe 10s ease-in-out infinite alternate-reverse; }
        @keyframes breathe { from { transform: scale(1) translate(0,0); } to { transform: scale(1.1) translate(2%,2%); } }
        .page { position: relative; z-index: 1; max-width: 480px; margin: 0 auto; padding: 0 20px 60px; }
        .topbar { display: flex; justify-content: center; padding: 20px 0 0; }
        .propages-badge { font-family: 'Bebas Neue', sans-serif; font-size: 13px; letter-spacing: 3px; color: var(--muted); border: 1px solid var(--card-border); padding: 4px 12px; border-radius: 20px; background: var(--card-bg); }
        .hero { text-align: center; padding: 40px 0 32px; }
        .avatar-wrap { position: relative; display: inline-block; margin-bottom: 20px; }
        .avatar-placeholder { width: 88px; height: 88px; border-radius: 50%; background: linear-gradient(135deg, var(--sky-light), var(--sky-mid)); border: 2px solid var(--sun); display: flex; align-items: center; justify-content: center; font-family: 'Bebas Neue', sans-serif; font-size: 32px; color: var(--sun); }
        .status-dot { position: absolute; bottom: 4px; right: 4px; width: 14px; height: 14px; background: var(--accent); border-radius: 50%; border: 2px solid var(--sky); animation: pulse-dot 2s ease-in-out infinite; }
        @keyframes pulse-dot { 0%, 100% { box-shadow: 0 0 0 0 rgba(0,229,190,0.4); } 50% { box-shadow: 0 0 0 6px rgba(0,229,190,0); } }
        .hero-name { font-family: 'Bebas Neue', sans-serif; font-size: 38px; letter-spacing: 2px; line-height: 1; color: var(--white); margin-bottom: 4px; }
        .hero-title { font-size: 13px; font-weight: 500; color: var(--sun); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 24px; }
        .hero-headline { font-size: 22px; font-weight: 300; line-height: 1.4; color: var(--white); margin-bottom: 10px; }
        .hero-bio { font-size: 14px; color: var(--muted); line-height: 1.6; max-width: 320px; margin: 0 auto 28px; }
        .cta-btn { display: block; width: 100%; padding: 17px 24px; background: linear-gradient(135deg, var(--sun), var(--sun-bright)); color: var(--sky); font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 700; border: none; border-radius: 14px; cursor: pointer; text-align: center; box-shadow: 0 8px 32px rgba(245,166,35,0.3); margin-bottom: 10px; text-decoration: none; transition: transform 0.15s ease, box-shadow 0.15s ease; }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(245,166,35,0.45); }
        .cta-sub { font-size: 12px; color: var(--muted); text-align: center; margin-bottom: 32px; }
        .lead-section { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 20px; padding: 28px 24px; margin-bottom: 28px; }
        .lead-section-label { font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--accent); margin-bottom: 8px; }
        .lead-section-headline { font-size: 18px; font-weight: 700; color: var(--white); margin-bottom: 6px; line-height: 1.3; }
        .lead-section-sub { font-size: 13px; color: var(--muted); margin-bottom: 20px; line-height: 1.5; }
        .field-group { display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px; }
        .field input { width: 100%; padding: 14px 16px; background: rgba(255,255,255,0.05); border: 1px solid var(--card-border); border-radius: 12px; color: var(--white); font-family: 'DM Sans', sans-serif; font-size: 15px; outline: none; transition: border-color 0.2s ease; }
        .field input::placeholder { color: var(--muted); }
        .field input:focus { border-color: var(--sun); background: rgba(245,166,35,0.04); }
        .submit-btn { width: 100%; padding: 16px; background: var(--accent); color: var(--sky); font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 700; border: none; border-radius: 12px; cursor: pointer; box-shadow: 0 6px 24px rgba(0,229,190,0.25); transition: transform 0.15s ease; }
        .submit-btn:hover { transform: translateY(-2px); }
        .success-icon { font-size: 48px; margin-bottom: 12px; }
        .success-title { font-family: 'Bebas Neue', sans-serif; font-size: 28px; color: var(--accent); margin-bottom: 6px; }
        .success-sub { font-size: 14px; color: var(--muted); line-height: 1.5; }
        .footer { text-align: center; padding-top: 20px; }
        .footer-powered { font-size: 11px; color: var(--muted); letter-spacing: 1px; }
        .footer-powered span { color: var(--sun); font-weight: 700; font-family: 'Bebas Neue', sans-serif; letter-spacing: 2px; font-size: 13px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.7s ease forwards; }
      `}</style>

      <div className="bg-atmosphere" />

      <div className="page">
        <div className="topbar">
          <div className="propages-badge">PROPAGES</div>
        </div>

        <div className="hero fade-up">
          <div className="avatar-wrap">
            <div className="avatar-placeholder">{initials}</div>
            <div className="status-dot" />
          </div>
          <div className="hero-name">{rep.name}</div>
          <div className="hero-title">{rep.title} · {rep.city}</div>
          <p className="hero-headline">{rep.headline}</p>
          <p className="hero-bio">{rep.bio}</p>
          <a href="#get-quote" className="cta-btn">See What You Could Save →</a>
          <p className="cta-sub">Free estimate · No obligation · Takes 60 seconds</p>
        </div>

        <div className="lead-section fade-up" id="get-quote">
          <div className="lead-section-label">Free Savings Estimate</div>
          <div className="lead-section-headline">Find out what your neighbors are saving</div>
          <div className="lead-section-sub">Takes less than a minute. No sales pressure — just numbers.</div>

          <LeadForm repId={rep.id} repName={rep.name} />
        </div>

        <div className="footer fade-up">
          <div className="footer-powered">Powered by <span>PROPAGES</span></div>
        </div>
      </div>
    </>
  );
}

function LeadForm({ repId, repName }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    if (!name.trim() || !phone.trim()) {
      setError('Please fill in both fields.');
      return;
    }
    setError('');

    const { error: dbError } = await supabase
      .from('leads')
      .insert([{ name: name.trim(), phone: phone.trim(), rep_id: repId }]);

    if (dbError) {
      setError('Something went wrong. Please try again.');
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div className="success-icon">☀️</div>
        <div className="success-title">You're On The List</div>
        <div className="success-sub">{repName} will reach out within the hour. Check your texts.</div>
      </div>
    );
  }

  return (
    <>
      <div className="field-group">
        <div className="field">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div className="field">
          <input
            type="tel"
            placeholder="Phone number"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
        </div>
      </div>
      {error && <p style={{ color: 'var(--danger)', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}
      <button className="submit-btn" onClick={handleSubmit}>Get My Free Estimate</button>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const slug = params.slug;

  const { data, error } = await supabase
    .from('reps')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return { props: { rep: null } };
  }

  return { props: { rep: data } };
}