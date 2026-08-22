import type { Metadata } from 'next';
import Link from 'next/link';
import StackButton from '@/components/ui/StackButton';
import CookieSettingsLink from '@/components/consent/CookieSettingsLink';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Privacy Policy · WAHEED',
  description: 'How Waheed Digital Studio collects, uses, and protects your personal information.',
  path: '/privacy',
});

const LAST_UPDATED = '22 August 2026';

/**
 * The privacy policy, rewritten in August 2026 because the previous version
 * said two things that were not true.
 *
 *   1. "We do not use cookies for tracking, and we do not use third-party
 *      analytics platforms that track you across websites." The site was
 *      running Google Analytics 4, Microsoft Clarity and Ahrefs on every route,
 *      Clarity being a session recorder.
 *   2. "Form submissions are stored securely on our server in India." The
 *      server is Hetzner Cloud in Nuremberg, Germany. That one was wrong in the
 *      studio's own disfavour: EU hosting is the stronger position, and the
 *      policy was hiding it.
 *
 * Neither was written dishonestly. Both are what a policy becomes when it is
 * written once and the stack keeps moving. The fix that matters is structural,
 * not textual: the cookie table on /cookies is generated from the same register
 * that decides which scripts load (src/lib/consent.ts), so that particular
 * claim can no longer drift from the code. The processor list below is still
 * prose, so it is still on a human to keep current. Anyone adding a service
 * that receives visitor data has to edit this file in the same commit.
 */
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

      <section className="sec" style={{ background: 'var(--rd-white)' }}>
        <div className="cnt" style={{ maxWidth: 720 }}>
          <div className="legal-body">

            <h2>Who we are</h2>
            <p>
              Waheed Digital Studio (&ldquo;Waheed&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is a
              halal digital studio, a professional service brand owned and operated by Ashraf Waheed
              Ansari, based in India. Our website is <strong>waheed.in</strong>. For anything in this
              policy we are the data controller, and you can reach us at{' '}
              <a href="mailto:info@waheed.in">info@waheed.in</a>.
            </p>
            <p>
              We work with clients across Europe and the Americas, so this policy is written to the
              standard of the EU and UK GDPR wherever you happen to be.
            </p>

            <h2>What we collect</h2>
            <p>Information you give us deliberately:</p>
            <ul>
              <li>
                Name, email address, phone or WhatsApp number, organisation name, location, the
                service you are interested in, your stage, budget range, timeline and your message,
                when you submit a project application or contact form.
              </li>
              <li>Email address when you subscribe to the newsletter.</li>
              <li>
                Name, email, the time you picked and your timezone when you book a call. We also
                record the IP address that made the booking, once, as a safeguard against automated
                and duplicate bookings.
              </li>
            </ul>
            <p>Information collected automatically, and only if you allow it:</p>
            <ul>
              <li>
                Analytics about your visit: which pages you read, roughly where in the world you
                are, what referred you, what browser you use.
              </li>
              <li>
                A recording of your session: pointer movement, clicks and scrolling on the page.
              </li>
            </ul>
            <p>
              Both of those are off until you turn them on. This is the part of the policy that used
              to say we did not use analytics at all, which was wrong, and we would rather correct it
              plainly than quietly. The full list of what each one sets is on our{' '}
              <Link href="/cookies">cookie policy</Link>, and you can change your answer at any time:{' '}
              <CookieSettingsLink />.
            </p>
            <p>
              Our web server keeps standard access logs, including IP addresses, for security and
              troubleshooting. Those are not linked to anything else and are not used to profile you.
              Our fonts are served from our own server, so loading a page on this site does not
              contact Google.
            </p>

            <h2>Why we use it, and on what legal basis</h2>
            <ul>
              <li>
                <strong>To answer your enquiry or run your booking.</strong> Legal basis: steps taken
                at your request before entering a contract, and our legitimate interest in responding
                to people who contact us.
              </li>
              <li>
                <strong>To send the newsletter you asked for.</strong> Legal basis: your consent. Every
                edition carries an unsubscribe link, and unsubscribing takes effect immediately.
              </li>
              <li>
                <strong>To deliver a project</strong> once we begin working together. Legal basis:
                performance of our contract with you.
              </li>
              <li>
                <strong>To measure the audience and improve the site.</strong> Legal basis: your
                consent, given through the cookie banner and withdrawable at any time.
              </li>
              <li>
                <strong>To keep the site up and secure.</strong> Legal basis: our legitimate interest
                in a site that works and is not being abused.
              </li>
            </ul>
            <p>
              We do not sell or rent your personal information, we do not share it with data brokers,
              and we do not use it to build advertising profiles.
            </p>

            <h2>Who else handles it</h2>
            <p>
              We use a small number of service providers, and each one only receives what it needs to
              do its job:
            </p>
            <ul>
              <li>
                <strong>Hetzner Online GmbH</strong> (Germany) hosts the website and its database.
              </li>
              <li>
                <strong>HubSpot</strong> (Ireland and United States) is our CRM. Contact form and
                booking details are recorded there so an enquiry does not get lost.
              </li>
              <li>
                <strong>Beehiiv</strong> (United States) sends the newsletter, and holds the email
                addresses of subscribers.
              </li>
              <li>
                <strong>Google</strong> (Ireland and United States) provides Calendar and Meet for
                booked calls, and Google Analytics if you have consented to it.
              </li>
              <li>
                <strong>Microsoft</strong> (Ireland and United States) provides Clarity session
                recording, only if you have consented to it.
              </li>
              <li>
                <strong>Ahrefs</strong> (Singapore) provides a second page-view count, only if you
                have consented to it.
              </li>
            </ul>

            <h2>Where your data is stored and sent</h2>
            <p>
              The website, its database and your form submissions are stored on a server in
              Nuremberg, Germany, inside the EU. An earlier version of this policy said India; that
              was out of date.
            </p>
            <p>
              Some of the providers above are based in, or transfer data to, the United States. Those
              transfers rely on the EU-US Data Privacy Framework where the provider is certified
              under it, and on the European Commission&rsquo;s Standard Contractual Clauses otherwise.
              We are happy to tell you which applies to a specific provider if you ask.
            </p>

            <h2>How long we keep it</h2>
            <ul>
              <li>Contact and booking records: up to 3 years after our last contact with you.</li>
              <li>Newsletter subscriptions: until you unsubscribe.</li>
              <li>Your cookie choice: 180 days, after which we ask again.</li>
              <li>Server access logs: 14 days, then they are rotated away.</li>
            </ul>
            <p>
              If we are working together, records connected to the engagement are kept for as long
              as accounting and tax rules require. Ask us and we will tell you exactly what we still
              hold on you.
            </p>

            <h2>Your rights</h2>
            <p>Wherever you are, and free of charge, you can ask us to:</p>
            <ul>
              <li>Give you a copy of the personal data we hold about you.</li>
              <li>Correct anything that is wrong or incomplete.</li>
              <li>Delete it.</li>
              <li>Restrict what we do with it, or object to us using it.</li>
              <li>Send it to you, or to someone else, in a portable format.</li>
              <li>
                Withdraw a consent you gave. For cookies that is the{' '}
                <CookieSettingsLink /> panel; for the newsletter it is the unsubscribe link. Withdrawing
                does not undo what was lawful before you withdrew.
              </li>
            </ul>
            <p>
              Email <a href="mailto:info@waheed.in">info@waheed.in</a> and we will respond within one
              month, in shā&rsquo; Allāh. We will not charge you or make you justify the request.
            </p>
            <p>
              If you are in the EU or the UK and you think we have got something wrong, you can
              complain to your national data protection authority. In the UK that is the{' '}
              <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener noreferrer">
                Information Commissioner&rsquo;s Office
              </a>
              ; elsewhere in the EU,{' '}
              <a
                href="https://www.edpb.europa.eu/about-edpb/about-edpb/members_en"
                target="_blank"
                rel="noopener noreferrer"
              >
                your country&rsquo;s supervisory authority
              </a>
              . We would rather you told us first, but you do not have to.
            </p>

            <h2>Children</h2>
            <p>
              This site is aimed at businesses and is not intended for children. We do not knowingly
              collect data from anyone under 16. If you believe we have, tell us and we will delete it.
            </p>

            <h2>Changes to this policy</h2>
            <p>
              When we change it we update the date at the top. If we add a service that receives your
              data, your stored cookie choice stops counting and you will be asked again, because
              consent to what was here is not consent to something new.
            </p>

            <h2>Contact</h2>
            <p>
              For any privacy question at all: <a href="mailto:info@waheed.in">info@waheed.in</a>
            </p>

          </div>

          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--rd-border)' }}>
            <StackButton href="/" tone="ghost">← Back to Home</StackButton>
          </div>
        </div>
      </section>
    </main>
  );
}
