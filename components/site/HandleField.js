// "propages.pro/[yourname]" + button, fused. Submitting stores the handle for
// setup step 1 (localStorage `pp_claim_handle`) and sends the visitor to
// /signup. Optional `email` field is passed along as ?email=.
import { useId, useState } from 'react';
import { useRouter } from 'next/router';
import Button from './Button';

export const CLAIM_KEY = 'pp_claim_handle';
import { DOMAIN } from '../../lib/site';

export { DOMAIN };

export function cleanHandle(val) {
  return (val || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 40);
}

export default function HandleField({
  cta = 'Claim your turf',
  onLight = false,
  source = 'home',
  className = '',
}) {
  const router = useRouter();
  const [handle, setHandle] = useState('');
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');

  function submit(e) {
    e.preventDefault();
    const h = cleanHandle(handle);
    try {
      if (h) localStorage.setItem(CLAIM_KEY, h);
      else localStorage.removeItem(CLAIM_KEY);
      localStorage.setItem('pp_signup_source', source);
    } catch (err) { /* storage unavailable: signup still works */ }
    router.push('/signup');
  }

  return (
    <form
      className={`site-claim ${onLight ? 'site-claim--on-light' : ''} ${className}`.trim()}
      onSubmit={submit}
    >
      <label className="site-claim__field" htmlFor={`claim${uid}`}>
        <span className="site-claim__prefix">{DOMAIN}/</span>
        <input
          id={`claim${uid}`}
          className="site-claim__input"
          type="text"
          inputMode="url"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck="false"
          placeholder="yourname"
          aria-label="Pick your link"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
        />
      </label>
      <Button type="submit" size="lg">{cta}</Button>
    </form>
  );
}
