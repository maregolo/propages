import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, email } = req.body;

  if (!name || !email) return res.status(400).json({ error: 'Missing fields' });

  try {
    await resend.emails.send({
      from: 'ProPages <onboarding@resend.dev>',
      to: 'marcusregolo@gmail.com',
      subject: `New invite request — ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p>Log in to Supabase to approve or reject this request.</p>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}