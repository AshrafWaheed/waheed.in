export default function HomeMarquee() {
  const items = [
    'Shariah-Compliant', 'Transparent Pricing', 'Muslim-Led Studio',
    'Long-Term Growth', 'Ihsan in Every Detail', 'No Dark Patterns',
  ];

  return (
    <div
      className="bg-[var(--cream-dark)] py-4 overflow-hidden"
      style={{ borderTop: '1px solid rgba(26,46,34,0.08)', borderBottom: '1px solid rgba(26,46,34,0.08)' }}
    >
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .marquee-track { animation: marquee 30s linear infinite; }
        .marquee-track:hover { animation-play-state: paused; }
      `}</style>
      <div className="marquee-track flex whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="inline-flex items-center gap-3 px-6 font-[var(--font-dm-sans)] text-xs uppercase tracking-widest text-[var(--text-mid)]">
            <span className="text-[var(--yellow)] text-base">✦</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
