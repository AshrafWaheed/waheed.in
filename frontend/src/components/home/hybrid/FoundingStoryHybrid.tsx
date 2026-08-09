'use client';

/**
 * FoundingStoryHybrid — the "Our Founding Story" teaser from the Figma redesign.
 *
 * A dark two-column band: heading + two paragraphs + a "Learn more" StackButton
 * on the left, a portrait placeholder on the right. It is a teaser only; the
 * full story is on /about, where the button points. Copy is `founding` in
 * content/home.ts. The image is a branded placeholder until a real portrait is
 * supplied — drop an <img> into `.fs-media` (or wire a content field) to swap it.
 */
import SplitReveal from '@/components/motion/SplitReveal';
import StackButton from '@/components/ui/StackButton';
import Khatam from '@/components/graphics/Khatam';
import { founding } from '@/content/home';

/** Render a paragraph, underlining the one phrase if present in it. */
function Para({ text, underline }: { text: string; underline?: string }) {
  if (!underline) return <>{text}</>;
  const i = text.indexOf(underline);
  if (i === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span className="fs-uline">{underline}</span>
      {text.slice(i + underline.length)}
    </>
  );
}

export default function FoundingStoryHybrid() {
  const { heading, paras, underline, cta } = founding;

  return (
    <section className="fs" data-section-color="dark">
      <div className="cnt fs-grid">
        <div className="fs-copy">
          <h2 className="fs-h">
            <SplitReveal text={heading} by="word" />
          </h2>

          {paras.map((p, i) => (
            <p key={i} className="fs-p">
              <Para text={p} underline={i === 0 ? underline : undefined} />
            </p>
          ))}

          <div className="fs-cta">
            <StackButton href={cta.href}>{cta.label}</StackButton>
          </div>
        </div>

        {/* Placeholder portrait. Branded (a faint khatam on a soft panel) rather
            than flat grey, so it reads as intentional on the dark ground until a
            real image lands here. */}
        <div className="fs-media" role="img" aria-label="Portrait of the Waheed founders — coming soon">
          <Khatam size={150} inner={0.5} stroke="rgba(37,72,81,.16)" strokeWidth={1.4} className="fs-media-mark" />
        </div>
      </div>
    </section>
  );
}
