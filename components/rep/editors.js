// Inline block editors (owner, edit mode). App chrome (.ow-*), not theme colors.
//
// Editors start from what the rep entered. Industry samples appear only as
// placeholder text, so saving can never turn a sample stat or review into
// something the page claims. Blank rows are dropped on save.

import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import RepIcon, { LINK_ICON_CHOICES, linkIconName } from './RepIcon';
import { formConfig } from './blocks';
import { cleanLinks, cleanStats, cleanTestimonials, normalizeUrl } from '../../lib/repBlocks';
import { CONTACT_METHODS, digits, messageSources } from '../../lib/contact';

function Shell({ title, note, error, saving, onSave, onCancel, children }) {
  return (
    <form className="ow ow-editor" onSubmit={e => { e.preventDefault(); onSave(); }} onClick={e => e.stopPropagation()}>
      <h3 className="ow-editor-title">{title}</h3>
      {note && <p className="ow-editor-note">{note}</p>}
      {children}
      {error && <p className="ow-error" role="alert">{error}</p>}
      <div className="ow-actions">
        <button type="button" className="ow-btn ow-btn--line" onClick={onCancel}>Cancel</button>
        <button type="submit" className="ow-btn ow-btn--primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
      </div>
    </form>
  );
}

function Field({ label, hint, optional, children }) {
  return (
    <label className="ow-field">
      <span className="ow-label">{label}{optional && <small>Optional</small>}</span>
      {children}
      {hint && <span className="ow-hint">{hint}</span>}
    </label>
  );
}

const trim = (s) => String(s ?? '').trim();

// ── Hero ─────────────────────────────────────────────────────────────────────

export function HeroEditor({ block, rep, defaults, onSave, onCancel, onRepPatch }) {
  const d = block.data || {};
  const [name, setName] = useState(rep.name || '');
  const [title, setTitle] = useState(rep.title || '');
  const [city, setCity] = useState(rep.city || '');
  const [photo, setPhoto] = useState(null);
  const [headline, setHeadline] = useState(d.headline || '');
  const [highlight, setHighlight] = useState(d.highlight || '');
  const [pitch, setPitch] = useState(d.pitch || '');
  const [cta, setCta] = useState(d.cta || '');
  const [ctaSub, setCtaSub] = useState(d.ctaSub || '');
  const [stats, setStats] = useState(() => {
    const own = cleanStats(d.stats);
    return [0, 1, 2].map(i => own[i] || { number: '', label: '' });
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const setStat = (i, k, v) => setStats(prev => prev.map((s, idx) => (idx === i ? { ...s, [k]: v } : s)));

  async function handleSave() {
    setError('');
    if (!trim(name)) { setError('Add your name.'); return; }
    const hl = trim(highlight);
    if (hl && trim(headline) && !trim(headline).includes(hl)) {
      setError('The highlighted words need to appear exactly as they do in your headline.');
      return;
    }
    const half = stats.find(s => !!trim(s.number) !== !!trim(s.label));
    if (half) { setError('Each proof number needs both a number and a label.'); return; }

    setSaving(true);
    const patch = { name: trim(name), title: trim(title), city: trim(city) };
    if (photo) {
      const ext = (photo.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
      const path = `${rep.slug}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from('avatars').upload(path, photo);
      if (upErr) { setSaving(false); setError('Photo upload failed. Try a smaller image, or save without it.'); return; }
      patch.photo_url = supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl;
    }
    const { error: repErr } = await supabase.from('reps').update(patch).eq('id', rep.id);
    if (repErr) { setSaving(false); setError('Something went wrong. Please try again.'); return; }
    onRepPatch?.(patch);

    const next = { ...d };
    delete next.name; delete next.title; delete next.city; delete next.industry;
    if (patch.photo_url) next.photo_url = patch.photo_url;
    const set = (k, v) => { if (trim(v)) next[k] = trim(v); else delete next[k]; };
    set('headline', headline); set('pitch', pitch); set('cta', cta); set('ctaSub', ctaSub);
    if (trim(headline) && hl) next.highlight = hl; else delete next.highlight;
    next.stats = cleanStats(stats).map(s => ({ number: trim(s.number), label: trim(s.label) }));
    onSave(next);
  }

  return (
    <Shell title="Hero" note="The first thing visitors see. Leave a field blank to use the suggested wording shown in it."
      error={error} saving={saving} onSave={handleSave} onCancel={onCancel}>
      <div className="ow-group">
        <span className="ow-group-title">You</span>
        <Field label="Name"><input className="ow-input" value={name} onChange={e => setName(e.target.value)} autoComplete="name" /></Field>
        <Field label="Title"><input className="ow-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Roofing Specialist" /></Field>
        <Field label="City"><input className="ow-input" value={city} onChange={e => setCity(e.target.value)} placeholder="Worcester, MA" /></Field>
        <Field label="Photo" optional hint={photo ? photo.name : (rep.photo_url ? 'Pick a file to replace your current photo.' : 'Without one, your initials show instead.')}>
          <input className="ow-input" type="file" accept="image/*" onChange={e => setPhoto(e.target.files?.[0] || null)} style={{ paddingTop: 12 }} />
        </Field>
      </div>
      <div className="ow-group">
        <span className="ow-group-title">Pitch</span>
        <Field label="Headline"><textarea className="ow-input" rows={2} value={headline} onChange={e => setHeadline(e.target.value)} placeholder={defaults.headline} style={{ minHeight: 72 }} /></Field>
        <Field label="Highlighted words" optional hint="A few words copied exactly from your headline. They get the marker swipe.">
          <input className="ow-input" value={highlight} onChange={e => setHighlight(e.target.value)} placeholder={trim(headline) ? '' : defaults.highlight} />
        </Field>
        <Field label="A sentence or two about what you do"><textarea className="ow-input" value={pitch} onChange={e => setPitch(e.target.value)} placeholder={defaults.pitch} /></Field>
        <Field label="Button"><input className="ow-input" value={cta} onChange={e => setCta(e.target.value)} placeholder={defaults.cta.replace(/\s*→\s*$/, '')} /></Field>
        <Field label="Line under the button"><input className="ow-input" value={ctaSub} onChange={e => setCtaSub(e.target.value)} placeholder={defaults.ctaSub} /></Field>
      </div>
      <div className="ow-group">
        <span className="ow-group-title">Proof numbers</span>
        <span className="ow-hint">Only numbers you can back up. Leave them blank and the strip stays hidden.</span>
        {stats.map((s, i) => (
          <div className="ow-row" key={i}>
            <input className="ow-input" aria-label={`Number ${i + 1}`} value={s.number} onChange={e => setStat(i, 'number', e.target.value)} placeholder={defaults.stats[i]?.number} />
            <input className="ow-input" aria-label={`Label ${i + 1}`} value={s.label} onChange={e => setStat(i, 'label', e.target.value)} placeholder={defaults.stats[i]?.label} />
          </div>
        ))}
      </div>
    </Shell>
  );
}

// ── Links ────────────────────────────────────────────────────────────────────

function IconPicker({ value, onChange }) {
  return (
    <div className="ow-icons" role="radiogroup" aria-label="Icon">
      {LINK_ICON_CHOICES.map(name => (
        <button key={name} type="button" role="radio" aria-checked={value === name} aria-label={name}
          className={`ow-iconpick${value === name ? ' is-on' : ''}`} onClick={() => onChange(name)}>
          <RepIcon name={name} size={20} />
        </button>
      ))}
    </div>
  );
}

export function LinksEditor({ block, defaults, onSave, onCancel }) {
  const d = block.data || {};
  const [heading, setHeading] = useState(d.heading || '');
  const [links, setLinks] = useState(() => {
    const own = (d.links || []).filter(l => trim(l.title) || (trim(l.url) && trim(l.url) !== '#'))
      .map(l => ({ ...l, url: trim(l.url) === '#' ? '' : l.url, icon: linkIconName(l) }));
    return own.length ? own : [{ icon: 'calendar', title: '', sub: '', url: '' }];
  });
  const [openIcon, setOpenIcon] = useState(null);
  const [error, setError] = useState('');

  const update = (i, k, v) => setLinks(prev => prev.map((l, idx) => (idx === i ? { ...l, [k]: v } : l)));
  const move = (i, dir) => setLinks(prev => {
    const j = i + dir;
    if (j < 0 || j >= prev.length) return prev;
    const next = [...prev];
    [next[i], next[j]] = [next[j], next[i]];
    return next;
  });

  function handleSave() {
    setError('');
    const filled = links.filter(l => trim(l.title) || trim(l.url));
    const prepared = filled.map(l => ({ icon: l.icon, title: trim(l.title), sub: trim(l.sub), url: normalizeUrl(l.url) }));
    if (prepared.some(l => !l.title)) { setError('Each link needs a title.'); return; }
    if (prepared.some(l => !l.url)) { setError('Each link needs a web address, phone number or email.'); return; }
    const next = { ...d, links: cleanLinks(prepared) };
    if (trim(heading)) next.heading = trim(heading); else delete next.heading;
    onSave(next);
  }

  const sample = defaults.links || [];
  return (
    <Shell title="Links" note="Instagram, Facebook, TikTok and other profile links show as buttons at the top. Everything else shows as a row."
      error={error} onSave={handleSave} onCancel={onCancel}>
      <Field label="Section heading" optional><input className="ow-input" value={heading} onChange={e => setHeading(e.target.value)} placeholder="More from me" /></Field>
      {links.map((l, i) => (
        <div className="ow-group" key={i}>
          <div className="ow-group-head">
            <span className="ow-group-title">Link {i + 1}</span>
            <span>
              <button type="button" className="ow-iconbtn" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up"><RepIcon name="up" size={18} /></button>
              <button type="button" className="ow-iconbtn" onClick={() => move(i, 1)} disabled={i === links.length - 1} aria-label="Move down"><RepIcon name="down" size={18} /></button>
              <button type="button" className="ow-iconbtn is-danger" onClick={() => setLinks(prev => prev.filter((_, idx) => idx !== i))} aria-label="Remove link"><RepIcon name="trash" size={18} /></button>
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className={`ow-iconpick${openIcon === i ? ' is-on' : ''}`} style={{ width: 48, height: 48, flexShrink: 0 }}
              onClick={() => setOpenIcon(openIcon === i ? null : i)} aria-label="Choose icon" aria-expanded={openIcon === i}>
              <RepIcon name={linkIconName({ ...l, url: normalizeUrl(l.url) })} size={22} />
            </button>
            <input className="ow-input" aria-label="Title" value={l.title} onChange={e => update(i, 'title', e.target.value)} placeholder={sample[i]?.title || 'Title'} />
          </div>
          {openIcon === i && <IconPicker value={l.icon} onChange={v => { update(i, 'icon', v); setOpenIcon(null); }} />}
          <input className="ow-input" aria-label="Subtitle" value={l.sub || ''} onChange={e => update(i, 'sub', e.target.value)} placeholder={sample[i]?.sub || 'Subtitle (optional)'} />
          <input className="ow-input" aria-label="Link" value={l.url || ''} onChange={e => update(i, 'url', e.target.value)} placeholder="Web address, phone number or email" inputMode="url" autoCapitalize="none" />
        </div>
      ))}
      <button type="button" className="ow-addrow" onClick={() => setLinks(prev => [...prev, { icon: 'link', title: '', sub: '', url: '' }])}>
        <RepIcon name="plus" size={18} />Add a link
      </button>
    </Shell>
  );
}

// ── Lead form ────────────────────────────────────────────────────────────────

export function LeadCaptureEditor({ block, rep, defaults, onSave, onCancel, profileLinks }) {
  const d = block.data || {};
  const lc = d.lead_capture || rep.lead_capture || {};
  const cfg = formConfig(block, rep, defaults);
  const [label, setLabel] = useState(cfg.label);
  const [headline, setHeadline] = useState(cfg.headline);
  const [sub, setSub] = useState(cfg.sub);
  const [question, setQuestion] = useState(cfg.question || '');
  const [options, setOptions] = useState(() => {
    const o = [...cfg.options];
    while (o.length < 2) o.push('');
    return o;
  });
  const [button, setButton] = useState(cfg.button);
  const [collectEmail, setCollectEmail] = useState(cfg.collectEmail);
  const [collectZip, setCollectZip] = useState(cfg.collectZip);
  const [methods, setMethods] = useState(cfg.methods);
  const [msgIg, setMsgIg] = useState(!!cfg.message.instagram);
  const [msgFb, setMsgFb] = useState(!!cfg.message.facebook);
  const [msgWa, setMsgWa] = useState(cfg.message.whatsapp || '');
  const [msgText, setMsgText] = useState(cfg.message.text || '');
  const [error, setError] = useState('');
  const sources = messageSources(profileLinks);
  const toggleMethod = (key, on) => setMethods(prev => (on ? [...new Set([...prev, key])] : prev.filter(k => k !== key)));

  function handleSave() {
    setError('');
    if (!trim(headline) || !trim(button)) { setError('The form needs a headline and button text.'); return; }
    const opts = options.map(trim).filter(Boolean);
    if (trim(question) && opts.length < 2) { setError('Give the question at least two answers, or clear the question.'); return; }
    for (const [label, num] of [['WhatsApp', msgWa], ['texting', msgText]]) {
      if (trim(num) && digits(num).length < 10) { setError(`The ${label} number needs at least 10 digits.`); return; }
    }
    onSave({
      ...d,
      lead_capture: {
        ...lc,
        form: {
          ...(lc.form || {}),
          label: trim(label), headline: trim(headline), sub: trim(sub),
          qualifying_question: trim(question),
          qualifying_options: trim(question) ? opts : [],
          button_text: trim(button),
          collect_email: collectEmail, collect_zip: collectZip,
          contact_methods: ['phone', ...Object.keys(CONTACT_METHODS).filter(k => k !== 'phone' && methods.includes(k))],
          message_buttons: { instagram: msgIg, facebook: msgFb, whatsapp: trim(msgWa), text: trim(msgText) },
        },
      },
    });
  }

  return (
    <Shell title="Lead form" note="New leads land on your dashboard and in your email."
      error={error} onSave={handleSave} onCancel={onCancel}>
      <Field label="Small label above the headline"><input className="ow-input" value={label} onChange={e => setLabel(e.target.value)} /></Field>
      <Field label="Headline"><input className="ow-input" value={headline} onChange={e => setHeadline(e.target.value)} /></Field>
      <Field label="Subtext" optional><textarea className="ow-input" rows={2} value={sub} onChange={e => setSub(e.target.value)} style={{ minHeight: 72 }} /></Field>
      <div className="ow-group">
        <span className="ow-group-title">Qualifying question</span>
        <Field label="Question" optional hint="Leave blank to skip it."><input className="ow-input" value={question} onChange={e => setQuestion(e.target.value)} /></Field>
        {trim(question) && options.map((opt, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input className="ow-input" aria-label={`Answer ${i + 1}`} value={opt} onChange={e => setOptions(prev => prev.map((o, idx) => (idx === i ? e.target.value : o)))} placeholder={`Answer ${i + 1}`} />
            <button type="button" className="ow-iconbtn is-danger" onClick={() => setOptions(prev => prev.filter((_, idx) => idx !== i))} aria-label={`Remove answer ${i + 1}`}><RepIcon name="trash" size={18} /></button>
          </div>
        ))}
        {trim(question) && options.length < 6 && (
          <button type="button" className="ow-textbtn" onClick={() => setOptions(prev => [...prev, ''])}><RepIcon name="plus" size={16} />Add an answer</button>
        )}
      </div>
      <Field label="Button"><input className="ow-input" value={button} onChange={e => setButton(e.target.value)} /></Field>
      <div className="ow-group">
        <span className="ow-group-title">How visitors can reach you</span>
        <span className="ow-hint">They pick one and leave the matching detail. You reach out from your own phone or app.</span>
        {Object.entries(CONTACT_METHODS).map(([key, m]) => (
          <label className="ow-check" key={key}>
            <input type="checkbox" checked={key === 'phone' || methods.includes(key)} disabled={key === 'phone'} onChange={e => toggleMethod(key, e.target.checked)} />
            {m.label}{key === 'phone' && <span className="ow-hint" style={{ marginLeft: 4 }}>always on</span>}
          </label>
        ))}
      </div>
      <div className="ow-group">
        <span className="ow-group-title">Message buttons</span>
        <span className="ow-hint">Buttons under the form that open a chat with you in the visitor&apos;s own app. Each tap is counted on your dashboard. Instagram and Facebook messages from people you don&apos;t follow land in your <b>message requests</b>, so check there.</span>
        <label className="ow-check">
          <input type="checkbox" checked={msgIg} onChange={e => setMsgIg(e.target.checked)} />
          Instagram {sources.instagram ? <span className="ow-hint">@{sources.instagram}</span> : <span className="ow-hint">add your Instagram to Links first</span>}
        </label>
        <label className="ow-check">
          <input type="checkbox" checked={msgFb} onChange={e => setMsgFb(e.target.checked)} />
          Messenger {sources.facebook ? <span className="ow-hint">facebook.com/{sources.facebook}</span> : <span className="ow-hint">add your Facebook to Links first</span>}
        </label>
        <Field label="WhatsApp number" optional hint="Shows a WhatsApp button. Visitors will see this number.">
          <input className="ow-input" type="tel" inputMode="tel" value={msgWa} onChange={e => setMsgWa(e.target.value)} placeholder="(555) 555-0100" />
        </Field>
        <Field label="Number for texts" optional hint="Shows a Send a text button. Visitors will see this number.">
          <input className="ow-input" type="tel" inputMode="tel" value={msgText} onChange={e => setMsgText(e.target.value)} placeholder="(555) 555-0100" />
        </Field>
      </div>
      <div className="ow-group">
        <span className="ow-group-title">Also ask for</span>
        <label className="ow-check"><input type="checkbox" checked={collectEmail} onChange={e => setCollectEmail(e.target.checked)} />Email address</label>
        <label className="ow-check"><input type="checkbox" checked={collectZip} onChange={e => setCollectZip(e.target.checked)} />Zip code</label>
      </div>
    </Shell>
  );
}

// ── Reviews ──────────────────────────────────────────────────────────────────

export function TestimonialsEditor({ block, defaults, onSave, onCancel }) {
  const d = block.data || {};
  const [heading, setHeading] = useState(d.heading || '');
  const [items, setItems] = useState(() => {
    const own = cleanTestimonials(d.testimonials);
    return own.length ? own : [{ text: '', name: '', detail: '' }];
  });
  const [error, setError] = useState('');
  const update = (i, k, v) => setItems(prev => prev.map((t, idx) => (idx === i ? { ...t, [k]: v } : t)));

  function handleSave() {
    setError('');
    const filled = items.filter(t => trim(t.text) || trim(t.name));
    if (filled.some(t => !trim(t.text) || !trim(t.name))) { setError('Each review needs the quote and the customer’s name.'); return; }
    const next = { ...d, testimonials: filled.map(t => ({ text: trim(t.text), name: trim(t.name), detail: trim(t.detail) })) };
    if (trim(heading)) next.heading = trim(heading); else delete next.heading;
    onSave(next);
  }

  const sample = defaults.testimonials || [];
  return (
    <Shell title="Reviews" note="Only real reviews from real customers, in their own words, with their OK to share. The section stays hidden until you add one."
      error={error} onSave={handleSave} onCancel={onCancel}>
      <Field label="Section heading" optional><input className="ow-input" value={heading} onChange={e => setHeading(e.target.value)} placeholder="What clients say" /></Field>
      {items.map((t, i) => (
        <div className="ow-group" key={i}>
          <div className="ow-group-head">
            <span className="ow-group-title">Review {i + 1}</span>
            <button type="button" className="ow-iconbtn is-danger" onClick={() => setItems(prev => prev.filter((_, idx) => idx !== i))} aria-label="Remove review"><RepIcon name="trash" size={18} /></button>
          </div>
          <textarea className="ow-input" aria-label="Quote" value={t.text} onChange={e => update(i, 'text', e.target.value)} placeholder={sample[i]?.text || 'What did they say?'} />
          <div className="ow-row">
            <input className="ow-input" aria-label="Name" value={t.name} onChange={e => update(i, 'name', e.target.value)} placeholder="First name, last initial" />
            <input className="ow-input" aria-label="Detail" value={t.detail || ''} onChange={e => update(i, 'detail', e.target.value)} placeholder="Homeowner · Your town" />
          </div>
        </div>
      ))}
      <button type="button" className="ow-addrow" onClick={() => setItems(prev => [...prev, { text: '', name: '', detail: '' }])}>
        <RepIcon name="plus" size={18} />Add a review
      </button>
    </Shell>
  );
}

// ── Other blocks ─────────────────────────────────────────────────────────────

export function TextEditor({ block, onSave, onCancel }) {
  const d = block.data || {};
  const [heading, setHeading] = useState(d.heading || '');
  const [body, setBody] = useState(d.body || '');
  return (
    <Shell title="Text" onSave={() => onSave({ ...d, heading: trim(heading), body: trim(body) })} onCancel={onCancel}>
      <Field label="Heading" optional><input className="ow-input" value={heading} onChange={e => setHeading(e.target.value)} placeholder="About me" /></Field>
      <Field label="Text"><textarea className="ow-input" value={body} onChange={e => setBody(e.target.value)} style={{ minHeight: 140 }} placeholder="Anything you'd like visitors to know" /></Field>
    </Shell>
  );
}

export function VideoEditor({ block, onSave, onCancel }) {
  const d = block.data || {};
  const [url, setUrl] = useState(d.url || '');
  const [caption, setCaption] = useState(d.caption || '');
  return (
    <Shell title="Video" note="YouTube links play right on your page. Other links (TikTok, Instagram) show as a button."
      onSave={() => onSave({ ...d, url: normalizeUrl(url), caption: trim(caption) })} onCancel={onCancel}>
      <Field label="Video link"><input className="ow-input" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://youtube.com/watch?v=…" inputMode="url" autoCapitalize="none" /></Field>
      <Field label="Caption" optional><input className="ow-input" value={caption} onChange={e => setCaption(e.target.value)} /></Field>
    </Shell>
  );
}

export function PortfolioEditor({ block, onSave, onCancel }) {
  const d = block.data || {};
  const [heading, setHeading] = useState(d.heading || '');
  const [layout, setLayout] = useState(d.layout || 'grid');
  const [images, setImages] = useState(d.images?.length ? d.images : [{ url: '', caption: '' }]);
  const update = (i, k, v) => setImages(prev => prev.map((img, idx) => (idx === i ? { ...img, [k]: v } : img)));
  return (
    <Shell title="Portfolio" note="Paste links to photos of your work."
      onSave={() => onSave({ ...d, heading: trim(heading), layout, images: images.filter(img => trim(img.url)).map(img => ({ url: normalizeUrl(img.url), caption: trim(img.caption) })) })}
      onCancel={onCancel}>
      <Field label="Heading" optional><input className="ow-input" value={heading} onChange={e => setHeading(e.target.value)} placeholder="Recent work" /></Field>
      <div className="ow-group">
        <span className="ow-group-title">Layout</span>
        <label className="ow-check"><input type="radio" name={`layout-${block.id}`} checked={layout === 'grid'} onChange={() => setLayout('grid')} />Grid</label>
        <label className="ow-check"><input type="radio" name={`layout-${block.id}`} checked={layout === 'carousel'} onChange={() => setLayout('carousel')} />Swipeable row</label>
      </div>
      {images.map((img, i) => (
        <div className="ow-group" key={i}>
          <div className="ow-group-head">
            <span className="ow-group-title">Photo {i + 1}</span>
            <button type="button" className="ow-iconbtn is-danger" onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))} aria-label="Remove photo"><RepIcon name="trash" size={18} /></button>
          </div>
          <input className="ow-input" aria-label="Photo link" value={img.url} onChange={e => update(i, 'url', e.target.value)} placeholder="https://…" inputMode="url" autoCapitalize="none" />
          <input className="ow-input" aria-label="Caption" value={img.caption || ''} onChange={e => update(i, 'caption', e.target.value)} placeholder="Caption (optional)" />
        </div>
      ))}
      <button type="button" className="ow-addrow" onClick={() => setImages(prev => [...prev, { url: '', caption: '' }])}><RepIcon name="plus" size={18} />Add a photo</button>
    </Shell>
  );
}

export function SocialFeedEditor({ block, onSave, onCancel }) {
  const d = block.data || {};
  const [heading, setHeading] = useState(d.heading || '');
  const [posts, setPosts] = useState(d.posts?.length ? d.posts : [{ url: '', caption: '', date: '' }]);
  const update = (i, k, v) => setPosts(prev => prev.map((p, idx) => (idx === i ? { ...p, [k]: v } : p)));
  return (
    <Shell title="Social posts" note="Links to individual posts. Each shows as a row with the platform's logo."
      onSave={() => onSave({ ...d, heading: trim(heading), posts: posts.filter(p => trim(p.url)).map(p => ({ url: normalizeUrl(p.url), caption: trim(p.caption), date: trim(p.date) })) })}
      onCancel={onCancel}>
      <Field label="Heading" optional><input className="ow-input" value={heading} onChange={e => setHeading(e.target.value)} placeholder="Latest posts" /></Field>
      {posts.map((p, i) => (
        <div className="ow-group" key={i}>
          <div className="ow-group-head">
            <span className="ow-group-title">Post {i + 1}</span>
            <button type="button" className="ow-iconbtn is-danger" onClick={() => setPosts(prev => prev.filter((_, idx) => idx !== i))} aria-label="Remove post"><RepIcon name="trash" size={18} /></button>
          </div>
          <input className="ow-input" aria-label="Post link" value={p.url} onChange={e => update(i, 'url', e.target.value)} placeholder="https://instagram.com/p/…" inputMode="url" autoCapitalize="none" />
          <input className="ow-input" aria-label="Caption" value={p.caption || ''} onChange={e => update(i, 'caption', e.target.value)} placeholder="Caption (optional)" />
          <input className="ow-input" aria-label="Date" value={p.date || ''} onChange={e => update(i, 'date', e.target.value)} placeholder="Date (optional)" />
        </div>
      ))}
      <button type="button" className="ow-addrow" onClick={() => setPosts(prev => [...prev, { url: '', caption: '', date: '' }])}><RepIcon name="plus" size={18} />Add a post</button>
    </Shell>
  );
}

export function renderEditor(block, ctx) {
  const props = { block, ...ctx };
  switch (block.type) {
    case 'hero':         return <HeroEditor {...props} />;
    case 'links':        return <LinksEditor {...props} />;
    case 'lead_capture': return <LeadCaptureEditor {...props} />;
    case 'testimonials': return <TestimonialsEditor {...props} />;
    case 'text':         return <TextEditor {...props} />;
    case 'video':        return <VideoEditor {...props} />;
    case 'portfolio':    return <PortfolioEditor {...props} />;
    case 'social_feed':  return <SocialFeedEditor {...props} />;
    default:             return null;
  }
}
