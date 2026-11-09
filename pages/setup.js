import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import { THEMES, getTheme, DEFAULT_THEME } from '../lib/themes';
import AppShell, { AppLoading, Intro, Alert } from '../components/site/AppShell';
import Button from '../components/site/Button';
import Field from '../components/site/Field';
import Icon from '../components/site/icons';
import { DOMAIN } from '../components/site/HandleField';

// ─── Default block stack written at signup ────────────────────────────────────

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

function buildDefaultBlocks(slug, name, title, city, industry, employment_type, photo_url) {
  return [
    {
      id: generateId(),
      type: 'profile',
      visible: true,
      data: { name, title, city, industry, photo_url },
    },
    {
      id: generateId(),
      type: 'headline',
      visible: true,
      data: {},  // falls back to industry defaults at render time
    },
    {
      id: generateId(),
      type: 'stats',
      visible: true,
      data: {},  // falls back to industry defaults at render time
    },
    {
      id: generateId(),
      type: 'lead_capture',
      visible: true,
      data: {},  // falls back to industry defaults at render time
    },
    {
      id: generateId(),
      type: 'testimonials',
      visible: true,
      data: {},  // falls back to industry defaults at render time
    },
    {
      id: generateId(),
      type: 'links',
      visible: true,
      data: {},  // populated in step 2 if rep adds links; otherwise falls back to defaults
    },
  ];
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Setup() {
  const router = useRouter();

  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');
  const [step,    setStep]    = useState(1);
  const [savedSlug, setSavedSlug] = useState('');

  // Step 1 fields
  const [name,           setName]           = useState('');
  const [slug,           setSlug]           = useState('');
  const claimedSlug = useRef(false);
  const [slugAvailable,  setSlugAvailable]  = useState(null);
  const [title,          setTitle]          = useState('');
  const [city,           setCity]           = useState('');
  const [industry,       setIndustry]       = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [phone,          setPhone]          = useState('');
  const [photo,          setPhoto]          = useState(null);
  const [photoPreview,   setPhotoPreview]   = useState(null);

  // Step 2 field (theme)
  const [accent, setAccent] = useState(DEFAULT_THEME);

  // Step 3 fields
  const [instagram,  setInstagram]  = useState('');
  const [tiktok,     setTiktok]     = useState('');
  const [calendly,   setCalendly]   = useState('');
  const [website,    setWebsite]    = useState('');
  const [otherLink,  setOtherLink]  = useState('');
  const [otherLabel, setOtherLabel] = useState('');


  function generateSlug(val) {
    return val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  }

  function handleNameChange(e) {
    const val = e.target.value;
    setName(val);
    if (claimedSlug.current) return; // keep the handle they claimed on the homepage
    const generated = generateSlug(val);
    setSlug(generated);
    if (generated) checkSlug(generated);
  }

  function handleSlugChange(e) {
    const val = generateSlug(e.target.value);
    claimedSlug.current = true; // a hand-edited handle also stops name auto-fill
    setSlug(val);
    if (val) checkSlug(val);
  }

  async function checkSlug(val) {
    setSlugAvailable(null);
    if (!val || val.length < 3) return;
    const { data } = await supabase
      .from('reps')
      .select('slug')
      .eq('slug', val)
      .maybeSingle();
    setSlugAvailable(!data);
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        router.push('/signup');
        return;
      }
      setUser(session.user);

      const { data: existing } = await supabase
        .from('reps')
        .select('slug')
        .eq('auth_id', session.user.id)
        .maybeSingle();

      if (existing?.slug) {
        router.push('/dashboard');
        return;
      }

      // Handle claimed on the homepage ("propages.pro/[yourname]" field)
      try {
        const claimed = localStorage.getItem('pp_claim_handle');
        if (claimed) {
          const clean = generateSlug(claimed);
          if (clean) {
            claimedSlug.current = true;
            setSlug(clean);
            checkSlug(clean);
          }
        }
      } catch (err) { /* storage unavailable */ }

      setLoading(false);
    });
  }, []);

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function normalizeUrl(val) {
    if (!val) return null;
    val = val.trim();
    if (!val) return null;
    if (!/^https?:\/\//i.test(val)) return 'https://' + val;
    return val;
  }

  function buildLinks() {
    const links = [];
    if (instagram) links.push({
      icon: '📸',
      title: 'Follow on Instagram',
      sub: '@' + instagram.replace(/^@/, '').replace(/.*instagram\.com\//, '').replace(/\/$/, ''),
      url: instagram.includes('instagram.com') ? normalizeUrl(instagram) : `https://instagram.com/${instagram.replace(/^@/, '')}`,
    });
    if (tiktok) links.push({
      icon: '🎵',
      title: 'Follow on TikTok',
      sub: '@' + tiktok.replace(/^@/, '').replace(/.*tiktok\.com\/@?/, '').replace(/\/$/, ''),
      url: tiktok.includes('tiktok.com') ? normalizeUrl(tiktok) : `https://tiktok.com/@${tiktok.replace(/^@/, '')}`,
    });
    if (calendly) links.push({
      icon: '📅',
      title: 'Book a Call',
      sub: 'Pick a time that works for you',
      url: normalizeUrl(calendly),
    });
    if (website) links.push({
      icon: '🌐',
      title: 'My Website',
      sub: website.replace(/^https?:\/\//, '').replace(/\/$/, ''),
      url: normalizeUrl(website),
    });
    if (otherLink) links.push({
      icon: '🔗',
      title: otherLabel || 'Learn More',
      sub: otherLink.replace(/^https?:\/\//, '').replace(/\/$/, ''),
      url: normalizeUrl(otherLink),
    });
    return links.length > 0 ? links : null;
  }

  async function handleStep1Submit(e) {
    e.preventDefault();
    setError('');

    if (!name || !slug || !industry || !employmentType) {
      setError('Please fill in all required fields.');
      return;
    }
    if (slugAvailable === false) {
      setError('That handle is already taken. Please choose another.');
      return;
    }

    setSaving(true);

    const { data: existingRep } = await supabase
      .from('reps')
      .select('slug')
      .eq('auth_id', user.id)
      .maybeSingle();

    if (existingRep?.slug) {
      router.push('/dashboard');
      return;
    }

    // Upload photo if provided
    let photo_url = null;
    if (photo) {
      const ext = photo.name.split('.').pop();
      const path = `${slug}-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, photo);
      if (uploadError) {
        setError('Photo upload failed. You can skip it for now.');
        setSaving(false);
        return;
      }
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(path);
      photo_url = urlData.publicUrl;
    }

    // Build the default block stack for this rep
    const blocks = buildDefaultBlocks(
      slug, name, title, city, industry, employmentType, photo_url
    );

    const referredBy = typeof window !== 'undefined' ? localStorage.getItem('pp_referral_ref') : null;

    const { error: insertError } = await supabase.from('reps').insert({
      slug,
      name,
      title,
      city,
      industry,
      employment_type: employmentType,
      phone: phone || null,
      photo_url,
      auth_id: user.id,
      blocks,
      referred_by: referredBy || null,
      accent: DEFAULT_THEME,
      theme: getTheme(DEFAULT_THEME).mode,
      font_pair: 'default',
    });

    if (insertError) {
      setError(insertError.message || 'Something went wrong. Please try again.');
      setSaving(false);
      return;
    }

    // Clear referral ref now that it's been written
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pp_referral_ref');
      localStorage.removeItem('pp_claim_handle');
    }

    setSaving(false);
    setSavedSlug(slug);
    setStep(2);
  }

  async function handleThemeSubmit() {
    setError('');
    setSaving(true);

    const { error: themeError } = await supabase
      .from('reps')
      .update({ accent, theme: getTheme(accent).mode })
      .eq('slug', savedSlug);

    setSaving(false);

    if (themeError) {
      setError(themeError.message || 'Something went wrong. Please try again.');
      return;
    }

    setStep(3);
  }

  async function handleLinksSubmit(skipLinks) {
    setSaving(true);

    if (!skipLinks) {
      const links = buildLinks();
      if (links) {
        // Fetch the current blocks array, find the links block, update its data
        const { data: repData } = await supabase
          .from('reps')
          .select('blocks')
          .eq('slug', savedSlug)
          .single();

        if (repData && repData.blocks) {
          const updatedBlocks = repData.blocks.map(block =>
            block.type === 'links'
              ? { ...block, data: { ...block.data, links } }
              : block
          );
          await supabase
            .from('reps')
            .update({ blocks: updatedBlocks })
            .eq('slug', savedSlug);
        }
      }
    }

    setSaving(false);
    router.push(`/${savedSlug}?new=true`);
  }

  if (loading) return <AppLoading />;

  const opt = <span className="opt">(optional)</span>;
  const live = (
    <div className="site-chip" style={{ justifyContent: 'flex-start' }}>
      <span className="site-chip__live" aria-hidden="true" />
      <span>Your page is live at <strong>{DOMAIN}/{savedSlug}</strong></span>
    </div>
  );

  return (
    <AppShell title="Set up your page" width={560} step={step} steps={3}>
      <main className="site-app__main">

        {/* ── STEP 1: profile ── */}
        {step === 1 && (
          <>
            <Intro title="Claim your page.">Set up your ProPage in under 2 minutes.</Intro>

            <form className="site-app__form" style={{ gap: 24 }} onSubmit={handleStep1Submit}>

              {/* Photo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <div aria-hidden="true" style={{
                  width: 80, height: 80, borderRadius: '50%', flexShrink: 0, overflow: 'hidden',
                  background: 'var(--site-dark-2)',
                  border: photoPreview ? '2px solid var(--site-coral)' : '2px dashed rgba(255,255,255,0.22)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 30, fontWeight: 700, color: 'var(--site-coral)',
                }}>
                  {photoPreview
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={photoPreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : (name ? name.charAt(0).toUpperCase() : <Icon name="person" size={28} />)}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
                  <label htmlFor="photo-upload" className="site-btn site-btn--outline-dark" style={{ minHeight: 44, padding: '0 18px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
                    <Icon name="camera" />{photoPreview ? 'Change photo' : 'Add a photo'}
                  </label>
                  <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoChange} className="sr-only" style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }} />
                  <span style={{ fontSize: 13, color: 'var(--site-on-dark-2)' }}>Optional · pages with a photo look more trustworthy</span>
                </div>
              </div>

              <Field label="Your name" type="text" autoComplete="name" placeholder="Jake Rivera" value={name} onChange={handleNameChange} />

              {/* Handle */}
              <div>
                <label className="site-label" htmlFor="setup-handle">Your handle</label>
                <label className="site-handle" htmlFor="setup-handle">
                  <span className="site-handle__prefix">{DOMAIN}/</span>
                  <input
                    id="setup-handle"
                    type="text"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                    placeholder="jake-rivera"
                    value={slug}
                    onChange={handleSlugChange}
                    aria-describedby="handle-status"
                  />
                  {slug.length >= 3 && slugAvailable === true && <Icon name="check" size={20} strokeWidth={2.5} style={{ color: 'var(--site-mint-ink)' }} />}
                </label>
                <span id="handle-status" aria-live="polite">
                  {slug.length >= 3 && slugAvailable === true  && <span className="site-status site-status--ok">Available, this one&apos;s yours.</span>}
                  {slug.length >= 3 && slugAvailable === false && <span className="site-status site-status--bad">Already taken. Try another.</span>}
                  {slug.length > 0 && slug.length < 3          && <span className="site-status site-status--muted">Handles need at least 3 characters.</span>}
                </span>
              </div>

              <div className="site-grid-2">
                <Field label={<>Your title {opt}</>} type="text" placeholder="Solar Energy Consultant" value={title} onChange={e => setTitle(e.target.value)} />
                <Field label={<>Your city {opt}</>} type="text" autoComplete="address-level2" placeholder="Phoenix, AZ" value={city} onChange={e => setCity(e.target.value)} />
              </div>

              {/* Industry */}
              <div>
                <label className="site-label" htmlFor="setup-industry">Industry</label>
                <div className="site-select">
                  <select id="setup-industry" className="site-field" value={industry} onChange={e => setIndustry(e.target.value)}>
                    <option value="">Select your industry…</option>
                    {INDUSTRIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                  <Icon name="chevronDown" size={20} />
                </div>
              </div>

              {/* Employment type */}
              <fieldset className="site-fieldset">
                <legend>Are you…</legend>
                <div className="site-choices">
                  {[['independent', 'Independent', 'person'], ['employee', 'Employee', 'building']].map(([v, l, ic]) => (
                    <label key={v} className="site-choice">
                      <input type="radio" name="employment" value={v} checked={employmentType === v} onChange={() => setEmploymentType(v)} />
                      <Icon name={ic} />{l}
                    </label>
                  ))}
                </div>
                {employmentType === 'employee' && (
                  <p className="site-hint">Heads up: make sure your employer is okay with you having your own page. ProPages isn&apos;t responsible for workplace conflicts.</p>
                )}
              </fieldset>

              <Field
                label={<>Phone number {opt}</>}
                type="tel"
                autoComplete="tel"
                placeholder="(602) 555-0100"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                hint="Lead alerts go to your email for now. Text alerts are coming soon. US numbers only."
              />

              <Alert error={error} />

              <Button type="submit" size="app" block disabled={saving} arrow={!saving} style={{ marginTop: 8 }}>
                {saving ? 'Setting up your page…' : 'Next: pick a theme'}
              </Button>
            </form>
          </>
        )}

        {/* ── STEP 2: theme ── */}
        {step === 2 && (
          <>
            <Intro title="Pick your style.">Choose a look. You can change it anytime.</Intro>
            {live}
            <fieldset className="site-fieldset">
              <legend className="sr-only" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>Theme</legend>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
                {Object.entries(THEMES).map(([key, t]) => (
                  <ThemeCard key={key} id={key} theme={t} checked={accent === key} onSelect={setAccent} />
                ))}
              </div>
            </fieldset>
            <Alert error={error} />
            <div className="site-stack">
              <Button type="button" size="app" block disabled={saving} arrow={!saving} onClick={handleThemeSubmit}>
                {saving ? 'Saving…' : 'Next: add your links'}
              </Button>
              <Button type="button" variant="line-dark" block disabled={saving} onClick={() => { setError(''); setStep(3); }}>
                Skip, use {getTheme(DEFAULT_THEME).label} for now
              </Button>
            </div>
          </>
        )}

        {/* ── STEP 3: links ── */}
        {step === 3 && (
          <>
            <Intro title="Add your links.">Give visitors somewhere to go. Add what you have, skip the rest.</Intro>
            {live}
            <form className="site-app__form" style={{ gap: 22 }} onSubmit={e => { e.preventDefault(); handleLinksSubmit(false); }}>
              <Field label={<IconLabel icon="instagram">Instagram</IconLabel>} type="text" autoCapitalize="none" placeholder="@yourusername or full URL" value={instagram} onChange={e => setInstagram(e.target.value)} />
              <Field label={<IconLabel icon="tiktok">TikTok</IconLabel>} type="text" autoCapitalize="none" placeholder="@yourusername or full URL" value={tiktok} onChange={e => setTiktok(e.target.value)} />
              <Field label={<IconLabel icon="calendar">Booking link <span className="opt">(Calendly, Cal.com…)</span></IconLabel>} type="text" autoCapitalize="none" placeholder="calendly.com/yourname" value={calendly} onChange={e => setCalendly(e.target.value)} />
              <Field label={<IconLabel icon="globe">Website</IconLabel>} type="text" autoCapitalize="none" placeholder="yoursite.com" value={website} onChange={e => setWebsite(e.target.value)} />
              <Field label={<IconLabel icon="link">Other link</IconLabel>} type="text" autoCapitalize="none" placeholder="https://…" value={otherLink} onChange={e => setOtherLink(e.target.value)} />
              {otherLink && (
                <Field label="Button label for that link" type="text" placeholder="e.g. Watch my explainer video" value={otherLabel} onChange={e => setOtherLabel(e.target.value)} />
              )}

              <Alert error={error} />

              <div className="site-stack" style={{ marginTop: 8 }}>
                <Button type="submit" size="app" block disabled={saving} arrow={!saving}>
                  {saving ? 'Saving…' : 'Save & view my page'}
                </Button>
                <Button type="button" variant="line-dark" block disabled={saving} onClick={() => handleLinksSubmit(true)}>
                  Skip for now, I&apos;ll add links later
                </Button>
              </div>
            </form>
          </>
        )}

      </main>
    </AppShell>
  );
}

const INDUSTRIES = [
  ['solar', 'Solar Energy'],
  ['roofing', 'Roofing'],
  ['pest', 'Pest Control'],
  ['windows', 'Windows & Doors'],
  ['hvac', 'HVAC'],
  ['security', 'Home Security'],
  ['landscaping', 'Lawn Care & Landscaping'],
  ['moving', 'Moving Services'],
  ['exterior_remodel', 'Gutters, Siding & Exterior Remodel'],
  ['real_estate', 'Real Estate'],
  ['mortgage', 'Mortgage / Lending'],
  ['property_management', 'Property Management'],
  ['str_hosts', 'Short-Term Rentals & Property Investing'],
  ['financial_advisor', 'Financial Advising'],
  ['insurance', 'Insurance'],
  ['life_coach', 'Life & Business Coaching'],
  ['fitness_coach', 'Fitness & Health Coaching'],
  ['sales_coach', 'Sales Coaching & Training'],
  ['career_coach', 'Career & Executive Coaching'],
  ['marketing_consultant', 'Marketing Consulting'],
  ['designer', 'Web & Graphic Design'],
  ['photographer', 'Photography & Video'],
  ['writer', 'Copywriting & Content'],
  ['personal_trainer', 'Personal Training'],
  ['medspa', 'Med Spa & Aesthetics'],
  ['other', 'Other'],
];

function IconLabel({ icon, children }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <Icon name={icon} style={{ color: 'var(--site-coral)' }} />{children}
    </span>
  );
}

// Theme option for setup step 2: a mini page in the theme's own colors.
function ThemeCard({ id, theme, checked, onSelect }) {
  const p = theme.preview;
  const dark = theme.mode === 'dark';
  const bar = { height: 7, borderRadius: 4, background: p.surface, boxShadow: dark ? '0 0 0 1px rgba(255,255,255,0.08)' : '0 0 0 1px rgba(0,0,0,0.06)' };
  return (
    <label
      htmlFor={`theme-${id}`}
      className="site-theme-card"
      style={{
        position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, padding: 12, borderRadius: 16,
        background: 'var(--site-dark-2)', cursor: 'pointer',
        boxShadow: checked ? 'inset 0 0 0 2px var(--site-coral)' : 'inset 0 0 0 1px rgba(255,255,255,0.10)',
      }}
    >
      <input id={`theme-${id}`} type="radio" name="theme" checked={checked} onChange={() => onSelect(id)} style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }} />
      <div aria-hidden="true" style={{ height: 112, borderRadius: 10, background: p.bg, padding: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
        <span style={{ width: 26, height: 26, borderRadius: '50%', background: p.accent }} />
        <span style={{ ...bar, width: '60%' }} />
        <span style={{ ...bar, width: '80%' }} />
        <span style={{ marginTop: 'auto', width: '80%', height: 16, borderRadius: 9999, background: p.accent }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
          <span style={{ fontSize: 17, fontWeight: 700 }}>{theme.label}</span>
          <span style={{ fontSize: 13, color: 'var(--site-on-dark-2)' }}>{dark ? 'Dark' : 'Light'} · {theme.description.toLowerCase()}</span>
        </span>
        {checked && (
          <span aria-hidden="true" style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--site-coral)', color: 'var(--site-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="check" size={15} strokeWidth={3} />
          </span>
        )}
      </div>
    </label>
  );
}
