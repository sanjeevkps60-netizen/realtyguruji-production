"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site, telLink, whatsappLink } from "@/lib/site";

const nav = [
  { label: "Home", href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "Categories", href: "/categories" },
  { label: "Plots", href: "/plots" },
  { label: "Sectors", href: "/sectors" },
  { label: "Builders", href: "/builders" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass border-b border-line/60 py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container-rg flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5" aria-label={site.name}>
          <Image
            src="/images/rg-logo-mark.png"
            alt={site.name}
            width={128}
            height={128}
            className="h-14 w-14 object-contain"
            priority
          />
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-bold tracking-wide text-cream">
              Realty <span className="text-gradient-gold">Guruji</span>
            </span>
            <span className="text-[0.62rem] uppercase tracking-[0.22em] text-muted">
              Gurugram Property Expert
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-muted transition-colors hover:bg-white/5 hover:text-cream"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a href={telLink()} className="btn-ghost px-4 py-2 text-sm" aria-label="Call Realty Guruji">
            <PhoneIcon /> Call
          </a>
          <a
            href={whatsappLink("Hi Realty Guruji, I'm looking for a property in Gurugram.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold px-4 py-2 text-sm"
          >
            <WhatsIcon /> WhatsApp
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-line text-cream lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <span className="relative block h-4 w-5">
            <span className={`absolute left-0 h-0.5 w-5 bg-current transition-all ${open ? "top-2 rotate-45" : "top-0"}`} />
            <span className={`absolute left-0 top-2 h-0.5 w-5 bg-current transition-all ${open ? "opacity-0" : "opacity-100"}`} />
            <span className={`absolute left-0 h-0.5 w-5 bg-current transition-all ${open ? "top-2 -rotate-45" : "top-4"}`} />
          </span>
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 top-0 z-40 lg:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <div
          className={`absolute inset-0 bg-ink/80 backdrop-blur-sm transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />
        <nav
          className={`absolute right-0 top-0 h-full w-[82%] max-w-sm overflow-y-auto border-l border-line bg-ink-soft p-6 pt-24 transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
          aria-label="Mobile"
        >
          <div className="flex flex-col gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-medium text-cream transition-colors hover:bg-white/5"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <a href={telLink()} className="btn-ghost w-full">
              <PhoneIcon /> {site.contact.phoneDisplay}
            </a>
            <a
              href={whatsappLink("Hi Realty Guruji, I'm looking for a property in Gurugram.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold w-full"
              onClick={() => setOpen(false)}
            >
              <WhatsIcon /> Chat on WhatsApp
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function WhatsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24s-3.7 8.42-8.24 8.42zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42-.14 0-.31-.02-.47-.02-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29z" />
    </svg>
  );
}
