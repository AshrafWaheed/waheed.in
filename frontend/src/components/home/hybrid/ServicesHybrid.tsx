'use client';

/**
 * ServicesHybrid — "Growth System Packages", rebuilt to the Figma redesign.
 *
 * Three checklist cards on a light section: two teal tiers flanking a raised,
 * darker "Foundation Engagements" card wearing a gold "For best results" tab.
 * Every inclusion is a gold ✦ + a line of copy; each card closes with a
 * "Contact us" StackButton. Copy is `growthPackages` in content/home.ts.
 *
 * The older paragraph-card version (and the `services` content it read) is gone
 * from here but kept in content for the unmounted Services.tsx variant.
 */
import SplitReveal from '@/components/motion/SplitReveal';
import Spotlight from '@/components/motion/Spotlight';
import StackButton from '@/components/ui/StackButton';
import { growthPackages } from '@/content/home';

/** The inclusion bullet — a four-point gold spark, matching the Figma. */
function Spark() {
  return (
    <svg className="gp-spark" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0 C8.6 4 12 7.4 16 8 C12 8.6 8.6 12 8 16 C7.4 12 4 8.6 0 8 C4 7.4 7.4 4 8 0 Z" />
    </svg>
  );
}

/** Wrap the one underlined phrase in the sub. */
function Sub({ text, underline }: { text: string; underline: string }) {
  const i = text.indexOf(underline);
  if (i === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span className="gp-uline">{underline}</span>
      {text.slice(i + underline.length)}
    </>
  );
}

export default function ServicesHybrid() {
  const { heading, sub, subUnderline, footnote, cta, cards } = growthPackages;

  return (
    <section className="gp" data-section-color="light">
      <div className="cnt">
        <div className="gp-head">
          <h2 className="gp-h">
            <SplitReveal text={heading} by="word" />
          </h2>
          <p className="gp-sub">
            <Sub text={sub} underline={subUnderline} />
          </p>
        </div>

        <div className="gp-grid">
          {cards.map((card) => (
            <Spotlight
              key={card.title}
              className={`gp-card-wrap${card.featured ? ' featured' : ''}`}
            >
              <article className={`gp-card${card.featured ? ' featured' : ''}`} data-cursor>
                {'badge' in card && card.badge && <span className="gp-badge">{card.badge}</span>}

                <h3 className="gp-title">{card.title}</h3>

                <ul className="gp-list">
                  {card.items.map((item) => (
                    <li key={item} className="gp-item">
                      <Spark />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {'note' in card && card.note && <p className="gp-note">{card.note}</p>}

                <div className="gp-cta">
                  <StackButton href={cta.href} size="sm">{cta.label}</StackButton>
                </div>
              </article>
            </Spotlight>
          ))}
        </div>

        <p className="gp-foot">{footnote}</p>
      </div>
    </section>
  );
}
