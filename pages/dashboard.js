import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import AppShell, { AppLoading, Intro } from '../components/site/AppShell';
import Button from '../components/site/Button';
import Icon from '../components/site/icons';
import { DOMAIN } from '../components/site/HandleField';
import { SITE } from '../components/SiteMeta';
import { normalizeBlocks, cleanLinks, cleanTestimonials } from '../lib/repBlocks';
import { CONTACT_METHODS, leadContactLink } from '../lib/contact';

const LEADS_PREVIEW = 3;
const DAY = 24 * 60 * 60 * 1000;

export default function Dashboard() {
  const router = useRouter();
  const [rep, setRep] = useState(null);
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState([]);
  const [showAllLeads, setShowAllLeads] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [weeklyViewCount, setWeeklyViewCount] = useState(0);
  const [topLink, setTopLink] = useState(null);
  const [dmTaps, setDmTaps] = useState([]);
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState(0);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace('/signup'); return; }

      const { data: profile } = await supabase
        .from('reps')
        .select('*')
        .eq('auth_id', session.user.id)
        .maybeSingle();

      if (!profile) { router.replace('/setup'); return; }

      setRep(profile);

      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

      const [{ data: leadsData }, { count: totalViews }, { count: weeklyViews }, { data: clickRows }, { data: dmRows }] = await Promise.all([
        supabase.from('leads').select('*').eq('rep_id', profile.id).order('created_at', { ascending: false }),
        supabase.from('page_views').select('*', { count: 'exact', head: true }).eq('rep_id', profile.id),
        supabase.from('page_views').select('*', { count: 'exact', head: true }).eq('rep_id', profile.id).gte('viewed_at', weekAgo),
        supabase.from('block_events').select('label').eq('rep_id', profile.id).eq('event_type', 'link_click'),
        supabase.from('block_events').select('label').eq('rep_id', profile.id).eq('event_type', 'dm_click').gte('created_at', weekAgo),
      ]);

      setLeads(leadsData || []);
      setViewCount(totalViews || 0);
      setWeeklyViewCount(weeklyViews || 0);

      if (clickRows && clickRows.length) {
        const counts = {};
        clickRows.forEach(r => { if (r.label) counts[r.label] = (counts[r.label] || 0) + 1; });
        const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
        setTopLink(top ? top[0] : null);
      }

      const dm = {};
      (dmRows || []).forEach(r => { if (r.label) dm[r.label] = (dm[r.label] || 0) + 1; });
      setDmTaps(Object.entries(dm).sort((a, b) => b[1] - a[1]));

      setNow(Date.now());
      setLoading(false);
    }
    load();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace('/');
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${SITE}/${rep.slug}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) { /* clipboard blocked: the link is shown on the page */ }
  }

  if (loading) return <AppLoading tone="light" />;

  const firstName = rep.name?.split(' ')[0] || 'there';
  const initials = rep.name
    ? rep.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';
  const visibleLeads = showAllLeads ? leads : leads.slice(0, LEADS_PREVIEW);
  const hasMore = leads.length > LEADS_PREVIEW;
  const conversion = viewCount > 0 ? ((leads.length / viewCount) * 100).toFixed(1) + '%' : '—';
  const editHref = `/${rep.slug}?edit=true`;
  const todo = finishItems(rep);
  const done = todo.filter(t => t.done);
  const open = todo.filter(t => !t.done);

  const user = (
    <div className="dash-user">
      <span className="dash-user__name">{rep.name}</span>
      <span className="dash-avatar" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {rep.photo_url ? <img src={rep.photo_url} alt="" /> : initials}
      </span>
    </div>
  );

  return (
    <AppShell title="Dashboard" tone="light" width={1120} right={user}>
      <main className="site-app__main">

        <div className="dash-top">
          <Intro eyebrow="Dashboard" title={`Hey, ${firstName}.`}>
            Your page is live at <a href={`/${rep.slug}`} target="_blank" rel="noopener">{DOMAIN}/{rep.slug}</a>
          </Intro>
          <div className="dash-actions">
            <Button type="button" onClick={copyLink} aria-live="polite">
              <Icon name={copied ? 'check' : 'copy'} />{copied ? 'Copied!' : 'Copy my link'}
            </Button>
            <Button href={`/${rep.slug}`} variant="outline-light" target="_blank" rel="noopener">
              <Icon name="external" />View page
            </Button>
          </div>
        </div>

        <div className="dash-cols">
          <div className="dash-side">
            <div className="dash-stats">
              <div className="dash-card dash-stat"><b>{viewCount.toLocaleString()}</b><span>Views</span></div>
              <div className="dash-card dash-stat"><b>{weeklyViewCount.toLocaleString()}</b><span>This week</span></div>
              <div className="dash-card dash-stat"><b className="hot">{conversion}</b><span>Conversion</span></div>
            </div>

            {topLink && <p className="dash-note">Top link: <strong>{topLink}</strong></p>}
            {dmTaps.length > 0 && (
              <p className="dash-note">
                Message taps this week: {dmTaps.map(([ch, n], i) => <span key={ch}>{i > 0 && ' · '}<strong>{DM_LABELS[ch] || ch} {n}</strong></span>)}
              </p>
            )}

            {open.length > 0 && (
              <section className="dash-card dash-finish" aria-labelledby="finish-title">
                <div className="dash-row-head">
                  <h2 id="finish-title" className="dash-h2">Finish your page</h2>
                  <span className="dash-meta">{done.length} of {todo.length} done</span>
                </div>
                <div className="dash-progress" aria-hidden="true"><span style={{ width: `${(done.length / todo.length) * 100}%` }} /></div>
                {done.length > 0 && (
                  <span className="dash-done"><Icon name="check" size={16} strokeWidth={2.5} />{listJoin(done.map(d => d.short))} done</span>
                )}
                <div>
                  {open.map(t => (
                    <a key={t.key} href={editHref} target="_blank" rel="noopener" className="dash-todo">
                      <Icon name={t.icon} size={20} /><span>{t.label}</span><Icon name="chevronRight" />
                    </a>
                  ))}
                </div>
              </section>
            )}

            <nav className="dash-card dash-tools" aria-label="Page tools">
              <a href={editHref} target="_blank" rel="noopener" className="dash-tool">
                <span className="dash-tool__icon"><Icon name="edit" size={20} /></span>
                <span className="dash-tool__text">Edit my page<small>Change blocks, links and theme</small></span>
                <Icon name="chevronRight" style={{ color: 'var(--site-muted)' }} />
              </a>
              <div className="dash-tool dash-tool--soon">
                <span className="dash-tool__icon"><Icon name="person" size={20} /></span>
                <span className="dash-tool__text">Edit profile</span>
                <span className="dash-soon">Soon</span>
              </div>
              <div className="dash-tool dash-tool--soon">
                <span className="dash-tool__icon"><Icon name="gear" size={20} /></span>
                <span className="dash-tool__text">Settings</span>
                <span className="dash-soon">Soon</span>
              </div>
            </nav>
          </div>

          <section className="dash-main" aria-labelledby="leads-title">
            <div className="dash-row-head">
              <h2 id="leads-title" className="dash-h2 dash-h2--lg">Recent leads</h2>
              <span className="dash-meta" style={{ fontSize: 15 }}>{leads.length} total</span>
            </div>

            {leads.length === 0 ? (
              <div className="dash-card dash-empty">
                <h3 className="dash-h2">No leads yet.</h3>
                <p>Share your link on your socials, in texts and on leave-behinds. Leads show up here the moment someone fills out your form.</p>
                <Button type="button" variant="outline-light" onClick={copyLink} style={{ minHeight: 48, fontSize: 16 }}>
                  <Icon name={copied ? 'check' : 'copy'} />{copied ? 'Copied!' : 'Copy my link'}
                </Button>
              </div>
            ) : (
              <>
                {visibleLeads.map(lead => <LeadCard key={lead.id || lead.created_at} lead={lead} now={now} />)}
                {hasMore && (
                  <Button type="button" variant="outline-light" block style={{ minHeight: 50, fontSize: 16, fontWeight: 600 }} onClick={() => setShowAllLeads(v => !v)}>
                    {showAllLeads ? 'Show less' : `Show all ${leads.length} leads`}
                  </Button>
                )}
              </>
            )}
          </section>
        </div>

        <button type="button" className="site-textbtn" onClick={handleLogout}>
          <Icon name="logout" />Sign out
        </button>
      </main>
    </AppShell>
  );
}

// What's left to make the page convincing. Each item opens edit mode.
// Reads blocks through normalizeBlocks so older pages (separate profile /
// headline / stats blocks) count the same as the merged hero.
function finishItems(rep) {
  const blocks = normalizeBlocks(rep.blocks);
  const blockData = (type) => blocks.find(b => b.type === type)?.data || {};
  const hero = blockData('hero');
  return [
    { key: 'photo', short: 'Photo', label: 'Add a photo', icon: 'camera', done: !!(rep.photo_url || hero.photo_url) },
    { key: 'headline', short: 'headline', label: 'Write your headline', icon: 'headline', done: !!String(hero.headline || '').trim() },
    { key: 'links', short: 'links', label: 'Add your links', icon: 'link', done: cleanLinks(blockData('links').links).length > 0 },
    { key: 'reviews', short: 'testimonial', label: 'Add a customer review', icon: 'quote', done: cleanTestimonials(blockData('testimonials').testimonials).length > 0 },
  ];
}

function listJoin(items) {
  const out = items.length <= 1 ? items.join('') : items.slice(0, -1).join(', ') + ' and ' + items[items.length - 1];
  return out.charAt(0).toUpperCase() + out.slice(1);
}

const DM_LABELS = { instagram: 'Instagram', facebook: 'Messenger', whatsapp: 'WhatsApp', text: 'Text' };

function LeadCard({ lead, now }) {
  // Older leads stored the qualifying answer as "Home ownership: <answer>".
  const answer = lead.notes ? lead.notes.replace(/^Home ownership: /, '').trim() : null;
  const method = lead.contact_method && CONTACT_METHODS[lead.contact_method] ? lead.contact_method : null;
  const dm = method ? leadContactLink(method, lead.contact_handle) : null;
  const created = new Date(lead.created_at);
  const when = created.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    + ' · ' + created.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const isNew = now - created.getTime() < DAY;

  return (
    <article className="dash-card dash-lead">
      <div className="dash-lead__head">
        <span className="dash-lead__init" aria-hidden="true">{lead.name?.charAt(0).toUpperCase() || '?'}</span>
        <span className="dash-lead__who"><b>{lead.name}</b><span>{when}</span></span>
        {isNew && <span className="dash-new">New</span>}
      </div>
      {method && <p className="dash-lead__pref">Prefers {CONTACT_METHODS[method].label}</p>}
      <div className="dash-lead__details">
        {dm && <a href={dm.href} target="_blank" rel="noopener noreferrer"><Icon name={method === 'instagram' ? 'instagram' : 'external'} size={16} /><span className="ellip">{dm.text}</span><small>{dm.action}</small></a>}
        {lead.phone && method !== 'whatsapp' && <a href={`tel:${lead.phone}`}><Icon name="phone" size={16} />{lead.phone}</a>}
        {lead.email && <a href={`mailto:${lead.email}`}><Icon name="mail" size={16} /><span className="ellip">{lead.email}</span></a>}
        {lead.zip && <span><Icon name="pin" size={16} />{lead.zip}</span>}
        {answer && <span><Icon name="check" size={16} />{answer}</span>}
      </div>
    </article>
  );
}
