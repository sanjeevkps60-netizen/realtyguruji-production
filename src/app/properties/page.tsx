import type { Metadata } from "next";
import { Suspense } from "react";
import PropertiesBrowser from "@/components/PropertiesBrowser";
import LeadForm from "@/components/LeadForm";
import { getAllProperties } from "@/lib/properties";

export const metadata: Metadata = {
  title: "Properties for Rent & Sale in Gurgaon",
  description:
    "Browse verified apartments, villas, penthouses, builder floors, plots and commercial properties across Gurgaon — Dwarka Expressway, Golf Course Road, SPR & New Gurgaon.",
  alternates: { canonical: "/properties" },
};

export default async function PropertiesPage() {
  const items = await getAllProperties();
  return (
    <>
      <section className="relative overflow-hidden border-b border-line pt-32 pb-12">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-surface to-ink" />
        <div className="container-rg">
          <span className="chip mb-4">Live inventory</span>
          <h1 className="font-display text-4xl font-bold text-cream sm:text-5xl">
            Properties in <span className="text-gradient-gold">Gurgaon</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted">
            Verified listings across every category and prime corridor. Use the filters to find your match — or tell us your requirement and we&apos;ll source it.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container-rg">
          <Suspense fallback={<div className="py-20 text-center text-muted">Loading properties…</div>}>
            <PropertiesBrowser items={items} />
          </Suspense>
        </div>
      </section>

      <section className="border-t border-line bg-ink-soft py-16">
        <div className="container-rg max-w-2xl">
          <LeadForm source="properties-page" heading="Didn't find the right one?" sub="Share your exact requirement and budget — Rahul will personally shortlist verified options for you." />
        </div>
      </section>
    </>
  );
}
