'use client';

import { useState, useEffect } from 'react';
import type { Variants, TargetAndTransition } from 'framer-motion';
import { AnimatePresence, motion } from 'framer-motion';

const btnHover: TargetAndTransition = { scale: 1.03 };
const btnTap: TargetAndTransition = { scale: 0.97 };

const COUNTRY_CODES = [
  { code: '+91', name: 'India' },
  { code: '+1', name: 'US / Canada' },
  { code: '+44', name: 'UK' },
  { code: '+971', name: 'UAE' },
  { code: '+966', name: 'Saudi Arabia' },
  { code: '+974', name: 'Qatar' },
  { code: '+965', name: 'Kuwait' },
  { code: '+968', name: 'Oman' },
  { code: '+973', name: 'Bahrain' },
  { code: '+92', name: 'Pakistan' },
  { code: '+880', name: 'Bangladesh' },
  { code: '+94', name: 'Sri Lanka' },
  { code: '+60', name: 'Malaysia' },
  { code: '+65', name: 'Singapore' },
  { code: '+62', name: 'Indonesia' },
  { code: '+63', name: 'Philippines' },
  { code: '+61', name: 'Australia' },
  { code: '+49', name: 'Germany' },
  { code: '+33', name: 'France' },
  { code: '+31', name: 'Netherlands' },
  { code: '+20', name: 'Egypt' },
  { code: '+27', name: 'South Africa' },
  { code: '+234', name: 'Nigeria' },
  { code: '+254', name: 'Kenya' },
  { code: '+255', name: 'Tanzania' },
];

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

// ── Floating background shapes ────────────────────────────────────────────────

type ShapeKind = 'circle' | 'square' | 'rect' | 'star';

interface ShapeCfg {
  kind: ShapeKind;
  x: number; y: number;   // position as % of viewport
  w: number; h: number;   // px dimensions
  color: string;
  opacity: number;
  floatY: number;         // float travel distance in px
  duration: number;
  delay: number;
  rotate: number;         // initial rotation
  filled: boolean;
}

const SHAPES: ShapeCfg[] = [
  // top band
  { kind: 'circle', x:  5, y:  4, w: 52, h: 52, color: '#E8C547', opacity: 0.10, floatY: 20, duration:  8, delay: 0.0, rotate:  0, filled: false },
  { kind: 'square', x: 22, y:  2, w: 26, h: 26, color: '#F5F0E8', opacity: 0.08, floatY: 14, duration:  7, delay: 0.6, rotate: 20, filled: true  },
  { kind: 'rect',   x: 38, y:  1, w: 56, h: 30, color: '#5a8a6a', opacity: 0.12, floatY: 12, duration: 10, delay: 1.8, rotate: -8, filled: false },
  { kind: 'star',   x: 68, y:  5, w: 36, h: 36, color: '#E8C547', opacity: 0.09, floatY: 18, duration:  9, delay: 1.0, rotate:  0, filled: true  },
  { kind: 'circle', x: 87, y:  3, w: 40, h: 40, color: '#F5F0E8', opacity: 0.07, floatY: 22, duration:  8, delay: 2.5, rotate:  0, filled: true  },
  // left band
  { kind: 'rect',   x:  1, y: 28, w: 48, h: 26, color: '#E8C547', opacity: 0.08, floatY: 16, duration: 11, delay: 1.2, rotate:  6, filled: false },
  { kind: 'star',   x:  6, y: 52, w: 30, h: 30, color: '#F5F0E8', opacity: 0.09, floatY: 20, duration:  7, delay: 2.8, rotate: 15, filled: false },
  { kind: 'square', x:  2, y: 76, w: 38, h: 38, color: '#E8C547', opacity: 0.07, floatY: 14, duration:  9, delay: 0.4, rotate: 32, filled: true  },
  { kind: 'circle', x: 14, y: 42, w: 20, h: 20, color: '#E8C547', opacity: 0.06, floatY: 10, duration:  8, delay: 4.0, rotate:  0, filled: true  },
  // right band
  { kind: 'circle', x: 86, y: 30, w: 46, h: 46, color: '#E8C547', opacity: 0.09, floatY: 18, duration:  8, delay: 1.6, rotate:  0, filled: false },
  { kind: 'star',   x: 78, y: 48, w: 24, h: 24, color: '#F5F0E8', opacity: 0.07, floatY: 12, duration:  7, delay: 2.2, rotate: 22, filled: false },
  { kind: 'square', x: 91, y: 62, w: 30, h: 30, color: '#F5F0E8', opacity: 0.08, floatY: 15, duration:  6, delay: 3.2, rotate: 45, filled: true  },
  { kind: 'rect',   x: 82, y: 74, w: 52, h: 28, color: '#5a8a6a', opacity: 0.10, floatY: 20, duration: 10, delay: 0.8, rotate: -5, filled: false },
  // bottom band
  { kind: 'star',   x: 12, y: 87, w: 38, h: 38, color: '#E8C547', opacity: 0.08, floatY: 12, duration:  9, delay: 2.0, rotate:  0, filled: true  },
  { kind: 'circle', x: 38, y: 91, w: 28, h: 28, color: '#F5F0E8', opacity: 0.07, floatY: 16, duration:  7, delay: 1.0, rotate:  0, filled: true  },
  { kind: 'rect',   x: 56, y: 88, w: 44, h: 24, color: '#E8C547', opacity: 0.09, floatY: 14, duration:  8, delay: 3.6, rotate:  5, filled: false },
  { kind: 'square', x: 74, y: 89, w: 32, h: 32, color: '#5a8a6a', opacity: 0.08, floatY: 18, duration: 11, delay: 1.4, rotate: 15, filled: true  },
  { kind: 'circle', x: 90, y: 86, w: 22, h: 22, color: '#E8C547', opacity: 0.07, floatY: 10, duration:  8, delay: 0.2, rotate:  0, filled: true  },
];

function shapeContent(cfg: ShapeCfg) {
  const c = cfg.color;
  const sw = 8;
  switch (cfg.kind) {
    case 'circle':
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none">
          {cfg.filled
            ? <circle cx="50" cy="50" r="48" fill={c} />
            : <circle cx="50" cy="50" r="44" stroke={c} strokeWidth={sw} />}
        </svg>
      );
    case 'square':
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none">
          {cfg.filled
            ? <rect x="2" y="2" width="96" height="96" fill={c} />
            : <rect x="4" y="4" width="92" height="92" stroke={c} strokeWidth={sw} />}
        </svg>
      );
    case 'rect':
      return (
        <svg viewBox="0 0 160 86" width="100%" height="100%" fill="none">
          {cfg.filled
            ? <rect x="2" y="2" width="156" height="82" fill={c} />
            : <rect x="4" y="4" width="152" height="78" stroke={c} strokeWidth={sw} />}
        </svg>
      );
    case 'star':
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none">
          {cfg.filled
            ? <polygon points="50,8 61,35 90,35 67,57 76,84 50,67 24,84 33,57 10,35 39,35" fill={c} />
            : <polygon points="50,8 61,35 90,35 67,57 76,84 50,67 24,84 33,57 10,35 39,35" stroke={c} strokeWidth="5" />}
        </svg>
      );
  }
}

function FloatingShape({ cfg }: { cfg: ShapeCfg }) {
  return (
    <motion.div
      style={{ position: 'absolute', left: `${cfg.x}%`, top: `${cfg.y}%`, width: cfg.w, height: cfg.h, opacity: cfg.opacity, pointerEvents: 'none' }}
      animate={{ y: [0, -cfg.floatY, 0], rotate: [cfg.rotate, cfg.rotate + 4, cfg.rotate] }}
      transition={{ duration: cfg.duration, repeat: Infinity, ease: 'easeInOut', delay: cfg.delay }}
    >
      {shapeContent(cfg)}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT, delay: i * 0.1 },
  }),
};

type FormState = { name: string; email: string; countryCode: string; phone: string; company: string };
type Status = 'idle' | 'loading' | 'success' | 'error';

export default function ComingSoonPage() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>({ name: '', email: '', countryCode: '+91', phone: '', company: '' });
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  function validate() {
    const e: { name?: string; email?: string } = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) {
      e.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      e.email = 'Enter a valid email address';
    }
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStatus('loading');
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() ? `${form.countryCode} ${form.phone.trim()}` : '',
          company: form.company.trim(),
        }),
      });
      if (res.ok) {
        setStatus('success');
      } else {
        const data = await res.json().catch(() => ({}));
        if (data.error === 'already_registered') {
          setStatus('success');
        } else {
          setStatus('error');
        }
      }
    } catch {
      setStatus('error');
    }
  }

  function closeModal() {
    setOpen(false);
    setTimeout(() => {
      setStatus('idle');
      setForm({ name: '', email: '', countryCode: '+91', phone: '', company: '' });
      setErrors({});
    }, 300);
  }

  return (
    <main
      className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#1A2E22' }}
    >
      {/* Floating geometric shapes */}
      {SHAPES.map((cfg, i) => <FloatingShape key={i} cfg={cfg} />)}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl w-full mx-auto">

        {/* Bismillah */}
        <motion.p
          custom={0} initial="hidden" animate="visible" variants={fadeUp}
          dir="rtl"
          style={{ fontFamily: 'var(--font-amiri)', fontSize: '1.5rem', color: '#F5F0E8', opacity: 0.45, marginBottom: '2rem', lineHeight: 1.8 }}
        >
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </motion.p>

        {/* Logo */}
        <motion.h1
          custom={1} initial="hidden" animate="visible" variants={fadeUp}
          style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(3.5rem, 12vw, 8rem)', fontWeight: 700, color: '#F5F0E8', lineHeight: 1, letterSpacing: '-0.01em', marginBottom: '1rem' }}
        >
          WAHEED
        </motion.h1>

        {/* Tagline */}
        <motion.p
          custom={2} initial="hidden" animate="visible" variants={fadeUp}
          style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.75rem', fontWeight: 500, color: '#E8C547', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '2.5rem' }}
        >
          India&apos;s First Halal Digital Studio
        </motion.p>

        {/* Divider */}
        <motion.div
          custom={3} initial="hidden" animate="visible" variants={fadeUp}
          style={{ width: '48px', height: '1px', background: '#E8C547', opacity: 0.35, marginBottom: '2.5rem' }}
        />

        {/* Coming soon */}
        <motion.p
          custom={4} initial="hidden" animate="visible" variants={fadeUp}
          style={{ fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', color: '#F5F0E8', lineHeight: 1.4, marginBottom: '1rem' }}
        >
          Something meaningful is coming.
        </motion.p>

        <motion.p
          custom={5} initial="hidden" animate="visible" variants={fadeUp}
          style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.9375rem', color: '#7A9080', lineHeight: 1.8, marginBottom: '3rem', maxWidth: '460px' }}
        >
          We&apos;re building a Shariah-aligned digital studio for Muslim-led brands —
          strategy, design, and digital products built with integrity.
        </motion.p>

        {/* CTA */}
        <motion.button
          custom={6} initial="hidden" animate="visible" variants={fadeUp}
          onClick={() => setOpen(true)}
          whileHover={btnHover}
          whileTap={btnTap}
          style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 600, fontSize: '0.9375rem', background: '#E8C547', color: '#1A2E22', border: 'none', borderRadius: '6px', padding: '14px 40px', cursor: 'pointer', letterSpacing: '0.03em', transition: 'background 0.2s' }}
        >
          Get Notified
        </motion.button>
      </div>

      {/* Registration popup */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ backgroundColor: 'rgba(10, 20, 14, 0.82)' }}
            onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
          >
            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
              style={{ background: '#F5F0E8', borderRadius: '16px', padding: '2.5rem 2rem', width: '100%', maxWidth: '460px', position: 'relative' }}
            >
              {/* Close button */}
              <button
                onClick={closeModal}
                aria-label="Close"
                style={{ position: 'absolute', top: '1rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#7A9080', fontSize: '1.125rem', lineHeight: 1, padding: '4px' }}
              >
                ✕
              </button>

              {status === 'success' ? (
                <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                  <p style={{ fontSize: '1.75rem', color: '#E8C547', marginBottom: '0.75rem' }}>✦</p>
                  <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.875rem', fontWeight: 700, color: '#2A4D38', marginBottom: '0.75rem' }}>
                    JazakAllahu Khayran!
                  </p>
                  <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.9375rem', color: '#7A9080', lineHeight: 1.6 }}>
                    We&apos;ll let you know the moment we launch.
                  </p>
                </div>
              ) : (
                <>
                  <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.875rem', fontWeight: 700, color: '#1A2E22', marginBottom: '0.375rem' }}>
                    Stay in the loop
                  </p>
                  <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.875rem', color: '#7A9080', marginBottom: '1.75rem', lineHeight: 1.5 }}>
                    Be the first to hear when we launch.
                  </p>

                  <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* Name */}
                    <div>
                      <label style={labelStyle}>
                        Full Name <span style={{ color: '#c0392b' }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        placeholder="Your name"
                        style={fieldStyle(!!errors.name)}
                      />
                      {errors.name && <p style={errStyle}>{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label style={labelStyle}>
                        Email Address <span style={{ color: '#c0392b' }}>*</span>
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        placeholder="you@example.com"
                        style={fieldStyle(!!errors.email)}
                      />
                      {errors.email && <p style={errStyle}>{errors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label style={labelStyle}>
                        Phone Number{' '}
                        <span style={{ color: '#7A9080', fontWeight: 400 }}>(optional)</span>
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <select
                          value={form.countryCode}
                          onChange={(e) => setForm((f) => ({ ...f, countryCode: e.target.value }))}
                          style={{ ...fieldStyle(false), width: '145px', flexShrink: 0, padding: '10px 8px' }}
                        >
                          {COUNTRY_CODES.map((c) => (
                            <option key={c.code + c.name} value={c.code}>
                              {c.code} — {c.name}
                            </option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                          placeholder="98765 43210"
                          style={{ ...fieldStyle(false), flex: 1 }}
                        />
                      </div>
                    </div>

                    {/* Company */}
                    <div>
                      <label style={labelStyle}>
                        Company / Brand{' '}
                        <span style={{ color: '#7A9080', fontWeight: 400 }}>(optional)</span>
                      </label>
                      <input
                        type="text"
                        value={form.company}
                        onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                        placeholder="Your business name"
                        style={fieldStyle(false)}
                      />
                    </div>

                    {status === 'error' && (
                      <p style={{ ...errStyle, marginTop: 0 }}>
                        Something went wrong. Please try again.
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      style={{
                        marginTop: '0.5rem',
                        fontFamily: 'var(--font-dm-sans)',
                        fontWeight: 600,
                        fontSize: '0.9375rem',
                        background: '#3D6B4F',
                        color: '#F5F0E8',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '14px',
                        cursor: status === 'loading' ? 'default' : 'pointer',
                        opacity: status === 'loading' ? 0.75 : 1,
                        transition: 'opacity 0.15s, background 0.15s',
                      }}
                    >
                      {status === 'loading' ? 'Sending...' : 'Notify Me'}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-dm-sans)',
  fontSize: '0.8125rem',
  fontWeight: 500,
  color: '#3d5245',
  marginBottom: '6px',
};

function fieldStyle(hasError: boolean): React.CSSProperties {
  return {
    width: '100%',
    fontFamily: 'var(--font-dm-sans)',
    fontSize: '0.9375rem',
    color: '#1A2E22',
    background: 'white',
    border: `1.5px solid ${hasError ? '#c0392b' : '#d5cfc4'}`,
    borderRadius: '8px',
    padding: '10px 14px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  };
}

const errStyle: React.CSSProperties = {
  fontFamily: 'var(--font-dm-sans)',
  fontSize: '0.75rem',
  color: '#c0392b',
  marginTop: '5px',
};
