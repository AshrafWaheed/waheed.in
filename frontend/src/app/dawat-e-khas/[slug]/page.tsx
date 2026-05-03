import { getGuestBySlug } from '../../../../lib/dek-db';
import InvitationCard from './InvitationCard';

export default async function DawatInvitationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guest = getGuestBySlug(slug);

  if (!guest || guest.is_active === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#C8D5B9' }}
      >
        <p style={{ fontFamily: 'var(--font-dm-sans)', color: '#3D6B4F', fontSize: '1rem' }}>
          This invitation is not available.
        </p>
      </div>
    );
  }

  return <InvitationCard guest={guest} />;
}
