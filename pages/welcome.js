// Landing page for the email confirmation link (signUp → emailRedirectTo).
// Supabase puts the new session in the URL; the client picks it up on load.
// Then: new user → "You're in" + steps + Build my page (→ /setup);
// already has a page → straight to the dashboard; no session (expired or
// already-used link: Supabase puts an error in the URL instead) → expired.
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import { DOMAIN } from '../lib/site';
import AppShell, { AppLoading, Intro } from '../components/site/AppShell';
import Button from '../components/site/Button';
import Icon from '../components/site/icons';

const STEPS = [
  ['Your info', 'Name, handle and what you do.'],
  ['Your style', 'Pick the look of your page.'],
  ['Your links', 'Socials, booking link, website.'],
];

export default function Welcome() {
  const router = useRouter();
  const [status, setStatus] = useState('checking'); // checking | ready | expired
  const [claimed, setClaimed] = useState('');

  useEffect(() => {
    let done = false;
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (done) return;
      if (!session) { setStatus('expired'); return; }

      const { data: rep } = await supabase
        .from('reps').select('slug').eq('auth_id', session.user.id).maybeSingle();
      if (rep?.slug) { router.replace('/dashboard'); return; }

      try { setClaimed(localStorage.getItem('pp_claim_handle') || ''); } catch (e) { /* no storage */ }
      setStatus('ready');
    });

    return () => { done = true; };
  }, [router]);

  if (status === 'checking') return <AppLoading />;

  if (status === 'expired') {
    return (
      <AppShell title="Link expired">
        <main className="site-app__main">
          <div className="site-success-icon"><Icon name="mail" size={26} /></div>
          <Intro eyebrow="Confirmation link" coral title="This link has expired.">
            Confirmation links work once and expire after a while. Log in with your email and password: if you&apos;re already confirmed you&apos;ll go straight in, and if not we&apos;ll send you a fresh link.
          </Intro>
          <Button href="/signup" size="lg" block arrow>Log in</Button>
        </main>
      </AppShell>
    );
  }

  return (
    <AppShell title="Email confirmed">
      <main className="site-app__main">
        <div className="site-success-icon"><Icon name="check" size={26} strokeWidth={2.5} /></div>
        <Intro eyebrow="Email confirmed" coral title="You're in.">
          You&apos;re just a few steps away from your ProPage. It takes about three minutes.
          {claimed && <> <strong>{DOMAIN}/{claimed}</strong> is waiting for you.</>}
        </Intro>
        <ol className="site-welcome-steps">
          {STEPS.map(([t, s], i) => (
            <li key={t}>
              <span className="site-welcome-steps__n" aria-hidden="true">{i + 1}</span>
              <span><strong>{t}</strong><span>{s}</span></span>
            </li>
          ))}
        </ol>
        <Button href="/setup" size="lg" block arrow>Build my page</Button>
      </main>
    </AppShell>
  );
}
