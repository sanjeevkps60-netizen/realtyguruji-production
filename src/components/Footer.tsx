"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { site, telLink, whatsappLink } from "@/lib/site";
import { featuredSectors } from "@/data/sectors";
import { builders } from "@/data/builders";

export default function Footer() {
  const year = new Date().getFullYear();
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return (
    <footer className="border-t border-line bg-ink-soft">
      <div className="container-rg py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/images/rg-logo-mark.png" alt={site.name} width={160} height={160} className="h-20 w-20 object-contain" />
              <span className="font-display text-xl font-bold text-cream">
                Realty <span className="text-gradient-gold">Guruji</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              {site.tagline}. Led by {site.founder.name}, {site.founder.experienceYears}+ years helping Gurugram find the right home and the right deal.
            </p>
            <div className="mt-5 flex gap-3">
              <Social href={site.socials.youtube} label="YouTube"><YT /></Social>
              <Social href={site.socials.instagram} label="Instagram"><IG /></Social>
              <Social href={site.socials.facebook} label="Facebook"><FB /></Social>
              <Social href={site.socials.linkedin} label="LinkedIn"><IN /></Social>
            </div>
          </div>

          <FooterCol title="Explore">
            <FooterLink href="/properties">All Properties</FooterLink>
            <FooterLink href="/properties?type=rental">2/3 BHK Rentals</FooterLink>
            <FooterLink href="/properties?type=resale">Resale Homes</FooterLink>
            <FooterLink href="/plots">Plots</FooterLink>
            <FooterLink href="/properties?ptype=penthouse">Penthouses</FooterLink>
            <FooterLink href="/properties?ptype=farmhouse">Farmhouses</FooterLink>
            <FooterLink href="/sectors">Gurugram Sectors</FooterLink>
            <FooterLink href="/builders">Top Builders</FooterLink>
            <FooterLink href="/about">About Rahul Soni</FooterLink>
          </FooterCol>

          <FooterCol title="Top Locations">
            {featuredSectors.slice(0, 6).map((s) => (
              <FooterLink key={s.slug} href={`/sectors/${s.slug}`}>{s.name}</FooterLink>
            ))}
          </FooterCol>

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-gold-bright">Get in touch</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li className="flex gap-2">
                <PinIcon />
                <span>{site.contact.address}, Sector 85, {site.contact.city}, {site.contact.state}</span>
              </li>
              <li>
                <a href={telLink()} className="transition-colors hover:text-gold-bright">{site.contact.phoneDisplay}</a>
              </li>
              <li>
                <a href={`mailto:${site.contact.email}`} className="transition-colors hover:text-gold-bright">{site.contact.email}</a>
              </li>
              <li className="text-faint">{site.contact.hours}</li>
            </ul>
            <a
              href={whatsappLink("Hi Realty Guruji, I'd like to enquire about a property.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold mt-5 w-full"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-12 hairline" />
        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-xs text-faint sm:flex-row">
          <p>© {year} {site.name}. All rights reserved. <a href="/admin/" className="ml-1 hover:text-gold-bright">Admin</a></p>
          <p>
            Builders:{" "}
            {builders.slice(0, 5).map((b, i) => (
              <span key={b.slug}>
                <Link href={`/builders/${b.slug}`} className="hover:text-gold-bright">{b.name}</Link>
                {i < 4 ? " · " : ""}
              </span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-gold-bright">{title}</h3>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-muted transition-colors hover:text-gold-bright">{children}</Link>
    </li>
  );
}

function Social({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-gold hover:bg-gold/10 hover:text-gold-bright"
    >
      {children}
    </a>
  );
}

const PinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0 text-gold" aria-hidden>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const YT = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M23 12s0-3.8-.5-5.6a3 3 0 0 0-2.1-2.1C18.6 3.7 12 3.7 12 3.7s-6.6 0-8.4.5A3 3 0 0 0 1.5 6.4C1 8.2 1 12 1 12s0 3.8.5 5.6a3 3 0 0 0 2.1 2.1c1.8.5 8.4.5 8.4.5s6.6 0 8.4-.5a3 3 0 0 0 2.1-2.1C23 15.8 23 12 23 12zM9.8 15.3V8.7l5.7 3.3-5.7 3.3z" /></svg>);
const IG = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>);
const FB = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z" /></svg>);
const IN = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.6h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.3c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8V21H9z" /></svg>);
