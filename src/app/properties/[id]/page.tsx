import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllProperties, getPropertyById } from "@/lib/properties";
import { categoryHasBhk } from "@/data/categories";
import { site, telLink, whatsappLink } from "@/lib/site";
import PropertyGallery from "@/components/PropertyGallery";
import PropertyCard from "@/components/PropertyCard";
import LeadForm from "@/components/LeadForm";
import ShareButton from "@/components/ShareButton";
import PropertyMedia from "@/components/PropertyMedia";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = await getPropertyById(id);
  if (!p) return { title: "Property not found" };
  const noBhkMeta = p.propertyType === "plot" || p.propertyType === "commercial" || !categoryHasBhk(p.category);

  // Absolute source image, then run it through Netlify's image CDN so the OG
  // thumbnail is a compact ~1200×630 JPEG (<300 KB) — WhatsApp/Instagram skip
  // large images, so this guarantees the photo shows in link previews.
  const rawImg = p.image || "/images/hero-banner.png";
  const imgAbs = rawImg.startsWith("http") ? rawImg : `${site.url}${rawImg}`;
  const ogImg = `${site.url}/.netlify/images?url=${encodeURIComponent(imgAbs)}&w=1200&h=630&fit=cover&fm=jpg&q=72`;

  const ogTitle = `${p.title} · ${p.priceLabel}`;
  const ogDesc = `${noBhkMeta ? (p.propertyType === "plot" ? "Plot" : "Commercial") : `${p.bhk} BHK`} · ${p.area} ${p.areaUnit} · ${p.zone}, Gurugram. ${p.description.slice(0, 120)}`;
  const url = `${site.url}/properties/${p.id}`;

  return {
    title: `${p.title} — ${p.priceLabel}`,
    description: ogDesc,
    alternates: { canonical: `/properties/${p.id}` },
    openGraph: {
      type: "website",
      url,
      siteName: site.name,
      title: ogTitle,
      description: ogDesc,
      images: [{ url: ogImg, width: 1200, height: 630, alt: p.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDesc,
      images: [ogImg],
    },
  };
}

export default async function PropertyDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await getPropertyById(id);
  if (!p) notFound();

  const all = await getAllProperties();
  const related = all.filter((x) => x.id !== p.id && (x.zone === p.zone || x.bhk === p.bhk)).slice(0, 3);
  const enquiryMsg = `Hi Rahul, I'm interested in "${p.title}" (${p.priceLabel}) in ${p.address}. Please share details.`;

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: p.title,
    description: p.description,
    image: p.images,
    address: { "@type": "PostalAddress", streetAddress: p.address, addressLocality: site.contact.city, addressRegion: site.contact.state, addressCountry: "IN" },
    geo: { "@type": "GeoCoordinates", latitude: p.lat, longitude: p.lng },
    numberOfRooms: p.bhk || undefined,
    floorSize: { "@type": "QuantitativeValue", value: p.area, unitText: p.areaUnit },
  };

  const isPlot = p.propertyType === "plot";
  const noBhk = isPlot || p.propertyType === "commercial" || !categoryHasBhk(p.category);
  const specs = [
    ...(noBhk
      ? [{ label: isPlot ? "Plot Area" : "Area", value: `${p.area} ${p.areaUnit}` }]
      : [
          { label: "Configuration", value: `${p.bhk} BHK` },
          { label: "Built-up Area", value: `${p.area} ${p.areaUnit}` },
          { label: "Furnishing", value: p.furnishing, cap: true },
          { label: "Floor", value: p.floor },
        ]),
    { label: "Facing", value: p.facing },
    { label: "Possession", value: p.possession },
    { label: "Builder", value: p.builder },
    ...(p.roi ? [{ label: "Est. ROI", value: p.roi }] : []),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} />

      <div className="container-rg pt-28 pb-16">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gold-bright">Home</Link><span>/</span>
          <Link href="/properties" className="hover:text-gold-bright">Properties</Link><span>/</span>
          <span className="text-cream">{p.title}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <PropertyGallery images={p.images} alt={p.title} />

            <div className="mt-8">
              <div className="flex flex-wrap items-center gap-2">
                {p.badge && <span className="chip">{p.badge}</span>}
                <span className="chip capitalize">{p.type}</span>
                <span className="chip">{p.zone}</span>
              </div>
              <h1 className="mt-4 font-display text-3xl font-bold text-cream sm:text-4xl">{p.title}</h1>
              <p className="mt-2 text-muted">{p.address}</p>
              <p className="mt-4 font-display text-3xl font-bold text-gradient-gold">{p.priceLabel}</p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {specs.map((sp) => (
                <div key={sp.label} className="rounded-xl border border-line bg-ink-soft p-4">
                  <p className="text-xs uppercase tracking-wide text-faint">{sp.label}</p>
                  <p className={`mt-1 font-semibold text-cream ${sp.cap ? "capitalize" : ""}`}>{sp.value}</p>
                </div>
              ))}
            </div>

            {p.description && (
              <div className="mt-10">
                <h2 className="font-display text-2xl font-bold text-cream">Overview</h2>
                <p className="mt-3 leading-relaxed text-muted">{p.description}</p>
              </div>
            )}

            <PropertyMedia
              videoUrl={p.videoUrl}
              tour360Url={p.tour360Url}
              model3dUrl={p.model3dUrl}
              title={p.title}
            />

            {p.amenities.length > 0 && (
              <div className="mt-10">
                <h2 className="font-display text-2xl font-bold text-cream">Amenities</h2>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {p.amenities.map((a) => (
                    <span key={a} className="rounded-full border border-line bg-ink-soft px-3.5 py-1.5 text-sm text-cream/90">{a}</span>
                  ))}
                </div>
              </div>
            )}

            {p.nearbyPlaces.length > 0 && (
              <div className="mt-10">
                <h2 className="font-display text-2xl font-bold text-cream">What&apos;s Nearby</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {p.nearbyPlaces.map((nb) => (
                    <div key={nb.name} className="flex items-center justify-between rounded-xl border border-line bg-ink-soft px-4 py-3">
                      <span className="text-sm text-cream/90">{nb.name}<span className="ml-2 text-xs capitalize text-faint">{nb.type}</span></span>
                      <span className="text-sm font-medium text-gold-bright">{nb.distance}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10">
              <h2 className="font-display text-2xl font-bold text-cream">Location</h2>
              <div className="mt-4 overflow-hidden rounded-2xl border border-line">
                <iframe
                  title={`Map of ${p.title}`}
                  src={`https://maps.google.com/maps?q=${p.lat},${p.lng}&z=14&output=embed`}
                  className="h-72 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="card-rg p-6">
              <p className="text-sm text-muted">Asking price</p>
              <p className="font-display text-3xl font-bold text-gradient-gold">{p.priceLabel}</p>
              <p className="mt-1 text-sm text-muted">Sector {p.sector} · {p.zone}</p>
              <div className="mt-5 flex flex-col gap-3">
                <a href={whatsappLink(enquiryMsg)} target="_blank" rel="noopener noreferrer" className="btn-gold w-full">Enquire on WhatsApp</a>
                <a href={telLink()} className="btn-ghost w-full">Call {site.contact.phoneDisplay}</a>
                <ShareButton title={p.title} />
              </div>
              <div className="my-6 hairline" />
              <p className="text-sm font-medium text-cream">Book a site visit</p>
              <p className="mt-1 text-xs text-muted">Usually arranged within 24–48 hours.</p>
            </div>
            <div className="mt-6">
              <LeadForm compact source="property-detail" propertyId={p.id} heading="Request a callback" sub="Rahul will call you about this property." />
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="font-display text-2xl font-bold text-cream">Similar Properties</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <PropertyCard key={r.id} property={r} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
