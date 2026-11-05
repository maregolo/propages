// Marketing nav: floating pill over a dark hero. On phones (<760px) it shows
// only the logo and the CTA.
//
//   <SiteNav />                                   homepage (links + log in + CTA)
//   <SiteNav links={[]} login={false} />          ad landing pages: logo + CTA only
//   <SiteNav tone="dark" />                        tonal slate pill (the board's original)
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
  return (
    <header className="site-nav-wrap">
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
        </div>
      </nav>
    </header>
  );
}
