import { Fragment } from 'react';

const ITEMS = [
  'Delivered with Ihsan',
  'Human Customer Care',
  'Long-Term Impact',
  '100% Shariah-Compliant',
];

// Repeat the base items so a single group is wider than any viewport —
// that's what makes the 2-group translateX(-50%) loop perfectly seamless.
const GROUP = Array.from({ length: 3 }, () => ITEMS).flat();

function StarSep() {
  return (
    <svg
      className="trust-star"
      width="10" height="10"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 1.5 13.6 9 21 7.4 15.5 12.5 21 17.6 13.6 16 12 23.5 10.4 16 3 17.6 8.5 12.5 3 7.4 10.4 9z" />
    </svg>
  );
}

function TrackGroup({ hidden }: { hidden?: boolean }) {
  return (
    <div className="trust-group" aria-hidden={hidden}>
      {GROUP.map((item, i) => (
        <Fragment key={i}>
          <span className="trust-item">{item}</span>
          <StarSep />
        </Fragment>
      ))}
    </div>
  );
}

export default function TrustStrip() {
  return (
    <div className="trust-strip">
      <div className="trust-track">
        <TrackGroup />
        <TrackGroup hidden />
      </div>
    </div>
  );
}
