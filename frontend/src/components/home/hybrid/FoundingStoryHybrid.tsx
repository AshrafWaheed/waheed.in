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
import { useRef } from 'react';
import { motion, useTransform } from 'framer-motion';
import { useScrollProgress } from '@/components/motion/useScrollProgress';
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
  const ref = useRef<HTMLDivElement>(null);
  // Scroll-scrubbed: the copy slides in from the left, the portrait from the
  // right, both advancing with scroll position through the section.
  const p = useScrollProgress(ref);
  const copyX = useTransform(p, [0, 0.85], [-64, 0], { clamp: true });
  const mediaX = useTransform(p, [0, 0.85], [64, 0], { clamp: true });
  const copyO = useTransform(p, [0, 0.55], [0, 1], { clamp: true });
  const mediaO = useTransform(p, [0, 0.55], [0, 1], { clamp: true });

  return (
    <section className="fs" data-section-color="dark">
      <div className="cnt fs-grid" ref={ref}>
        <motion.div className="fs-copy" style={{ x: copyX, opacity: copyO }}>
          <h2 className="fs-h">{heading}</h2>

          {paras.map((para, i) => (
            <p key={i} className="fs-p">
              <Para text={para} underline={i === 0 ? underline : undefined} />
            </p>
          ))}

          <div className="fs-cta">
            <StackButton href={cta.href}>{cta.label}</StackButton>
          </div>
        </motion.div>

        {/* Placeholder portrait. Branded (a faint khatam on a soft panel) rather
            than flat grey, so it reads as intentional on the dark ground until a
            real image lands here. */}
        <motion.div className="fs-media" style={{ x: mediaX, opacity: mediaO }} role="img" aria-label="Portrait of the Waheed founders — coming soon">
          <Khatam size={150} inner={0.5} stroke="rgba(37,72,81,.16)" strokeWidth={1.4} className="fs-media-mark" />
        </motion.div>
      </div>
    </section>
  );
}
