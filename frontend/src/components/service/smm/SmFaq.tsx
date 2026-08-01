/**
 * SmFaq — §7. Everything open, nothing to click.
 *
 * The other three shapes this slot has taken are all accordions. This one is
 * not: four questions, all answers visible, question set in the mono label tier
 * above an answer set large enough to be the section's main text.
 *
 * That is a deliberate choice for THIS page's questions. Three of the four are
 * objections a buyer is embarrassed to ask out loud — do we have to be on
 * camera, how do you handle our production constraints, can you guarantee
 * growth — and an answer behind a disclosure triangle is an answer the reader
 * has to admit to wanting. Open, they are simply read.
 *
 * Still a server component, so the content is in the DOM either way.
 */
import type { ServicePage } from '@/content/services';

export default function SmFaq({ page }: { page: ServicePage }) {
  return (
    <section className="sm-faq" data-section-color="light">
      <div className="cnt">
        <header className="sm-faq-head">
          <p className="sm-eyebrow">Before you ask</p>
          <h2 className="sm-h2 sm-h2--tight">Straight answers.</h2>
        </header>

        <dl className="sm-qa">
          {page.faq.map((f) => (
            <div key={f.q} className="sm-qa-row reveal">
              <dt>{f.q}</dt>
              <dd>{f.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
