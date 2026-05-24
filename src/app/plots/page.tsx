import type { Metadata } from "next";
import { Suspense } from "react";
import PropertiesBrowser from "@/components/PropertiesBrowser";
import LeadForm from "@/components/LeadForm";
import SectionHeading from "@/components/SectionHeading";
import { getAllProperties } from "@/lib/properties";
import { plotCategorySlugs } from "@/data/categories";

export const metadata: Metadata = {
  title: "Plots in Gurugram — Residential, Commercial & SCO Plots",
  description:
    "Buy verified residential, commercial and SCO plots in Gurugram — DLF Garden City, New Gurugram, SPR and Dwarka Expressway. Clear title, all approvals, high-appreciation belts.",
  alternates: { canonical: "/plots" },
};

const why = [
  { title: "Build Your Own", desc: "Total freedom to design and build your dream home or builder floor your way." },
  { title: "Higher Appreciation", desc: "Land typically appreciates faster than built-up units in growth corridors." },
  { title: "Clear Title & Approvals", desc: "We deal only in verified plots with clean titles and all sanctions in place." },
  { title: "Flexible Investment", desc: "From affordable residential plots to premium SCO and commercial frontage." },
];

export default async function PlotsPage() {
  const all = await getAllProperties();
  const plotSet = new Set(plotCategorySlugs);
  const items = all.filter((p) => p.category && plotSet.has(p.category));

  return (
    <>
      <section className="relative overflow-hidden border-b border-line pt-32 pb-12">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-surface to-ink" />
        <div className="container-rg">
          <span className="chip mb-4">Special section · Plots</span>
          <h1 className="font-display text-4xl font-bold text-cream sm:text-5xl">
            Buy <span className="text-gradient-gold">Plots</span> in Gurugram
          </h1>
          <p className="mt-4 max-w-2xl text-muted">
            Residential, commercial and SCO plots across Gurugram&apos;s fastest-growing corridors — DLF Garden City, New Gurugram, SPR and Dwarka Expressway. Verified titles, all approvals, ready to register.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container-rg">
          <Suspense fallback={<div className="py-20 text-center text-muted">Loading plots…</div>}>
            <PropertiesBrowser items={items} hideCategory />
          </Suspense>
        </div>
      </section>

      <section className="border-t border-line bg-ink-soft py-16">
        <div className="container-rg">
          <SectionHeading eyebrow="Why plots" title="Why Invest in a Plot?" subtitle="Land remains one of the most rewarding long-term plays in Gurugram real estate." />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {why.map((w) => (
              <div key={w.title} className="card-rg h-full p-6">
                <h3 className="font-display text-lg font-semibold text-gold-bright">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-rg max-w-2xl">
          <LeadForm source="plots-page" heading="Looking for a specific plot?" sub="Tell us your preferred sector, size and budget — we'll share verified plot options." />
        </div>
      </section>
    </>
  );
}
