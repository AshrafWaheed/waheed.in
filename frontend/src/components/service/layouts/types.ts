import type { ServicePage } from '@/content/services';

/**
 * What every service layout receives. Keeping it one type is what lets the route
 * hold a `Record<string, ComponentType<ServiceLayoutProps>>` and pick by slug
 * without a switch.
 */
export interface ServiceLayoutProps {
  page: ServicePage;
  /**
   * Index in the services register — the CraftArtifact for this craft, i.e. the
   * same object the homepage bento showed. Layouts that do not open on an
   * artifact (BrandStrategy opens on BrandField) simply ignore it.
   */
  artifact: number;
}
