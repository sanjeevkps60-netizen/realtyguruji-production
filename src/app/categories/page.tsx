import type { Metadata } from "next";
import Link from "next/link";
import { categories } from "@/data/categories";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Property Categories in Gurgaon",
  description:
    "Explore every property category with Realty Guruji — apartments, villas, penthouses, builder floors, luxury homes, farmhouses, residential/commercial/SCO plots and office spaces in Gurgaon.",
  alternates: { canonical: "/categories" },
};

export default function CategoriesPage() {
  const groups: { label: string; kind: string }[] = [
    { label: "Residential", kind: "residential" },
    { label: "Plots", kind: "plot" },
    { label: "Commercial", kind: "commercial" },
  ];

  return (
    <>
      <section className="relative overflow-hidden border-b border-line pt-32 pb-12">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-surface to-ink" />
        <div className="container-rg">
          <span className="chip mb-4">Browse by category</span>
          <h1 className="font-display text-4xl font-bold text-cream sm:text-5xl">
            Property <span className="text-gradient-gold">Categories</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted">
            From luxury apartments and penthouses to plots, SCO and office spaces — find exactly the type of property you&apos;re looking for in Gurgaon.
          </p>
        </div>
      </section>

      {groups.map((g) => (
        <section key={g.kind} className="border-b border-line py-14 last:border-b-0">
          <div className="container-rg">
            <SectionHeading align="left" eyebrow={g.label} title={`${g.label} Properties`} />
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {categories.filter((c) => c.kind === g.kind).map((c, i) => (
                <ScrollReveal key={c.slug} delay={i * 40}>
                  <Link href={`/categories/${c.slug}`} className="card-rg group flex h-full items-start gap-4 p-6">
                    <span className="text-3xl" aria-hidden>{c.icon}</span>
                    <span>
                      <span className="block font-display text-lg font-bold text-cream group-hover:text-gold-bright">{c.name}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-muted">{c.blurb}</span>
                    </span>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
