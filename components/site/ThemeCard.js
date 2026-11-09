// Theme option card: a mini page in the theme's own colors, on the app's dark
// chrome. Used by setup step 2 and the rep page's owner menu.
import Icon from './icons';

export default function ThemeCard({ id, theme, checked, onSelect, name = 'theme' }) {
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
      <input id={`theme-${id}`} type="radio" name={name} checked={checked} onChange={() => onSelect(id)} style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }} />
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
