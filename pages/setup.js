import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

export default function Setup() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugAvailable, setSlugAvailable] = useState(null);
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('');
  const [industry, setIndustry] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Check auth on load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/signup');
      } else {
        setUser(session.user);
        setLoading(false);
      }
    });
  }, []);

  // Auto-generate slug from name
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

  async function handleSubmit(e) {
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

    let photo_url = null;

    // Upload photo if provided
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

    // Save rep row
    const { error: insertError } = await supabase.from('reps').insert({
      slug,
      name,
      title,
      city,
      industry,
      employment_type: employmentType,
      photo_url,
    });

    if (insertError) {
      setError('Something went wrong saving your profile. Please try again.');
      setSaving(false);
      return;
    }

    router.push(`/${slug}`);
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
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 13, letterSpacing: 3, color: '#8899AA', marginBottom: 16 }}>PROPAGES</div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 36, letterSpacing: 2, marginBottom: 8 }}>Claim Your Page</h1>
          <p style={{ fontSize: 14, color: '#8899AA', lineHeight: 1.6 }}>Set up your ProPage in under 2 minutes.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Photo upload */}
          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <label htmlFor="photo-upload" style={{ cursor: 'pointer' }}>
              <div style={{
                width: 88, height: 88, borderRadius: '50%', margin: '0 auto 10px',
                background: photoPreview ? 'transparent' : 'linear-gradient(135deg, #1D3461, #112240)',
                border: '2px solid #F5A623',
                overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Bebas Neue, sans-serif', fontSize: 32, color: '#F5A623'
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

          {/* Handle / slug */}
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
            {slug.length > 0 && slug.length < 3                && <div style={{ fontSize: 12, color: '#8899AA', marginTop: 4 }}>Handle must be at least 3 characters</div>}
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

          {/* Template selector - coming soon */}
          <div>
            <label style={labelStyle}>Page Template</label>
            <div style={{
              padding: '14px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <span style={{ fontSize: 14, color: '#8899AA' }}>🎨 Template selector</span>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#F5A623', background: 'rgba(245,166,35,0.1)', padding: '3px 8px', borderRadius: 20 }}>COMING SOON</span>
            </div>
          </div>

          {/* Error */}
          {error && <p style={{ fontSize: 13, color: '#FF6B6B', textAlign: 'center' }}>{error}</p>}

          {/* Submit */}
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
            {saving ? 'Setting up your page...' : 'Claim My Page →'}
          </button>

        </form>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block', fontSize: 13, fontWeight: 600,
  color: '#F8F5EE', marginBottom: 6
};

const inputStyle = {
  width: '100%', padding: '13px 16px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 12, color: '#F8F5EE',
  fontFamily: 'DM Sans, sans-serif', fontSize: 15,
  outline: 'none', appearance: 'none',
};