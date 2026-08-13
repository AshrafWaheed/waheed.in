'use client';

/**
 * /contact — rebuilt to homepage standard.
 *
 * IMPORTANT: this redesign is PRESENTATIONAL ONLY. Every piece of behaviour below
 * — field names, the validator, the /api/contact payload shape, the custom-service
 * expander, the success state — is unchanged, because this form is live and wired
 * through to HubSpot. What changed is the shell: a real hero, a sticky aside, and
 * `.ct-*` classes for the form chrome.
 *
 * The form's labels, options, placeholders and error strings stay inline here
 * rather than moving to content/contact.ts, since they are welded to the field
 * names and the validation rules and belong next to them. Only the hero and aside
 * copy was extracted.
 *
 * On success the form no longer shows a thank-you card: it hands off to the
 * /book calendar, prefilled with email/brand/phone (same as the homepage form),
 * so the application flows straight into picking a call time.
 */
import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import SmoothScroll from '@/components/motion/SmoothScroll';
import SectionNav from '@/components/motion/useSectionNav';
import ContactHero from '@/components/contact/ContactHero';
import StackButton from '@/components/ui/StackButton';
import Khatam from '@/components/graphics/Khatam';
import { contactAside } from '@/content/contact';

const SERVICES = [
  'Halal Brand Audit',
  'Foundations Engagement',
  'The Authority System',
  'Halal Brand OS',
  'Halal Brand Partnership',
  'Not Sure Yet, Need Guidance',
  'Custom',
] as const;

const CUSTOM_OPTS = [
  'Website & App Design / Development',
  'Custom Software Development',
  'Brand Strategy',
  'SEO',
  'Social Media Marketing',
  'Conversion Copywriting',
] as const;

const STAGES   = ['Idea stage', 'Pre-launch', '0–1 year', '1–3 years', 'Established (3+ years)'];
const BUDGETS  = ['Under $1,000', '$1,000–$3,000', '$3,000–$5,000', '$5,000+', 'Not sure, open to proposal'];
const TIMELINE = ['Immediately', 'Within 1 month', '1–3 months', 'Just exploring'];

interface FormData {
  name:      string;
  brand:     string;
  email:     string;
  phone:     string;
  location:  string;
  service:   string;
  stage:     string;
  budget:    string;
  message:   string;
  timeline:  string;
  consent:   boolean;
}

const EMPTY: FormData = {
  name: '', brand: '', email: '', phone: '', location: '',
  service: '', stage: '', budget: '', message: '', timeline: '', consent: false,
};

type FieldErrors = Partial<Record<keyof FormData | 'customServices', string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d\s().-]+$/;

export default function ContactPage() {
  const router = useRouter();
  const [form,           setForm]           = useState<FormData>(EMPTY);
  const [customServices, setCustomServices] = useState<string[]>([]);
  const [customSaved,    setCustomSaved]    = useState(false);
  const [submitting,     setSubmitting]     = useState(false);
  const [error,          setError]          = useState('');
  const [fieldErrors,    setFieldErrors]    = useState<FieldErrors>({});

  function clearError(key: keyof FieldErrors) {
    setFieldErrors(prev => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function field(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, type } = e.target;
    const value = type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm(prev => ({ ...prev, [name]: value }));
    clearError(name as keyof FieldErrors);
    if (name === 'service') { setCustomSaved(false); setCustomServices([]); clearError('customServices'); }
  }

  function toggleCustom(opt: string) {
    setCustomServices(prev =>
      prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]
    );
    setCustomSaved(false);
    clearError('customServices');
  }

  function validate(): FieldErrors {
    const e: FieldErrors = {};
    if (form.name.trim().length < 2) e.name = 'Please enter your name.';
    if (form.brand.trim().length < 2) e.brand = 'Please enter your organisation or brand.';
    if (!EMAIL_RE.test(form.email.trim())) e.email = 'Please enter a valid email address.';
    if (form.phone.trim()) {
      const digits = (form.phone.match(/\d/g) ?? []).length;
      if (!PHONE_RE.test(form.phone.trim()) || digits < 7) e.phone = 'Please enter a valid phone number.';
    }
    if (!form.service) e.service = 'Please select a service.';
    if (form.service === 'Custom' && customServices.length === 0) {
      e.customServices = 'Please choose at least one service.';
    }
    if (form.message.trim().length < 10) e.message = 'Please tell us a little more about your project.';
    if (!form.consent) e.consent = 'Please confirm you agree to our values-based working guidelines.';
    return e;
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');

    const errs = validate();
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) {
      const first = Object.keys(errs)[0];
      document.getElementById(first)?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          ...form,
          customServices: form.service === 'Custom' ? customServices : [],
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'submission_failed');
      }
      // Hand straight off to the booking calendar, prefilled — the /book page
      // reads these params to attach the meeting to the same HubSpot contact
      // and to scroll past its lead form to the calendar. `submitting` stays
      // true through the navigation so the button doesn't flash back to idle.
      const qs = new URLSearchParams({ email: form.email.trim(), company: form.brand.trim() });
      if (form.phone.trim()) qs.set('phone', form.phone.trim());
      router.push(`/book?${qs.toString()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  }

  const SOCIAL_ICON: Record<string, React.ReactNode> = {
    Facebook: <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />,
    Instagram: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.5" cy="6.5" r="1" />
      </>
    ),
    LinkedIn: (
      <>
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
  };

  return (
    <SmoothScroll>
      <SectionNav />
      <main>

        <ContactHero />

        {/* ── Form Section ── */}
        <section className="ct-body" data-section-color="light">
          <div className="cnt ct-grid">

            {/* ── Left: sticky aside. Sticky because the form is ~1,000px taller
                   than this column, which previously left it stranded at the top
                   beside a long run of empty ivory. ── */}
            <aside className="ct-aside">
              <div className="ct-aside-in">
                <h2 className="ct-aside-h">{contactAside.heading}</h2>
                <p className="ct-aside-intro">{contactAside.intro}</p>

                <a className="ct-mail" href={`mailto:${contactAside.email}`} data-cursor>
                  <span className="ct-mail-icon" aria-hidden="true">
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </span>
                  {contactAside.email}
                </a>

                <div className="ct-socials">
                  {contactAside.socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      // Every entry in contactAside.socials is now a real external
                      // profile. This used to be guarded against a '#' placeholder
                      // (LinkedIn had no URL yet); `as const` on the content module
                      // makes that comparison a type error once the placeholder goes,
                      // which is the intended tripwire — reinstate the guard only if
                      // a placeholder ever comes back.
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ct-soc"
                      aria-label={s.label}
                      data-cursor
                    >
                      <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        {SOCIAL_ICON[s.label]}
                      </svg>
                    </a>
                  ))}
                </div>

                <div className="ct-note">
                  <span className="ct-note-mark" aria-hidden="true">
                    <Khatam size={13} inner={0.5} stroke="var(--rd-gold)" strokeWidth={1.6} />
                  </span>
                  <p>
                    <strong>{contactAside.note.lead}</strong>
                    {contactAside.note.rest}
                  </p>
                </div>
              </div>
            </aside>

            {/* ── Right: Form ── */}
            <div className="ct-form-wrap reveal">
                <form onSubmit={submit} noValidate>
                  <h3 className="contact-form-h">Project Application Form</h3>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="name">Name *</label>
                      <input id="name" name="name" type="text" className="form-input"
                        placeholder="Your name" value={form.name} onChange={field}
                        aria-invalid={fieldErrors.name ? true : undefined} required />
                      {fieldErrors.name && <span className="form-error">{fieldErrors.name}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="brand">Organisation / Brand *</label>
                      <input id="brand" name="brand" type="text" className="form-input"
                        placeholder="Brand name" value={form.brand} onChange={field}
                        aria-invalid={fieldErrors.brand ? true : undefined} required />
                      {fieldErrors.brand && <span className="form-error">{fieldErrors.brand}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="email">Email Address *</label>
                      <input id="email" name="email" type="email" className="form-input"
                        placeholder="your@email.com" value={form.email} onChange={field}
                        aria-invalid={fieldErrors.email ? true : undefined} required />
                      {fieldErrors.email && <span className="form-error">{fieldErrors.email}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="phone">Phone Number</label>
                      <input id="phone" name="phone" type="tel" inputMode="tel" className="form-input"
                        placeholder="+91 98765 43210" value={form.phone} onChange={field}
                        aria-invalid={fieldErrors.phone ? true : undefined} />
                      {fieldErrors.phone && <span className="form-error">{fieldErrors.phone}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="location">Location</label>
                    <input id="location" name="location" type="text" className="form-input"
                      placeholder="City, Country" value={form.location} onChange={field} />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="service">Service Interested In *</label>
                    <select id="service" name="service" className="form-select"
                      value={form.service} onChange={field}
                      aria-invalid={fieldErrors.service ? true : undefined} required>
                      <option value="">Select a package...</option>
                      {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {fieldErrors.service && <span className="form-error">{fieldErrors.service}</span>}
                  </div>

                  {/* Custom services expander */}
                  {form.service === 'Custom' && (
                    <div className="custom-panel">
                      <p className="custom-panel-title">Choose the services you need</p>
                      <div className="custom-checks">
                        {CUSTOM_OPTS.map(opt => (
                          <label key={opt} className="custom-check-label">
                            <input
                              type="checkbox"
                              checked={customServices.includes(opt)}
                              onChange={() => toggleCustom(opt)}
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                      <StackButton type="button" size="sm" arrow onClick={() => setCustomSaved(true)}>
                        Save selection
                      </StackButton>
                      {customSaved && (
                        <span className="custom-saved">✓ Saved</span>
                      )}
                      {fieldErrors.customServices && (
                        <span className="form-error" style={{ marginTop: '.6rem' }}>{fieldErrors.customServices}</span>
                      )}
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label" htmlFor="stage">Business Stage</label>
                    <select id="stage" name="stage" className="form-select"
                      value={form.stage} onChange={field}>
                      <option value="">Select stage...</option>
                      {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="budget">Estimated Budget</label>
                    <select id="budget" name="budget" className="form-select"
                      value={form.budget} onChange={field}>
                      <option value="">Select range...</option>
                      {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="message">Tell us about your project *</label>
                    <textarea id="message" name="message" className="form-textarea"
                      placeholder="Describe your brand, goals, and what challenges you're facing online..."
                      value={form.message} onChange={field}
                      aria-invalid={fieldErrors.message ? true : undefined} required />
                    {fieldErrors.message && <span className="form-error">{fieldErrors.message}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="timeline">When are you hoping to start?</label>
                    <select id="timeline" name="timeline" className="form-select"
                      value={form.timeline} onChange={field}>
                      <option value="">Select...</option>
                      {TIMELINE.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <div className="form-check">
                      <input type="checkbox" id="consent" name="consent"
                        checked={form.consent} onChange={field} />
                      <label htmlFor="consent">
                        I understand that Waheed works with values-aligned brands and may decline
                        projects that do not meet its ethical guidelines.
                      </label>
                    </div>
                    {fieldErrors.consent && <span className="form-error">{fieldErrors.consent}</span>}
                  </div>

                  {error && (
                    <p style={{ fontSize: '.82rem', color: '#c0392b', marginBottom: '.8rem', lineHeight: 1.5 }}>
                      {error}
                    </p>
                  )}

                  <StackButton
                    type="submit"
                    size="lg"
                    fullWidth
                    arrow
                    className="ct-submit"
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting…' : 'Submit Application'}
                  </StackButton>

                  <p className="form-note">We respond within 24 hours, in shā&apos; Allāh.</p>
                </form>
            </div>

          </div>
        </section>

      </main>
    </SmoothScroll>
  );
}
