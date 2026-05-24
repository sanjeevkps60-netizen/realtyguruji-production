import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/data/properties";
import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Gurgaon Real Estate Blog — Insights, Guides & Market Analysis",
  description:
    "Expert insights on Gurgaon real estate from Realty Guruji — investment guides, rental yields, sector analysis and buying tips for Dwarka Expressway, Golf Course Road and beyond.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line pt-32 pb-12">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-surface to-ink" />
        <div className="container-rg">
          <span className="chip mb-4">Insights & guides</span>
          <h1 className="font-display text-4xl font-bold text-cream sm:text-5xl">
            Gurgaon Real Estate <span className="text-gradient-gold">Blog</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted">
            Data-backed market analysis, investment guides and buying tips from Rahul Soni and the Realty Guruji team.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-rg">
          <SectionHeading align="left" eyebrow="Latest articles" title="From the Realty Guruji Desk" />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post, i) => (
              <ScrollReveal key={post.id} delay={i * 50}>
                <Link href={`/blog/${post.id}`} className="card-rg group flex h-full flex-col p-6">
                  <div className="flex items-center gap-3 text-xs text-muted">
                    <span className="chip">{post.category}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="mt-4 font-display text-xl font-bold leading-snug text-cream group-hover:text-gold-bright">{post.title}</h2>
                  <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">{post.excerpt}</p>
                  <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-sm">
                    <span className="text-faint">{new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                    <span className="font-semibold text-gold-bright">Read →</span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
