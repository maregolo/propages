// Pill button / link. Pills are for buttons only (see BRAND.md).
//
//   <Button href="/signup">Get started</Button>                 lit mint, default size
//   <Button size="lg" arrow>Start free trial</Button>            60px, trailing arrow
//   <Button variant="light" size="nav" href="/signup">…</Button>  light pill in the dark nav
//
// variant: primary | light | ghost-dark | outline-dark | outline-light
// size:    md | lg | xl | nav
import Link from 'next/link';

export function Arrow({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export default function Button({
  href,
  variant = 'primary',
  size = 'md',
  block = false,
  arrow = false,
  className = '',
  children,
  ...rest
}) {
  const cls = [
    'site-btn',
    `site-btn--${variant}`,
    size !== 'md' && `site-btn--${size}`,
    block && 'site-btn--block',
    className,
  ].filter(Boolean).join(' ');

  const content = (
    <>
      {children}
      {arrow && <Arrow />}
    </>
  );

  if (href) {
    const external = /^https?:/.test(href);
    if (external || href.startsWith('#')) {
      return <a href={href} className={cls} {...rest}>{content}</a>;
    }
    return <Link href={href} className={cls} {...rest}>{content}</Link>;
  }
  return <button type="button" className={cls} {...rest}>{content}</button>;
}
