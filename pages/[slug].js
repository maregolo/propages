// Public rep page: propages.pro/<slug>
//
// Layout follows the "Full rep page" boards: Billboard hero → links → lead
// form → reviews → footer, in the rep's theme pack. The owner gets edit mode
// (click a block to edit it), a share panel with a real QR code, and a theme
// switcher, all in app chrome.
//
// Pieces:
//   lib/repDefaults.js         industry copy + samples
//   lib/repBlocks.js           default stack, old-page conversion, visibility rules
//   components/rep/blocks.js   public blocks
//   components/rep/editors.js  inline editors
//   components/rep/owner.js    owner tools
//   components/rep/styles.js   CSS for all of the above

import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { getTheme, themeToCSS, DEFAULT_THEME, THEMES } from '../lib/themes';
import { SITE_URL } from '../lib/site';
import { getDefaults } from '../lib/repDefaults';
import { normalizeBlocks, cleanLinks } from '../lib/repBlocks';
import { PUBLIC_REP_COLUMNS as PUBLIC_FIELDS } from '../lib/repColumns';
import { renderBlock, RepFooter } from '../components/rep/blocks';
import { renderEditor } from '../components/rep/editors';
import { OwnerBar, BlockBar, AddBlock, LiveToast, WelcomeBanner, BLOCK_LABELS } from '../components/rep/owner';
import { REP_STYLES } from '../components/rep/styles';

function PageHead({ rep, defaults, blocks }) {
  const hero = blocks.find(b => b.type === 'hero')?.data || {};
  const description = hero.pitch || defaults.pitch;
  const title = `${rep.name || 'ProPages'}${rep.title ? ` · ${rep.title}` : ''}`;
  return (
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={`${SITE_URL}/${rep.slug}`} />
      <meta property="og:type" content="profile" />
      {rep.photo_url && <meta property="og:image" content={rep.photo_url} />}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400..800&display=swap" rel="stylesheet" />
    </Head>
  );
}

export default function RepPage({ rep }) {
  if (!rep) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24, textAlign: 'center', background: 'var(--site-dark)', color: 'var(--site-on-dark)', fontFamily: 'var(--site-font)' }}>
        <Head><title>Page not found · ProPages</title><meta name="robots" content="noindex" /></Head>
        <h1 style={{ fontSize: 32, letterSpacing: '-0.03em' }}>This page doesn&apos;t exist yet.</h1>
        <p style={{ color: 'var(--site-on-dark-2)' }}>Want it? <Link href="/signup" style={{ color: 'var(--site-mint)', textDecoration: 'underline' }}>Claim it on ProPages</Link>.</p>
      </main>
    );
  }
  return <BlockPage initialRep={rep} />;
}

function BlockPage({ initialRep }) {
  const [rep, setRep] = useState(initialRep);
  const [blocks, setBlocks] = useState(() => normalizeBlocks(initialRep.blocks));
  const [previousBlocks, setPreviousBlocks] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingIds, setEditingIds] = useState(() => new Set());
  const [toastVisible, setToastVisible] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [theme, setTheme] = useState(THEMES[initialRep.accent] ? initialRep.accent : DEFAULT_THEME);

  const defaults = getDefaults(rep.industry);
  const mode = getTheme(theme).mode;
  const hasForm = blocks.some(b => b.type === 'lead_capture' && b.visible !== false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session || session.user.id !== initialRep.auth_id) return;
      setIsOwner(true);
      const params = new URLSearchParams(window.location.search);
      if (params.get('edit') === 'true') setEditMode(true);
      if (params.get('new') === 'true') {
        setToastVisible(true);
        let welcomed = false;
        try { welcomed = !!localStorage.getItem(`pp_welcomed_${initialRep.slug}`); } catch { /* private mode */ }
        if (!welcomed) setShowWelcome(true);
      }
      if (params.has('edit') || params.has('new')) window.history.replaceState({}, '', window.location.pathname);
    });
  }, [initialRep.auth_id, initialRep.slug]);

  async function saveBlocks(next) {
    const before = blocks;
    setPreviousBlocks(before);
    setBlocks(next);
    const { error } = await supabase.from('reps').update({ blocks: next }).eq('id', rep.id);
    if (error) {
      setBlocks(before);
      setPreviousBlocks(null);
      window.alert('That change didn’t save. Check your connection and try again.');
    }
  }

  async function handleUndo() {
    if (!previousBlocks) return;
    const prev = previousBlocks;
    setBlocks(prev);
    setPreviousBlocks(null);
    await supabase.from('reps').update({ blocks: prev }).eq('id', rep.id);
  }

  async function handleThemeSelect(key) {
    setTheme(key);
    await supabase.from('reps').update({ accent: key, theme: getTheme(key).mode }).eq('id', rep.id);
  }

  const openEditor = (id) => setEditingIds(prev => new Set(prev).add(id));
  const closeEditor = (id) => setEditingIds(prev => { const n = new Set(prev); n.delete(id); return n; });

  function toggleEdit() {
    setEditMode(on => !on);
    setEditingIds(new Set());
    setToastVisible(false);
  }

  function update(id, patch) { saveBlocks(blocks.map(b => (b.id === id ? { ...b, ...patch } : b))); }

  function move(id, dir) {
    const i = blocks.findIndex(b => b.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= blocks.length) return;
    const next = [...blocks];
    [next[i], next[j]] = [next[j], next[i]];
    saveBlocks(next);
  }

  function remove(id) {
    const b = blocks.find(x => x.id === id);
    if (!window.confirm(`Delete the ${(BLOCK_LABELS[b?.type] || 'this').toLowerCase()} block? You can undo right after.`)) return;
    saveBlocks(blocks.filter(x => x.id !== id));
    closeEditor(id);
  }

  function insertAt(index, block) {
    const next = [...blocks];
    next.splice(index, 0, block);
    saveBlocks(next);
    openEditor(block.id);
  }

  // The rep's own profile links (Links block) power the message-me buttons.
  const profileLinks = cleanLinks(blocks.find(b => b.type === 'links' && b.visible !== false)?.data?.links);
  const ctx = { rep, defaults, isOwner, editMode: isOwner && editMode, hasForm, profileLinks };
  const editing = isOwner && editMode;

  return (
    <>
      <PageHead rep={rep} defaults={defaults} blocks={blocks} />
      <style>{REP_STYLES}</style>
      <style>{themeToCSS(theme)}</style>

      <div className="rp" data-mode={mode}>
        {isOwner && (
          <OwnerBar
            slug={rep.slug}
            editMode={editMode}
            onToggleEdit={toggleEdit}
            canUndo={!!previousBlocks}
            onUndo={handleUndo}
            currentTheme={theme}
            onThemeSelect={handleThemeSelect}
          />
        )}

        <main className={`rp-main${editing ? ' is-editing' : isOwner ? ' is-owner' : ''}`}>
          {isOwner && showWelcome && (
            <WelcomeBanner slug={rep.slug} onDismiss={() => setShowWelcome(false)} onEdit={editMode ? null : toggleEdit} />
          )}

          {editing && <AddBlock existingTypes={blocks.map(b => b.type)} onInsert={(b) => insertAt(0, b)} />}

          {blocks.map((block, i) => {
            if (!editing) {
              const out = renderBlock(block, ctx);
              return out ? <div key={block.id}>{out}</div> : null;
            }
            const isEditingThis = editingIds.has(block.id);
            const hidden = block.visible === false;
            return (
              <div key={block.id} className="ow-slot">
                <BlockBar
                  type={block.type}
                  hidden={hidden}
                  isFirst={i === 0}
                  isLast={i === blocks.length - 1}
                  onToggleVisible={() => update(block.id, { visible: hidden })}
                  onMoveUp={() => move(block.id, -1)}
                  onMoveDown={() => move(block.id, 1)}
                  onDelete={() => remove(block.id)}
                />
                {isEditingThis
                  ? renderEditor(block, {
                      rep, defaults, profileLinks,
                      onSave: (data) => { update(block.id, { data }); closeEditor(block.id); },
                      onCancel: () => closeEditor(block.id),
                      onRepPatch: (patch) => setRep(r => ({ ...r, ...patch })),
                    })
                  : (
                    <div
                      className={`ow-editable${hidden ? ' ow-hidden' : ''}`}
                      role="button"
                      tabIndex={0}
                      aria-label={`Edit ${BLOCK_LABELS[block.type] || 'block'}`}
                      onClickCapture={(e) => { e.preventDefault(); e.stopPropagation(); openEditor(block.id); }}
                      onKeyDown={(e) => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openEditor(block.id); } }}
                    >
                      <div inert>{renderBlock(block, ctx)}</div>
                    </div>
                  )}
                <div style={{ marginTop: 20 }}>
                  <AddBlock existingTypes={blocks.map(b => b.type)} onInsert={(b) => insertAt(i + 1, b)} />
                </div>
              </div>
            );
          })}

          <RepFooter slug={rep.slug} mode={mode} />
        </main>

        {isOwner && toastVisible && <LiveToast slug={rep.slug} onDismiss={() => setToastVisible(false)} />}
      </div>
    </>
  );
}

// ─── Server-side data fetch ───────────────────────────────────────────────────

// Only what the page needs. These are also the only `reps` columns the public
// (anon) key may read: see lib/repColumns.js and the grant in SCHEMA_final.md.

export async function getServerSideProps({ params, req, res }) {
  const slug = params.slug;
  const reserved = ['signup', 'setup', 'api', 'dashboard', 'reset', 'certified'];
  if (reserved.includes(slug)) {
    return { redirect: { destination: `/${slug}`, permanent: false } };
  }

  const { data, error } = await supabase.from('reps').select(PUBLIC_FIELDS.join(', ')).eq('slug', slug).maybeSingle();
  if (error || !data) {
    res.statusCode = 404;
    return { props: { rep: null } };
  }

  // Page view (fire-and-forget). Skip bots and link-preview crawlers.
  const ua = req.headers['user-agent'] || '';
  if (!/bot|crawl|spider|prerender|facebookexternalhit|slurp|preview/i.test(ua)) {
    supabase.from('page_views').insert({ rep_id: data.id, referrer: req.headers['referer'] || null }).then(() => {});
  }

  const rep = {};
  for (const k of PUBLIC_FIELDS) rep[k] = data[k] ?? null;
  return { props: { rep } };
}
