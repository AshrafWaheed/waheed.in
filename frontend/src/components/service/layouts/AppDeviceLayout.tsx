/**
 * App Development's journey — the whole page as one phone screen.
 *
 * Unlike every other service page this one has no scan-down sequence of bands:
 * it is a single device surface (AppPhone) you read top-to-bottom, so the layout
 * mounts exactly that. The shared packages/FAQ/CTA are folded into the phone UI
 * inside AppPhone rather than appended as separate sections.
 */
import AppPhone from '@/components/service/app/AppPhone';
import type { ServiceLayoutProps } from './types';

export default function AppDeviceLayout({ page }: ServiceLayoutProps) {
  return <AppPhone page={page} />;
}
