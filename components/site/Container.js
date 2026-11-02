// One container for every marketing section: content up to 1440px wide,
// side margins clamp(20px, 4.5vw, 64px). See styles/tokens.css (.site-container).
export default function Container({ as: Tag = 'div', className = '', children, ...rest }) {
  return (
    <Tag className={`site-container ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
