/**
 * BsFaq — §7. Full-measure numbered rows, mark on the left.
 *
 * Still <details>/<summary> in a server component — that decision is not a
 * style choice, it is what puts the answers in the DOM for a crawler and gets
 * keyboard and screen-reader behaviour from the browser for free. What differs
 * from the default layout is the shape: full measure rather than a two-column
 * split, numbered, and the disclosure mark leads the row instead of trailing it,
 * so the questions read as a numbered sequence.
 *
 * The FAQPage JSON-LD is emitted by the route, so there is one ld+json per page.
 */
import type { ServicePage } from '@/content/services';

export default function BsFaq({ page }: { page: ServicePage }) {
  return (
    <section className="bs-faq" data-section-color="light">
      <div className="cnt">
        <header className="bs-faq-head">
          <p className="bs-eyebrow">Before you ask</p>
          <h2 className="bs-h2 bs-h2--tight">Straight answers.</h2>
        </header>

        <div className="bs-faq-list">
          {page.faq.map((f, i) => (
            <details key={f.q} className="bs-q">
              <summary>
                <span className="bs-q-mark" aria-hidden="true" />
                <span className="bs-q-n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <span className="bs-q-t">{f.q}</span>
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
