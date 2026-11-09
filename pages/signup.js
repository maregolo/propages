import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import Link from 'next/link';
import AppShell, { Intro, Alert } from '../components/site/AppShell';
import Button from '../components/site/Button';
import Field from '../components/site/Field';
import Icon from '../components/site/icons';
import { SITE_URL } from '../lib/site';
import { LEGAL } from '../lib/legal';

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
      if (!session) {
        // Homepage "Claim my page" form passes the email along
        const prefillEmail = new URLSearchParams(window.location.search).get('email');
        if (prefillEmail) setEmail(prefillEmail);
        return;
      }
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
      // Record of Terms acceptance, stored on the auth user at the moment of signup.
      options: { data: { terms_accepted_at: new Date().toISOString(), terms_version: LEGAL.effective } },
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
      // Record of Terms acceptance, stored on the auth user at the moment of signup.
      options: { data: { terms_accepted_at: new Date().toISOString(), terms_version: LEGAL.effective } },
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
      { redirectTo: `${SITE_URL}/reset` }
    );

    setLoading(false);
    if (resetError) {
      setError('Something went wrong. Please try again.');
      return;
    }
    setStep('reset_sent');
  }

  const backToEmail = () => { setStep('email'); setError(''); setPassword(''); setConfirmPassword(''); };


  const titles = {
    email: 'Sign in', new_user: 'Create your password', returning_user: 'Sign in',
    forgot_password: 'Reset password', email_sent: 'Check your email', reset_sent: 'Check your inbox',
  };

  return (
    <AppShell title={titles[step]}>
      <main className="site-app__main">

        {/* ── Email sent (new user confirm) ── */}
        {step === 'email_sent' && (
          <>
            <div className="site-success-icon"><Icon name="mail" size={26} /></div>
            <Intro eyebrow="Almost there" coral title="Check your email.">
              We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account. Check your spam folder if you don&apos;t see it within a minute.
            </Intro>
          </>
        )}

        {/* ── Reset sent ── */}
        {step === 'reset_sent' && (
          <>
            <div className="site-success-icon"><Icon name="key" size={26} /></div>
            <Intro eyebrow="Reset link sent" coral title="Check your inbox.">
              We sent a password reset link to <strong>{email}</strong>.
            </Intro>
          </>
        )}

        {/* ── Step 1: Email ── */}
        {step === 'email' && (
          <>
            {isReferred ? (
              <Intro eyebrow="You were referred" coral title="You're in.">
                A ProPages rep sent you here. Enter your email to claim your page.
              </Intro>
            ) : (
              <Intro eyebrow="Sign in or get started" title="Welcome.">
                Enter your email to get started or sign in.
              </Intro>
            )}
            <form className="site-app__form" onSubmit={handleEmailSubmit}>
              <Alert error={error} />
              <Field
                label="Email address"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <Button type="submit" size="app" block disabled={loading} arrow={!loading}>
                {loading ? 'Checking…' : 'Continue'}
              </Button>
            </form>
            <hr className="site-app__rule" />
            <p className="site-app__fine">
              New here? Enter your email and you&apos;ll create a password next. Already have a page? Same box, you&apos;ll sign in.
            </p>
          </>
        )}

        {/* ── Step 2a: New user ── */}
        {step === 'new_user' && (
          <>
            <Intro eyebrow={isReferred ? 'You were referred' : 'New account'} coral title="Create your password.">
              Set a password to claim your page.
            </Intro>
            <EmailChip email={email} onChange={backToEmail} />
            <form className="site-app__form" onSubmit={handleSignUp}>
              <Alert error={error} />
              <Field
                label="Password"
                type="password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <Field
                label="Confirm password"
                type="password"
                autoComplete="new-password"
                placeholder="Type it again"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
              <label className="site-check" htmlFor="tos">
                <input
                  type="checkbox"
                  id="tos"
                  checked={tosAccepted}
                  onChange={e => setTosAccepted(e.target.checked)}
                />
                <span>I agree to the ProPages <a href="/terms" target="_blank" rel="noopener">Terms of Service</a></span>
              </label>
              <Button type="submit" size="app" block disabled={loading || !tosAccepted} arrow={!loading}>
                {loading ? 'Creating account…' : 'Create account'}
              </Button>
            </form>
          </>
        )}

        {/* ── Step 2b: Returning user ── */}
        {step === 'returning_user' && (
          <>
            <Intro eyebrow="Welcome back" title="Sign in.">
              Enter your password to sign in.
            </Intro>
            <EmailChip email={email} onChange={backToEmail} />
            <form className="site-app__form" onSubmit={handleSignIn}>
              <Alert error={error} />
              <Field
                label="Password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <Button type="submit" size="app" block disabled={loading} arrow={!loading}>
                {loading ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>
            <button type="button" className="site-textbtn" onClick={() => { setStep('forgot_password'); setError(''); }}>
              <Icon name="key" />Forgot password?
            </button>
          </>
        )}

        {/* ── Forgot password ── */}
        {step === 'forgot_password' && (
          <>
            <Intro eyebrow="Forgot password" title="Reset your password.">
              We&apos;ll send a reset link to your email.
            </Intro>
            <form className="site-app__form" onSubmit={handleForgotPassword}>
              <Alert error={error} />
              <Field
                label="Email address"
                type="email"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <Button type="submit" size="app" block disabled={loading} arrow={!loading}>
                {loading ? 'Sending…' : 'Send reset link'}
              </Button>
            </form>
            <button type="button" className="site-textbtn" onClick={() => { setStep('returning_user'); setError(''); }}>
              <Icon name="arrowLeft" />Back to sign in
            </button>
          </>
        )}

        <Link href="/" className="site-textbtn"><Icon name="arrowLeft" />Back to homepage</Link>
      </main>
    </AppShell>
  );
}

function EmailChip({ email, onChange }) {
  return (
    <div className="site-chip">
      <span className="site-chip__main"><Icon name="mail" /><span>{email}</span></span>
      <button type="button" className="site-textbtn" onClick={onChange}>Change</button>
    </div>
  );
}
