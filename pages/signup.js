import React, { useState } from 'react';
import Head from 'next/head';


export default function Signup() {
console.log('ENV:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

    async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);


    
// Check if email is in invite_requests with status 'approved'
    const { data } = await supabase
      .from('invite_requests')
      .select('status')
      .eq('email', email.trim().toLowerCase())
      .single();

    if (!data || data.status !== 'approved') {
      setError("We don't have an approved invite for that email. Request access from the homepage.");
      setLoading(false);
      return;
    }

    // Send magic link
    const { error } = await supabase.auth.signInWithOtp({
  email,
  options: {
    emailRedirectTo: 'https://propages.vercel.app/setup',
  },
});

    if (authError) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>Sign Up – ProPages</title>
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
          --danger: #FF6B6B;
          --card-bg: rgba(255,255,255,0.04);
          --card-border: rgba(255,255,255,0.08);
        }
        body {
          background-color: var(--sky);
          color: var(--white);
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 24px;
          padding: 40px 32px;
          width: 100%;
          max-width: 420px;
        }
        .logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px;
          letter-spacing: 3px;
          color: var(--white);
          margin-bottom: 28px;
          text-align: center;
        }
        .logo span { color: var(--sun); }
        .card-headline {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 32px;
          letter-spacing: 1px;
          color: var(--white);
          margin-bottom: 8px;
          text-align: center;
        }
        .card-sub {
          font-size: 13px;
          color: var(--muted);
          text-align: center;
          line-height: 1.6;
          margin-bottom: 28px;
        }
        .input {
          width: 100%;
          padding: 14px 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--card-border);
          border-radius: 12px;
          color: var(--white);
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          outline: none;
          margin-bottom: 12px;
        }
        .input:focus { border-color: var(--sun); }
        .btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, var(--sun), var(--sun-bright));
          color: var(--sky);
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 700;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          box-shadow: 0 8px 32px rgba(245,166,35,0.3);
        }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .error {
          font-size: 13px;
          color: var(--danger);
          margin-bottom: 12px;
          text-align: center;
          line-height: 1.5;
        }
        .success-icon { font-size: 48px; text-align: center; margin-bottom: 12px; }
        .success-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          color: var(--accent);
          text-align: center;
          margin-bottom: 8px;
        }
        .success-sub {
          font-size: 13px;
          color: var(--muted);
          text-align: center;
          line-height: 1.6;
        }
        .back-link {
          display: block;
          text-align: center;
          margin-top: 20px;
          font-size: 12px;
          color: var(--muted);
          text-decoration: none;
        }
        .back-link:hover { color: var(--white); }
      `}</style>

      <div className="card">
        <div className="logo">PRO<span>PAGES</span></div>

        {sent ? (
          <>
            <div className="success-icon">📬</div>
            <div className="success-title">Check Your Email</div>
            <div className="success-sub">
              We sent a magic link to <strong>{email}</strong>. Click it to finish setting up your ProPage — check your spam folder if you don't see it in a minute.
            </div>
          </>
        ) : (
          <>
            <div className="card-headline">Claim Your Page</div>
            <div className="card-sub">Enter the email you used to request your invite and we'll send you a login link.</div>

            {error && <div className="error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <input
                className="input"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <button className="btn" type="submit" disabled={loading}>
                {loading ? 'Checking...' : 'Send My Magic Link →'}
              </button>
            </form>
          </>
        )}

        <a href="/" className="back-link">← Back to homepage</a>
      </div>
    </>
  );
}