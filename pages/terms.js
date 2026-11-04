// Terms of Service. DRAFT: written from how ProPages works today; needs a
// lawyer's review before launch. Placeholders live in LEGAL (LegalPage.js).
import Link from 'next/link';
import LegalPage, { LEGAL } from '../components/site/LegalPage';

export default function Terms() {
  return (
    <LegalPage
      title="Terms of Service"
      intro="The rules for using ProPages. Plain language where we can manage it."
    >
      <h2>1. The agreement</h2>
      <p>
        These Terms are an agreement between you and ProPages (&ldquo;ProPages,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;).
        They cover your use of propages.pro, the pages you build on it, and anything else we offer there
        (together, the &ldquo;Service&rdquo;). By creating an account or using the Service, you agree to these Terms and to
        our <Link href="/privacy">Privacy Policy</Link>. If you don&apos;t agree, don&apos;t use the Service.
      </p>

      <h2>2. Your account</h2>
      <ul>
        <li>You must be at least {LEGAL.minimumAge} years old and able to enter a contract.</li>
        <li>Give us accurate information and keep it up to date. Your page must represent you, a real person, and not someone else.</li>
        <li>Keep your password safe. You&apos;re responsible for what happens under your account. Tell us right away at {LEGAL.contactEmail} if you think someone else has access.</li>
        <li>One account and one page per person unless we agree otherwise.</li>
      </ul>

      <h2>3. Your page and your content</h2>
      <p>
        You own what you put on your page: your name, photo, headline, links, reviews and other content
        (&ldquo;Your Content&rdquo;). You give us a non-exclusive, worldwide, royalty-free license to host, store,
        display, copy and format Your Content so we can run the Service and show your page to visitors. This
        license ends when you delete the content or your account, except for copies in routine backups for a
        limited time.
      </p>
      <p>You&apos;re responsible for Your Content and promise that:</p>
      <ul>
        <li>You have the right to use everything you post, including photos and logos.</li>
        <li>
          <strong>Claims are true.</strong> Numbers, ratings, awards, years in business and other statements about
          you or your results are accurate and current.
        </li>
        <li>
          <strong>Reviews and testimonials are real.</strong> They come from actual customers who agreed to have them
          shared, and they reflect those customers&apos; honest opinions. Disclose any payment or incentive you gave
          for a review. This follows the FTC&apos;s rules on endorsements and reviews.
        </li>
        <li>
          You hold any license your work requires (for example insurance, real estate, mortgage, financial advice or
          contracting), and your page follows the advertising rules for your industry and state.
        </li>
        <li>If you work for a company, you&apos;re allowed to have your own page and to use any company names or logos you show. ProPages isn&apos;t a party to your employment and isn&apos;t responsible for disputes with your employer.</li>
      </ul>
      <p>
        Pages may start with example text (sample headlines, stats or reviews) to show you how a block works.
        Replace it with your own before you share your page. You&apos;re responsible for anything that stays on your
        published page.
      </p>

      <h2>4. Leads and contacting people</h2>
      <p>
        When a visitor fills out the form on your page, we store what they send and deliver it to you (on your
        dashboard and by email). You decide what to do with it, and you&apos;re responsible for doing it lawfully. That
        includes:
      </p>
      <ul>
        <li>Following telemarketing and messaging laws such as the Telephone Consumer Protection Act (TCPA), the National Do Not Call Registry, CAN-SPAM, and state rules on calling and texting.</li>
        <li>Only contacting people about what they asked about, and stopping when they ask you to.</li>
        <li>Not selling, renting or sharing leads with anyone else unless the person agreed to it.</li>
      </ul>
      <p>ProPages doesn&apos;t guarantee any number or quality of leads, and isn&apos;t a party to anything you agree with a lead or customer.</p>

      <h2>5. What you can&apos;t do</h2>
      <ul>
        <li>Break the law, or help anyone else do so.</li>
        <li>Post anything false, misleading, deceptive, hateful, harassing, sexually explicit or violent.</li>
        <li>Impersonate a person or company, or suggest an affiliation you don&apos;t have.</li>
        <li>Use your page or links for spam, phishing, malware, or schemes such as pyramid or get-rich-quick offers.</li>
        <li>Collect sensitive information through your page (Social Security numbers, card numbers, bank details, health information).</li>
        <li>Interfere with the Service: no probing for vulnerabilities, overloading it, scraping it, or getting around limits or access controls.</li>
        <li>Fill out lead forms with fake submissions, or inflate your page&apos;s views or clicks.</li>
      </ul>

      <h2>6. Badges</h2>
      <p>
        ProPages badges (such as &ldquo;Verified&rdquo;) confirm only what the badge says, for example identity or company
        affiliation. They are not an endorsement of a rep, and they don&apos;t confirm licensing, qualifications or the
        accuracy of anything on a page. We can grant, change or remove badges at our discretion.
      </p>

      <h2>7. Plans, trials and billing</h2>
      <ul>
        <li>Some features need a paid plan. Prices are shown before you subscribe.</li>
        <li>If we offer a free trial, it converts to a paid plan when it ends unless you cancel before then. We&apos;ll tell you the trial length when you start.</li>
        <li><strong>Subscriptions renew automatically</strong> each billing period until you cancel. You can cancel anytime. Cancellation takes effect at the end of the period you&apos;ve paid for, and you keep access until then.</li>
        <li>Payments are handled by our payment processor (Stripe). We don&apos;t store your full card number.</li>
        <li>Except where the law requires otherwise, fees are not refundable, including for partly used periods.</li>
        <li>We may change prices. We&apos;ll give you at least 30 days&apos; notice before a change affects your subscription, and you can cancel before it does.</li>
        <li>If a payment fails, we may pause paid features until it&apos;s fixed.</li>
      </ul>

      <h2>8. Changes to the Service</h2>
      <p>
        We&apos;re a young product and we&apos;ll keep improving it. We may add, change or remove features. Anything marked
        &ldquo;coming soon&rdquo; or &ldquo;beta&rdquo; may change or never launch. We try to keep the Service running but
        can&apos;t promise it will always be available or error-free.
      </p>

      <h2>9. Suspension and ending your account</h2>
      <p>
        You can stop using ProPages and ask us to delete your account at any time by emailing {LEGAL.contactEmail}.
        We may suspend or remove a page or account that breaks these Terms, puts others at risk, or exposes us to legal
        liability. Where it&apos;s reasonable, we&apos;ll tell you first and give you a chance to fix it. Sections 3 (the
        parts about your responsibility), 4, 10, 11, 12 and 13 still apply after an account ends.
      </p>

      <h2>10. Disclaimers</h2>
      <p>
        The Service is provided &ldquo;as is&rdquo; and &ldquo;as available.&rdquo; To the fullest extent the law allows,
        we disclaim all warranties, express or implied, including merchantability, fitness for a particular purpose and
        non-infringement. We don&apos;t promise any particular results from using ProPages.
      </p>

      <h2>11. Limitation of liability</h2>
      <p>
        To the fullest extent the law allows, ProPages won&apos;t be liable for indirect, incidental, special,
        consequential or punitive damages, or for lost profits, revenue, leads, data or goodwill. Our total liability
        for any claim about the Service is limited to the greater of the amount you paid us in the 12 months before the
        claim and US $100.
      </p>

      <h2>12. Indemnity</h2>
      <p>
        You&apos;ll defend and cover ProPages against claims, losses and costs (including reasonable legal fees) that come
        from Your Content, your use of leads, or your breaking these Terms or the law.
      </p>

      <h2>13. Governing law</h2>
      <p>
        These Terms are governed by the laws of the State of {LEGAL.governingState}, without regard to its conflict-of-law
        rules. Any dispute will be handled in the state or federal courts located in {LEGAL.governingState}, and you and
        ProPages agree to those courts&apos; jurisdiction.
      </p>

      <h2>14. Changes to these Terms</h2>
      <p>
        We may update these Terms. If a change is significant, we&apos;ll tell you by email or in the app before it takes
        effect. If you keep using ProPages after that, the new Terms apply.
      </p>

      <h2>15. Everything else</h2>
      <p>
        These Terms and the Privacy Policy are the whole agreement between us about the Service. If part of these Terms
        can&apos;t be enforced, the rest still applies. If we don&apos;t enforce something right away, we haven&apos;t given
        up the right to. You can&apos;t transfer your account or these Terms without our OK; we may transfer them as part
        of a merger, sale or reorganization.
      </p>
    </LegalPage>
  );
}
