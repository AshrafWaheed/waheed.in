import type { Metadata } from 'next';
import Link from 'next/link';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Privacy Policy · WAHEED',
  description: 'How Waheed Digital Studio collects, uses, and protects your personal information.',
  path: '/privacy',
});

const LAST_UPDATED = 'June 2026';

export default function PrivacyPage() {
  return (
    <main>
      <div className="page-hero" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
        <div className="cnt">
          <span className="lbl">Legal</span>
          <h1 style={{ fontSize: 'clamp(2rem,3.5vw,3rem)' }}>Privacy Policy</h1>
          <p>Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      <section className="sec" style={{ background: '#FFFDF9' }}>
        <div className="cnt" style={{ maxWidth: 720 }}>
          <div className="legal-body">

            <h2>Who we are</h2>
            <p>Waheed Digital Studio ("Waheed", "we", "us") is a halal digital studio based in India. Our website is <strong>waheed.in</strong>.</p>

            <h2>Information we collect</h2>
            <p>We collect information you provide directly to us, including:</p>
            <ul>
              <li>Name, email address, phone/WhatsApp number, and organisation name when you submit a project application or contact form.</li>
              <li>Email address when you subscribe to our newsletter.</li>
              <li>Project details and messages you share with us.</li>
            </ul>
            <p>We do not use cookies for tracking, and we do not use third-party analytics platforms that track you across websites.</p>

            <h2>How we use your information</h2>
            <ul>
              <li>To review and respond to your project application or enquiry.</li>
              <li>To send the newsletter you subscribed to (you may unsubscribe at any time).</li>
              <li>To communicate with you about your project if we begin working together.</li>
            </ul>
            <p>We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>

            <h2>Data storage</h2>
            <p>Form submissions are stored securely on our server in India. We retain contact records only as long as necessary to manage client relationships, and no longer than 3 years after the last contact.</p>

            <h2>Your rights</h2>
            <p>You may request access to, correction of, or deletion of your personal information at any time by emailing us at <a href="mailto:info@waheed.in">info@waheed.in</a>. We will respond within 10 business days, in shā' Allāh.</p>

            <h2>Contact</h2>
            <p>For any privacy-related questions: <a href="mailto:info@waheed.in">info@waheed.in</a></p>

          </div>

          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #E6DED3' }}>
            <Link href="/" className="btn btn-teal">← Back to Home</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
