import Image from "next/image";
import Link from "next/link";
import { site, telLink, whatsappLink } from "@/lib/site";
import { testimonials, marketInsights, featuredBuilders } from "@/data/properties";
import { getFeaturedProperties } from "@/lib/properties";
import { featuredSectors } from "@/data/sectors";
import { generalFaqs } from "@/data/faqs";
import HeroSearch from "@/components/HeroSearch";
import PropertyCard from "@/components/PropertyCard";
import LeadForm from "@/components/LeadForm";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: generalFaqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default async function Home() {
  const featured = await getFeaturedProperties(6);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* ---------------- HERO ---------------- */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden">
        <Image
          src="/images/hero-banner.png"
          alt="Gurgaon skyline"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/70 to-ink" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/40 to-transparent" />

        <div className="container-rg relative z-10 pt-28 pb-16">
          <div className="max-w-2xl">
            <span className="chip mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#25d366]" /> {site.founder.experienceYears}+ years · All of Gurugram
            </span>
            <h1 className="font-display text-4xl font-bold leading-[1.05] text-cream sm:text-5xl lg:text-6xl">
              Find Your Perfect <span className="text-gradient-gold">Gurgaon</span> Home
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-cream/80">
              {site.tagline}. From budget rentals to premium resale — {site.founder.name} helps you find the right property with honest advice and verified deals.
            </p>

            <div className="mt-8 max-w-2xl">
              <HeroSearch />
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href={whatsappLink("Hi Realty Guruji, I'm looking for a property in Gurgaon.")} target="_blank" rel="noopener noreferrer" className="btn-gold">
                Talk to Rahul on WhatsApp
              </a>
              <a href={telLink()} className="btn-ghost">Call {site.contact.phoneDisplay}</a>
            </div>
          </div>

          {/* Trust stats */}
          <div className="mt-14 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
            {site.stats.map((s) => (
              <div key={s.label} className="glass rounded-xl px-4 py-3 text-center">
                <p className="font-display text-2xl font-bold text-gold-bright">{s.value}</p>
                <p className="mt-0.5 text-xs text-cream/70">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FEATURED PROPERTIES ---------------- */}
      <section className="py-20 sm:py-24">
        <div className="container-rg">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              align="left"
              eyebrow="Handpicked"
              title="Featured Properties"
              subtitle="Verified rentals and resale homes across Gurgaon's most-wanted sectors."
            />
            <Link href="/properties" className="btn-ghost hidden sm:inline-flex">View all properties</Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <ScrollReveal key={p.id} delay={i * 60}>
                <PropertyCard property={p} />
              </ScrollReveal>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link href="/properties" className="btn-ghost">View all properties</Link>
          </div>
        </div>
      </section>

      {/* ---------------- SECTOR / ZONE NAV ---------------- */}
      <section className="border-y border-line bg-ink-soft py-20 sm:py-24">
        <div className="container-rg">
          <SectionHeading
            eyebrow="Explore by location"
            title="Gurgaon's Prime Corridors"
            subtitle="Sector-wise price trends, connectivity and investment scores — pick where you want to live or invest."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredSectors.map((s, i) => (
              <ScrollReveal key={s.slug} delay={i * 50}>
                <Link href={`/sectors/${s.slug}`} className="card-rg group flex h-full flex-col p-6">
                  <div className="flex items-center justify-between">
                    <span className="chip">{s.highlight}</span>
                    <span className="text-sm font-semibold text-gold-bright">Score {s.investmentScore}/10</span>
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold text-cream group-hover:text-gold-bright">{s.name}</h3>
                  <p className="mt-1 text-sm text-muted">{s.tagline}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-line pt-4 text-sm">
                    <span className="text-muted">From <span className="font-semibold text-cream">{s.priceFrom}</span></span>
                    <span className="text-[#7ee2a8]">{s.priceTrend}</span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/sectors" className="btn-ghost">Browse all 115+ sectors</Link>
          </div>
        </div>
      </section>

      {/* ---------------- MARKET INSIGHTS ---------------- */}
      <section className="py-20 sm:py-24">
        <div className="container-rg">
          <SectionHeading
            eyebrow="Market intelligence"
            title="Gurgaon Market Insights"
            subtitle="Live pricing bands across rental and resale segments — so you negotiate from knowledge."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {marketInsights.map((m, i) => (
              <ScrollReveal key={m.title} delay={i * 50}>
                <div className="card-rg h-full p-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted">{m.title}</p>
                    <span className="rounded-full bg-[#7ee2a8]/10 px-2 py-0.5 text-xs font-semibold text-[#7ee2a8]">{m.change}</span>
                  </div>
                  <p className="mt-3 font-display text-xl font-bold text-gold-bright">{m.range}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{m.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- BUILDERS ---------------- */}
      <section className="border-y border-line bg-ink-soft py-20 sm:py-24">
        <div className="container-rg">
          <SectionHeading
            eyebrow="Trusted developers"
            title="Top Gurgaon Builders"
            subtitle="We deal across every leading developer — new launches, resale and verified inventory."
          />
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {featuredBuilders.map((b, i) => (
              <ScrollReveal key={b.name} delay={i * 30}>
                <Link
                  href={`/builders/${b.name.toLowerCase().replace(/\s+/g, "-")}`}
                  className="card-rg flex h-full flex-col items-center justify-center p-6 text-center"
                >
                  <span className="font-display text-lg font-bold text-cream">{b.name}</span>
                  <span className="mt-1 text-xs text-muted">{b.tagline}</span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/builders" className="btn-ghost">Explore all builders</Link>
          </div>
        </div>
      </section>

      {/* ---------------- ABOUT RAHUL + YOUTUBE ---------------- */}
      <section className="py-20 sm:py-24">
        <div className="container-rg">
          <ScrollReveal className="mx-auto max-w-3xl text-center">
            <span className="chip mb-4">Meet your consultant</span>
            <h2 className="font-display text-3xl font-bold text-cream sm:text-4xl">{site.founder.name}</h2>
            <p className="mt-1 text-gold-bright">{site.founder.role}</p>
            <p className="mt-5 leading-relaxed text-muted">{site.founder.bio}</p>

            <div className="mx-auto mt-8 grid max-w-lg grid-cols-3 gap-4">
              <YtStat value={site.socials.youtubeStats.subscribers} label="Subscribers" />
              <YtStat value={`${site.socials.youtubeStats.videos}`} label="Videos" />
              <YtStat value={site.socials.youtubeStats.views} label="Views" />
            </div>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <a href={site.socials.youtube} target="_blank" rel="noopener noreferrer" className="btn-gold">
                Watch on YouTube
              </a>
              <Link href="/about" className="btn-ghost">More about Rahul</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ---------------- TESTIMONIALS ---------------- */}
      <section className="border-y border-line bg-ink-soft py-20 sm:py-24">
        <div className="container-rg">
          <SectionHeading
            eyebrow="Client love"
            title="What Gurgaon Says About Us"
            subtitle="Real families and investors who found their match with Realty Guruji."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.slice(0, 6).map((t, i) => (
              <ScrollReveal key={t.id} delay={i * 50}>
                <figure className="card-rg h-full p-6">
                  <div className="flex gap-0.5 text-gold-bright" aria-label={`${t.rating} star rating`}>
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} filled={idx < t.rating} />
                    ))}
                  </div>
                  <blockquote className="mt-4 text-sm leading-relaxed text-cream/90">“{t.text}”</blockquote>
                  <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 font-semibold text-gold-bright">
                      {t.name.charAt(0)}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-cream">{t.name}</span>
                      <span className="block text-xs text-muted">{t.role}</span>
                    </span>
                  </figcaption>
                </figure>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="py-20 sm:py-24">
        <div className="container-rg grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <SectionHeading
            align="left"
            eyebrow="Good to know"
            title="Frequently Asked Questions"
            subtitle="Quick answers about how Realty Guruji works in Gurgaon."
          />
          <div className="space-y-3">
            {generalFaqs.map((f) => (
              <details key={f.q} className="card-rg group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-cream">
                  {f.q}
                  <span className="text-gold-bright transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- LEAD CTA ---------------- */}
      <section className="relative overflow-hidden border-t border-line py-20 sm:py-24">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-surface to-ink" />
        <div className="container-rg grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold text-cream sm:text-4xl">
              Ready to find your <span className="text-gradient-gold">Gurgaon</span> property?
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-muted">
              Tell us what you're looking for. Rahul will personally shortlist verified options and call you back — no spam, no pressure.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-cream/90">
              {["Verified, owner-direct listings", "Honest pricing & negotiation help", "Full support for NRIs & investors", "Site visits within 24–48 hours"].map((b) => (
                <li key={b} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/15 text-gold-bright">✓</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <LeadForm source="homepage" />
        </div>
      </section>
    </>
  );
}

function YtStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-line bg-ink-soft p-4 text-center">
      <p className="font-display text-xl font-bold text-cream">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}

function Star({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
