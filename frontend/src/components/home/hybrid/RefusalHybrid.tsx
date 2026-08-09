'use client';

/**
 * RefusalHybrid — "What We Will Not Build", reskinned to the Figma redesign.
 *
 * Left: heading + a one-line sub with "honour" underlined gold. Right: the six
 * refusals as a 2×3 grid of solid gold tiles (dark text on gold). Copy is
 * `refusal` in content/home.ts — `title`/`sub`/`subUnderline` are the redesign's
 * fields; the old `heading`/`intro` stay in content for unmounted variants.
 */
import SplitReveal from '@/components/motion/SplitReveal';
import { refusal } from '@/content/home';

/** Underline the one phrase in the sub. */
function Sub({ text, underline }: { text: string; underline: string }) {
  const i = text.indexOf(underline);
  if (i === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span className="rf-uline">{underline}</span>
      {text.slice(i + underline.length)}
    </>
  );
}

export default function RefusalHybrid() {
  const { title, sub, subUnderline, items } = refusal;

  return (
    <section className="rf" data-section-color="dark">
      <div className="cnt rf-grid">
        <div className="rf-left">
          <h2 className="rf-h">
            <SplitReveal text={title} by="word" />
          </h2>
          <p className="rf-sub">
            <Sub text={sub} underline={subUnderline} />
          </p>
        </div>

        <ul className="rf-tiles">
          {items.map((item) => (
            <li key={item} className="rf-tile">{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
