'use client';

import { useState, type FormEvent, type ChangeEvent } from 'react';

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
  const [form,           setForm]           = useState<FormData>(EMPTY);
  const [customServices, setCustomServices] = useState<string[]>([]);
  const [customSaved,    setCustomSaved]    = useState(false);
  const [submitting,     setSubmitting]     = useState(false);
  const [submitted,      setSubmitted]      = useState(false);
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
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>

      {/* ── Hero ── */}
      <div className="page-hero">
        {/* Geometric accent */}
        <svg
          style={{ position: 'absolute', bottom: -40, left: -40, width: 260, opacity: .12, pointerEvents: 'none' }}
          viewBox="0 0 200 200"
          aria-hidden="true"
        >
          <g stroke="white" strokeWidth=".5" fill="none">
            <polygon points="100,10 190,55 190,145 100,190 10,145 10,55" />
            <circle cx="100" cy="100" r="30" />
          </g>
        </svg>
        <div className="cnt" style={{ position: 'relative', zIndex: 1 }}>
          <span className="lbl">Apply for a Discovery Call</span>
          <h1>
            Tell us about your{' '}
            <em>brand.</em>
          </h1>
          <p>A 30-minute fit call. We review every application personally and respond within 24 hours, in sha Allah.</p>
        </div>
      </div>

      {/* ── Form Section ── */}
      <section className="sec" style={{ background: '#F7F3ED' }}>
        <div className="cnt">
          <div className="contact-grid">

            {/* ── Left: Info ── */}
            <div className="reveal">
              <h2 className="contact-info-h">Start a Conversation</h2>
              <p className="contact-intro">
                Whether you&apos;re exploring your options or ready to start immediately, we&apos;d
                love to hear about your brand. Fill out the form and we&apos;ll be in touch,
                in&nbsp;shā&apos;&nbsp;Allāh.
              </p>

              <div className="contact-details">
                <div className="cd-item">
                  <div className="cd-icon">
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  info@waheed.in
                </div>
              </div>

              <div className="contact-socials">
                <a href="https://www.facebook.com/profile.php?id=61556593554803" target="_blank" rel="noopener noreferrer" className="soc" title="Facebook" aria-label="Facebook">
                  <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/waheeddigitalsolutions/" target="_blank" rel="noopener noreferrer" className="soc" title="Instagram" aria-label="Instagram">
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5"/>
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                  </svg>
                </a>
                <a href="#" className="soc" title="LinkedIn" aria-label="LinkedIn">
                  <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                </a>
              </div>

              {/* Values note */}
              <div style={{ marginTop: '2.5rem', padding: '1.3rem 1.5rem', background: 'rgba(51,92,103,.06)', borderRadius: 10, borderLeft: '3px solid #335C67' }}>
                <p style={{ fontSize: '.82rem', color: '#254851', lineHeight: 1.7, margin: 0 }}>
                  <strong>We only work with values-aligned brands.</strong> Every application is reviewed personally.
                  We may respectfully decline projects that do not align with our ethical guidelines.
                </p>
              </div>
            </div>

            {/* ── Right: Form ── */}
            <div className="contact-form-wrap reveal delay-2">
              {submitted ? (
                <div className="contact-success">
                  <div className="contact-success-icon">
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <h3 className="contact-success-h">Jazakallahu Khayran</h3>
                  <p className="contact-success-p">
                    Your application has been received. We&apos;ll review it personally and get back
                    to you within 24 hours, in shā&apos; Allāh.
                  </p>
                </div>
              ) : (
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
                      <button
                        type="button"
                        className="btn btn-teal"
                        style={{ padding: '.5rem 1.3rem', fontSize: '.82rem' }}
                        onClick={() => setCustomSaved(true)}
                      >
                        Save selection →
                      </button>
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

                  <button
                    type="submit"
                    className="btn btn-teal"
                    disabled={submitting}
                    style={{ width: '100%', justifyContent: 'center', opacity: submitting ? .7 : 1 }}
                  >
                    {submitting ? 'Submitting...' : 'Submit Application →'}
                  </button>

                  <p className="form-note">We respond within 24 hours, in shā&apos; Allāh.</p>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}
