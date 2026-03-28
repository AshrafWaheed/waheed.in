"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SectionTag from "@/components/ui/SectionTag";
import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface BlogPost {
  category: string;
  date:     string;
  title:    string;
  excerpt:  string;
  href:     string;
}

const POSTS: BlogPost[] = [
  {
    category: "Business",
    date:     "March 2025",
    title:    "Why halal isn't a niche — it's the future of ethical commerce",
    excerpt:  "The global halal economy is valued at over $7 trillion. Here's why Muslim entrepreneurs are uniquely positioned to lead the next era of trust-based business.",
    href:     "/blog/halal-future-of-ethical-commerce",
  },
  {
    category: "Web Development",
    date:     "February 2025",
    title:    "Dark patterns are haram: designing with conscience",
    excerpt:  "From fake countdown timers to forced continuity subscriptions — we break down why deceptive UX violates Islamic principles and how to build without them.",
    href:     "/blog/dark-patterns-are-haram",
  },
  {
    category: "Social Media",
    date:     "January 2025",
    title:    "Building a community vs. buying an audience",
    excerpt:  "Paid followers, engagement pods, viral bait — the shortcuts that damage your brand long-term and the ethical alternative that actually compounds.",
    href:     "/blog/community-vs-audience",
  },
];

const headerVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

const cardContainer: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.1 } },
};

const cardVariant: Variants = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE_OUT } },
};

function CategoryChip({ label }: { label: string }) {
  return (
    <span
      className="inline-block bg-[var(--yellow)] text-[var(--text-dark)] font-[var(--font-dm-sans)] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-sm leading-none"
      style={{ fontSize: "0.65rem" }}
    >
      {label}
    </span>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <motion.article
      variants={cardVariant}
      className="group flex flex-col bg-[#3D6B4F] rounded-xl overflow-hidden hover:-translate-y-1 transition-transform duration-300 ease-out h-full"
    >
      {/* Image placeholder */}
      <div className="relative bg-gradient-to-br from-[#2a4d38] to-[#4a7a5f] aspect-video shrink-0">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #F5F0E8 0, #F5F0E8 1px, transparent 0, transparent 50%)",
            backgroundSize: "16px 16px",
          }}
          aria-hidden="true"
        />
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <CategoryChip label={post.category} />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <p className="font-[var(--font-dm-sans)] text-xs text-[var(--text-light)] mb-3">
          {post.date}
        </p>

        <h3 className="font-[var(--font-cormorant)] font-semibold text-xl text-[var(--cream)] leading-tight mb-3">
          {post.title}
        </h3>

        <p className="font-[var(--font-dm-sans)] text-xs text-[var(--text-light)] leading-relaxed mb-5 flex-1 line-clamp-2">
          {post.excerpt}
        </p>

        <a
          href={post.href}
          className="inline-flex items-center gap-1.5 text-sm font-medium font-[var(--font-dm-sans)] text-[var(--yellow)] hover:text-[var(--yellow-soft)] transition-colors duration-200"
        >
          Read Article
          <ArrowRight
            size={13}
            strokeWidth={2}
            className="translate-x-0 group-hover:translate-x-1 transition-transform duration-200"
          />
        </a>
      </div>
    </motion.article>
  );
}

export default function BlogPreview() {
  return (
    <section id="blog" className="bg-[#2A4D38] py-24 px-6">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <motion.div
          className="mb-14"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <SectionTag accent className="mb-4">From the Blog</SectionTag>
          <SectionTitle light className="text-4xl md:text-5xl">
            Thoughts on{" "}
            <em className="not-italic italic text-[var(--yellow)]">ethical growth</em>
          </SectionTitle>
        </motion.div>

        {/* ── Cards ── */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={cardContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {POSTS.map((post) => (
            <BlogCard key={post.href} post={post} />
          ))}
        </motion.div>

        {/* ── CTA ── */}
        <motion.div
          className="mt-12 flex justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button href="/blog" variant="outline" size="lg">
            Visit the Blog
          </Button>
        </motion.div>

      </div>
    </section>
  );
}
