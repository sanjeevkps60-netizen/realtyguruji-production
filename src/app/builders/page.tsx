import type { Metadata } from "next";
import Link from "next/link";
import { builders } from "@/data/builders";
import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import LeadForm from "@/components/LeadForm";

export const metadata: Metadata = {
  title: "Top Gurgaon Builders & Developers — DLF, M3M, Godrej & More",
  description:
    "Explore Gurgaon's leading real estate developers — DLF, M3M, Sobha, Godrej, Signature Global, Elan, Emaar, Smartworld, Birla Estates & ATS. Projects, pricing and verified inventory.",
  alternates: { canonical: "/builders" },
};

export default function BuildersPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line pt-32 pb-12">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-surface to-ink" />
        <div className="container-rg">
          <span className="chip mb-4">Trusted developers</span>
          <h1 className="font-display text-4xl font-bold text-cream sm:text-5xl">
            Top <span className="text-gradient-gold">Gurgaon Builders</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted">
            We deal across every leading developer in Gurugram — new launches, resale and verified inventory at fair prices.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-rg">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {builders.map((b, i) => (
              <ScrollReveal key={b.slug} delay={i * 40}>
                <Link href={`/builders/${b.slug}`} className="card-rg group flex h-full flex-col p-6">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-2xl font-bold text-cream group-hover:text-gold-bright">{b.name}</span>
                    <span className="text-sm font-semibold text-gold-bright">★ {b.rating}</span>
                  </div>
                  <p className="mt-1 text-sm text-gold-bright/80">{b.tagline}</p>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{b.intro}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {b.focus.slice(0, 3).map((f) => (
                      <span key={f} className="rounded-full border border-line bg-ink px-2.5 py-1 text-xs text-muted">{f}</span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-line pt-4 text-sm">
                    <span className="text-muted">From <span className="font-semibold text-cream">{b.priceFrom}</span></span>
                    <span className="text-gold-bright">View projects →</span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-ink-soft py-16">
        <div className="container-rg max-w-2xl">
          <SectionHeading eyebrow="Tell us your pick" title="Looking for a specific builder?" subtitle="Share the developer and project you want — we'll find verified availability and the best price." />
          <div className="mt-8">
            <LeadForm source="builders-page" heading="Builder enquiry" sub="Which builder or project are you interested in?" />
          </div>
        </div>
      </section>
    </>
  );
}
