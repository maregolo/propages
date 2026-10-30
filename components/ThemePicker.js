import { THEMES } from '../lib/themes';

export default function ThemePicker({ selectedTheme, onSelect }) {
  const themeKeys = Object.keys(THEMES);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {themeKeys.map(key => {
        const theme = THEMES[key];
        const isSelected = selectedTheme === key;
        return (
          <div
            key={key}
            onClick={() => onSelect(key)}
            style={{
              borderRadius: 16,
              border: isSelected
                ? `2px solid ${theme.preview.accent}`
                : '2px solid rgba(255,255,255,0.07)',
              background: isSelected
                ? 'rgba(255,255,255,0.04)'
                : 'rgba(255,255,255,0.02)',
              padding: '14px 16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              transition: 'all 0.2s ease',
            }}
          >
            {/* Mini preview swatch */}
            <div style={{
              width: 56, height: 42, borderRadius: 10, flexShrink: 0,
              background: theme.preview.bg,
              border: '1px solid rgba(0,0,0,0.12)',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: isSelected ? `0 0 0 2px ${theme.preview.accent}44` : 'none',
            }}>
              <div style={{
                position: 'absolute', top: 7, left: 7, right: 7,
                height: 12, borderRadius: 4,
                background: theme.preview.surface,
              }} />
              <div style={{
                position: 'absolute', bottom: 7, left: 7,
                width: 20, height: 5, borderRadius: 3,
                background: theme.preview.accent,
              }} />
              <div style={{
                position: 'absolute', bottom: 7, left: 32, right: 7,
                height: 3, borderRadius: 2,
                background: theme.preview.accent + '44',
              }} />
            </div>

            {/* Label + description */}
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 15, fontWeight: 700,
                color: isSelected ? theme.preview.accent : '#F8F5EE',
                marginBottom: 2,
                transition: 'color 0.2s ease',
              }}>
                {theme.label}
                {' '}
                <span style={{
                  fontSize: 10, fontWeight: 600, letterSpacing: 1,
                  textTransform: 'uppercase',
                  color: theme.mode === 'light' ? '#00E5BE' : '#8899AA',
                  marginLeft: 4,
                }}>
                  {theme.mode}
                </span>
              </div>
              <div style={{ fontSize: 12, color: '#8899AA' }}>
                {theme.description}
              </div>
            </div>

            {/* Selected indicator */}
            <div style={{
              width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
              border: isSelected
                ? `2px solid ${theme.preview.accent}`
                : '2px solid rgba(255,255,255,0.12)',
              background: isSelected ? theme.preview.accent : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, color: '#0A1628', fontWeight: 700,
              transition: 'all 0.2s ease',
            }}>
              {isSelected ? '✓' : ''}
            </div>
          </div>
        );
      })}
    </div>
  );
}