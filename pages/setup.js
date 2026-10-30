import { useState, useEffect } from 'react';
import Logo from '../components/Logo';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import { getTheme, DEFAULT_THEME } from '../lib/themes';
import ThemePicker from '../components/ThemePicker';

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

      setLoading(false);
    });
  }, []);

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
    const generated = generateSlug(val);
    setSlug(generated);
    if (generated) checkSlug(generated);
  }

  function handleSlugChange(e) {
    const val = generateSlug(e.target.value);
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
    if (typeof window !== 'undefined') localStorage.removeItem('pp_referral_ref');

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

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0A1628', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F8F5EE', fontFamily: 'sans-serif' }}>
      Loading...
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0A1628', color: '#F8F5EE', fontFamily: 'DM Sans, sans-serif', padding: '40px 20px 80px' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ marginBottom: 16 }}><Logo height={20} /></div>
          {step === 1 && <>
            <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 36, letterSpacing: 2, marginBottom: 8 }}>Claim Your Page</h1>
            <p style={{ fontSize: 14, color: '#8899AA', lineHeight: 1.6 }}>Set up your ProPage in under 2 minutes.</p>
          </>}
          {step === 2 && <>
            <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 36, letterSpacing: 2, marginBottom: 8 }}>Pick Your Style</h1>
            <p style={{ fontSize: 14, color: '#8899AA', lineHeight: 1.6 }}>
              Your page is live at <span style={{ color: '#F5A623' }}>propages.com/{savedSlug}</span>
              <br />Choose a look. You can change this anytime.
            </p>
          </>}
          {step === 3 && <>
            <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 36, letterSpacing: 2, marginBottom: 8 }}>Add Your Links</h1>
            <p style={{ fontSize: 14, color: '#8899AA', lineHeight: 1.6 }}>
              Your page is live at <span style={{ color: '#F5A623' }}>propages.com/{savedSlug}</span>
              <br />Add your links so visitors have somewhere to go.
            </p>
          </>}
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
          {[1, 2, 3].map(n => (
            <div key={n} style={{
              width: n === step ? 24 : 8,
              height: 8,
              borderRadius: 4,
              background: n === step ? '#F5A623' : n < step ? '#00E5BE' : 'rgba(255,255,255,0.12)',
              transition: 'all 0.3s ease',
            }} />
          ))}
        </div>

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Photo */}
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              <label htmlFor="photo-upload" style={{ cursor: 'pointer' }}>
                <div style={{
                  width: 88, height: 88, borderRadius: '50%', margin: '0 auto 10px',
                  background: photoPreview ? 'transparent' : 'linear-gradient(135deg, #1D3461, #112240)',
                  border: '2px solid #F5A623',
                  overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Bebas Neue, sans-serif', fontSize: 32, color: '#F5A623',
                }}>
                  {photoPreview
                    ? <img src={photoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : (name ? name.charAt(0).toUpperCase() : '?')}
                </div>
                <div style={{ fontSize: 13, color: '#8899AA' }}>Tap to add a photo <span style={{ color: '#F5A623' }}>(optional)</span></div>
              </label>
              <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
            </div>

            {/* Name */}
            <div>
              <label style={labelStyle}>Your Name *</label>
              <input style={inputStyle} type="text" placeholder="Jake Rivera" value={name} onChange={handleNameChange} />
            </div>

            {/* Handle */}
            <div>
              <label style={labelStyle}>Your Handle *</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#8899AA', fontSize: 15 }}>propages.com/</span>
                <input
                  style={{ ...inputStyle, paddingLeft: 130 }}
                  type="text"
                  placeholder="jake-rivera"
                  value={slug}
                  onChange={handleSlugChange}
                />
              </div>
              {slug.length >= 3 && slugAvailable === true  && <div style={{ fontSize: 12, color: '#00E5BE', marginTop: 4 }}>✓ Available</div>}
              {slug.length >= 3 && slugAvailable === false && <div style={{ fontSize: 12, color: '#FF6B6B', marginTop: 4 }}>✗ Already taken — try another</div>}
              {slug.length > 0 && slug.length < 3          && <div style={{ fontSize: 12, color: '#8899AA', marginTop: 4 }}>Handle must be at least 3 characters</div>}
            </div>

            {/* Title */}
            <div>
              <label style={labelStyle}>Your Title <span style={{ color: '#8899AA' }}>(optional)</span></label>
              <input style={inputStyle} type="text" placeholder="Solar Energy Consultant" value={title} onChange={e => setTitle(e.target.value)} />
            </div>

            {/* City */}
            <div>
              <label style={labelStyle}>Your City <span style={{ color: '#8899AA' }}>(optional)</span></label>
              <input style={inputStyle} type="text" placeholder="Phoenix, AZ" value={city} onChange={e => setCity(e.target.value)} />
            </div>

            {/* Industry */}
            <div>
              <label style={labelStyle}>Industry *</label>
              <select style={inputStyle} value={industry} onChange={e => setIndustry(e.target.value)}>
                <option value="">Select your industry...</option>
                <option value="solar">Solar Energy</option>
                <option value="roofing">Roofing</option>
                <option value="pest">Pest Control</option>
                <option value="windows">Windows & Doors</option>
                <option value="hvac">HVAC</option>
                <option value="security">Home Security</option>
                <option value="landscaping">Lawn Care & Landscaping</option>
                <option value="moving">Moving Services</option>
                <option value="exterior_remodel">Gutters, Siding & Exterior Remodel</option>
                <option value="real_estate">Real Estate</option>
                <option value="mortgage">Mortgage / Lending</option>
                <option value="property_management">Property Management</option>
                <option value="str_hosts">Short-Term Rentals & Property Investing</option>
                <option value="financial_advisor">Financial Advising</option>
                <option value="insurance">Insurance</option>
                <option value="life_coach">Life & Business Coaching</option>
                <option value="fitness_coach">Fitness & Health Coaching</option>
                <option value="sales_coach">Sales Coaching & Training</option>
                <option value="career_coach">Career & Executive Coaching</option>
                <option value="marketing_consultant">Marketing Consulting</option>
                <option value="designer">Web & Graphic Design</option>
                <option value="photographer">Photography & Video</option>
                <option value="writer">Copywriting & Content</option>
                <option value="personal_trainer">Personal Training</option>
                <option value="medspa">Med Spa & Aesthetics</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Employment type */}
            <div>
              <label style={labelStyle}>Are you... *</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {['independent', 'employee'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setEmploymentType(type)}
                    style={{
                      flex: 1, padding: '12px 10px', borderRadius: 12, cursor: 'pointer',
                      fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600,
                      border: employmentType === type ? '1px solid #F5A623' : '1px solid rgba(255,255,255,0.08)',
                      background: employmentType === type ? 'rgba(245,166,35,0.08)' : 'rgba(255,255,255,0.04)',
                      color: employmentType === type ? '#F5A623' : '#8899AA',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {type === 'independent' ? '🧑‍💼 Independent' : '🏢 Employee'}
                  </button>
                ))}
              </div>
              {employmentType === 'employee' && (
                <p style={{ fontSize: 12, color: '#8899AA', marginTop: 8, lineHeight: 1.5 }}>
                  ⚠️ Heads up: make sure your employer is cool with you having your own page. ProPages is not responsible for any workplace conflicts.
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label style={labelStyle}>Your Phone Number <span style={{ color: '#8899AA' }}>(optional — for lead alerts)</span></label>
              <input
                style={inputStyle}
                type="tel"
                placeholder="+1 (602) 555-0100"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
              <div style={{ fontSize: 12, color: '#8899AA', marginTop: 4 }}>
                We&apos;ll text you the moment a lead comes in. US numbers only.
              </div>
            </div>

            {error && <p style={{ fontSize: 13, color: '#FF6B6B', textAlign: 'center' }}>{error}</p>}

            <button
              type="submit"
              disabled={saving}
              style={{
                width: '100%', padding: '16px', marginTop: 8,
                background: saving ? '#8899AA' : 'linear-gradient(135deg, #F5A623, #FFD166)',
                color: '#0A1628', fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 700,
                border: 'none', borderRadius: 14, cursor: saving ? 'not-allowed' : 'pointer',
                boxShadow: '0 8px 32px rgba(245,166,35,0.3)',
              }}
            >
              {saving ? 'Setting up your page...' : 'Next: Pick a Theme →'}
            </button>

          </form>
        )}

        {/* ── STEP 2: THEME ── */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div style={{
              background: 'rgba(0,229,190,0.06)',
              border: '1px solid rgba(0,229,190,0.2)',
              borderRadius: 12,
              padding: '12px 16px',
              fontSize: 13,
              color: '#00E5BE',
              marginBottom: 4,
            }}>
              ✓ Your page is live! Pick a theme, or skip and use the default.
            </div>

            <ThemePicker selectedTheme={accent} onSelect={setAccent} />

            {error && <p style={{ fontSize: 13, color: '#FF6B6B', textAlign: 'center' }}>{error}</p>}

            <button
              onClick={handleThemeSubmit}
              disabled={saving}
              style={{
                width: '100%', padding: '16px', marginTop: 8,
                background: saving ? '#8899AA' : 'linear-gradient(135deg, #F5A623, #FFD166)',
                color: '#0A1628', fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 700,
                border: 'none', borderRadius: 14, cursor: saving ? 'not-allowed' : 'pointer',
                boxShadow: '0 8px 32px rgba(245,166,35,0.3)',
              }}
            >
              {saving ? 'Saving...' : 'Next: Add Your Links →'}
            </button>

          </div>
        )}

        {/* ── STEP 3: LINKS ── */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div style={{
              background: 'rgba(0,229,190,0.06)',
              border: '1px solid rgba(0,229,190,0.2)',
              borderRadius: 12,
              padding: '12px 16px',
              fontSize: 13,
              color: '#00E5BE',
              marginBottom: 4,
            }}>
              ✓ Your page is live! Add your links below, or skip and do it later.
            </div>

            {/* Instagram */}
            <div>
              <label style={labelStyle}>📸 Instagram <span style={{ color: '#8899AA' }}>(optional)</span></label>
              <input style={inputStyle} type="text" placeholder="@yourusername or full URL" value={instagram} onChange={e => setInstagram(e.target.value)} />
            </div>

            {/* TikTok */}
            <div>
              <label style={labelStyle}>🎵 TikTok <span style={{ color: '#8899AA' }}>(optional)</span></label>
              <input style={inputStyle} type="text" placeholder="@yourusername or full URL" value={tiktok} onChange={e => setTiktok(e.target.value)} />
            </div>

            {/* Calendly */}
            <div>
              <label style={labelStyle}>📅 Booking Link <span style={{ color: '#8899AA' }}>(Calendly, Cal.com, etc.)</span></label>
              <input style={inputStyle} type="text" placeholder="calendly.com/yourname" value={calendly} onChange={e => setCalendly(e.target.value)} />
            </div>

            {/* Website */}
            <div>
              <label style={labelStyle}>🌐 Website <span style={{ color: '#8899AA' }}>(optional)</span></label>
              <input style={inputStyle} type="text" placeholder="yoursite.com" value={website} onChange={e => setWebsite(e.target.value)} />
            </div>

            {/* Other */}
            <div>
              <label style={labelStyle}>🔗 Other Link <span style={{ color: '#8899AA' }}>(optional)</span></label>
              <input
                style={{ ...inputStyle, marginBottom: 8 }}
                type="text"
                placeholder="https://..."
                value={otherLink}
                onChange={e => setOtherLink(e.target.value)}
              />
              {otherLink && (
                <input
                  style={inputStyle}
                  type="text"
                  placeholder='Label (e.g. "Watch My Explainer Video")'
                  value={otherLabel}
                  onChange={e => setOtherLabel(e.target.value)}
                />
              )}
            </div>

            {error && <p style={{ fontSize: 13, color: '#FF6B6B', textAlign: 'center' }}>{error}</p>}

            <button
              onClick={() => handleLinksSubmit(false)}
              disabled={saving}
              style={{
                width: '100%', padding: '16px', marginTop: 8,
                background: saving ? '#8899AA' : 'linear-gradient(135deg, #F5A623, #FFD166)',
                color: '#0A1628', fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 700,
                border: 'none', borderRadius: 14, cursor: saving ? 'not-allowed' : 'pointer',
                boxShadow: '0 8px 32px rgba(245,166,35,0.3)',
              }}
            >
              {saving ? 'Saving...' : 'Save & View My Page →'}
            </button>

            <button
              onClick={() => handleLinksSubmit(true)}
              disabled={saving}
              style={{
                width: '100%', padding: '14px',
                background: 'transparent',
                color: '#8899AA', fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 500,
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14,
                cursor: saving ? 'not-allowed' : 'pointer',
              }}
            >
              Skip for now — I&apos;ll add links later
            </button>

          </div>
        )}

      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block', fontSize: 13, fontWeight: 600,
  color: '#F8F5EE', marginBottom: 6,
};

const inputStyle = {
  width: '100%', padding: '13px 16px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 12, color: '#F8F5EE',
  fontFamily: 'DM Sans, sans-serif', fontSize: 15,
  outline: 'none', appearance: 'none',
};