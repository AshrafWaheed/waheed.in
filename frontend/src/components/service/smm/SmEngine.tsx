'use client';

/**
 * SmEngine — §3. The six parts as a horizontal accordion.
 *
 * Six panels side by side. Collapsed, a panel shows only its number and its
 * title set vertically; the open one expands and shows the body. It is the
 * fourth shape this slot has taken — grid (01), pinned rail (03), slabs (04) —
 * and the one that suits an ENGINE, because the parts are visibly one assembly
 * rather than six items on a shelf.
 *
 * Interaction rules, in order of who they are for:
 *   · pointer — hover opens, which is the fastest way to browse six things
 *   · keyboard — each panel is a real <button>, focus opens it, arrows are not
 *     hijacked; Tab through six panels is the expected behaviour here
 *   · touch — hover does not exist, so tap opens; the layout falls back to a
 *     plain vertical stack below 900px where six horizontal panels would be
 *     6 × 60px of unreadable vertical type
 *
 * One panel is always open (index 0 at rest), so the section is never a row of
 * closed doors with nothing to read.
 */
import { useState } from 'react';
import SplitReveal from '@/components/motion/SplitReveal';
import type { ServicePage } from '@/content/services';

type CSSVars = React.CSSProperties & Record<string, string | number>;
const v = (o: Record<string, string | number>): CSSVars => o as CSSVars;

export default function SmEngine({ page }: { page: ServicePage }) {
  const { eyebrow, heading, sub, items } = page.build;
  const [open, setOpen] = useState(0);

  return (
    <section className="sm-engine" data-section-color="dark">
      <div className="cnt">
        <header className="sm-head">
          <p className="sm-eyebrow">{eyebrow}</p>
          <h2 className="sm-h2 sm-h2--on-night">
            <SplitReveal text={heading} by="word" />
          </h2>
          <p className="sm-lede sm-lede--on-night reveal">{sub}</p>
        </header>

        <div className="sm-panels">
          {items.map((it, i) => (
            <div
              key={it.num}
              className={`sm-panel${i === open ? ' is-open' : ''}`}
              style={v({ '--k': i })}
              onMouseEnter={() => setOpen(i)}
            >
              <button
                type="button"
                className="sm-panel-tab"
                aria-expanded={i === open}
                onClick={() => setOpen(i)}
                onFocus={() => setOpen(i)}
              >
                <span className="sm-panel-n">{it.num}</span>
                <span className="sm-panel-t">{it.title}</span>
              </button>

              <div className="sm-panel-body" hidden={i !== open}>
                <h3 className="sm-panel-h">{it.title}</h3>
                <p>{it.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
