<?php

namespace Database\Seeders;

use App\Models\Topic;
use Illuminate\Database\Seeder;

/**
 * The 29 planned articles from the keyword strategy, as a work queue.
 *
 * Source: the "Halal Content Engine" strategy artifact — five pillars plus the
 * first-12 publish order. Priority 1..12 mirrors that order; the remaining
 * pillar articles sit at 100+ and get re-ranked by real performance data once
 * post_performance exists (CONTENT_ENGINE.md §6 stage 9).
 *
 * Idempotent: matches on primary_keyword so re-running never duplicates, and
 * never overwrites a topic that has already been picked up (status != queued).
 */
class TopicSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->topics() as $t) {
            $existing = Topic::where('primary_keyword', $t['primary_keyword'])->first();

            if ($existing && $existing->status !== 'queued') {
                continue; // in progress or published — leave it alone
            }

            Topic::updateOrCreate(
                ['primary_keyword' => $t['primary_keyword']],
                $t + ['status' => 'queued'],
            );
        }
    }

    /** @return array<int, array<string, mixed>> */
    private function topics(): array
    {
        return [
            // ── The first 12, in the strategy's publish order ──────────────
            [
                'title' => 'Does My Muslim Business Actually Need a Website?',
                'pillar' => 'web-app-software',
                'primary_keyword' => 'muslim business website',
                'secondary_keywords' => ['website development in the UK', 'halal web design'],
                'difficulty' => 'easy',
                'bridge_target' => '/services/web-development',
                'priority' => 1,
                'notes' => 'Answer-first. Honest about when they do NOT need one. Already drafted 2026-08-16.',
            ],
            [
                'title' => 'Is Digital Marketing Halal? A Guide for Muslim Owners',
                'pillar' => 'halal-marketing',
                'primary_keyword' => 'is digital marketing halal',
                'secondary_keywords' => ['halal digital marketing agency'],
                'difficulty' => 'medium',
                'bridge_target' => '/services/seo',
                'priority' => 2,
                'notes' => 'Umbrellas every service. A competitor already ranks; beat on depth + UX.',
            ],
            [
                'title' => 'SEO for Islamic & Halal Businesses (Without Paying for Ads)',
                'pillar' => 'halal-marketing',
                'primary_keyword' => 'seo for muslim businesses',
                'secondary_keywords' => ['seo for islamic businesses', 'halal seo agency'],
                'difficulty' => 'easy',
                'bridge_target' => '/services/seo',
                'priority' => 3,
                'notes' => 'The article itself is the proof of the service. Demonstrate, do not claim.',
            ],
            [
                'title' => 'Is Freelancing Halal? For Muslim Developers, Designers & Writers',
                'pillar' => 'halal-income',
                'primary_keyword' => 'is freelancing halal',
                'difficulty' => 'easy',
                'bridge_target' => null,
                'priority' => 4,
                'notes' => 'IslamQA rules on this — easy to cite. Builds fiqh credibility.',
            ],
            [
                'title' => 'What Makes Marketing "Halal"? Principles for Muslim Brands',
                'pillar' => 'halal-marketing',
                'primary_keyword' => 'halal marketing',
                'difficulty' => 'medium',
                'bridge_target' => '/services/brand-strategy',
                'priority' => 5,
                'notes' => 'Pillar-02 hub. Publish early so later posts have something to link up to.',
            ],
            [
                'title' => 'Is Affiliate Marketing Halal or Haram?',
                'pillar' => 'halal-income',
                'primary_keyword' => 'is affiliate marketing halal',
                'difficulty' => 'medium',
                'bridge_target' => '/services/social-media-marketing',
                'priority' => 6,
                'notes' => 'Highest-volume term in the niche. Scholar quotes + clear verdict up top.',
            ],
            [
                'title' => 'Website Design Best Practices for Muslim & Halal Brands',
                'pillar' => 'web-app-software',
                'primary_keyword' => 'muslim website design',
                'difficulty' => 'medium',
                'bridge_target' => '/services/web-development',
                'priority' => 7,
            ],
            [
                'title' => 'How to Take Payments the Halal Way Online (Avoiding Riba)',
                'pillar' => 'web-app-software',
                'primary_keyword' => 'halal payment gateway',
                'difficulty' => 'easy',
                'bridge_target' => '/services/custom-software-development',
                'priority' => 8,
                'notes' => 'Almost nobody owns this term. Genuine differentiator.',
            ],
            [
                'title' => 'Halal Ways to Make Money Online in 2026',
                'pillar' => 'halal-income',
                'primary_keyword' => 'halal ways to make money online',
                'difficulty' => 'medium',
                'bridge_target' => null,
                'priority' => 9,
                'notes' => 'Cluster glue — links to the affiliate + freelancing posts.',
            ],
            [
                'title' => 'What Is Islamic Branding? (More Than a Crescent Logo)',
                'pillar' => 'islamic-branding',
                'primary_keyword' => 'islamic branding',
                'difficulty' => 'medium',
                'bridge_target' => '/services/brand-strategy',
                'priority' => 10,
            ],
            [
                'title' => 'Social Media Marketing for Muslim Businesses',
                'pillar' => 'halal-marketing',
                'primary_keyword' => 'social media for muslim business',
                'difficulty' => 'medium',
                'bridge_target' => '/services/social-media-marketing',
                'priority' => 11,
            ],
            [
                'title' => 'Riba, Gharar & Maysir: What Makes a Business Haram',
                'pillar' => 'islamic-branding',
                'primary_keyword' => 'riba gharar maysir',
                'difficulty' => 'easy',
                'bridge_target' => null,
                'priority' => 12,
                'notes' => 'Foundational reference every other post links back to. Pure E-E-A-T.',
            ],

            // ── Pillar 01 · Halal income & online business ─────────────────
            [
                'title' => 'Is Dropshipping Haram? The Islamic Ruling, Explained',
                'pillar' => 'halal-income',
                'primary_keyword' => 'is dropshipping haram',
                'difficulty' => 'medium',
                'bridge_target' => '/services/web-development',
                'priority' => 100,
            ],
            [
                'title' => '35 Halal Business Ideas You Can Start This Year',
                'pillar' => 'halal-income',
                'primary_keyword' => 'halal business ideas',
                'difficulty' => 'medium',
                'bridge_target' => null,
                'priority' => 101,
            ],

            // ── Pillar 02 · Halal marketing & growth ───────────────────────
            [
                'title' => 'Is Instagram/Facebook Advertising Halal? Music, Imagery & Riba Ads',
                'pillar' => 'halal-marketing',
                'primary_keyword' => 'is facebook advertising halal',
                'difficulty' => 'easy',
                'bridge_target' => '/services/social-media-marketing',
                'priority' => 110,
            ],

            // ── Pillar 03 · Websites, apps & software ──────────────────────
            [
                'title' => 'Halal E-commerce: Building a Shariah-Compliant Online Store',
                'pillar' => 'web-app-software',
                'primary_keyword' => 'halal ecommerce',
                'difficulty' => 'medium',
                'bridge_target' => '/services/web-development',
                'priority' => 120,
            ],
            [
                'title' => 'Masjid & Madrasa Management Software: What to Look For',
                'pillar' => 'web-app-software',
                'primary_keyword' => 'masjid management software',
                'secondary_keywords' => ['madrasa management software', 'islamic school erp'],
                'difficulty' => 'low-comp',
                'bridge_target' => '/services/custom-software-development',
                'priority' => 121,
                'notes' => 'Lowest-competition term in the whole set.',
            ],

            // ── Pillar 04 · Islamic branding & business ethics ─────────────
            [
                'title' => "How to Build a Muslim Brand That Doesn't Feel Preachy",
                'pillar' => 'islamic-branding',
                'primary_keyword' => 'muslim brand strategy',
                'difficulty' => 'easy',
                'bridge_target' => '/services/brand-strategy',
                'priority' => 130,
            ],
            [
                'title' => 'Barakah in Business: Why Ethical Growth Compounds',
                'pillar' => 'islamic-branding',
                'primary_keyword' => 'barakah in business',
                'difficulty' => 'easy',
                'bridge_target' => null,
                'priority' => 131,
            ],

            // ── Pillar 05 · Islamic charities, masjids & nonprofits ────────
            [
                'title' => "Donation Page UX: Why Your Masjid's Checkout Loses People",
                'pillar' => 'charities-masjids',
                'primary_keyword' => 'donation page design',
                'difficulty' => 'easy',
                'bridge_target' => '/services/web-development',
                'priority' => 140,
            ],
            [
                'title' => 'Gift Aid & 501(c)(3): The Charity Paperwork That Pays for Itself',
                'pillar' => 'charities-masjids',
                'primary_keyword' => 'gift aid for muslim charities',
                'difficulty' => 'low-comp',
                'bridge_target' => '/services/custom-software-development',
                'priority' => 141,
                'notes' => 'UK + US split. Verify both regimes carefully — compliance detail.',
            ],
            [
                'title' => 'Zakat Distribution Software: What Trustees Should Demand',
                'pillar' => 'charities-masjids',
                'primary_keyword' => 'zakat distribution software',
                'difficulty' => 'low-comp',
                'bridge_target' => '/services/custom-software-development',
                'priority' => 142,
            ],
            [
                'title' => 'How Islamic Charities Can Raise More in Ramadan',
                'pillar' => 'charities-masjids',
                'primary_keyword' => 'ramadan fundraising',
                'difficulty' => 'medium',
                'bridge_target' => '/services/social-media-marketing',
                'priority' => 143,
                'notes' => 'Seasonal — publish by January to be indexed before Ramadan.',
            ],
            [
                'title' => 'Is Crowdfunding Halal? Riba, Platform Fees and Where the Cut Goes',
                'pillar' => 'charities-masjids',
                'primary_keyword' => 'is crowdfunding halal',
                'difficulty' => 'easy',
                'bridge_target' => null,
                'priority' => 144,
            ],
        ];
    }
}
