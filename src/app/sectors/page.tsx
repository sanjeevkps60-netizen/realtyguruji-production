import type { Metadata } from "next";
import Link from "next/link";
import { featuredSectors, allSectors } from "@/data/sectors";
import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Gurgaon Sectors & Corridors — Price Trends & Investment Guide",
  description:
    "Explore every Gurgaon sector and corridor — Dwarka Expressway, Golf Course Road, SPR, Sohna Road, New Gurgaon and sectors 1–115 with price trends, connectivity and investment scores.",
  alternates: { canonical: "/sectors" },
};

export default function SectorsPage() {
  const numbered = allSectors.filter((s) => s.kind === "sector");

  return (
    <>
      <section className="relative overflow-hidden border-b border-line pt-32 pb-12">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-surface to-ink" />
        <div className="container-rg">
          <span className="chip mb-4">Location intelligence</span>
          <h1 className="font-display text-4xl font-bold text-cream sm:text-5xl">
            Gurgaon <span className="text-gradient-gold">Sectors & Corridors</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted">
            Price trends, connectivity, infrastructure and investment scores for every part of Gurugram — from the prime corridors to all 115 sectors.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-rg">
          <SectionHeading align="left" eyebrow="Prime corridors" title="Major Growth Corridors" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredSectors.map((s, i) => (
              <ScrollReveal key={s.slug} delay={i * 50}>
                <Link href={`/sectors/${s.slug}`} className="card-rg group flex h-full flex-col p-6">
                  <div className="flex items-center justify-between">
                    <span className="chip">{s.highlight}</span>
                    <span className="text-sm font-semibold text-gold-bright">{s.investmentScore}/10</span>
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold text-cream group-hover:text-gold-bright">{s.name}</h3>
                  <p className="mt-1 text-sm text-muted">{s.tagline}</p>
                  <p className="mt-3 line-clamp-2 text-sm text-muted/80">{s.intro}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-line pt-4 text-sm">
                    <span className="text-muted">From <span className="font-semibold text-cream">{s.priceFrom}</span></span>
                    <span className="text-[#7ee2a8]">{s.priceTrend}</span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-ink-soft py-16">
        <div className="container-rg">
          <SectionHeading align="left" eyebrow="All sectors" title="Browse Sectors 1–115" subtitle="Tap any sector for local price trends, connectivity and verified listings." />
          <div className="mt-8 grid grid-cols-3 gap-2.5 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-10">
            {numbered.map((s) => (
              <Link
                key={s.slug}
                href={`/sectors/${s.slug}`}
                className="rounded-lg border border-line bg-ink px-2 py-2.5 text-center text-sm text-cream/90 transition-colors hover:border-gold hover:text-gold-bright"
              >
                {s.name.replace("Sector ", "")}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
