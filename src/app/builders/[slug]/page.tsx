import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllBuilderSlugs, getBuilderBySlug } from "@/data/builders";
import { properties } from "@/data/properties";
import { whatsappLink } from "@/lib/site";
import PropertyCard from "@/components/PropertyCard";
import LeadForm from "@/components/LeadForm";

export function generateStaticParams() {
  return getAllBuilderSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const b = getBuilderBySlug(slug);
  if (!b) return { title: "Builder not found" };
  return {
    title: `${b.name} Gurugram Projects, Prices & Reviews`,
    description: `${b.name} (${b.tagline}): ${b.intro.slice(0, 130)} Projects from ${b.priceFrom}.`,
    alternates: { canonical: `/builders/${b.slug}` },
  };
}

export default async function BuilderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const b = getBuilderBySlug(slug);
  if (!b) notFound();

  const matching = properties.filter((p) => p.builder.toLowerCase().includes(b.name.toLowerCase())).slice(0, 3);
  const statusColor: Record<string, string> = {
    "Ready": "text-[#7ee2a8]",
    "New Launch": "text-gold-bright",
    "Under Construction": "text-amber-300",
  };

  return (
    <>
      <section className="relative overflow-hidden border-b border-line pt-32 pb-12">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-surface to-ink" />
        <div className="container-rg">
          <nav className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-gold-bright">Home</Link><span>/</span>
            <Link href="/builders" className="hover:text-gold-bright">Builders</Link><span>/</span>
            <span className="text-cream">{b.name}</span>
          </nav>
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="font-display text-4xl font-bold text-cream sm:text-5xl">{b.name}</h1>
            <span className="chip">★ {b.rating} rating</span>
            <span className="chip">Since {b.founded}</span>
          </div>
          <p className="mt-2 text-gold-bright">{b.tagline}</p>
          <p className="mt-5 max-w-3xl leading-relaxed text-muted">{b.intro}</p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {b.focus.map((f) => (
              <span key={f} className="rounded-full border border-line bg-ink-soft px-3.5 py-1.5 text-sm text-cream/90">{f}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-rg grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <h2 className="font-display text-2xl font-bold text-cream">Key Projects in Gurugram</h2>
            <div className="mt-6 space-y-4">
              {b.projects.map((pr) => (
                <div key={pr.name} className="card-rg flex flex-wrap items-center justify-between gap-4 p-5">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-cream">{pr.name}</h3>
                    <p className="mt-0.5 text-sm text-muted">{pr.location} · {pr.type}</p>
                  </div>
                  <span className={`text-sm font-semibold ${statusColor[pr.status] || "text-muted"}`}>{pr.status}</span>
                </div>
              ))}
            </div>

            {b.faqs.length > 0 && (
              <div className="mt-12">
                <h2 className="font-display text-2xl font-bold text-cream">FAQs</h2>
                <div className="mt-4 space-y-3">
                  {b.faqs.map((f) => (
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
              <p className="text-sm text-muted">Projects starting from</p>
              <p className="font-display text-3xl font-bold text-gradient-gold">{b.priceFrom}</p>
              <a href={whatsappLink(`Hi Rahul, I'm interested in ${b.name} projects in Gurugram.`)} target="_blank" rel="noopener noreferrer" className="btn-gold mt-5 w-full">
                Enquire about {b.name}
              </a>
            </div>
            <div className="mt-6">
              <LeadForm compact source={`builder-${b.slug}`} heading={`${b.name} enquiry`} sub="Which project interests you?" />
            </div>
          </aside>
        </div>
      </section>

      {matching.length > 0 && (
        <section className="border-t border-line bg-ink-soft py-16">
          <div className="container-rg">
            <h2 className="font-display text-2xl font-bold text-cream">{b.name} Listings</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {matching.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
