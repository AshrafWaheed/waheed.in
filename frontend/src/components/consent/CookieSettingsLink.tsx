'use client';

import { CONSENT_EVENT } from '@/lib/consent';

/**
 * The withdrawal route. Art 7(3): it has to be as easy to take consent back as
 * it was to give it, which in practice means a permanent, findable control —
 * not an email address and a promise.
 *
 * A button rather than a link because it opens a dialog on the current page.
 * It renders whether or not a decision exists, so it also serves the visitor
 * who rejected everything and later changed their mind.
 */
export default function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className ?? 'ck-settings-link'}
      onClick={() => window.dispatchEvent(new Event(CONSENT_EVENT))}
    >
      Cookie settings
    </button>
  );
}
