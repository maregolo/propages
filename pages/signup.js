import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import Head from 'next/head';
import Logo from '../components/Logo';

export default function Signup() {
  const router = useRouter();

  // Steps: 'email' | 'new_user' | 'returning_user' | 'forgot_password' | 'email_sent' | 'reset_sent'
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tosAccepted, setTosAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isReferred, setIsReferred] = useState(false);

  // If already logged in, redirect away. Also check for valid ?ref= param.
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return;
      const { data: rep } = await supabase
        .from('reps')
        .select('slug')
        .eq('auth_id', session.user.id)
        .maybeSingle();
      router.push(rep?.slug ? `/${rep.slug}` : '/setup');
    });

    // Check for referral param
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      supabase
        .from('reps')
        .select('slug')
        .eq('slug', ref)
        .maybeSingle()
        .then(({ data }) => {
          if (data?.slug) {
            localStorage.setItem('pp_referral_ref', data.slug);
            setIsReferred(true);
          }
        });
    }
  }, []);

  // Step 1: check email
  async function handleEmailSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const clean = email.trim().toLowerCase();

    // Check if they already have an account by attempting a dummy reset
    // The cleanest way without service role: try signInWithPassword with a blank
    // password and check the error code. If 'invalid_credentials', user exists.
    // If 'email_not_confirmed' or similar, also exists. Any other error = no account.
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: clean,
      password: '##CHECK_ONLY##',
    });

    const userExists =
      signInError?.message?.includes('Invalid login credentials') ||
      signInError?.message?.includes('Email not confirmed');

    setLoading(false);
    setStep(userExists ? 'returning_user' : 'new_user');
  }

  // Step 2a: new user signup
  async function handleSignUp(e) {
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
    if (!tosAccepted) {
      setError('You must accept the Terms of Service to continue.');
      return;
    }

    setLoading(true);

    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
    });

    if (signUpError) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
      return;
    }

    setLoading(false);
    setStep('email_sent');
  }

  // Step 2b: returning user login
  async function handleSignIn(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (signInError) {
      setError('Incorrect password. Try again or reset your password below.');
      setLoading(false);
      return;
    }

    const { data: rep } = await supabase
      .from('reps')
      .select('slug')
      .eq('auth_id', (await supabase.auth.getUser()).data.user.id)
      .maybeSingle();

    router.push(rep?.slug ? `/${rep.slug}` : '/setup');
  }

  // Forgot password
  async function handleForgotPassword(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      { redirectTo: 'https://propages.vercel.app/reset' }
    );

    setLoading(false);
    if (resetError) {
      setError('Something went wrong. Please try again.');
      return;
    }
    setStep('reset_sent');
  }

  return (
    <>
      <Head>
        <title>Sign In – ProPages</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;700&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --sun: #F5A623; --sun-bright: #FFD166; --sky: #0A1628;
          --sky-mid: #112240; --sky-light: #1D3461; --white: #F8F5EE;
          --muted: #8899AA; --accent: #00E5BE; --danger: #FF6B6B;
          --card-bg: rgba(255,255,255,0.04); --card-border: rgba(255,255,255,0.08);
        }
        body { background-color: var(--sky); color: var(--white); font-family: 'DM Sans', sans-serif; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; }
        .card { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 24px; padding: 40px 32px; width: 100%; max-width: 420px; }
        .logo { display: flex; justify-content: center; margin-bottom: 28px; }
        .card-headline { font-family: 'Bebas Neue', sans-serif; font-size: 32px; letter-spacing: 1px; color: var(--white); margin-bottom: 8px; text-align: center; }
        .card-sub { font-size: 13px; color: var(--muted); text-align: center; line-height: 1.6; margin-bottom: 28px; }
        .email-display { font-size: 13px; color: var(--accent); text-align: center; margin-bottom: 20px; }
        .email-display button { background: none; border: none; color: var(--muted); font-size: 12px; cursor: pointer; margin-left: 8px; text-decoration: underline; font-family: 'DM Sans', sans-serif; }
        .email-display button:hover { color: var(--white); }
        .input { width: 100%; padding: 14px 16px; background: rgba(255,255,255,0.05); border: 1px solid var(--card-border); border-radius: 12px; color: var(--white); font-family: 'DM Sans', sans-serif; font-size: 15px; outline: none; margin-bottom: 12px; }
        .input:focus { border-color: var(--sun); }
        .input::placeholder { color: var(--muted); }
        .btn { width: 100%; padding: 15px; background: linear-gradient(135deg, var(--sun), var(--sun-bright)); color: var(--sky); font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 700; border: none; border-radius: 12px; cursor: pointer; box-shadow: 0 8px 32px rgba(245,166,35,0.3); }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .error { font-size: 13px; color: var(--danger); margin-bottom: 12px; text-align: center; line-height: 1.5; }
        .tos-row { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 16px; }
        .tos-row input[type="checkbox"] { width: 16px; height: 16px; margin-top: 2px; accent-color: var(--sun); cursor: pointer; flex-shrink: 0; }
        .tos-row label { font-size: 12px; color: var(--muted); line-height: 1.5; cursor: pointer; }
        .tos-row label a { color: var(--sun); text-decoration: none; }
        .tos-row label a:hover { text-decoration: underline; }
        .text-link { background: none; border: none; color: var(--muted); font-size: 12px; cursor: pointer; font-family: 'DM Sans', sans-serif; text-decoration: underline; display: block; text-align: center; margin-top: 14px; }
        .text-link:hover { color: var(--white); }
        .back-link { display: block; text-align: center; margin-top: 20px; font-size: 12px; color: var(--muted); text-decoration: none; }
        .back-link:hover { color: var(--white); }
        .success-icon { font-size: 48px; text-align: center; margin-bottom: 12px; }
        .success-title { font-family: 'Bebas Neue', sans-serif; font-size: 28px; color: var(--accent); text-align: center; margin-bottom: 8px; }
        .success-sub { font-size: 13px; color: var(--muted); text-align: center; line-height: 1.6; }
      `}</style>

      <div className="card">
        <div className="logo"><Logo height={28} /></div>

        {/* ── Email sent (new user confirm) ── */}
        {step === 'email_sent' && (
          <>
            <div className="success-icon">📬</div>
            <div className="success-title">Check Your Email</div>
            <div className="success-sub">
              We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account — check your spam folder if you don&apos;t see it within a minute.
            </div>
          </>
        )}

        {/* ── Reset sent ── */}
        {step === 'reset_sent' && (
          <>
            <div className="success-icon">🔑</div>
            <div className="success-title">Reset Link Sent</div>
            <div className="success-sub">
              Check your inbox at <strong>{email}</strong> for a password reset link.
            </div>
          </>
        )}

        {/* ── Step 1: Email ── */}
        {step === 'email' && (
          <>
            <div className="card-headline">{isReferred ? 'You\'re In' : 'Welcome'}</div>
            <div className="card-sub">{isReferred ? 'You were referred by a ProPages rep. Enter your email to claim your page.' : 'Enter your email to get started or sign in.'}</div>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleEmailSubmit}>
              <input
                className="input"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <button className="btn" type="submit" disabled={loading}>
                {loading ? 'Checking...' : 'Continue'}
              </button>
            </form>
          </>
        )}

        {/* ── Step 2a: New user ── */}
        {step === 'new_user' && (
          <>
            <div className="card-headline">Create Password</div>
            <div className="card-sub">Set a password to claim your page.</div>
            <div className="email-display">
              {email}
              <button onClick={() => { setStep('email'); setError(''); }}>Change</button>
            </div>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSignUp}>
              <input
                className="input"
                type="password"
                placeholder="Password (min. 8 characters)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <input
                className="input"
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
              <div className="tos-row">
                <input
                  type="checkbox"
                  id="tos"
                  checked={tosAccepted}
                  onChange={e => setTosAccepted(e.target.checked)}
                />
                <label htmlFor="tos">
                  I agree to the ProPages <a href="/terms" target="_blank">Terms of Service</a>
                </label>
              </div>
              <button className="btn" type="submit" disabled={loading || !tosAccepted}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          </>
        )}

        {/* ── Step 2b: Returning user ── */}
        {step === 'returning_user' && (
          <>
            <div className="card-headline">Welcome Back</div>
            <div className="card-sub">Enter your password to sign in.</div>
            <div className="email-display">
              {email}
              <button onClick={() => { setStep('email'); setError(''); }}>Change</button>
            </div>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSignIn}>
              <input
                className="input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button className="btn" type="submit" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            <button className="text-link" onClick={() => { setStep('forgot_password'); setError(''); }}>
              Forgot password?
            </button>
          </>
        )}

        {/* ── Forgot password ── */}
        {step === 'forgot_password' && (
          <>
            <div className="card-headline">Reset Password</div>
            <div className="card-sub">We&apos;ll send a reset link to your email.</div>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleForgotPassword}>
              <input
                className="input"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <button className="btn" type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
            <button className="text-link" onClick={() => { setStep('returning_user'); setError(''); }}>
              Back to sign in
            </button>
          </>
        )}

        <a href="/" className="back-link">Back to homepage</a>
      </div>
    </>
  );
}