import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import Head from 'next/head';

export default function Reset() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase fires onAuthStateChange with PASSWORD_RECOVERY
    // when the user lands here via the reset link
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleReset(e) {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
      return;
    }

    router.push('/signup');
  }

  return (
    <>
      <Head>
        <title>Reset Password – ProPages</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;700&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --sun: #F5A623; --sun-bright: #FFD166; --sky: #0A1628;
          --sky-mid: #112240; --white: #F8F5EE; --muted: #8899AA;
          --accent: #00E5BE; --danger: #FF6B6B;
          --card-bg: rgba(255,255,255,0.04); --card-border: rgba(255,255,255,0.08);
        }
        body { background-color: var(--sky); color: var(--white); font-family: 'DM Sans', sans-serif; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; }
        .card { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 24px; padding: 40px 32px; width: 100%; max-width: 420px; }
        .logo { font-family: 'Bebas Neue', sans-serif; font-size: 20px; letter-spacing: 3px; color: var(--white); margin-bottom: 28px; text-align: center; }
        .logo span { color: var(--sun); }
        .card-headline { font-family: 'Bebas Neue', sans-serif; font-size: 32px; letter-spacing: 1px; color: var(--white); margin-bottom: 8px; text-align: center; }
        .card-sub { font-size: 13px; color: var(--muted); text-align: center; line-height: 1.6; margin-bottom: 28px; }
        .input { width: 100%; padding: 14px 16px; background: rgba(255,255,255,0.05); border: 1px solid var(--card-border); border-radius: 12px; color: var(--white); font-family: 'DM Sans', sans-serif; font-size: 15px; outline: none; margin-bottom: 12px; }
        .input:focus { border-color: var(--sun); }
        .input::placeholder { color: var(--muted); }
        .btn { width: 100%; padding: 15px; background: linear-gradient(135deg, var(--sun), var(--sun-bright)); color: var(--sky); font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 700; border: none; border-radius: 12px; cursor: pointer; box-shadow: 0 8px 32px rgba(245,166,35,0.3); }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .error { font-size: 13px; color: var(--danger); margin-bottom: 12px; text-align: center; line-height: 1.5; }
        .waiting { font-size: 14px; color: var(--muted); text-align: center; line-height: 1.6; }
      `}</style>

      <div className="card">
        <div className="logo">PRO<span>PAGES</span></div>

        {!ready ? (
          <>
            <div className="card-headline">One Moment</div>
            <div className="waiting">Verifying your reset link...</div>
          </>
        ) : (
          <>
            <div className="card-headline">New Password</div>
            <div className="card-sub">Choose a password for your ProPages account.</div>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleReset}>
              <input
                className="input"
                type="password"
                placeholder="New password (min. 8 characters)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <input
                className="input"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
              <button className="btn" type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Set New Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </>
  );
}