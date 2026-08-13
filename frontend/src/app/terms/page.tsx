import type { Metadata } from 'next';
import StackButton from '@/components/ui/StackButton';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Terms of Service · WAHEED',
  description: 'Terms and conditions for working with Waheed Digital Studio.',
  path: '/terms',
});

const LAST_UPDATED = 'June 2026';

export default function TermsPage() {
  return (
    <main>
      <div className="page-hero" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
        <div className="cnt">
          <span className="lbl">Legal</span>
          <h1 style={{ fontSize: 'clamp(2rem,3.5vw,3rem)' }}>Terms of Service</h1>
          <p>Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      <section className="sec" style={{ background: 'var(--rd-white)' }}>
        <div className="cnt" style={{ maxWidth: 720 }}>
          <div className="legal-body">

            <h2>Agreement to terms</h2>
            <p>By engaging Waheed Digital Studio ("Waheed") for any service, you agree to these terms. If you do not agree, please do not proceed with any engagement.</p>

            <h2>Services</h2>
            <p>Waheed provides digital services including website design and development, brand strategy, social media management, and custom software solutions. The specific scope of work for each client is defined in a written proposal or statement of work agreed upon before any project begins.</p>

            <h2>Ethical guidelines</h2>
            <p>Waheed operates according to Islamic ethical principles. We reserve the right to decline or discontinue any project that conflicts with our values, including but not limited to projects involving interest-based finance, content that is inappropriate according to Islamic principles, or deceptive practices.</p>

            <h2>Payment terms</h2>
            <p>No deposit is required before work begins. Projects are invoiced on a milestone basis, with the milestones and their amounts set out in your proposal; each milestone is invoiced only once the work it covers has been completed and made available for your review. All payments are due within 7 days of the relevant milestone being reached. We do not use interest-based payment structures.</p>

            <h2>Intellectual property</h2>
            <p>Upon receipt of final payment, all deliverables created for your project become your property. Waheed retains the right to display completed work in its portfolio unless otherwise agreed in writing.</p>

            <h2>Confidentiality</h2>
            <p>Both parties agree to keep confidential any proprietary information shared during the project. This obligation continues for 2 years after the project ends.</p>

            <h2>Limitation of liability</h2>
            <p>Waheed's liability for any claim arising from our services is limited to the total amount paid for the specific project giving rise to the claim. We are not liable for indirect, consequential, or incidental damages.</p>

            <h2>Governing law</h2>
            <p>These terms are governed by the laws of India. Any disputes shall be resolved through mutual consultation in good faith before any formal proceedings.</p>

            <h2>Contact</h2>
            <p>For questions about these terms: <a href="mailto:info@waheed.in">info@waheed.in</a></p>

          </div>

          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--rd-border)' }}>
            <StackButton href="/" tone="ghost">← Back to Home</StackButton>
          </div>
        </div>
      </section>
    </main>
  );
}
