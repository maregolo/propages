// Marketing nav: floating pill over a dark hero. Below 1100px the section
// links move into a menu behind a hamburger button; on phones (<760px) Log in
// moves there too, so the bar is logo + CTA + menu button.
//
//   <SiteNav />                                   homepage (links + log in + CTA)
//   <SiteNav links={[]} login={false} />          ad landing pages: logo + CTA only
//   <SiteNav tone="dark" />                        tonal slate pill (the board's original)
import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import Logo from '../Logo';
import Button from './Button';

export const DEFAULT_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'How It Works', href: '#how' },
  { label: 'LeadMarket', soon: true },
];

export default function SiteNav({
  links = DEFAULT_LINKS,
  login = true,
  cta = { label: 'Get started', href: '/signup' },
  tone = 'light',
}) {
  const light = tone === 'light';
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const wrapRef = useRef(null);
  const btnRef = useRef(null);
  const hasMenu = links.length > 0 || login;

  // While open: Escape or a tap outside the nav closes it.
  useEffect(() => {
    if (!open) return undefined;
    function onKey(e) {
      if (e.key === 'Escape') {
        setOpen(false);
        btnRef.current?.focus();
      }
    }
    function onPointer(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="site-nav-wrap" ref={wrapRef}>
      <nav className={`site-nav ${light ? 'site-nav--light' : ''}`} aria-label="Main">
        <Link href="/" className="site-nav__logo" aria-label="ProPages home">
          {light ? (
            // White nav: the glow logo sits on a slate pill (same as "Get started"), concentric with the nav.
            <span className="site-nav__tile"><Logo height={34} title="ProPages" /></span>
          ) : (
            <Logo height={28} title="ProPages" />
          )}
        </Link>
        {links.length > 0 && (
          <div className="site-nav__links">
            {links.map((l) =>
              l.soon ? (
                <span key={l.label} className="site-nav__link">
                  {l.label} <span className="site-nav__soon">Coming soon</span>
                </span>
              ) : (
                <a key={l.label} href={l.href} className="site-nav__link">{l.label}</a>
              )
            )}
          </div>
        )}
        <div className="site-nav__actions">
          {login && (
            <Button href="/signup" variant="ghost-dark" size="nav" className="site-nav__login">Log in</Button>
          )}
          {cta && <Button href={cta.href} variant="light" size="nav">{cta.label}</Button>}
          {hasMenu && (
            <button
              ref={btnRef}
              type="button"
              className={`site-nav__menu-btn ${links.length === 0 ? 'site-nav__menu-btn--phone' : ''}`}
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                {open ? (
                  <><path d="M6 6l12 12" /><path d="M18 6L6 18" /></>
                ) : (
                  <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>
                )}
              </svg>
            </button>
          )}
        </div>
      </nav>
      {hasMenu && (
        <div
          id={menuId}
          className={`site-nav__menu ${light ? 'site-nav__menu--light' : ''}`}
          hidden={!open}
        >
          {links.map((l) =>
            l.soon ? (
              <span key={l.label} className="site-nav__menu-item site-nav__menu-item--soon">
                {l.label} <span className="site-nav__soon">Coming soon</span>
              </span>
            ) : (
              <a key={l.label} href={l.href} className="site-nav__menu-item" onClick={close}>{l.label}</a>
            )
          )}
          {login && (
            <Button href="/signup" variant="ghost-dark" size="nav" block className="site-nav__menu-login" onClick={close}>
              Log in
            </Button>
          )}
        </div>
      )}
    </header>
  );
}
