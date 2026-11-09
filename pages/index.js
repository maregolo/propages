// Marketing homepage.
// Design: "Outfit · Laptop 1440 (working draft)" board + phone 390 / desktop 1920
// copies, ProPages Cleanup Pass canvas. Notes: claude/REDESIGN-NOTES.md.
//
// Signup is open: both handle fields store the handle for setup step 1
// (localStorage `pp_claim_handle`) and send visitors to /signup.
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import SiteMeta from '../components/SiteMeta';
import SiteNav from '../components/site/SiteNav';
import SiteFooter from '../components/site/SiteFooter';
import Container from '../components/site/Container';
import Button, { Arrow } from '../components/site/Button';
import Field from '../components/site/Field';
import HandleField, { CLAIM_KEY, DOMAIN, cleanHandle } from '../components/site/HandleField';
import { Route, HeroMap, ProblemMap, FeaturesMap, PricingMap, ClosingMap } from '../components/site/TurfMap';
import s from '../styles/Home.module.css';

const TITLE = 'ProPages – The only link-in-bio built for sales.';

// Proof bar: true statements only (no user counts until there are real ones).
const PROOF = [
  { num: '26', label: 'industries with ready-made pages' },
  { num: '3', label: 'steps to a live page' },
  { num: '24/7', label: 'lead capture' },
];

const PRICE_ROWS = [
  { name: 'Your Page + Lead Capture', note: 'Website builder + form tool, typically', price: '$20/mo' },
  { name: 'Verified Badge', note: 'Trust signal, standalone tools charge for this', price: '$8/mo' },
  { name: 'Instant Lead Alerts', note: 'Typical CRM alert add-on', price: '$25/mo' },
  { name: 'Conversion Analytics', note: 'Standalone analytics tool, entry tier', price: '$19/mo' },
  { name: 'A/B Testing Tools', note: 'Standalone optimization tool', price: '$39/mo' },
];

const HIGHLIGHTS = [
  { tag: 'Your URL', title: 'Your handle. Your brand.' },
  { tag: 'Analytics', title: "See what's working.", body: "Page views, lead conversions, weekly trends. Know exactly how many people your pitch is reaching, even when you're not in the room.", active: true },
  { tag: 'Make It Yours', title: 'Built around your business.' },
  { tag: 'Live in Minutes', title: 'No designer. No developer.' },
  { tag: 'Your Gateway', title: 'Your page grows with you.' },
];

const icon = { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.75, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };

const STEPS = [
  {
    num: '01', title: 'Get Your Page', body: 'Sign up, pick your handle, and your ProPage is live in minutes.',
    icon: <svg {...icon}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>,
  },
  {
    num: '02', title: 'Share It Anywhere', body: "Drop your QR code on leave-behinds, texts, or cards. One scan and they're on your page.", ink: true,
    icon: <svg {...icon}><rect width="5" height="5" x="3" y="3" rx="1" /><rect width="5" height="5" x="16" y="3" rx="1" /><rect width="5" height="5" x="3" y="16" rx="1" /><path d="M21 16h-3a2 2 0 0 0-2 2v3" /><path d="M12 7v3a2 2 0 0 1-2 2H7" /><path d="M16 12h1" /><path d="M12 21v-1" /></svg>,
  },
  {
    num: '03', title: 'Capture the Lead', body: 'Interested leads fill out your form on their own time. You get notified. No lead slips through.',
    icon: <svg {...icon}><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></svg>,
  },
];

function Phone({ tone, initials, name, title, cta, slug }) {
  return (
    <div className={`${s.phone} ${tone === 'dark' ? s.phoneDark : s.phoneLight}`} aria-hidden="true">
      <div className={s.pNotch} />
      <div className={s.pBrand}>PROPAGES</div>
      <div className={s.pAvatarWrap}>
        <div className={s.pAvatar}>{initials}</div>
        <div className={s.pDot} />
      </div>
      <div className={s.pName}>{name}</div>
      <div className={s.pTitle}>{title}</div>
      <div className={s.pVerified}>Verified Rep</div>
      <div className={s.pRule} />
      <div className={s.pInput}>Your name</div>
      <div className={s.pInput}>Phone number</div>
      <div className={s.pBtn}>{cta}</div>
      <div className={s.pUrl}>{DOMAIN}/{slug}</div>
    </div>
  );
}

function ClaimForm() {
  const router = useRouter();
  const [handle, setHandle] = useState('');
  const [email, setEmail] = useState('');

  function submit(e) {
    e.preventDefault();
    const h = cleanHandle(handle);
    try {
      if (h) localStorage.setItem(CLAIM_KEY, h);
      localStorage.setItem('pp_signup_source', 'home-closing');
    } catch (err) { /* storage unavailable: signup still works */ }
    const q = email.trim() ? `?email=${encodeURIComponent(email.trim())}` : '';
    router.push(`/signup${q}`);
  }

  return (
    <form className={s.claimCard} onSubmit={submit}>
      <div>
        <label className="site-label" htmlFor="claim-handle">Pick your link</label>
        <label className={s.handleBox} htmlFor="claim-handle">
          <span className={s.handlePrefix}>{DOMAIN}/</span>
          <input
            id="claim-handle"
            className={s.handleInput}
            type="text"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck="false"
            placeholder="yourname"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
          />
        </label>
      </div>
      <Field
        label="Email address"
        type="email"
        name="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Button type="submit" size="xl" block arrow>Claim my page</Button>
      <p className={s.claimNote}>7-day free trial · Cancel anytime · Already have a page? <Link href="/signup">Log in</Link></p>
    </form>
  );
}

export default function Home() {
  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="One link working around the clock: capturing leads, building your reputation, and starting conversations before you ever pitch." />
      </Head>
      <SiteMeta title={TITLE} />

      <div className={`site-page ${s.page}`}>

        {/* ── Dark: nav + hero + proof ── */}
        <div className={s.dark}>
          <SiteNav />

          <Container as="section" className={s.hero} aria-labelledby="hero-title">
            <HeroMap className={s.heroMap} />
            <div className={s.heroCopy}>
              <span className={s.eyebrow}>For Reps, Contractors &amp; Closers</span>
              <h1 id="hero-title" className={`site-h-hero ${s.heroTitle}`}>
                The only <span className={s.nowrap}>link-in-bio</span>{' '}
                <span className={s.accent}>built for sales.</span>
              </h1>
              <p className={s.heroSub}>
                One link working around the clock — <strong>capturing leads, building your reputation, and starting conversations</strong> before you ever pitch.
              </p>
              <HandleField cta="Claim your turf" source="home-hero" />
              <span className={s.heroNote}>7-day free trial · Cancel anytime · <a href="/jake-rivera" target="_blank" rel="noopener">See an example</a></span>
            </div>

            <div className={s.heroVisual}>
              <Image className={s.heroPhoto} src="/Young_Man_with_Clipboard.png" alt="Sales rep in the field with a clipboard" fill priority sizes="(max-width: 760px) 100vw, 50vw" />
              <Phone tone="dark" initials="SM" name="Sara Mitchell" title="Roofing · Denver" cta="Get a Free Inspection" slug="sara-mitchell" />
              <Phone tone="light" initials="JR" name="Jake Rivera" title="Solar Consultant · Phoenix" cta="Get My Free Estimate" slug="jake-rivera" />
            </div>
          </Container>

          <section className={s.proof} aria-label="At a glance">
            <Container as="ul" className={s.proofInner}>
              {PROOF.map((p) => (
                <li key={p.label} className={s.proofItem}>
                  <span className={s.proofNum}>{p.num}</span>
                  <span className={s.proofLabel}>{p.label}</span>
                </li>
              ))}
            </Container>
          </section>
        </div>

        {/* ── The problem ── */}
        <Container as="section" className={`${s.section} ${s.problem}`} aria-labelledby="problem-title">
          <Route d="M40 0 V8 H90 V100" className={s.route} />
          <ProblemMap className={`${s.map} ${s.problemMap}`} />
          <h2 id="problem-title" className={`site-h-section ${s.problemTitle}`}>
            The internet is the <span className={s.swipe}>greatest wealth-generating machine ever built.</span> You&apos;re not plugged into it.
          </h2>
          <div className={s.problemCopy}>
            <p className={s.problemBody}>
              Creators have it. Online stores have it. Every brand on the internet has it: a way to capture leads, grow an audience, and make money while they sleep. You&apos;ve been doing it the hard way.
            </p>
            <p className={s.problemBody}>
              And the ground is moving under all of us. Your customers look you up before they open the door. AI now answers the questions you used to answer on the porch. Tools that took a team last year take an afternoon today. The reps who stake their claim online now will own their turf. The ones who wait will be explaining why nobody can find them.
            </p>
            <p className={`${s.problemBody} ${s.problemKicker}`}>The time to get out there is now.</p>
          </div>
          <a href="#features" className={s.textLink}>One link changes that.</a>
        </Container>

        {/* ── Features ── */}
        <section id="features" className={`${s.section} ${s.features} ${s.anchor}`} aria-labelledby="features-title">
          <Route d="M90 0 V3 H2.5 V100" className={s.route} />
          <FeaturesMap className={`${s.map} ${s.featuresMap}`} />
          <Container className={s.featuresInner}>
            <h2 id="features-title" className="site-h-section">How it works for you.</h2>

            <div className={s.row}>
              <div className={s.rowText}>
                <span className={`${s.eyebrow} ${s.eyebrowCoral}`}>Always On</span>
                <h3 className="site-h-feature">24/7 lead capture.</h3>
                <p className={s.body}>Amazon never closes. Neither does your ProPage. The biggest brands in the world have a digital salesman working around the clock — capturing leads, qualifying prospects, filling the pipeline. Now you have one too.</p>
                <p className={s.kicker}>The door closes. Your page stays open.</p>
              </div>
              <div className={`${s.panel} ${s.panelWhite}`} aria-hidden="true">
                <div className={s.leadCard}>
                  <span className={s.leadTitle}>Get a Free Quote</span>
                  <span className={s.leadUrl}>{DOMAIN}/jake-rivera</span>
                  <div className={s.mockField}>Full name</div>
                  <div className={s.mockField}>Phone number</div>
                  <div className={s.mockField}>
                    What&apos;s your biggest concern?
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                  </div>
                  <div className={s.mockBtn}>Send My Info</div>
                  <div className={s.toast}>New lead — Marcus T. just submitted · 2 min ago</div>
                </div>
              </div>
            </div>

            <div className={`${s.row} ${s.rowReverse}`}>
              <div className={`${s.panel} ${s.panelDark}`} aria-hidden="true">
                <div className={s.miniPhone}>
                  <span className={s.miniBrand}>PROPAGES</span>
                  <div className={s.miniAvatar}>JR</div>
                  <span className={s.miniName}>Jake Rivera</span>
                  <span className={s.miniTitle}>Solar · Phoenix, AZ</span>
                  <div className={s.miniRule} />
                  <div className={s.miniField}>Your name</div>
                  <div className={s.miniField}>Phone number</div>
                  <div className={s.miniBtn}>Get My Free Estimate</div>
                  <span className={s.miniUrl}>{DOMAIN}/jake-rivera</span>
                </div>
              </div>
              <div className={s.rowText}>
                <span className={`${s.eyebrow} ${s.eyebrowInk}`}>Your Digital Presence</span>
                <h3 className="site-h-feature">A page you&apos;re actually proud to share.</h3>
                <p className={s.body}>Not a generic form. Not a basic link tree. A real, designed page with your name, your industry, your story — that you&apos;d send to your best prospect without hesitation. First impressions happen online now. Make yours count.</p>
                <p className={s.kicker}>{DOMAIN}/yourname — live in minutes.</p>
              </div>
            </div>

            <div className={s.row}>
              <div className={s.rowText}>
                <span className={`${s.eyebrow} ${s.eyebrowCoral}`}>Word of Mouth, Automated</span>
                <h3 className="site-h-feature">Give your best customers something to send.</h3>
                <p className={s.body}>The best lead you&apos;ll ever get is a warm referral. But referrals die without a destination. ProPages gives every satisfied customer a link to share and a form that captures their neighbor the moment they&apos;re ready. Word of mouth, finally working at scale.</p>
                <p className={s.kicker}>Your reputation, shareable.</p>
              </div>
              <div className={`${s.panel} ${s.panelWhite} ${s.panelCol}`} aria-hidden="true">
                <div className={s.refLink}>
                  <span className={s.refUrl}>{DOMAIN}/jake?ref=sandra</span>
                  <span className={s.refCopy}>Copy</span>
                </div>
                <div className={s.refChain}>
                  <span className={`${s.refAvatar} ${s.refA}`}>JR</span>
                  <Arrow size={20} />
                  <span className={`${s.refAvatar} ${s.refB}`}>SK</span>
                  <Arrow size={20} />
                  <span className={`${s.refAvatar} ${s.refC}`}>+3</span>
                </div>
                <span className={s.refNote}>Sandra referred 3 neighbors this month</span>
              </div>
            </div>
          </Container>
        </section>

        {/* ── Feature highlight ── */}
        <Container as="section" className={`${s.section} ${s.highlight}`} aria-label="More features">
          <Route d="M2.5 0 V8 H42.5 V100" className={s.route} />
          <div className={s.statsCard} aria-hidden="true">
            <div className={s.bars}>
              {[30, 55, 45, 70, 60, 88, 75].map((h, i) => (
                <div key={i} className={`${s.bar} ${i === 5 ? s.barHot : ''}`} style={{ height: `${h}%` }} />
              ))}
            </div>
            <div className={s.days}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <span key={i}>{d}</span>)}</div>
            <div className={s.statTiles}>
              <div className={s.statTile}><span className={s.statNum}>247</span><span className={s.statLabel}>Page Views</span></div>
              <div className={s.statTile}><span className={s.statNum}>18%</span><span className={s.statLabel}>Conversion</span></div>
              <div className={s.statTile}><span className={`${s.statNum} ${s.statNumHot}`}>44</span><span className={s.statLabel}>Leads</span></div>
            </div>
          </div>
          <ol className={s.list}>
            {HIGHLIGHTS.map((h) => (
              <li key={h.tag} className={`${s.item} ${h.active ? s.itemActive : ''}`}>
                <span className={s.itemTag}>{h.tag}</span>
                <span className={s.itemTitle}>{h.title}</span>
                {h.body && <p className={s.itemBody}>{h.body}</p>}
              </li>
            ))}
          </ol>
        </Container>

        {/* ── Pricing ── */}
        <Container as="section" id="pricing" className={`${s.section} ${s.pricing} ${s.anchor}`} aria-labelledby="pricing-title">
          <Route d="M42.5 0 V88 H2.5 V100" className={s.route} />
          <div className={s.priceCard}>
            <PricingMap className={s.priceMap} />
            <div className={s.priceCopy}>
              <span className={`${s.eyebrow} ${s.eyebrowOnDark}`}>Simple Pricing</span>
              <h2 id="pricing-title" className={`site-h-section ${s.priceTitle}`}>What you&apos;re actually getting.</h2>
              <p className={s.priceTerms}>7-day free trial · Cancel anytime · No setup fee</p>
              <Button href="/signup" size="xl" arrow>Start your free trial</Button>
            </div>
            <div className={s.priceTable}>
              <table>
                <tbody>
                  {PRICE_ROWS.map((r) => (
                    <tr key={r.name}>
                      <td><span className={s.rowName}>{r.name}</span><span className={s.rowNote}>{r.note}</span></td>
                      <td>{r.price}</td>
                    </tr>
                  ))}
                  <tr className={s.total}><td>Elsewhere</td><td>$111/mo</td></tr>
                </tbody>
              </table>
              <div className={s.ours}>
                <span className={s.oursName}>ProPages</span>
                <span className={s.oursPrice}><b>$19</b><span>/mo</span></span>
              </div>
            </div>
          </div>
        </Container>

        {/* ── How it works ── */}
        <Container as="section" id="how" className={`${s.section} ${s.how} ${s.anchor}`} aria-labelledby="how-title">
          <Route d="M2.5 0 V90 H20 V100" className={s.route} />
          <h2 id="how-title" className="site-h-section">Up and running in minutes.</h2>
          <ol className={s.steps}>
            {STEPS.map((st) => (
              <li key={st.num} className={s.step}>
                <div className={s.stepTop}>
                  <span className={`${s.stepNum} ${st.ink ? s.stepNumInk : ''}`} aria-hidden="true">{st.num}</span>
                  <span className={`${s.stepIcon} ${st.ink ? s.stepIconInk : ''}`} aria-hidden="true">{st.icon}</span>
                </div>
                <h3 className={s.stepTitle}>{st.title}</h3>
                <p className={s.stepBody}>{st.body}</p>
              </li>
            ))}
          </ol>
        </Container>

        {/* ── Closing: claim your page ── */}
        <section id="claim" className={`${s.section} ${s.closing} ${s.anchor}`} aria-labelledby="claim-title">
          <Route d="M20 0 V42" className={s.route} />
          <ClosingMap className={`${s.map} ${s.closingMap}`} />
          <Container className={s.closingInner}>
            <div className={s.closingCopy}>
              <span className={`${s.eyebrow} ${s.eyebrowCoral}`}>Get Started</span>
              <h2 id="claim-title" className={`site-h-closing ${s.closingTitle}`}>Claim your page.</h2>
              <p className={s.closingBody}>Pick your link, tell us what you sell, and your page is ready to share in minutes.</p>
            </div>
            <ClaimForm />
          </Container>
        </section>

        <SiteFooter />
      </div>
    </>
  );
}
