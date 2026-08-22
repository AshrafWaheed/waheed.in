import type { Metadata } from 'next';
import Link from 'next/link';
import StackButton from '@/components/ui/StackButton';
import CookieSettingsLink from '@/components/consent/CookieSettingsLink';
import { PURPOSES } from '@/lib/consent';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Cookie Policy · WAHEED',
  description:
    'Every cookie this site can set, what it does, how long it lasts, and how to turn it off.',
  path: '/cookies',
});

const LAST_UPDATED = '22 August 2026';

/**
 * The cookie policy.
 *
 * The table is generated from the register in src/lib/consent.ts rather than
 * typed out here, and that is the whole point of the file. A hand-written
 * cookie table is accurate on the day it is published and wrong the first time
 * anyone adds a script; this one cannot describe a cookie the site does not
 * set, or miss one it does, because the same array decides what loads.
 */
export default function CookiesPage() {
  return (
    <main>
      <div className="page-hero" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
        <div className="cnt">
          <span className="lbl">Legal</span>
          <h1 style={{ fontSize: 'clamp(2rem,3.5vw,3rem)' }}>Cookie Policy</h1>
          <p>Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      <section className="sec" style={{ background: 'var(--rd-white)' }}>
        <div className="cnt" style={{ maxWidth: 760 }}>
          <div className="legal-body">

            <h2>The short version</h2>
            <p>
              Two cookies are needed for this site to work at all. Everything else is optional,
              nothing optional loads until you say yes, and saying no is a complete answer that we
              will not ask you to reconsider on your next visit.
            </p>
            <p>
              We do not run advertising cookies, we do not sell or share your data with data
              brokers, and there is no third-party ad network anywhere on this site.
            </p>

            <div className="ck-choice-box">
              <p>Change your mind at any time. This is the same panel as the banner.</p>
              <CookieSettingsLink className="ck-btn ck-btn-yes" />
            </div>

            <h2>Why you get asked</h2>
            <p>
              Under the EU ePrivacy rules and the GDPR, anything stored on or read from your device
              that is not strictly necessary needs your permission first. Not permission afterwards,
              and not permission assumed from you continuing to scroll. So the optional scripts on
              this site are not merely told to behave until you agree, they are not sent to your
              browser at all. If you refuse, or simply never answer, the requests to Google,
              Microsoft and Ahrefs never happen.
            </p>
            <p>
              If your browser sends a{' '}
              <a
                href="https://globalprivacycontrol.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Global Privacy Control
              </a>{' '}
              signal, we take that as a no and do not show you the banner. You can still opt in
              deliberately using the button above, and that choice will override the signal.
            </p>

            <h2>What can be set</h2>

            {PURPOSES.map((p) => (
              <section key={p.id} className="ck-doc-group">
                <h3 className="ck-doc-h">
                  {p.title}
                  <span className="ck-doc-tag">{p.locked ? 'No choice needed' : 'Your choice'}</span>
                </h3>
                <p>{p.detail}</p>

                {p.vendors.length > 0 && (
                  <ul>
                    {p.vendors.map((v) => (
                      <li key={v.name}>
                        <strong>{v.name}</strong> — {v.role} Data goes to {v.transfer}{' '}
                        <a href={v.policy} target="_blank" rel="noopener noreferrer">
                          Their privacy notice
                        </a>
                        .
                      </li>
                    ))}
                  </ul>
                )}

                <div className="ck-table-wrap">
                  <table className="ck-table">
                    <thead>
                      <tr>
                        <th>Cookie</th>
                        <th>Set by</th>
                        <th>Lasts</th>
                        <th>What it does</th>
                      </tr>
                    </thead>
                    <tbody>
                      {p.cookies.map((c) => (
                        <tr key={c.name}>
                          <td><code>{c.name}</code></td>
                          <td>
                            {c.domain}
                            <span className="ck-party">
                              {c.party === 'first' ? 'first party' : 'third party'}
                            </span>
                          </td>
                          <td>{c.ttl}</td>
                          <td>{c.purpose}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}

            <h2>What happens when you switch something off</h2>
            <p>
              We delete the first-party cookies for that purpose immediately and reload the page so
              the script is no longer running in it. Cookies set on someone else&rsquo;s domain are a
              different matter: we can stop sending you to Microsoft, but only Microsoft or your
              browser can delete a cookie on <code>clarity.ms</code>. To clear those, use{' '}
              <a
                href="https://privacy.microsoft.com/privacystatement"
                target="_blank"
                rel="noopener noreferrer"
              >
                Microsoft&rsquo;s privacy dashboard
              </a>{' '}
              or your browser&rsquo;s site-data settings.
            </p>
            <p>
              You can also refuse everything at the browser level, before any site gets a say.
              Google offers a{' '}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Analytics opt-out add-on
              </a>{' '}
              that works across every site you visit.
            </p>

            <h2>How long your answer is kept</h2>
            <p>
              Your choice is stored for 180 days and then we ask again. If we ever add a service
              that is not listed above, your stored answer stops counting and the banner returns,
              because consent to the things on this page is not consent to something new.
            </p>

            <h2>Questions</h2>
            <p>
              Anything at all: <a href="mailto:info@waheed.in">info@waheed.in</a>. Our{' '}
              <Link href="/privacy">privacy policy</Link> covers what happens to information you
              send us deliberately, such as a contact form.
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
