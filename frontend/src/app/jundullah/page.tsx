import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session-server';
import LoginForm from './LoginForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin · WAHEED',
  robots: { index: false, follow: false },
};

export default async function JundullahLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ expired?: string }>;
}) {
  const session = await getSession();
  if (session) redirect('/jundullah/dashboard');

  const { expired } = await searchParams;
  return <LoginForm expired={expired === '1'} />;
}
