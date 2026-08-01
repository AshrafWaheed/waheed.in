/**
 * ServiceFaq — §7. Four objections, answered before the call.
 *
 * Built on <details>/<summary>, so it is a server component with no state and
 * no JavaScript: keyboard and screen-reader behaviour come from the browser,
 * and the answers are in the DOM whether or not React ever hydrates — which is
 * what makes them worth anything to a crawler.
 *
 * The matching FAQPage JSON-LD is emitted by the route, not here, so there is
 * exactly one <script type="application/ld+json"> per page.
 */
import type { ServicePage } from '@/content/services';

export default function ServiceFaq({ page }: { page: ServicePage }) {
  return (
    <section className="sd-faq" data-section-color="light">
      <div className="cnt sd-faq-grid">
        <div className="sd-faq-lead">
          <p className="ab-pill">Before you ask</p>
          <h2 className="sd-h2">Straight answers.</h2>
        </div>

        <div className="sd-faq-list">
          {page.faq.map((f) => (
            <details key={f.q} className="sd-q">
              <summary>
                <span>{f.q}</span>
                <span className="sd-q-mark" aria-hidden="true" />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
