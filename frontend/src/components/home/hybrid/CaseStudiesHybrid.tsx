'use client';

/**
 * CaseStudiesHybrid — the proof band, sitting between the packages you can buy
 * and the process that delivers them.
 *
 * Placement is the argument: ServicesHybrid has just told the visitor what we
 * sell, which is the moment the question changes from "what do they do" to
 * "have they done it". So this answers with one project documented properly
 * rather than a logo wall, which is what a studio with one strong case study
 * should show instead of pretending to have twelve.
 *
 * Motion follows the house pattern (ServicesHybrid, BrandLockup): a shared
 * scroll progress MotionValue scrubbed through ScrubReveal, so the reveal
 * tracks scroll position and reverses on the way back up rather than firing
 * once. Reduced motion pins progress to 1 inside useScrollProgress, so nothing
 * here needs its own guard.
 */

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import ScrubReveal from '@/components/motion/ScrubReveal';
import { useScrollProgress } from '@/components/motion/useScrollProgress';
import CaseStudyModal from './CaseStudyModal';
import { caseStudies, caseStudiesIntro, type CaseStudy } from '@/content/case-studies';

export default function CaseStudiesHybrid() {
  const headRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<CaseStudy | null>(null);
  // Remembered so focus can go back where it came from when the dialog closes.
  const triggerRef = useRef<HTMLElement | null>(null);

  const pHead = useScrollProgress(headRef);
  const pBody = useScrollProgress(bodyRef, { startVh: 0.95, endVh: 0.5 });
  const headY = useTransform(pHead, [0, 0.8], [40, 0], { clamp: true });
  const headO = useTransform(pHead, [0, 0.55], [0, 1], { clamp: true });

  function openStudy(study: CaseStudy, el: HTMLElement | null) {
    triggerRef.current = el;
    setOpen(study);
  }

  function closeStudy() {
    setOpen(null);
    // Returning focus matters more than usual here: the card sits deep in a
    // long page, and a keyboard user who lost focus to <body> would be sent
    // back to the top of the document on the next Tab.
    triggerRef.current?.focus();
  }

  return (
    <section className="cs" data-section-color="dark" id="work">
      <div className="cnt">
        <motion.div className="cs-head" ref={headRef} style={{ y: headY, opacity: headO }}>
          <span className="cs-eyebrow">{caseStudiesIntro.eyebrow}</span>
          <h2 className="cs-h">{caseStudiesIntro.heading}</h2>
          <p className="cs-sub">{caseStudiesIntro.sub}</p>
        </motion.div>

        <div className="cs-body" ref={bodyRef}>
          {caseStudies.map((study, i) => (
            <ScrubReveal
              key={study.slug}
              progress={pBody}
              from={i * 0.12}
              to={0.65 + i * 0.12}
              y={48}
              className="cs-card-wrap"
            >
              {/*
                The whole card is a click target for a pointer, but the accessible
                affordance is the real <button> inside it. The button carries no
                handler of its own: a keyboard Enter fires a click that bubbles to
                the article, so both routes run exactly one handler.
              */}
              <article
                className="cs-card"
                onClick={(e) =>
                  openStudy(study, e.currentTarget.querySelector('button'))
                }
              >
                <div className="cs-media">
                  <Image
                    src={study.cover.src}
                    alt={study.cover.alt}
                    width={1200}
                    height={1553}
                    className="cs-media-img"
                    sizes="(max-width: 900px) 92vw, 520px"
                  />
                  <span className="cs-media-veil" aria-hidden="true" />
                </div>

                <div className="cs-content">
                  <span className="cs-client">{study.client}</span>
                  <h3 className="cs-tagline">{study.tagline}</h3>
                  <p className="cs-blurb">{study.blurb}</p>

                  <ul className="cs-services">
                    {study.services.map((s) => <li key={s}>{s}</li>)}
                  </ul>

                  <dl className="cs-stats">
                    {study.stats.map((s) => (
                      <div className="cs-stat" key={s.label}>
                        <dt className="cs-stat-n">{s.value}</dt>
                        <dd className="cs-stat-l">{s.label}</dd>
                      </div>
                    ))}
                  </dl>

                  <button type="button" className="cs-open">
                    <span>Read the case study</span>
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </button>
                </div>
              </article>
            </ScrubReveal>
          ))}
        </div>
      </div>

      {open && <CaseStudyModal study={open} onClose={closeStudy} />}
    </section>
  );
}
