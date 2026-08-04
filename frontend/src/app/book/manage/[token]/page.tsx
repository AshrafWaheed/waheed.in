import type { Metadata } from 'next';
import ManageBooking from './ManageBooking';

export const dynamic = 'force-dynamic';

// Never indexed and never followed: the URL *is* the credential.
export const metadata: Metadata = {
  title: 'Your booking · WAHEED',
  robots: { index: false, follow: false },
};

/**
 * /book/manage/[token] — move or cancel a booking without an account.
 *
 * The booking is fetched client-side rather than server-rendered, deliberately:
 * a server render would put the booking's details into the HTML of a page whose
 * URL travels through email, link previewers and corporate scanners. Fetching
 * after mount means a preview crawler that follows the link sees a shell.
 */
export default async function ManageBookingPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <main>
      <section className="bk-hero bk-hero--short" data-section-color="dark">
        <div className="cnt bk-hero-inner">
          <p className="ab-pill">Your booking</p>
          <h1 className="bk-hero-h1">Need to <em>change it?</em></h1>
        </div>
      </section>

      <section className="bk-body" data-section-color="light">
        <div className="cnt">
          <ManageBooking token={token} />
        </div>
      </section>
    </main>
  );
}
