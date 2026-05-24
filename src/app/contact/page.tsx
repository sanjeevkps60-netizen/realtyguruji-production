import type { Metadata } from "next";
import { site, telLink, whatsappLink } from "@/lib/site";
import LeadForm from "@/components/LeadForm";

export const metadata: Metadata = {
  title: "Contact Realty Guruji — Gurugram Property Consultant",
  description:
    "Get in touch with Realty Guruji (Rahul Soni) for rentals, resale and investment in Gurugram. Call 098112 90102, WhatsApp, or visit our Sector 85 office.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line pt-32 pb-12">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-surface to-ink" />
        <div className="container-rg">
          <span className="chip mb-4">We reply fast</span>
          <h1 className="font-display text-4xl font-bold text-cream sm:text-5xl">
            Let's Find Your <span className="text-gradient-gold">Property</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted">
            Call, WhatsApp or send your requirement below. Rahul personally responds — usually within minutes during working hours.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-rg grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <ContactCard
              title="Call us"
              value={site.contact.phoneDisplay}
              href={telLink()}
              cta="Tap to call"
            />
            <ContactCard
              title="WhatsApp"
              value={site.contact.phoneDisplay}
              href={whatsappLink("Hi Realty Guruji, I'd like to enquire about a property in Gurugram.")}
              cta="Chat now"
              external
            />
            <ContactCard
              title="Email"
              value={site.contact.email}
              href={`mailto:${site.contact.email}`}
              cta="Send email"
            />
            <div className="card-rg p-6">
              <h3 className="font-display text-lg font-semibold text-gold-bright">Office</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream/90">
                {site.contact.address},<br />Sector 85, {site.contact.city}, {site.contact.state}
              </p>
              <p className="mt-2 text-sm text-muted">{site.contact.hours}</p>
              <div className="mt-4 overflow-hidden rounded-xl border border-line">
                <iframe
                  title="Realty Guruji office location"
                  src={`https://maps.google.com/maps?q=${site.contact.geo.lat},${site.contact.geo.lng}&z=14&output=embed`}
                  className="h-56 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

          <div>
            <LeadForm source="contact-page" heading="Send your requirement" sub="Fill this in and we'll get back to you with matching options." />
          </div>
        </div>
      </section>
    </>
  );
}

function ContactCard({ title, value, href, cta, external }: { title: string; value: string; href: string; cta: string; external?: boolean }) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="card-rg flex items-center justify-between p-6"
    >
      <div>
        <p className="text-sm text-muted">{title}</p>
        <p className="mt-1 font-display text-xl font-semibold text-cream">{value}</p>
      </div>
      <span className="text-sm font-semibold text-gold-bright">{cta} →</span>
    </a>
  );
}
