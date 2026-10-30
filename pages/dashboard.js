import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Logo from '../components/Logo';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Dashboard() {
  const router = useRouter();
  const [rep, setRep] = useState(null);
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState([]);
  const [showAllLeads, setShowAllLeads] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [weeklyViewCount, setWeeklyViewCount] = useState(0);
  const [topLink, setTopLink] = useState(null);

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

      const [{ data: leadsData }, { count: totalViews }, { count: weeklyViews }, { data: clickRows }] = await Promise.all([
        supabase.from('leads').select('*').eq('rep_id', profile.id).order('created_at', { ascending: false }),
        supabase.from('page_views').select('*', { count: 'exact', head: true }).eq('rep_id', profile.id),
        supabase.from('page_views').select('*', { count: 'exact', head: true }).eq('rep_id', profile.id).gte('viewed_at', weekAgo),
        supabase.from('block_events').select('label').eq('rep_id', profile.id).eq('event_type', 'link_click'),
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

      setLoading(false);
    }
    load();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace('/');
  }

  if (loading) {
    return (
      <>
        <Head>
          <title>ProPages – Dashboard</title>
        </Head>
        <style>{`
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
          .load-dot { width: 10px; height: 10px; border-radius: 50%; background: #F5A623; animation: pulse 1s ease-in-out infinite; }
        `}</style>
        <div style={styles.loadWrap}>
          <div className="load-dot" />
        </div>
      </>
    );
  }

  const initials = rep.name
    ? rep.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  const LEADS_PREVIEW = 3;
  const visibleLeads = showAllLeads ? leads : leads.slice(0, LEADS_PREVIEW);
  const hasMore = leads.length > LEADS_PREVIEW;

  const cards = [
    {
      id: 'mypage',
      icon: '🔗',
      label: 'My Page',
      sub: `propages.com/${rep.slug}`,
      action: () => window.open(`/${rep.slug}`, '_blank'),
      accent: '#F5A623',
    },
    {
      id: 'editpage',
      icon: '🎨',
      label: 'Edit ProPage',
      sub: 'Open your page in edit mode',
      action: () => window.open(`/${rep.slug}?edit=true`, '_blank'),
      accent: '#7B8CDE',
    },
    {
      id: 'editprofile',
      icon: '✏️',
      label: 'Edit Profile',
      sub: 'Coming soon',
      action: () => {},
      accent: '#7B8CDE',
      muted: true,
    },
    {
      id: 'settings',
      icon: '⚙️',
      label: 'Settings',
      sub: 'Coming soon',
      action: () => {},
      accent: '#8899AA',
      muted: true,
    },
  ];

  return (
    <>
      <Head>
        <title>ProPages – Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div style={styles.page}>

        {/* Top bar */}
        <div style={styles.topbar}>
          <Logo height={22} />
          <div style={styles.avatarWrap}>
            {rep.photo_url
              ? <img src={rep.photo_url} alt={rep.name} style={styles.avatarImg} />
              : <div style={styles.avatarInitials}>{initials}</div>
            }
            <div style={styles.repName}>{rep.name}</div>
          </div>
        </div>

        {/* Greeting */}
        <div style={styles.greeting}>
          <div style={styles.greetingLabel}>Dashboard</div>
          <div style={styles.greetingName}>Hey, {rep.name?.split(' ')[0]} 👋</div>
          <div style={styles.greetingSub}>
            Your page is live at{' '}
            <span
              style={styles.handleLink}
              onClick={() => window.open(`/${rep.slug}`, '_blank')}
            >
              propages.com/{rep.slug}
            </span>
          </div>
        </div>

        {/* Analytics strip */}
        <div style={styles.statsStrip}>
          <div style={styles.statCell}>
            <div style={styles.statNumber}>{viewCount.toLocaleString()}</div>
            <div style={styles.statLabel}>Page Views</div>
          </div>
          <div style={styles.statDivider} />
          <div style={styles.statCell}>
            <div style={styles.statNumber}>{weeklyViewCount.toLocaleString()}</div>
            <div style={styles.statLabel}>This Week</div>
          </div>
          <div style={styles.statDivider} />
          <div style={styles.statCell}>
            <div style={styles.statNumber}>
              {viewCount > 0 ? ((leads.length / viewCount) * 100).toFixed(1) + '%' : '—'}
            </div>
            <div style={styles.statLabel}>Conversion</div>
          </div>
        </div>

        {/* Top link clicked */}
        {topLink && (
          <div style={styles.topLinkLine}>
            Top link: <span style={styles.topLinkValue}>{topLink}</span>
          </div>
        )}

        {/* Cards grid */}
        <div style={styles.grid}>
          {cards.map(card => (
            <div
              key={card.id}
              style={{
                ...styles.card,
                ...(card.muted ? styles.cardMuted : {}),
                cursor: card.muted ? 'default' : 'pointer',
              }}
              onClick={card.action}
            >
              <div style={{ ...styles.cardIconWrap, background: card.accent + '18' }}>
                <span style={styles.cardIcon}>{card.icon}</span>
              </div>
              <div style={styles.cardLabel}>{card.label}</div>
              <div style={{ ...styles.cardSub, color: card.muted ? '#445566' : '#8899AA' }}>
                {card.sub}
              </div>
              {!card.muted && (
                <div style={{ ...styles.cardArrow, color: card.accent }}>›</div>
              )}
            </div>
          ))}
        </div>

        {/* Leads */}
        <div style={styles.leadsSection}>
          <div style={styles.leadsSectionTitle}>Recent Leads ({leads.length})</div>
          {leads.length === 0 ? (
            <div style={styles.noLeads}>No leads yet — share your page to get started.</div>
          ) : (
            <>
              {visibleLeads.map((lead, i) => (
                <LeadCard key={i} lead={lead} />
              ))}
              {hasMore && (
                <button
                  style={styles.showMoreBtn}
                  onClick={() => setShowAllLeads(s => !s)}
                >
                  {showAllLeads
                    ? 'Show less'
                    : `Show all ${leads.length} leads`}
                </button>
              )}
            </>
          )}
        </div>

        {/* Logout */}
        <button style={styles.logoutBtn} onClick={handleLogout}>
          Sign Out
        </button>

      </div>
    </>
  );
}

function LeadCard({ lead }) {
  const ownership = lead.notes
    ? lead.notes.replace('Home ownership: ', '').trim()
    : null;

  const date = new Date(lead.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div style={styles.leadCard}>
      <div style={styles.leadHeader}>
        <div style={styles.leadInitial}>{lead.name?.charAt(0).toUpperCase()}</div>
        <div style={styles.leadHeaderText}>
          <div style={styles.leadName}>{lead.name}</div>
          <div style={styles.leadDate}>{date}</div>
        </div>
      </div>
      <div style={styles.leadDetails}>
        <LeadDetail icon="📞" value={lead.phone} href={`tel:${lead.phone}`} />
        {lead.email && <LeadDetail icon="✉️" value={lead.email} href={`mailto:${lead.email}`} />}
        {lead.zip && <LeadDetail icon="📍" value={lead.zip} />}
        {ownership && <LeadDetail icon="🏠" value={ownership} />}
      </div>
    </div>
  );
}

function LeadDetail({ icon, value, href }) {
  const content = (
    <div style={styles.leadDetailRow}>
      <span style={styles.leadDetailIcon}>{icon}</span>
      <span style={styles.leadDetailValue}>{value}</span>
    </div>
  );

  if (href) {
    return <a href={href} style={{ textDecoration: 'none' }}>{content}</a>;
  }

  return content;
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0D1117',
    color: '#F8F5EE',
    fontFamily: "'DM Sans', sans-serif",
    padding: '0 20px 60px',
    maxWidth: 480,
    margin: '0 auto',
  },
  loadWrap: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0D1117',
  },

  // Top bar
  topbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 0 0',
    marginBottom: 32,
  },
  avatarWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  avatarImg: {
    width: 34,
    height: 34,
    borderRadius: '50%',
    objectFit: 'cover',
    border: '1.5px solid #F5A623',
  },
  avatarInitials: {
    width: 34,
    height: 34,
    borderRadius: '50%',
    background: '#1D3461',
    border: '1.5px solid #F5A623',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    fontWeight: 700,
    color: '#F5A623',
  },
  repName: {
    fontSize: 14,
    fontWeight: 600,
    color: '#F8F5EE',
  },

  // Greeting
  greeting: {
    marginBottom: 32,
  },
  greetingLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: '#445566',
    marginBottom: 6,
  },
  greetingName: {
    fontSize: 28,
    fontWeight: 700,
    color: '#F8F5EE',
    marginBottom: 6,
    lineHeight: 1.2,
  },
  greetingSub: {
    fontSize: 13,
    color: '#8899AA',
  },
  handleLink: {
    color: '#F5A623',
    cursor: 'pointer',
    textDecoration: 'underline',
    textDecorationColor: 'rgba(245,166,35,0.3)',
  },

  // Analytics strip
  statsStrip: {
    display: 'flex',
    alignItems: 'center',
    background: '#161B22',
    border: '1px solid #21262D',
    borderRadius: 14,
    padding: '16px 0',
    marginBottom: 16,
  },
  statCell: {
    flex: 1,
    textAlign: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 700,
    color: '#F8F5EE',
    marginBottom: 3,
    letterSpacing: '-0.5px',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: '#445566',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  statDivider: {
    width: 1,
    height: 32,
    background: '#21262D',
    flexShrink: 0,
  },

  // Top link clicked
  topLinkLine: {
    textAlign: 'center',
    fontSize: 12,
    color: '#8899AA',
    marginBottom: 16,
  },
  topLinkValue: {
    color: '#F5A623',
    fontWeight: 600,
  },

  // Cards
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    marginBottom: 32,
  },
  card: {
    background: '#161B22',
    border: '1px solid #21262D',
    borderRadius: 14,
    padding: '18px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    position: 'relative',
  },
  cardMuted: {
    opacity: 0.45,
  },
  cardIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardIcon: {
    fontSize: 20,
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: 600,
    color: '#F8F5EE',
    flex: 1,
  },
  cardSub: {
    fontSize: 12,
    position: 'absolute',
    bottom: 18,
    left: 76,
  },
  cardArrow: {
    fontSize: 22,
    lineHeight: 1,
    marginLeft: 'auto',
  },

  // Leads section
  leadsSection: {
    marginBottom: 24,
  },
  leadsSectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: '#8899AA',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  noLeads: {
    color: '#445566',
    fontSize: 14,
    textAlign: 'center',
    padding: '24px 0',
  },
  showMoreBtn: {
    width: '100%',
    padding: '11px',
    background: 'transparent',
    border: '1px solid #21262D',
    borderRadius: 10,
    color: '#8899AA',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    marginTop: 2,
  },

  // Lead card
  leadCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 14,
    padding: '14px 16px',
    marginBottom: 10,
  },
  leadHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  leadInitial: {
    width: 38,
    height: 38,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #1D3461, #F5A623)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 15,
    flexShrink: 0,
    color: '#F8F5EE',
  },
  leadHeaderText: {
    flex: 1,
  },
  leadName: {
    fontSize: 15,
    fontWeight: 700,
    color: '#F8F5EE',
    marginBottom: 2,
  },
  leadDate: {
    fontSize: 11,
    color: '#445566',
  },
  leadDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    paddingLeft: 50,
  },
  leadDetailRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  leadDetailIcon: {
    fontSize: 13,
    width: 18,
    textAlign: 'center',
    flexShrink: 0,
  },
  leadDetailValue: {
    fontSize: 13,
    color: '#8899AA',
  },

  // Logout
  logoutBtn: {
    width: '100%',
    padding: '13px',
    background: 'transparent',
    border: '1px solid #21262D',
    borderRadius: 12,
    color: '#445566',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
  },
};