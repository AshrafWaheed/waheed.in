const ITEMS = [
  'Gambling or lottery platforms',
  'Interest-based financial products',
  'Haram entertainment & music content',
  'Brands built on manipulative tactics',
  'Alcohol & tobacco',
  'Adult content of any kind',
];

export default function RefusalPanel() {
  return (
    <section className="refusal">
      <div className="cnt">
        <div className="refusal-grid">

          {/* Left — headline */}
          <div>
            <span className="eyebrow-v2">A standard, not a disclaimer</span>
            <h2 className="refusal-h reveal">
              What we <em>will&nbsp;not</em> build.
            </h2>
            <p className="refusal-intro">
              Naming what we refuse is how we honour what we build.
            </p>
          </div>

          {/* Right — refusal list */}
          <div className="refusal-list">
            {ITEMS.map((item, i) => (
              <div
                key={item}
                className={`refusal-item reveal delay-${Math.min(Math.floor(i / 2) + 1, 4)}`}
              >
                <div className="refusal-x">✕</div>
                <p className="refusal-text">{item}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
