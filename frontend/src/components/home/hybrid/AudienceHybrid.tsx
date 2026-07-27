'use client';

import { useState } from 'react';
import SplitReveal from '@/components/motion/SplitReveal';
import AudienceGlyph from '@/components/graphics/AudienceGlyph';
import { audience } from '@/content/home';

export default function AudienceHybrid() {
  const [active, setActive] = useState(0);
  const { eyebrow, heading, items } = audience;

  return (
    <section className="hy-aud" data-section-color="light">
      <div className="cnt">
        <div className="hy-aud-head">
          <span className="hy-aud-eyebrow">{eyebrow}</span>
          <h2 className="hy-aud-h">
            <SplitReveal text={heading.lead} by="word" />{' '}
            <em>
              <SplitReveal text={heading.em!} by="word" />
            </em>
          </h2>
        </div>

        <div className="hy-aud-list">
          {items.map((item, i) => (
            <div
              key={item.num}
              className={`hy-aud-row${active === i ? ' open' : ''}`}
              onMouseEnter={() => setActive(i)}
              onClick={() => setActive(i)}
              data-cursor
            >
              <div className="hy-aud-row-head">
                <span className="hy-aud-num">{item.num}</span>
                <span className="hy-aud-title">{item.title}</span>
                <span className="hy-aud-glyph"><AudienceGlyph i={i} /></span>
              </div>
              <div className="hy-aud-body">
                <div className="hy-aud-body-inner">
                  <p>{item.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
