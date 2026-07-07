import type { Metadata } from 'next';
import FaqContent from './FaqContent';

export const metadata: Metadata = {
  title:       'FAQs · WAHEED',
  description: 'Answers to common questions about working with Waheed Digital Studio, from our faith-aligned approach to website timelines and payment plans.',
};

export default function FAQPage() {
  return <FaqContent />;
}
