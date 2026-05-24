// Central business configuration for Realty Guruji.
// Single source of truth for NAP (name/address/phone), socials, and CTAs.

export const site = {
  name: "Realty Guruji",
  legalName: "Realty Guruji — Gurugram Real Estate",
  tagline: "All Gurugram Property Expert",
  description:
    "Realty Guruji is Gurugram's trusted real estate consultancy led by Rahul Soni — 14+ years of expertise in rental, resale, builder floors and society flats across all of Gurugram.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://realtyguruji.com",
  domain: "realtyguruji.com",
  locale: "en_IN",

  founder: {
    name: "Rahul Soni",
    role: "Real Estate Consultant & Broker",
    experienceYears: 14,
    bio: "Rahul Soni is the face of Realty Guruji — a Gurugram real estate consultant with over 14 years of on-ground experience helping families and investors find the right home or the right deal. From budget rentals to mid-segment resale, Rahul is known for honest advice, deep sector knowledge, and a transparent, no-pressure process.",
  },

  contact: {
    phoneDisplay: "098112 90102",
    phoneE164: "+919811290102",
    phoneRaw: "9811290102",
    email: "realtyguruji@gmail.com",
    address: "R1 Street, Sector 85, Near Maruti Workshop",
    city: "Gurugram",
    state: "Haryana",
    country: "India",
    postalCode: "122004",
    geo: { lat: 28.41, lng: 76.945 },
    hours: "Mon–Sun, 9:00 AM – 8:00 PM",
  },

  socials: {
    youtube: "https://www.youtube.com/@RealtyGuruji",
    youtubeStats: { subscribers: "5.33K", videos: 218, views: "8.2L+" },
    facebook: "https://fb.com/realtyguruji",
    instagram: "https://www.instagram.com/realtyguruji",
    linkedin: "https://www.linkedin.com/in/realty-guruji-24b544212",
  },

  stats: [
    { value: "14+", label: "Years in Gurugram" },
    { value: "1000+", label: "Happy Clients" },
    { value: "115+", label: "Sectors Covered" },
    { value: "5.3K+", label: "YouTube Subscribers" },
  ],
} as const;

// Pre-built WhatsApp deep link with an optional message.
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${site.contact.phoneRaw.length === 10 ? "91" + site.contact.phoneRaw : site.contact.phoneRaw}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function telLink(): string {
  return `tel:${site.contact.phoneE164}`;
}
