'use client';

/**
 * FeedColumns — two columns of post cards drifting past each other.
 *
 * The /services/social-media-marketing hero object. The other four service
 * heroes are all STILL — an artifact card, a rosette, a chart drawn once — and
 * this one is the only craft whose subject is a thing that never stops moving,
 * so the hero moves.
 *
 * Two columns travelling in opposite directions is what makes it read as a feed
 * rather than as a carousel: opposing motion has no single direction to follow,
 * which is exactly the experience being described.
 *
 * The cards are abstract on purpose — blocks, lines and a chip, no invented
 * captions and no fake handles. Putting plausible-looking posts from imaginary
 * brands in a hero is the kind of detail that reads as a real client until
 * someone asks who it is.
 *
 * The track is duplicated once and translated by exactly -50%, which is what
 * makes the loop seamless; `aria-hidden` because there is nothing here to read.
 */

type CSSVars = React.CSSProperties & Record<string, string | number>;
const v = (o: Record<string, string | number>): CSSVars => o as CSSVars;

/** Deterministic 0..1 from an index — no Math.random, so SSR and client agree. */
function h(i: number, salt: number): number {
  const x = Math.sin(i * 91.7 + salt * 41.3) * 9137.71;
  return x - Math.floor(x);
}

function Card({ i }: { i: number }) {
  const tall = h(i, 1) > 0.55;
  const lines = 2 + Math.round(h(i, 2) * 2);
  return (
    <div className={`fc-card${tall ? ' is-tall' : ''}`}>
      <div className="fc-media">
        <span className="fc-chip" />
      </div>
      <div className="fc-lines">
        {Array.from({ length: lines }, (_, n) => (
          <span key={n} className="fc-line" style={v({ '--w': `${52 + h(i * 7 + n, 3) * 44}%` })} />
        ))}
      </div>
      <div className="fc-meta">
        <span className="fc-dot" />
        <span className="fc-line" style={v({ '--w': '38%' })} />
      </div>
    </div>
  );
}

export default function FeedColumns({ className }: { className?: string }) {
  const col = (from: number) => Array.from({ length: 5 }, (_, n) => from + n);

  return (
    <div className={`fc ${className ?? ''}`} aria-hidden="true">
      <div className="fc-col">
        <div className="fc-track fc-track--up">
          {[0, 1].map((dup) => (
            <div className="fc-group" key={dup}>
              {col(0).map((i) => <Card key={`${dup}-${i}`} i={i} />)}
            </div>
          ))}
        </div>
      </div>
      <div className="fc-col fc-col--2">
        <div className="fc-track fc-track--down">
          {[0, 1].map((dup) => (
            <div className="fc-group" key={dup}>
              {col(20).map((i) => <Card key={`${dup}-${i}`} i={i} />)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
