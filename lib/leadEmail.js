// Email a rep gets when a lead comes in. No timestamp: it's sent the moment
// the lead is saved, and the inbox shows when it arrived in the rep's own time
// zone. Pure function: no I/O, so it can be
// tested on its own. Every value from the lead is escaped: lead fields come
// from a public form and must never be trusted as HTML.

const esc = (v) => String(v ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// Digits and a leading + only, for tel: links.
const telHref = (phone) => 'tel:' + String(phone || '').replace(/[^\d+]/g, '');

export function buildLeadEmail({ lead, rep, siteUrl }) {
  const leadName = (lead.name || '').trim() || 'Someone';
  const first = (rep.name || '').trim().split(/\s+/)[0] || 'there';
  const dashboard = `${siteUrl}/dashboard`;

  const rows = [
    lead.phone && ['Phone', `<a href="${esc(telHref(lead.phone))}" style="color:#222A33;font-weight:600;text-decoration:none">${esc(lead.phone)}</a>`, lead.phone],
    lead.email && ['Email', `<a href="mailto:${esc(lead.email)}" style="color:#222A33;font-weight:600;text-decoration:none">${esc(lead.email)}</a>`, lead.email],
    lead.zip && ['Zip', esc(lead.zip), lead.zip],
    lead.notes && ['Notes', esc(lead.notes), lead.notes],
  ].filter(Boolean);

  const subject = `New lead: ${leadName.slice(0, 80)}`;

  const text = [
    `Hey ${first}, you have a new lead from your ProPage.`,
    '',
    leadName,
    ...rows.map(([k, , raw]) => `${k}: ${raw}`),
    '',
    lead.phone ? 'Call them back while they\'re still thinking about it.' : '',
    `See all your leads: ${dashboard}`,
    '',
    `You're getting this because someone filled out the form on ${siteUrl.replace(/^https?:\/\//, '')}/${rep.slug}.`,
  ].filter((l, i, a) => !(l === '' && a[i - 1] === '')).join('\n');

  const rowHtml = rows.map(([k, v]) => `
          <tr>
            <td style="padding:10px 0;border-top:1px solid #E3E8E5;font-size:14px;color:#5E6762;width:72px;vertical-align:top">${k}</td>
            <td style="padding:10px 0;border-top:1px solid #E3E8E5;font-size:16px;color:#222A33">${v}</td>
          </tr>`).join('');

  const callButton = lead.phone ? `
        <tr><td style="padding-top:24px">
          <a href="${esc(telHref(lead.phone))}" style="display:inline-block;background:#8EF0B8;color:#181E25;font-weight:700;font-size:16px;text-decoration:none;padding:14px 28px;border-radius:9999px">Call ${esc(leadName.split(/\s+/)[0])}</a>
        </td></tr>` : '';

  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:#F8F9FA">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8F9FA">
    <tr><td align="center" style="padding:32px 16px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;font-family:Outfit,'Helvetica Neue',Arial,sans-serif">
        <tr><td style="padding:0 4px 16px;font-size:13px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#B23E22">New lead</td></tr>
        <tr><td style="background:#FFFFFF;border:1px solid #E3E8E5;border-radius:16px;padding:28px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="font-size:15px;color:#5E6762;padding-bottom:6px">Hey ${esc(first)}, someone just filled out your form.</td></tr>
            <tr><td style="font-size:28px;line-height:32px;font-weight:700;color:#222A33;padding-bottom:16px">${esc(leadName)}</td></tr>
            <tr><td>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rowHtml}
              </table>
            </td></tr>${callButton}
            <tr><td style="padding-top:20px;font-size:15px"><a href="${esc(dashboard)}" style="color:#0F7A4A;font-weight:600">See all your leads</a></td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:16px 4px 0;font-size:13px;line-height:1.5;color:#5E6762">
          You're getting this because someone filled out the form on your ProPage, ${esc(siteUrl.replace(/^https?:\/\//, ''))}/${esc(rep.slug)}.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  return { subject, html, text, replyTo: lead.email || undefined };
}
