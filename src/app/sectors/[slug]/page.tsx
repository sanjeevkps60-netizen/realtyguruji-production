import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllSectorSlugs, getSectorBySlug } from "@/data/sectors";
import { properties } from "@/data/properties";
import { site, whatsappLink } from "@/lib/site";
import PropertyCard from "@/components/PropertyCard";
import LeadForm from "@/components/LeadForm";

export function generateStaticParams() {
  return getAllSectorSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getSectorBySlug(slug);
  if (!s) return { title: "Sector not found" };
  return {
    title: `${s.name} Gurgaon — Property Prices, Trends & Listings`,
    description: `${s.name} (${s.zone}): ${s.intro.slice(0, 130)} Prices from ${s.priceFrom}, ${s.priceTrend}.`,
    alternates: { canonical: `/sectors/${s.slug}` },
  };
}

export default async function SectorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getSectorBySlug(slug);
  if (!s) notFound();

  const num = s.kind === "sector" ? Number(s.name.replace("Sector ", "")) : null;
  const matching = properties
    .filter((p) => (num ? p.sector === num : p.zone === s.zone))
    .slice(0, 6);
  const fallback = matching.length ? matching : properties.filter((p) => p.featured).slice(0, 3);

  const faqLd = s.faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: s.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }
    : null;

  return (
    <>
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}

      <section className="relative overflow-hidden border-b border-line pt-32 pb-12">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-surface to-ink" />
        <div className="container-rg">
          <nav className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-gold-bright">Home</Link><span>/</span>
            <Link href="/sectors" className="hover:text-gold-bright">Sectors</Link><span>/</span>
            <span className="text-cream">{s.name}</span>
          </nav>
          <span className="chip mb-4">{s.highlight}</span>
          <h1 className="font-display text-4xl font-bold text-cream sm:text-5xl">
            {s.name} <span className="text-gradient-gold">Gurgaon</span>
          </h1>
          <p className="mt-2 text-gold-bright">{s.tagline}</p>
          <p className="mt-5 max-w-3xl leading-relaxed text-muted">{s.intro}</p>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat label="Price from" value={s.priceFrom} />
            <Stat label="Price trend" value={s.priceTrend} accent />
            <Stat label="Rental range" value={s.rentRange} />
            <Stat label="Investment score" value={`${s.investmentScore}/10`} />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-rg grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-10">
            <InfoBlock title="Connectivity" items={s.connectivity} />
            <InfoBlock title="Infrastructure & Lifestyle" items={s.infrastructure} />
            <div className="grid gap-6 sm:grid-cols-2">
              <ListCard title="Schools" items={s.schools} />
              <ListCard title="Hospitals" items={s.hospitals} />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-cream">Active Builders Here</h2>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {s.builders.map((b) => (
                  <Link
                    key={b}
                    href={`/builders/${b.toLowerCase().replace(/\s+/g, "-")}`}
                    className="rounded-full border border-line bg-ink-soft px-4 py-2 text-sm text-cream/90 transition-colors hover:border-gold hover:text-gold-bright"
                  >
                    {b}
                  </Link>
                ))}
              </div>
            </div>

            {s.faqs.length > 0 && (
              <div>
                <h2 className="font-display text-2xl font-bold text-cream">FAQs about {s.name}</h2>
                <div className="mt-4 space-y-3">
                  {s.faqs.map((f) => (
                    <details key={f.q} className="card-rg group p-5">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-cream">
                        {f.q}<span className="text-gold-bright transition-transform group-open:rotate-45">+</span>
                      </summary>
                      <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="card-rg p-6">
              <h3 className="font-display text-lg font-bold text-cream">Investing in {s.name}?</h3>
              <p className="mt-2 text-sm text-muted">Get current verified listings, fair pricing and an expert area consultation from Rahul.</p>
              <a href={whatsappLink(`Hi Rahul, I'm interested in property in ${s.name}, Gurgaon.`)} target="_blank" rel="noopener noreferrer" className="btn-gold mt-4 w-full">
                Get {s.name} options
              </a>
            </div>
            <div className="mt-6">
              <LeadForm compact source={`sector-${s.slug}`} heading="Area consultation" sub={`Tell us your budget for ${s.name}.`} />
            </div>
          </aside>
        </div>
      </section>

      <section className="border-t border-line bg-ink-soft py-16">
        <div className="container-rg">
          <h2 className="font-display text-2xl font-bold text-cream">
            {matching.length ? `Properties in ${s.name}` : "You may also like"}
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fallback.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
          <div className="mt-8">
            <Link href="/properties" className="btn-ghost">View all properties</Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="glass rounded-xl p-4">
      <p className="text-xs uppercase tracking-wide text-faint">{label}</p>
      <p className={`mt-1 font-display text-lg font-bold ${accent ? "text-[#7ee2a8]" : "text-cream"}`}>{value}</p>
    </div>
  );
}

function InfoBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-cream">{title}</h2>
      <ul className="mt-4 space-y-3">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-3 text-muted">
            <span className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/15 text-xs text-gold-bright">✓</span>
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ListCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="card-rg p-5">
      <h3 className="font-display text-lg font-semibold text-gold-bright">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm text-muted">
        {items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
    </div>
  );
}
