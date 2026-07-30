'use client';

/**
 * FaqBody — §2, the 28 questions.
 *
 * The old layout put the category filter in a row of chips at the very top of an
 * 820px centred column, then ran 4,000px of accordion beneath it. Two problems:
 * the filter scrolled out of reach after the first screenful, so it was only
 * usable in the three seconds before you started reading; and an 820px column
 * centred at 1440 left ~300px of dead margin on both sides while the questions
 * themselves were set at 0.95rem.
 *
 * Rebuilt as a two-column with the filter as a STICKY vertical rail. It stays
 * reachable the whole way down, which is the only state in which a filter on a
 * page this long is worth having, and it doubles as a position indicator. The
 * questions get the reclaimed width and a real type size.
 *
 * Filter/accordion behaviour is unchanged from the old component: single-open
 * accordion, filtering resets the open item, and `activeCats` still drops empty
 * categories so a filter can never render a bare header. Roles and aria-expanded
 * are preserved.
 *
 * The bodies open with grid-template-rows 0fr→1fr rather than max-height, so the
 * transition is to the content's real height with no magic number — same
 * mechanism as the homepage audience list.
 */
import { useState } from 'react';
import Khatam from '@/components/graphics/Khatam';
import { FAQS, FILTERS, CAT_LABELS, type Category } from '@/app/faq/faqData';

const ORDER = ['General', 'Website & App', 'Social Media', 'Payment'] as const;

export default function FaqBody() {
  const [filter, setFilter] = useState<Category>('All');
  const [openId, setOpenId] = useState<string | null>(null);

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  const activeCats = (filter === 'All' ? ORDER : ([filter] as const)).filter((cat) =>
    FAQS.some((f) => f.cat === cat),
  );

  return (
    <section className="fq-body" data-section-color="light">
      <div className="cnt fq-grid">
        {/* ── sticky filter rail ───────────────────────────────────── */}
        <aside className="fq-rail">
          <div className="fq-rail-in" role="tablist" aria-label="FAQ categories">
            {FILTERS.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={filter === cat}
                className={`fq-tab${filter === cat ? ' is-on' : ''}`}
                onClick={() => { setFilter(cat); setOpenId(null); }}
                data-cursor
              >
                <span className="fq-tab-dot" aria-hidden="true" />
                {cat}
              </button>
            ))}
          </div>
        </aside>

        {/* ── questions ────────────────────────────────────────────── */}
        <div className="fq-list">
          {activeCats.map((cat) => {
            const items = FAQS.filter((f) => f.cat === cat);
            return (
              <section key={cat} className="fq-cat">
                <h2 className="fq-cat-label">
                  <Khatam size={12} inner={0.5} stroke="var(--rd-gold)" strokeWidth={1.6} />
                  {CAT_LABELS[cat]}
                </h2>

                <div className="fq-acc">
                  {items.map((item) => {
                    const id = `${cat}::${item.q}`;
                    const open = openId === id;
                    return (
                      <div key={id} className={`fq-item${open ? ' is-open' : ''}`}>
                        <button
                          className="fq-q"
                          type="button"
                          aria-expanded={open}
                          onClick={() => toggle(id)}
                          data-cursor
                        >
                          <span className="fq-q-text">{item.q}</span>
                          <span className="fq-plus" aria-hidden="true" />
                        </button>
                        <div className="fq-a">
                          <div className="fq-a-in">
                            <p>{item.a}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}
