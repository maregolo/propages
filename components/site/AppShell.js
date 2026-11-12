// Frame for the app screens (signup, reset, setup, dashboard).
//
//   <AppShell title="Sign in">…</AppShell>                         dark, 480px column, turf map
//   <AppShell title="Setup" width={560} step={2} steps={3}>…</AppShell>  dark, progress bar
//   <AppShell title="Dashboard" tone="light" width={1120} right={…}>…</AppShell>
import Head from 'next/head';
import Link from 'next/link';
import Logo from '../Logo';

function CornerMap() {
  return (
    <svg aria-hidden="true" viewBox="0 0 400 400" className="site-app__map">
      <defs>
        <radialGradient id="app-map-g" cx="0.5" cy="0.45" r="0.5"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#000000" /></radialGradient>
        <mask id="app-map-m"><rect width="400" height="400" fill="url(#app-map-g)" /></mask>
      </defs>
      <g mask="url(#app-map-m)"><g transform="rotate(-12 200 200)" fill="none" stroke="#FFFFFF" strokeOpacity="0.06" strokeWidth="1.25">
        <path d="M20 -50V450M110 -50V450M195 -50V450M290 -50V450M380 -50V450M-50 40H450M-50 135H450M-50 220H450M-50 320H450" />
        <polygon points="110,40 290,40 290,135 380,135 380,220 195,220 195,135 110,135" fill="#8EF0B8" fillOpacity="0.06" stroke="#8EF0B8" strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="6 6" />
        <g stroke="none" fillOpacity="0.8"><circle cx="160" cy="88" r="4" fill="#FFB59C" /><circle cx="330" cy="180" r="4" fill="#FFB59C" /><circle cx="240" cy="170" r="4" fill="#8EF0B8" /></g>
      </g></g>
    </svg>
  );
}

export function Steps({ step, steps }) {
  return (
    <div className="site-steps" style={{ '--n': steps }} aria-hidden="true">
      {Array.from({ length: steps }, (_, i) => <span key={i} className={i < step ? 'is-done' : ''} />)}
    </div>
  );
}

export default function AppShell({
  title,
  tone = 'dark',
  width = 480,
  map = true,
  step,
  steps,
  right,
  logoHref = '/',
  children,
}) {
  const dark = tone === 'dark';
  const hasSteps = step && steps;
  const showMap = map && dark && !hasSteps;
  const gut = width > 600 ? 'clamp(20px, 4vw, 48px)' : '20px';
  return (
    <>
      <Head>
        <title>{title ? `${title} – ProPages` : 'ProPages'}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content={dark ? '#161A20' : '#F8F9FA'} />
      </Head>
      <div
        className={`site-app ${dark ? 'site-app--dark site-on-dark' : 'site-app--light'} ${hasSteps ? 'site-app--steps' : ''}`}
        style={{ '--site-app-w': `${width}px`, '--site-app-gut': gut }}
      >
        {showMap && <CornerMap />}
        <header className="site-app__header">
          <div className="site-app__bar">
            <Link href={logoHref} className="site-app__logo" aria-label="ProPages home">
              <Logo height={28} tone={dark ? 'dark' : 'light'} />
            </Link>
            {hasSteps ? <span className="site-steps__label">Step {step} of {steps}</span> : right}
          </div>
          {hasSteps && <Steps step={step} steps={steps} />}
        </header>
        {children}
      </div>
    </>
  );
}

export function AppLoading({ tone = 'dark' }) {
  return (
    <div className={`site-app ${tone === 'dark' ? 'site-app--dark' : 'site-app--light'}`}>
      <div className="site-loading" role="status" aria-label="Loading"><span /></div>
    </div>
  );
}

// Eyebrow + 48px headline + lede, as on every App flow board.
export function Intro({ eyebrow, coral, title, children }) {
  return (
    <div className="site-app__intro">
      {eyebrow && <span className={`site-app__eyebrow ${coral ? 'site-app__eyebrow--coral' : ''}`}>{eyebrow}</span>}
      <h1 className="site-app__h1">{title}</h1>
      {children && <p className="site-app__lede">{children}</p>}
    </div>
  );
}

export function Alert({ error }) {
  return error ? <p className="site-alert" role="alert">{error}</p> : null;
}
