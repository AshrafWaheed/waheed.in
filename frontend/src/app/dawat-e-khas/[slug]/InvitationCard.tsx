'use client';

import React, { useEffect, useState } from 'react';
import type { Guest } from '../../../../lib/dek-db';

type Lang = 'en' | 'hi' | 'ur';

interface TranslationSet {
  bismillahTr: string;
  dear: (name: string) => string;
  familyBadge: string;
  hostLine: string;
  eventName: string;
  inshaAllah: string;
  connector: string;
  at: string;
  attend: string;
  decline: string;
  confirmedMsg: string;
  declinedMsg: string;
  dressNote: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  eventPassed: string;
}

const T: Record<Lang, TranslationSet> = {
  en: {
    bismillahTr: 'In the name of Allah, the Most Beneficent, the Most Merciful',
    dear: (name) => `Dear ${name},`,
    familyBadge: 'You and your family are invited',
    hostLine:
      'Mrs. and Mr. Waheed request the pleasure of your presence on the auspicious occasion of the',
    eventName: 'Dawat-e-Khas',
    inshaAllah: 'In sha Allah',
    connector: 'with',
    at: 'At',
    attend: '✓ I will attend',
    decline: '✗ I cannot attend',
    confirmedMsg: 'JazakAllah Khair! We look forward to seeing you.',
    declinedMsg: 'We understand. May Allah bless you.',
    dressNote:
      'Kindly honor our celebration by observing modest attire and refraining from photography.',
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
    eventPassed: 'JazakAllah Khair for celebrating with us',
  },
  hi: {
    bismillahTr: 'अल्लाह के नाम से, जो अत्यंत कृपालु और दयावान है',
    dear: (name) => `प्रिय ${name},`,
    familyBadge: 'आप और आपका परिवार आमंत्रित हैं',
    hostLine:
      'श्रीमती और श्री वाहीद आपको अपने पुत्र के निकाह की खुशी में दावत-ए-ख़ास में सादर आमंत्रित करते हैं',
    eventName: 'दावत-ए-ख़ास',
    inshaAllah: 'इन शा अल्लाह',
    connector: 'के साथ',
    at: 'स्थान',
    attend: '✓ मैं आऊंगा',
    decline: '✗ मैं नहीं आ सकता',
    confirmedMsg: 'जज़ाकल्लाह खैर! हम आपसे मिलने के लिए उत्सुक हैं।',
    declinedMsg: 'हम समझते हैं। अल्लाह आपको बरकत दे।',
    dressNote: 'कृपया सादे वस्त्र पहनकर आएं और फ़ोटोग्राफी से परहेज़ करें।',
    days: 'दिन',
    hours: 'घंटे',
    minutes: 'मिनट',
    seconds: 'सेकंड',
    eventPassed: 'हमारे साथ जश्न मनाने के लिए जज़ाकल्लाह खैर',
  },
  ur: {
    bismillahTr: 'اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے',
    dear: (name) => `عزیزم ${name}،`,
    familyBadge: 'آپ اور آپ کا خاندان مدعو ہیں',
    hostLine:
      'جناب اور محترمہ واحد اپنے بیٹے کے نکاح کی خوشی میں آپ کو دعوتِ خاص میں مدعو کرتے ہیں',
    eventName: 'دعوتِ خاص',
    inshaAllah: 'ان شاء اللہ',
    connector: 'کے ساتھ',
    at: 'مقام',
    attend: '✓ میں آؤں گا',
    decline: '✗ میں نہیں آ سکتا',
    confirmedMsg: 'جزاک اللہ خیرا! ہم آپ سے ملنے کے منتظر ہیں۔',
    declinedMsg: 'ہم سمجھتے ہیں۔ اللہ آپ کو برکت دے۔',
    dressNote: 'براہ کرم سادہ لباس میں تشریف لائیں اور فوٹوگرافی سے گریز کریں۔',
    days: 'دن',
    hours: 'گھنٹے',
    minutes: 'منٹ',
    seconds: 'سیکنڈ',
    eventPassed: 'ہمارے ساتھ جشن منانے کے لیے جزاک اللہ خیرا',
  },
};

const TARGET_MS = new Date('2026-05-10T19:00:00+05:30').getTime();

function calcCountdown() {
  const diff = TARGET_MS - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

const DIVIDER = <hr style={{ borderColor: '#C8D5B9', margin: '20px 0' }} />;

export default function InvitationCard({ guest }: { guest: Guest }) {
  const [lang, setLang] = useState<Lang>('en');
  const [rsvpStatus, setRsvpStatus] = useState(guest.rsvp_status);
  const [rsvpLoading, setRsvpLoading] = useState<'confirmed' | 'declined' | null>(null);
  const [countdown, setCountdown] = useState(() => calcCountdown());

  useEffect(() => {
    const id = setInterval(() => setCountdown(calcCountdown()), 1000);
    return () => clearInterval(id);
  }, []);

  async function handleRsvp(status: 'confirmed' | 'declined') {
    setRsvpLoading(status);
    try {
      const res = await fetch('/api/dek/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: guest.slug, status }),
      });
      if (res.ok) setRsvpStatus(status);
    } finally {
      setRsvpLoading(null);
    }
  }

  const t = T[lang];
  const isRtl = lang === 'ur';

  return (
    <div
      className="min-h-screen relative flex flex-col items-center py-8 px-4"
      style={{ background: '#C8D5B9' }}
    >
      {/* ── Islamic 8-pointed star tiled background ── */}
      <svg
        className="absolute inset-0 w-full pointer-events-none"
        style={{ height: '100%', zIndex: 0 }}
        aria-hidden="true"
      >
        <defs>
          <pattern id="dekStar" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <polygon
              points="30,18 31.91,25.38 38.49,21.51 34.62,28.09 42,30 34.62,31.91 38.49,38.49 31.91,34.62 30,42 28.09,34.62 21.51,38.49 25.38,31.91 18,30 25.38,28.09 21.51,21.51 28.09,25.38"
              fill="#2A4D38"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dekStar)" opacity="0.06" />
      </svg>

      {/* ── Floral corner decorations ── */}
      {/* TODO: replace with actual floral PNG */}
      <div
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          zIndex: 1,
          width: 180,
          height: 180,
          background: 'rgba(100,130,110,0.18)',
          borderBottomRightRadius: '100%',
          transform: 'translate(-35%, -35%)',
        }}
      />
      <div
        className="fixed top-0 right-0 pointer-events-none"
        style={{
          zIndex: 1,
          width: 180,
          height: 180,
          background: 'rgba(100,130,110,0.18)',
          borderBottomLeftRadius: '100%',
          transform: 'translate(35%, -35%)',
        }}
      />
      <div
        className="fixed bottom-0 left-0 pointer-events-none"
        style={{
          zIndex: 1,
          width: 160,
          height: 160,
          background: 'rgba(100,130,110,0.18)',
          borderTopRightRadius: '100%',
          transform: 'translate(-35%, 35%)',
        }}
      />
      <div
        className="fixed bottom-0 right-0 pointer-events-none"
        style={{
          zIndex: 1,
          width: 160,
          height: 160,
          background: 'rgba(100,130,110,0.18)',
          borderTopLeftRadius: '100%',
          transform: 'translate(35%, 35%)',
        }}
      />

      {/* ── Card ── */}
      <div className="relative w-full max-w-[480px]" style={{ zIndex: 10 }}>
        {/* Mosque arch — SVG fills the full card width; rect provides sage fill for cutaway areas */}
        <svg
          viewBox="0 0 480 140"
          className="w-full block"
          aria-hidden="true"
          style={{ display: 'block' }}
        >
          <rect width="480" height="140" fill="#C8D5B9" />
          <path d="M0,140 C0,60 110,0 240,0 C370,0 480,60 480,140Z" fill="white" />
        </svg>

        {/* Card body */}
        <div
          className="bg-white rounded-b-3xl px-6 pb-10"
          style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.12)' }}
        >
          <div dir={isRtl ? 'rtl' : 'ltr'}>

            {/* ── 1. Language switcher ── */}
            <div className="flex justify-center gap-2 pb-6 pt-2">
              {(['en', 'hi', 'ur'] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  style={{
                    padding: '4px 14px',
                    borderRadius: 999,
                    fontSize: 12,
                    border: `1px solid ${lang === l ? '#3D6B4F' : '#C8D5B9'}`,
                    background: lang === l ? '#3D6B4F' : 'white',
                    color: lang === l ? 'white' : '#3D6B4F',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-dm-sans)',
                    transition: 'all 0.15s',
                  }}
                >
                  {l === 'en' ? 'English' : l === 'hi' ? 'हिंदी' : 'اردو'}
                </button>
              ))}
            </div>

            {/* ── 2. Bismillah ── */}
            <div className="text-center mb-5">
              <p
                dir="rtl"
                style={{
                  fontFamily: 'var(--font-amiri)',
                  fontSize: 28,
                  color: '#1A2E22',
                  lineHeight: 1.7,
                }}
              >
                بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: 12,
                  color: '#7A9080',
                  marginTop: 4,
                  lineHeight: 1.5,
                }}
              >
                {t.bismillahTr}
              </p>
            </div>

            {DIVIDER}

            {/* ── 3. Dear guest ── */}
            <div className="text-center mb-4">
              <p
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontStyle: 'italic',
                  fontSize: 22,
                  color: '#2A4D38',
                  lineHeight: 1.4,
                }}
              >
                {t.dear(guest.name)}
              </p>
              {guest.with_family === 1 && (
                <span
                  style={{
                    display: 'inline-block',
                    marginTop: 8,
                    padding: '4px 14px',
                    borderRadius: 999,
                    fontSize: 12,
                    fontFamily: 'var(--font-dm-sans)',
                    background: '#e8f5ee',
                    color: '#3D6B4F',
                    fontWeight: 500,
                  }}
                >
                  {t.familyBadge}
                </span>
              )}
            </div>

            {/* ── 4. Host line ── */}
            <p
              className="text-center mb-4"
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: 13,
                color: '#3d5245',
                lineHeight: 1.7,
              }}
            >
              {t.hostLine}
            </p>

            {/* ── 5. Event name ── */}
            <p
              className="text-center"
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: 26,
                fontWeight: 700,
                color: '#2A4D38',
                lineHeight: 1.3,
              }}
            >
              {t.eventName}
            </p>

            {DIVIDER}

            {/* ── 6. Groom ── */}
            <div className="text-center mb-1">
              <p
                style={{
                  fontFamily: 'var(--font-dancing)',
                  fontSize: 32,
                  color: '#1A2E22',
                  lineHeight: 1.3,
                }}
              >
                Ashraf Waheed Ansari
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: 12,
                  color: '#7A9080',
                  marginTop: 3,
                }}
              >
                S/o Sarwar Waheed · Ramnagar, Varanasi, India
              </p>
            </div>

            {/* "with" connector */}
            <p
              className="text-center my-3"
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontStyle: 'italic',
                fontSize: 14,
                color: '#7A9080',
              }}
            >
              {t.connector}
            </p>

            {/* ── 7. Bride ── */}
            <div className="text-center mb-2">
              <p
                style={{
                  fontFamily: 'var(--font-dancing)',
                  fontSize: 32,
                  color: '#1A2E22',
                  lineHeight: 1.3,
                }}
              >
                Mardhiyya Tulawi Barahim
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: 12,
                  color: '#7A9080',
                  marginTop: 3,
                }}
              >
                D/o Abdelkhan Barahim · Talisayan, Zamboanga City, Philippines
              </p>
            </div>

            {DIVIDER}

            {/* ── 8. Date / time ── */}
            <div className="text-center mb-4">
              <p
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontStyle: 'italic',
                  fontSize: 16,
                  color: '#7A9080',
                }}
              >
                {t.inshaAllah}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontWeight: 700,
                  fontSize: 15,
                  color: '#1A2E22',
                  marginTop: 6,
                }}
              >
                Sunday, 10th of May, 2026
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontWeight: 700,
                  fontSize: 15,
                  color: '#1A2E22',
                  marginTop: 2,
                }}
              >
                7:00 PM
              </p>
            </div>

            {/* ── 9. Venue ── */}
            <div className="text-center mb-6">
              <p
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontStyle: 'italic',
                  fontSize: 14,
                  color: '#7A9080',
                }}
              >
                {t.at}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontWeight: 700,
                  fontSize: 15,
                  color: '#1A2E22',
                  marginTop: 4,
                }}
              >
                Paradise Marriage Hall
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: 13,
                  color: '#7A9080',
                  marginTop: 2,
                }}
              >
                Purana Ramnagar, Varanasi
              </p>
            </div>

            {/* ── 10. Countdown ── */}
            {countdown === null ? (
              <p
                className="text-center py-4 mb-4"
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontStyle: 'italic',
                  fontSize: 17,
                  color: '#3D6B4F',
                }}
              >
                {t.eventPassed}
              </p>
            ) : (
              <div
                className="grid grid-cols-4 gap-2 mb-6"
                dir="ltr" /* countdown numbers always LTR */
              >
                {(
                  [
                    [countdown.days, t.days],
                    [countdown.hours, t.hours],
                    [countdown.minutes, t.minutes],
                    [countdown.seconds, t.seconds],
                  ] as [number, string][]
                ).map(([val, label]) => (
                  <div
                    key={label}
                    className="text-center rounded-xl py-3 px-1"
                    style={{ background: '#C8D5B9' }}
                  >
                    <p
                      style={{
                        fontFamily: 'var(--font-cormorant)',
                        fontSize: 28,
                        fontWeight: 600,
                        color: '#2A4D38',
                        lineHeight: 1,
                      }}
                    >
                      {String(val).padStart(2, '0')}
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-dm-sans)',
                        fontSize: 10,
                        color: '#7A9080',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        marginTop: 4,
                      }}
                    >
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {DIVIDER}

            {/* ── 11. RSVP ── */}
            <div className="text-center mb-5">
              <p
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontStyle: 'italic',
                  fontSize: 20,
                  color: '#2A4D38',
                  marginBottom: 14,
                }}
              >
                R.S.V.P.
              </p>

              {rsvpStatus === 'pending' && (
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => handleRsvp('confirmed')}
                    disabled={rsvpLoading !== null}
                    style={{
                      flex: 1,
                      maxWidth: 180,
                      padding: '10px 0',
                      borderRadius: 12,
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily: 'var(--font-dm-sans)',
                      background: rsvpLoading === 'confirmed' ? '#5a8a6a' : '#3D6B4F',
                      color: 'white',
                      border: 'none',
                      cursor: rsvpLoading !== null ? 'default' : 'pointer',
                      opacity: rsvpLoading !== null && rsvpLoading !== 'confirmed' ? 0.5 : 1,
                      transition: 'all 0.15s',
                    }}
                  >
                    {rsvpLoading === 'confirmed' ? '...' : t.attend}
                  </button>
                  <button
                    onClick={() => handleRsvp('declined')}
                    disabled={rsvpLoading !== null}
                    style={{
                      flex: 1,
                      maxWidth: 180,
                      padding: '10px 0',
                      borderRadius: 12,
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily: 'var(--font-dm-sans)',
                      background: rsvpLoading === 'declined' ? '#fdf0ef' : 'white',
                      color: '#c0392b',
                      border: '1px solid #e8b4b0',
                      cursor: rsvpLoading !== null ? 'default' : 'pointer',
                      opacity: rsvpLoading !== null && rsvpLoading !== 'declined' ? 0.5 : 1,
                      transition: 'all 0.15s',
                    }}
                  >
                    {rsvpLoading === 'declined' ? '...' : t.decline}
                  </button>
                </div>
              )}

              {rsvpStatus === 'confirmed' && (
                <p
                  style={{
                    fontFamily: 'var(--font-dm-sans)',
                    fontSize: 14,
                    color: '#3D6B4F',
                    lineHeight: 1.6,
                  }}
                >
                  {t.confirmedMsg}
                </p>
              )}

              {rsvpStatus === 'declined' && (
                <p
                  style={{
                    fontFamily: 'var(--font-dm-sans)',
                    fontSize: 14,
                    color: '#7A9080',
                    lineHeight: 1.6,
                  }}
                >
                  {t.declinedMsg}
                </p>
              )}
            </div>

            {/* ── 12. Contact ── */}
            <p
              className="text-center mb-4"
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: 13,
                color: '#7A9080',
              }}
            >
              Waheed Family · 7408428040 / 9140220237
            </p>

            {/* ── 13. Dress note ── */}
            <p
              className="text-center"
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontStyle: 'italic',
                fontSize: 11,
                color: '#7A9080',
                lineHeight: 1.7,
              }}
            >
              {t.dressNote}
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
