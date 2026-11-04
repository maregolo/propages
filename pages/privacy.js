// Privacy Policy. DRAFT: written from what the code actually collects
// (Nov 2026); needs a lawyer's review before launch. Keep it in sync with
// schema.md when tables or fields change.
import Link from 'next/link';
import LegalPage, { LEGAL } from '../components/site/LegalPage';

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="What we collect, why, who it goes to, and what you can do about it."
    >
      <h2>Who this covers</h2>
      <p>This policy covers three groups of people:</p>
      <ul>
        <li><strong>Reps:</strong> people with a ProPages account and page.</li>
        <li><strong>Visitors:</strong> anyone who views a ProPages page, including the homepage.</li>
        <li><strong>People who reach out:</strong> anyone who fills out a form on a rep&apos;s page or on our site.</li>
      </ul>
      <p>
        Each rep is an independent business, not part of ProPages. When you send your information to a rep through their
        page, they decide how to use it, and their own practices apply to what they do with it.
      </p>

      <h2>What we collect</h2>
      <h3>From reps</h3>
      <ul>
        <li><strong>Account:</strong> email address and password. Passwords are stored as one-way hashes by our authentication provider; we can&apos;t see them.</li>
        <li><strong>Profile and page:</strong> name, handle, title, city, industry, whether you&apos;re independent or employed, phone number (optional), photo (optional), links, and the content you add to your page.</li>
        <li><strong>Referrals:</strong> if you sign up through another rep&apos;s link, which rep referred you.</li>
        <li><strong>Agreement:</strong> when you accepted the Terms of Service.</li>
      </ul>
      <h3>From people who fill out a rep&apos;s form</h3>
      <ul>
        <li>Name and phone number, plus email address and zip code if the rep asks for them.</li>
        <li>Your answer to the rep&apos;s question (for example, whether you own your home).</li>
        <li>If you refer a neighbor or friend: your name and email, and theirs.</li>
      </ul>
      <h3>From visitors</h3>
      <ul>
        <li><strong>Page views:</strong> that a page was viewed, when, and the website that linked to it (the &ldquo;referrer&rdquo;).</li>
        <li><strong>Clicks:</strong> which link or button on a page was clicked, and when.</li>
        <li>We don&apos;t store your IP address or build a profile of you in these records. Our hosting and database providers process IP addresses and similar technical data in their own logs to run and secure the service.</li>
      </ul>
      <h3>From people who contact us</h3>
      <ul>
        <li>If you join a waitlist or request access: name, email and industry.</li>
        <li>Anything you send us by email.</li>
      </ul>

      <h2>Cookies and browser storage</h2>
      <p>
        We don&apos;t use advertising cookies, ad networks or third-party tracking tools. We use your browser&apos;s storage
        only to make the site work: keeping you signed in, remembering the handle you picked on the homepage or the rep
        who referred you until you finish signing up, and remembering that you&apos;ve dismissed a welcome message.
      </p>

      <h2>How we use information</h2>
      <ul>
        <li>To run ProPages: host pages, create accounts and sign you in.</li>
        <li>To deliver leads: form submissions go to the rep whose page they were sent from, on the rep&apos;s dashboard and by email.</li>
        <li>To show reps how their page is doing (views, clicks, conversion).</li>
        <li>To send account email: confirmations, password resets, lead notifications and important service updates.</li>
        <li>To prevent spam, abuse and fraud, and to keep the service secure.</li>
        <li>To understand how ProPages is used so we can improve it.</li>
      </ul>
      <p><strong>We don&apos;t sell personal information</strong>, and we don&apos;t share it with anyone for their advertising.</p>

      <h2>Who we share it with</h2>
      <ul>
        <li><strong>The rep you contacted.</strong> That&apos;s the point of the form.</li>
        <li><strong>The public.</strong> Rep pages are public. Anything a rep puts on their page can be seen by anyone with the link.</li>
        <li>
          <strong>Service providers</strong> that run parts of ProPages for us, only for that purpose:
          Supabase (database, sign-in and file storage), Vercel (website hosting), Resend (email delivery), and
          Stripe (payments, once paid plans launch).
        </li>
        <li><strong>When the law requires it</strong>, or to protect the rights, safety or property of ProPages, our users or others.</li>
        <li><strong>In a business transfer</strong> such as a merger or sale, where the new owner keeps this policy&apos;s protections or tells you first.</li>
      </ul>

      <h2>How long we keep it</h2>
      <p>
        We keep a rep&apos;s account, page and leads for as long as the account is open. When an account is deleted, we
        delete its page, profile and leads, except where the law requires us to keep something or for a short time in
        routine backups. Page-view and click records are kept to show reps their history and are deleted with the account.
      </p>

      <h2>Your choices</h2>
      <ul>
        <li><strong>Reps</strong> can edit their page and profile at any time, and can ask us to export or delete their account by emailing {LEGAL.contactEmail}.</li>
        <li>
          <strong>If you sent your information to a rep</strong> and want it removed, ask the rep, or email us with the
          rep&apos;s page address and we&apos;ll delete it from ProPages. Copies the rep already saved elsewhere are theirs to
          delete.
        </li>
        <li>
          Depending on where you live (for example California, Colorado, Connecticut, Virginia and other states with
          privacy laws), you may have the right to access, correct, delete or get a copy of your personal information. Email
          us and we&apos;ll respond within the time the law requires. We won&apos;t treat you differently for asking.
        </li>
      </ul>

      <h2>Security</h2>
      <p>
        We use encrypted connections (HTTPS), database access rules that limit each rep to their own leads, and
        reputable providers. No system is perfectly secure, so we can&apos;t guarantee absolute security. If we learn of a
        breach that affects you, we&apos;ll tell you as the law requires.
      </p>

      <h2>Children</h2>
      <p>
        ProPages is for adults. Accounts are for people {LEGAL.minimumAge} and older, and we don&apos;t knowingly collect
        information from children under 13. If you think a child has sent us information, email us and we&apos;ll delete it.
      </p>

      <h2>Where data is stored</h2>
      <p>ProPages is run from the United States, and our providers may store and process data in the United States and other countries.</p>

      <h2>Changes</h2>
      <p>
        If we change this policy, we&apos;ll update the date at the top. If a change is significant, we&apos;ll tell reps by
        email or in the app first. See also our <Link href="/terms">Terms of Service</Link>.
      </p>
    </LegalPage>
  );
}
