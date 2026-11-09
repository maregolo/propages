// Shared frame for /terms and /privacy: light app shell, 760px reading column.
import Link from 'next/link';
import AppShell from './AppShell';
import Icon from './icons';
import { LEGAL } from '../../lib/legal';

export { LEGAL };

export default function LegalPage({ title, intro, children }) {
  return (
    <AppShell title={title} tone="light" width={760}>
      <main className="site-app__main legal">
        <div className="site-app__intro">
          <span className="site-app__eyebrow">Last updated {LEGAL.effective}</span>
          <h1 className="site-app__h1">{title}</h1>
          {intro && <p className="site-app__lede">{intro}</p>}
        </div>
        <div className="legal__body">{children}</div>
        <p className="legal__contact">
          Questions? Email <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a>.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
          <Link href="/" className="site-textbtn"><Icon name="arrowLeft" />Back to homepage</Link>
          <Link href="/terms" className="site-textbtn">Terms of Service</Link>
          <Link href="/privacy" className="site-textbtn">Privacy Policy</Link>
        </div>
      </main>
    </AppShell>
  );
}
