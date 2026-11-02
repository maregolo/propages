// Labelled form field: white, 54px, 10px radius (same on light and dark).
//
//   <Field label="Email address" type="email" name="email" value={…} onChange={…} />
//   <Field label="Industry" as="select">…options…</Field>
import { useId } from 'react';

export default function Field({ label, as: Tag = 'input', id, hint, className = '', children, ...rest }) {
  const auto = useId();
  const fieldId = id || `f${auto.replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <div className={className}>
      {label && <label className="site-label" htmlFor={fieldId}>{label}</label>}
      <Tag id={fieldId} className="site-field" {...rest}>{children}</Tag>
      {hint && <p className="site-hint">{hint}</p>}
    </div>
  );
}
