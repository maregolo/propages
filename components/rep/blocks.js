// Public rep page blocks, built to the "Full rep page" boards.
//
// Rule for every block: visitors see only what the rep entered, plus neutral
// industry copy (headline, pitch, button text, form wording). Industry sample
// stats, reviews and links appear only to the owner in edit mode, inside a
// <Sample> frame. Empty blocks render nothing for visitors.

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import Logo from '../Logo';
import RepIcon, { BrandIcon, linkIconName } from './RepIcon';
import { BRAND_LABELS, BRAND_PATHS } from './brandPaths';
import { CONTACT_METHODS, SUGGESTED_METHODS, cleanHandle, validateContact, messageButtons } from '../../lib/contact';
import {
  cleanLinks, cleanStats, cleanTestimonials, firstName, initialsOf,
  isSocialProfile, socialPlatform,
} from '../../lib/repBlocks';

// Fire-and-forget insert into block_events. Raw fetch with keepalive so the
// request survives same-tab navigation (a link click leaves the page at once).
export function logBlockEvent(repId, blockId, blockType, eventType, label) {
  try {
    fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/block_events`, {
      method: 'POST',
      keepalive: true,
      headers: {
        'Content-Type': 'application/json',
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        rep_id: repId, block_id: blockId, block_type: blockType,
        event_type: eventType, label: label || null,
      }),
    }).catch(() => {});
  } catch {
    // analytics never breaks the page
  }
}

// Old default copy ends with " →"; the button draws its own arrow.
const noArrow = (s) => String(s || '').replace(/\s*→\s*$/, '');

function Sample({ label, children }) {
  return (
    <div className="ow-sample">
      <div className="ow-sample-tag ow"><b>Sample</b>{label}</div>
      <div className="ow-sample-content" aria-hidden="true" inert>{children}</div>
    </div>
  );
}

// ── Hero (Billboard) ─────────────────────────────────────────────────────────

function Headline({ text, highlight }) {
  const at = highlight ? text.indexOf(highlight) : -1;
  if (at < 0) return <h1 className="rp-h1">{text}</h1>;
  return (
    <h1 className="rp-h1">
      {text.slice(0, at)}<span className="rp-hi">{highlight}</span>{text.slice(at + highlight.length)}
    </h1>
  );
}

function StatStrip({ stats }) {
  return (
    <div className="rp-stats">
      {stats.map((s, i) => {
        const n = String(s.number).trim();
        const star = n.endsWith('★');
        return (
          <div className="rp-stat" key={i}>
            <span className="rp-stat-n">
              {star ? <>{n.slice(0, -1)}<span className="rp-star" aria-label=" stars">★</span></> : n}
            </span>
            <span className="rp-stat-l">{s.label}</span>
          </div>
        );
      })}
    </div>
  );
}

const BADGES = { pro: 'ProPages Pro', verified: 'Verified', certified: 'Certified' };

export function HeroBlock({ block, rep, defaults, editMode, isOwner, hasForm }) {
  const d = block.data || {};
  const name = rep.name || d.name || '';
  const role = [rep.title || d.title, rep.city || d.city].filter(Boolean).join(' · ');
  const photo = d.photo_url || rep.photo_url;
  const ownHeadline = String(d.headline || '').trim();
  const headline = ownHeadline || defaults.headline;
  const highlight = ownHeadline ? d.highlight : defaults.highlight;
  const pitch = d.pitch || defaults.pitch;
  const cta = noArrow(d.cta || defaults.cta);
  const ctaSub = d.ctaSub || defaults.ctaSub;
  const stats = cleanStats(d.stats);
  const badge = BADGES[rep.badge_tier];

  return (
    <section className="rp-hero" aria-label="Introduction">
      <div className="rp-id">
        {photo
          ? <img src={photo} alt={name} className="rp-avatar" />
          : <span className="rp-avatar rp-avatar--initials" aria-hidden="true">{initialsOf(name)}</span>}
        <div className="rp-id-text">
          <span className="rp-name">{name}</span>
          {role && <span className="rp-role">{role}</span>}
          {badge && <span className="rp-badge"><RepIcon name="shield" size={14} />{badge}</span>}
        </div>
      </div>
      <Headline text={headline} highlight={highlight} />
      {pitch && <p className="rp-pitch">{pitch}</p>}
      {hasForm && (
        <div className="rp-cta-wrap">
          <a
            href="#get-quote"
            className="rp-cta"
            onClick={() => { if (!isOwner) logBlockEvent(rep.id, block.id, 'hero', 'hero_cta', 'billboard'); }}
          >
            {cta}<RepIcon name="arrowRight" size={20} strokeWidth={2.5} />
          </a>
          {ctaSub && <span className="rp-cta-sub">{ctaSub}</span>}
        </div>
      )}
      {stats.length > 0
        ? <StatStrip stats={stats} />
        : editMode && <Sample label="Proof numbers · add your own to show them">
            <StatStrip stats={defaults.stats} />
          </Sample>}
    </section>
  );
}

// ── Links ────────────────────────────────────────────────────────────────────

function LinkList({ links, onClick }) {
  const social = links.filter(l => isSocialProfile(l.url));
  const rows = links.filter(l => !isSocialProfile(l.url));
  const cols = Math.min(Math.max(social.length, 1), 3);
  return (
    <>
      {social.length > 0 && (
        <div className="rp-chips" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {social.map((l, i) => {
            const p = socialPlatform(l.url);
            return (
              <a key={i} href={l.url} className="rp-chip" onClick={() => onClick?.(l)} rel="noopener">
                <span><BrandIcon platform={p} /></span>
                <span>{BRAND_LABELS[p] || l.title}</span>
              </a>
            );
          })}
        </div>
      )}
      {rows.map((l, i) => (
        <a key={i} href={l.url} className="rp-link" onClick={() => onClick?.(l)} rel="noopener">
          <span className="rp-link-icon" aria-hidden="true"><RepIcon name={linkIconName(l)} /></span>
          <span className="rp-link-text">
            <span className="rp-link-title">{l.title}</span>
            {l.sub && <span className="rp-link-sub">{l.sub}</span>}
          </span>
          <span className="rp-link-go" aria-hidden="true"><RepIcon name="chevronRight" size={18} /></span>
        </a>
      ))}
    </>
  );
}

export function LinksBlock({ block, rep, defaults, isOwner, editMode }) {
  const links = cleanLinks(block.data?.links);
  const heading = String(block.data?.heading || '').trim();

  function handleClick(link) {
    if (isOwner) return;
    logBlockEvent(rep.id, block.id, 'links', 'link_click', link.title);
  }

  if (links.length === 0) {
    if (!editMode) return null;
    return (
      <Sample label="Links · add yours to show them">
        <nav className="rp-links"><LinkList links={defaults.links.map(l => ({ ...l, url: 'https://example.com' }))} /></nav>
      </Sample>
    );
  }

  return (
    <nav className="rp-links" aria-label={heading || 'Links'}>
      {heading && <h2 className="rp-h2 rp-section-h" style={{ marginBottom: 4 }}>{heading}</h2>}
      <LinkList links={links} onClick={handleClick} />
    </nav>
  );
}

// ── Lead form ────────────────────────────────────────────────────────────────

export function formConfig(block, rep, defaults) {
  const lc = block.data?.lead_capture || rep.lead_capture || {};
  const f = lc.form || {};
  const df = defaults.form;
  const methods = (Array.isArray(f.contact_methods) ? f.contact_methods : SUGGESTED_METHODS)
    .filter(m => CONTACT_METHODS[m] && m !== 'phone');
  return {
    label: f.label || df.label,
    headline: f.headline || df.headline,
    sub: f.sub || df.sub,
    question: f.qualifying_question ?? df.qualifying_question,
    options: (f.qualifying_options || df.qualifying_options || []).filter(o => String(o).trim()),
    button: noArrow(f.button_text || df.button_text),
    namePlaceholder: f.name_placeholder || 'First and last name',
    phonePlaceholder: f.phone_placeholder || '(555) 555-0100',
    collectEmail: !!f.collect_email,
    collectZip: !!f.collect_zip,
    // Call/text is always offered, and always first.
    methods: ['phone', ...methods],
    // Instagram/Messenger buttons appear only if the rep's links include that profile.
    message: f.message_buttons || { instagram: true, facebook: true },
  };
}

export function LeadCaptureBlock({ block, rep, defaults, isOwner, editMode, profileLinks }) {
  const cfg = formConfig(block, rep, defaults);
  const sectionRef = useRef(null);
  const logged = useRef(false);
  const who = firstName(rep.name);
  const buttons = messageButtons(cfg.message, profileLinks, `Hi ${who || 'there'}, I found you on ProPages and I'd like to learn more.`);

  useEffect(() => {
    if (isOwner || !sectionRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !logged.current) {
        logged.current = true;
        logBlockEvent(rep.id, block.id, 'lead_capture', 'form_view');
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [isOwner, rep.id, block.id]);

  return (
    <section className="rp-form" id="get-quote" ref={sectionRef} aria-labelledby={`form-h-${block.id}`}>
      <div className="rp-form-head">
        <span className="rp-eyebrow">{cfg.label}</span>
        <h2 className="rp-h2" id={`form-h-${block.id}`}>{cfg.headline}</h2>
        {cfg.sub && <p className="rp-form-sub">{cfg.sub}</p>}
      </div>
      <LeadForm repId={rep.id} repName={rep.name} cfg={cfg} formId={block.id} preview={editMode} />
      {buttons.length === 0 && editMode && (
        <Sample label="Message buttons · set up in this form">
          <div className="rp-dm">
            <span className="rp-dm-head">Rather message {who || 'me'} directly?</span>
            {[['instagram', 'Message on Instagram'], ['text', 'Send a text']].map(([ch, label]) => (
              <span key={ch} className="rp-dm-btn">
                <span className="rp-dm-icon">{ch === 'text' ? <RepIcon name="chat" size={20} /> : <BrandIcon platform={ch} size={20} />}</span>
                <span className="rp-dm-label">{label}</span>
                <RepIcon name="external" size={16} />
              </span>
            ))}
          </div>
        </Sample>
      )}
      {buttons.length > 0 && (
        <div className="rp-dm" role="group" aria-labelledby={`dm-h-${block.id}`}>
          <span className="rp-dm-head" id={`dm-h-${block.id}`}>Rather message {who || 'them'} directly?</span>
          {buttons.map(b => (
            <a key={b.channel} href={b.href} className="rp-dm-btn" target="_blank" rel="noopener"
              onClick={() => { if (!isOwner) logBlockEvent(rep.id, block.id, 'lead_capture', 'dm_click', b.channel); }}>
              <span className="rp-dm-icon" aria-hidden="true">{b.channel === 'text' ? <RepIcon name="chat" size={20} /> : <BrandIcon platform={b.channel} size={20} />}</span>
              <span className="rp-dm-label">{b.label}</span>
              <RepIcon name="external" size={16} />
            </a>
          ))}
        </div>
      )}
    </section>
  );
}

function MethodIcon({ method }) {
  const icon = CONTACT_METHODS[method]?.icon;
  return BRAND_PATHS[icon] ? <BrandIcon platform={icon} size={20} /> : <RepIcon name={icon} size={20} />;
}

// Consent line matched to the channel the visitor picked. Calls and texts get
// the full TCPA disclosure; messaging apps and email get a plain one.
function Consent({ method, button, repName }) {
  const name = repName || 'this professional';
  const privacy = <>See our <Link href="/privacy">Privacy Policy</Link>.</>;
  if (method === 'phone') {
    return (
      <p className="rp-tcpa">
        By tapping &ldquo;{button}&rdquo;, you agree that {name} may call or text you at the number above about your request,
        including by automated means. Consent isn&apos;t a condition of any purchase. Msg &amp; data rates may apply; reply STOP
        to opt out. {privacy}
      </p>
    );
  }
  const where = method === 'email' ? 'email you' : `message you on ${CONTACT_METHODS[method].label}`;
  return (
    <p className="rp-tcpa">
      By tapping &ldquo;{button}&rdquo;, you agree that {name} may {where} about your request.
      {method === 'whatsapp' && ' Msg & data rates may apply.'} {privacy}
    </p>
  );
}

function LeadForm({ repId, repName, cfg, formId, preview }) {
  const [answer, setAnswer] = useState('');
  const [method, setMethod] = useState('phone');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [zip, setZip] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const who = firstName(repName) || 'They';
  const m = CONTACT_METHODS[method];
  const askEmailToo = cfg.collectEmail && method !== 'email';

  function pick(next) {
    setMethod(next);
    setContact('');
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (preview) return;
    if (!name.trim()) { setError('Add your name.'); return; }
    const problem = validateContact(method, contact);
    if (problem) { setError(problem); return; }
    if (askEmailToo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError('Add a valid email address.'); return; }
    if (cfg.collectZip && !zip.trim()) { setError('Add your zip code.'); return; }
    setError('');
    setSending(true);

    const handle = cleanHandle(method, contact);
    const base = {
      rep_id: repId,
      name: name.trim(),
      notes: answer ? `${cfg.question ? `${cfg.question} ` : ''}${answer}` : null,
      ...((method === 'phone' || method === 'whatsapp') && { phone: contact.trim() }),
      ...(method === 'email' && { email: handle }),
      ...(askEmailToo && { email: email.trim() }),
      ...(cfg.collectZip && { zip: zip.trim() }),
    };
    const extra = method === 'phone' ? {} : { contact_method: method, contact_handle: handle };
    let { error: dbError } = await supabase.from('leads').insert([{ ...base, ...extra }]);
    // Until the contact_method / contact_handle columns exist, keep the
    // preference in notes rather than losing the lead.
    if (dbError && method !== 'phone' && /contact_(method|handle)/.test(dbError.message || '')) {
      const pref = `Prefers ${m.label}: ${method === 'instagram' ? '@' : ''}${handle}`;
      ({ error: dbError } = await supabase.from('leads').insert([{ ...base, notes: [base.notes, pref].filter(Boolean).join(' · ') }]));
    }
    setSending(false);
    if (dbError) { setError('Something went wrong. Please try again.'); return; }
    setDone(true);
  }

  if (done) {
    const how = method === 'phone' ? 'will be in touch soon.'
      : method === 'email' ? 'will email you soon.'
      : `will message you on ${m.label} soon.${method === 'whatsapp' ? '' : ' Keep an eye on your message requests.'}`;
    return (
      <div className="rp-done" role="status">
        <span className="rp-done-icon"><RepIcon name="check" size={28} strokeWidth={2.5} /></span>
        <h3 className="rp-h2" style={{ fontSize: 24, lineHeight: '28px' }}>You&apos;re all set.</h3>
        <p>{who} {how}</p>
      </div>
    );
  }

  const id = (s) => `${s}-${formId}`;
  const inputType = method === 'email' ? 'email' : (method === 'phone' || method === 'whatsapp') ? 'tel' : 'text';
  const autoComplete = method === 'email' ? 'email' : (method === 'phone' || method === 'whatsapp') ? 'tel' : 'off';
  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'contents' }}>
      {cfg.question && cfg.options.length > 0 && (
        <fieldset className="rp-fieldset">
          <legend className="rp-legend">{cfg.question}</legend>
          <div className="rp-opts">
            {cfg.options.map((opt, i) => (
              <label key={i} className={`rp-opt${answer === opt ? ' is-on' : ''}`} htmlFor={id(`opt${i}`)}>
                <input id={id(`opt${i}`)} type="radio" name={id('q')} checked={answer === opt} onChange={() => setAnswer(opt)} />
                {opt}
              </label>
            ))}
          </div>
        </fieldset>
      )}
      <div className="rp-field">
        <label className="rp-label" htmlFor={id('name')}>Your name</label>
        <input className="rp-input" id={id('name')} type="text" autoComplete="name" placeholder={cfg.namePlaceholder} value={name} onChange={e => setName(e.target.value)} />
      </div>
      {cfg.methods.length > 1 && (
        <fieldset className="rp-fieldset">
          <legend className="rp-legend">How should {firstName(repName) || 'they'} reach you?</legend>
          <div className="rp-methods">
            {cfg.methods.map(key => (
              <label key={key} className={`rp-method${method === key ? ' is-on' : ''}`} htmlFor={id(`m-${key}`)}>
                <input id={id(`m-${key}`)} type="radio" name={id('method')} checked={method === key} onChange={() => pick(key)} />
                <MethodIcon method={key} />
                <span>{CONTACT_METHODS[key].short}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}
      <div className="rp-field">
        <label className="rp-label" htmlFor={id('contact')}>{m.field}</label>
        <input className="rp-input" id={id('contact')} type={inputType} autoComplete={autoComplete}
          autoCapitalize={method === 'instagram' || method === 'email' ? 'none' : undefined}
          inputMode={inputType === 'tel' ? 'tel' : undefined}
          placeholder={method === 'phone' ? cfg.phonePlaceholder : m.placeholder}
          value={contact} onChange={e => setContact(e.target.value)} />
        {(method === 'instagram' || method === 'facebook') && (
          <span className="rp-hint">{who} will message you there. It may show up in your message requests.</span>
        )}
      </div>
      {askEmailToo && (
        <div className="rp-field">
          <label className="rp-label" htmlFor={id('email')}>Email</label>
          <input className="rp-input" id={id('email')} type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
      )}
      {cfg.collectZip && (
        <div className="rp-field">
          <label className="rp-label" htmlFor={id('zip')}>Zip code</label>
          <input className="rp-input" id={id('zip')} type="text" inputMode="numeric" autoComplete="postal-code" placeholder="12345" value={zip} onChange={e => setZip(e.target.value)} />
        </div>
      )}
      {error && <p className="rp-form-error" role="alert">{error}</p>}
      <button type="submit" className="rp-cta" disabled={sending}>
        {sending ? 'Sending…' : cfg.button}{!sending && <RepIcon name="arrowRight" size={20} strokeWidth={2.5} />}
      </button>
      <span className="rp-trust"><RepIcon name="lock" size={16} />Goes straight to {who}. No spam, ever.</span>
      <Consent method={method} button={cfg.button} repName={repName} />
    </form>
  );
}

// ── Reviews ──────────────────────────────────────────────────────────────────

function ReviewList({ items }) {
  return items.map((t, i) => (
    <figure className="rp-review" key={i}>
      <span className="rp-stars" role="img" aria-label="5 out of 5 stars">★★★★★</span>
      <blockquote>&ldquo;{t.text}&rdquo;</blockquote>
      <figcaption>
        <span className="rp-review-init" aria-hidden="true">{initialsOf(t.name)}</span>
        <span className="rp-review-who">
          <span className="rp-review-name">{t.name}</span>
          {t.detail && <span className="rp-review-detail">{t.detail}</span>}
        </span>
      </figcaption>
    </figure>
  ));
}

export function TestimonialsBlock({ block, defaults, editMode }) {
  const items = cleanTestimonials(block.data?.testimonials);
  const heading = String(block.data?.heading || '').trim() || 'What clients say';
  if (items.length === 0) {
    if (!editMode) return null;
    return (
      <Sample label="Reviews · add real ones to show them">
        <section className="rp-reviews">
          <h2 className="rp-h2">{heading}</h2>
          <ReviewList items={defaults.testimonials} />
        </section>
      </Sample>
    );
  }
  return (
    <section className="rp-reviews" aria-labelledby={`rev-h-${block.id}`}>
      <h2 className="rp-h2" id={`rev-h-${block.id}`}>{heading}</h2>
      <ReviewList items={items} />
    </section>
  );
}

// ── Other blocks ─────────────────────────────────────────────────────────────

function EmptyOwnerNote({ editMode, children }) {
  if (!editMode) return null;
  return <Sample label={children}><div style={{ height: 80, borderRadius: 16, background: 'var(--pp-surface)', border: '1px solid var(--pp-border)' }} /></Sample>;
}

export function TextBlock({ block, editMode }) {
  const d = block.data || {};
  if (!d.heading && !d.body) return <EmptyOwnerNote editMode={editMode}>Text · add a heading or paragraph</EmptyOwnerNote>;
  return (
    <section className="rp-text">
      {d.heading && <h2 className="rp-h2 rp-section-h">{d.heading}</h2>}
      {d.body && <p>{d.body}</p>}
    </section>
  );
}

function youTubeId(raw) {
  const m = String(raw || '').match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

export function VideoBlock({ block, editMode }) {
  const d = block.data || {};
  const url = String(d.url || '').trim();
  if (!url) return <EmptyOwnerNote editMode={editMode}>Video · paste a YouTube or TikTok link</EmptyOwnerNote>;
  const yt = youTubeId(url);
  if (!yt) {
    if (!/^https?:\/\//i.test(url)) return null;
    return (
      <div className="rp-links">
        <a href={url} className="rp-link" rel="noopener">
          <span className="rp-link-icon" aria-hidden="true">{socialPlatform(url) ? <BrandIcon platform={socialPlatform(url)} size={22} /> : <RepIcon name="video" />}</span>
          <span className="rp-link-text">
            <span className="rp-link-title">{d.caption || 'Watch the video'}</span>
            <span className="rp-link-sub">{url.replace(/^https?:\/\/(www\.)?/, '').slice(0, 40)}</span>
          </span>
          <span className="rp-link-go" aria-hidden="true"><RepIcon name="chevronRight" size={18} /></span>
        </a>
      </div>
    );
  }
  return (
    <figure style={{ margin: 0 }}>
      <div className="rp-video">
        <iframe src={`https://www.youtube-nocookie.com/embed/${yt}`} title={d.caption || 'Video'} loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      </div>
      {d.caption && <figcaption className="rp-caption">{d.caption}</figcaption>}
    </figure>
  );
}

export function PortfolioBlock({ block, editMode }) {
  const d = block.data || {};
  const images = (d.images || []).filter(img => /^https?:\/\//i.test(String(img?.url || '')));
  if (images.length === 0) return <EmptyOwnerNote editMode={editMode}>Portfolio · add photos of your work</EmptyOwnerNote>;
  const imgs = images.map((img, i) => <img key={i} src={img.url} alt={img.caption || `Photo ${i + 1}`} loading="lazy" />);
  return (
    <section className="rp-block-stack">
      {d.heading && <h2 className="rp-h2 rp-section-h">{d.heading}</h2>}
      {d.layout === 'carousel' ? <div className="rp-carousel">{imgs}</div> : <div className="rp-grid">{imgs}</div>}
    </section>
  );
}

export function SocialFeedBlock({ block, editMode }) {
  const d = block.data || {};
  const posts = (d.posts || []).filter(p => /^https?:\/\//i.test(String(p?.url || '')));
  if (posts.length === 0) return <EmptyOwnerNote editMode={editMode}>Social posts · add links to your posts</EmptyOwnerNote>;
  return (
    <section className="rp-links">
      {d.heading && <h2 className="rp-h2 rp-section-h" style={{ marginBottom: 4 }}>{d.heading}</h2>}
      {posts.map((post, i) => {
        const p = socialPlatform(post.url);
        return (
          <a key={i} href={post.url} className="rp-link" rel="noopener">
            <span className="rp-link-icon" aria-hidden="true">{p ? <BrandIcon platform={p} size={22} /> : <RepIcon name="link" />}</span>
            <span className="rp-link-text">
              <span className="rp-link-title">{post.caption || BRAND_LABELS[p] || 'View post'}</span>
              {post.date && <span className="rp-link-sub">{post.date}</span>}
            </span>
            <span className="rp-link-go" aria-hidden="true"><RepIcon name="chevronRight" size={18} /></span>
          </a>
        );
      })}
    </section>
  );
}

// ── Footer ───────────────────────────────────────────────────────────────────

export function RepFooter({ slug, mode }) {
  return (
    <footer className="rp-footer">
      <Link href={`/signup?ref=${encodeURIComponent(slug)}`} className="rp-footer-cta">Want a page like this? Get your own</Link>
      <Link href="/" className="rp-made">
        Made with <Logo tone={mode === 'light' ? 'light' : 'dark'} glow={false} height={20} />
      </Link>
    </footer>
  );
}

export function renderBlock(block, ctx) {
  if (block.visible === false && !ctx.editMode) return null;
  const props = { block, ...ctx };
  switch (block.type) {
    case 'hero':         return <HeroBlock {...props} />;
    case 'links':        return <LinksBlock {...props} />;
    case 'lead_capture': return <LeadCaptureBlock {...props} />;
    case 'testimonials': return <TestimonialsBlock {...props} />;
    case 'text':         return <TextBlock {...props} />;
    case 'video':        return <VideoBlock {...props} />;
    case 'portfolio':    return <PortfolioBlock {...props} />;
    case 'social_feed':  return <SocialFeedBlock {...props} />;
    default:             return null;
  }
}
