import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import Link from 'next/link';
import AppShell, { Intro, Alert } from '../components/site/AppShell';
import Button from '../components/site/Button';
import Field from '../components/site/Field';
import Icon from '../components/site/icons';

export default function Reset() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    // Supabase fires onAuthStateChange with PASSWORD_RECOVERY
    // when the user lands here via the reset link
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true);
        setExpired(false);
      }
    });
    // If the recovery event never arrives (expired or already-used link),
    // don't leave the page spinning: fall back to any recovered session,
    // otherwise say the link didn't work.
    const timer = setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setReady(true);
      else setExpired(true);
    }, 5000);
    return () => { subscription.unsubscribe(); clearTimeout(timer); };
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
    <AppShell title="Reset password">
      <main className="site-app__main">
        {!ready && !expired && (
          <Intro eyebrow="One moment" title="Checking your link…">
            Verifying your reset link.
          </Intro>
        )}

        {!ready && expired && (
          <>
            <Intro eyebrow="Reset link" coral title="That link didn't work.">
              Reset links expire and only work once. Request a new one and use the newest email.
            </Intro>
            <Button href="/signup" size="app" block arrow>Request a new link</Button>
          </>
        )}

        {ready && (
          <>
            <Intro eyebrow="Reset password" title="Choose a new password.">
              Pick a password for your ProPages account.
            </Intro>
            <form className="site-app__form" onSubmit={handleReset}>
              <Alert error={error} />
              <Field
                label="New password"
                type="password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <Field
                label="Confirm new password"
                type="password"
                autoComplete="new-password"
                placeholder="Type it again"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
              <Button type="submit" size="app" block disabled={loading} arrow={!loading}>
                {loading ? 'Saving…' : 'Set new password'}
              </Button>
            </form>
          </>
        )}

        <Link href="/" className="site-textbtn"><Icon name="arrowLeft" />Back to homepage</Link>
      </main>
    </AppShell>
  );
}
