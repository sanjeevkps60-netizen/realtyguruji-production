import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { testimonials } from "@/data/properties";
import SectionHeading from "@/components/SectionHeading";
import LeadForm from "@/components/LeadForm";

export const metadata: Metadata = {
  title: "About Rahul Soni — Gurgaon Real Estate Consultant",
  description:
    "Meet Rahul Soni, founder of Realty Guruji — 8+ years helping Gurugram families and investors with rentals, resale, builder floors and society flats. Honest, transparent advice.",
  alternates: { canonical: "/about" },
};

const values = [
  { title: "Honest & Transparent", desc: "No hidden charges, no inflated prices. Just straight, dependable advice you can act on." },
  { title: "Deep Local Knowledge", desc: "8+ years on the ground across every Gurgaon sector — from Dwarka Expressway to Golf Course Road." },
  { title: "Verified Listings Only", desc: "Owner-direct and verified inventory, so you never waste time on dead leads." },
  { title: "End-to-End Support", desc: "From shortlisting and site visits to negotiation and paperwork — including full NRI support." },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line pt-32 pb-16">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-surface to-ink" />
        <div className="container-rg max-w-3xl">
          <div>
            <span className="chip mb-4">Meet your consultant</span>
            <h1 className="font-display text-4xl font-bold text-cream sm:text-5xl">{site.founder.name}</h1>
            <p className="mt-2 text-gold-bright">{site.founder.role} · {site.founder.experienceYears}+ years</p>
            <p className="mt-5 leading-relaxed text-muted">{site.founder.bio}</p>
            <div className="mt-6 grid grid-cols-3 gap-4">
              {site.stats.slice(0, 3).map((s) => (
                <div key={s.label} className="rounded-xl border border-line bg-ink-soft p-4 text-center">
                  <p className="font-display text-xl font-bold text-gold-bright">{s.value}</p>
                  <p className="text-xs text-muted">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href={site.socials.youtube} target="_blank" rel="noopener noreferrer" className="btn-gold">Watch on YouTube</a>
              <Link href="/contact" className="btn-ghost">Get in touch</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-rg">
          <SectionHeading eyebrow="Why Realty Guruji" title="What Sets Us Apart" subtitle="A relationship-first approach to Gurgaon real estate — built on trust earned over hundreds of deals." />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="card-rg h-full p-6">
                <h3 className="font-display text-lg font-semibold text-gold-bright">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-ink-soft py-20">
        <div className="container-rg">
          <SectionHeading eyebrow="Client stories" title="Trusted Across Gurgaon" />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.slice(0, 6).map((t) => (
              <figure key={t.id} className="card-rg h-full p-6">
                <blockquote className="text-sm leading-relaxed text-cream/90">“{t.text}”</blockquote>
                <figcaption className="mt-5 border-t border-line pt-4 text-sm">
                  <span className="font-semibold text-cream">{t.name}</span>
                  <span className="block text-xs text-muted">{t.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-rg max-w-2xl">
          <LeadForm source="about-page" />
        </div>
      </section>
    </>
  );
}
