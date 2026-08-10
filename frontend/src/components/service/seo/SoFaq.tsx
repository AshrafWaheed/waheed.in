/**
 * SoFaq — §7. Two columns of accordions side by side.
 *
 * Third shape again: page 01 splits a heading column off a single list, page 03
 * runs full-measure numbered rows, this one is a two-up grid. Still
 * <details>/<summary> in a server component — that part is not a style choice.
 * It puts the answers in the DOM for a crawler whether or not React hydrates,
 * and gets keyboard and screen-reader behaviour from the browser rather than
 * from us reimplementing it.
 *
 * On an SEO page in particular, an FAQ that a crawler cannot read would be an
 * unusually poor advertisement.
 */
import type { ServicePage } from '@/content/services';

export default function SoFaq({ page }: { page: ServicePage }) {
  return (
    <section className="so-faq" data-section-color="light">
      <div className="cnt">
        <header className="so-faq-head">
          <h2 className="so-h2 so-h2--tight">Questions, answered.</h2>
        </header>

        <div className="so-faq-grid">
          {page.faq.map((f) => (
            <details key={f.q} className="so-q">
              <summary>
                <span className="so-q-t">{f.q}</span>
                <span className="so-q-mark" aria-hidden="true" />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
