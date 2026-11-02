import Logo from '../Logo';
import Container from './Container';

export default function SiteFooter({ tagline = 'Built for the reps who show up every day.' }) {
  return (
    <footer className="site-footer">
      <Container className="site-footer__inner">
        <div className="site-footer__brand">
          <Logo height={28} />
          <span className="site-footer__tag">{tagline}</span>
        </div>
        <span className="site-footer__copy">© {new Date().getFullYear()} ProPages. All rights reserved.</span>
      </Container>
    </footer>
  );
}
