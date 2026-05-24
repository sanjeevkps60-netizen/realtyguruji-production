// Builder/developer data — powers /builders and /builders/[slug] pages.

export interface Builder {
  slug: string;
  name: string;
  tagline: string;
  founded: string;
  intro: string;
  focus: string[];
  priceFrom: string;
  rating: number;
  projects: { name: string; location: string; type: string; status: string }[];
  faqs: { q: string; a: string }[];
}

export const builders: Builder[] = [
  {
    slug: "dlf",
    name: "DLF",
    tagline: "Building India since 1946",
    founded: "1946",
    intro:
      "DLF is India's largest real estate developer and the company that built modern Gurugram. From DLF Phases and Golf Course Road to The Camellias and plotted townships, DLF properties command premium value and trust.",
    focus: ["Luxury high-rises", "Plotted townships", "Builder floors", "Commercial"],
    priceFrom: "₹2.2 Cr",
    rating: 4.7,
    projects: [
      { name: "The Camellias", location: "Golf Course Road", type: "Ultra-Luxury", status: "Ready" },
      { name: "DLF Garden City", location: "Sector 76–77", type: "Plots", status: "Ready" },
      { name: "DLF Privana", location: "Sector 76–77", type: "High-Rise", status: "New Launch" },
      { name: "DLF Phase 1–5", location: "Golf Course Road", type: "Floors/Plots", status: "Ready" },
    ],
    faqs: [
      {
        q: "Why invest in a DLF property in Gurgaon?",
        a: "DLF offers unmatched brand trust, prime locations and strong resale value. Realty Guruji helps you find verified DLF resale and new-launch inventory at fair prices.",
      },
    ],
  },
  {
    slug: "m3m",
    name: "M3M",
    tagline: "Magnificence in the Trinity",
    founded: "2007",
    intro:
      "M3M is among Gurugram's fastest-growing luxury developers, known for design-led high-rises and integrated commercial hubs across Golf Course Extension Road, Dwarka Expressway and SPR.",
    focus: ["Luxury residences", "Retail & commercial", "Branded living"],
    priceFrom: "₹1.8 Cr",
    rating: 4.5,
    projects: [
      { name: "M3M Crown", location: "Sector 111, Dwarka Expressway", type: "High-Rise", status: "New Launch" },
      { name: "M3M Golf Estate", location: "Sector 65", type: "Luxury", status: "Ready" },
      { name: "M3M Antalya Hills", location: "Sector 79", type: "Low-Rise", status: "Under Construction" },
    ],
    faqs: [],
  },
  {
    slug: "smartworld",
    name: "Smartworld",
    tagline: "Smart living, redefined",
    founded: "2020",
    intro:
      "Smartworld Developers focus on technology-enabled premium living, with landmark projects on SPR and Dwarka Expressway aimed at young professionals and upgraders.",
    focus: ["Tech-enabled homes", "Premium high-rises"],
    priceFrom: "₹1.6 Cr",
    rating: 4.3,
    projects: [
      { name: "Smartworld One DXP", location: "Sector 113, Dwarka Expressway", type: "High-Rise", status: "Under Construction" },
      { name: "Smartworld Orchard", location: "Sector 61, SPR", type: "Low-Rise", status: "Ready" },
    ],
    faqs: [],
  },
  {
    slug: "signature-global",
    name: "Signature Global",
    tagline: "Affordable to premium luxury",
    founded: "2014",
    intro:
      "Signature Global is one of Gurugram's most active developers, spanning affordable housing to premium projects across New Gurgaon and Dwarka Expressway — a strong pick for value and rental demand.",
    focus: ["Affordable housing", "Mid-premium", "Independent floors"],
    priceFrom: "₹95 Lakh",
    rating: 4.2,
    projects: [
      { name: "Signature Global City 92", location: "Sector 92", type: "Floors", status: "Ready" },
      { name: "Signature De Luxe DXP", location: "Sector 37D", type: "High-Rise", status: "New Launch" },
    ],
    faqs: [],
  },
  {
    slug: "godrej",
    name: "Godrej Properties",
    tagline: "Brighter living",
    founded: "1990",
    intro:
      "Godrej Properties brings the trust of the Godrej Group with sustainable, design-forward residences across Gurugram's prime corridors.",
    focus: ["Premium residences", "Sustainable design"],
    priceFrom: "₹1.7 Cr",
    rating: 4.5,
    projects: [
      { name: "Godrej Aristocrat", location: "Sector 49", type: "High-Rise", status: "Under Construction" },
      { name: "Godrej Meridien", location: "Sector 106, Dwarka Expressway", type: "High-Rise", status: "Ready" },
    ],
    faqs: [],
  },
  {
    slug: "sobha",
    name: "Sobha",
    tagline: "Passion at work",
    founded: "1995",
    intro:
      "Sobha is renowned for backward-integrated, best-in-class construction quality. Its Gurugram projects on Dwarka Expressway set benchmarks in finish and reliability.",
    focus: ["Premium quality", "High-rises"],
    priceFrom: "₹2.0 Cr",
    rating: 4.6,
    projects: [
      { name: "Sobha City", location: "Sector 108, Dwarka Expressway", type: "High-Rise", status: "Ready" },
      { name: "Sobha Altus", location: "Sector 106", type: "Luxury", status: "Under Construction" },
    ],
    faqs: [],
  },
  {
    slug: "elan",
    name: "Elan Group",
    tagline: "Crafting landmarks",
    founded: "2013",
    intro:
      "Elan Group is a leading commercial and luxury developer in Gurugram, known for iconic retail destinations and premium residences on Dwarka Expressway and SPR.",
    focus: ["Commercial", "Luxury residences", "Retail"],
    priceFrom: "₹2.5 Cr",
    rating: 4.4,
    projects: [
      { name: "Elan The Presidential", location: "Sector 106", type: "Luxury", status: "Under Construction" },
      { name: "Elan Empire", location: "Sector 66", type: "Commercial", status: "Ready" },
    ],
    faqs: [],
  },
  {
    slug: "emaar",
    name: "Emaar India",
    tagline: "Shaping the future",
    founded: "2005",
    intro:
      "Emaar India, part of the global Emaar group behind Dubai's landmarks, delivers premium gated communities across Golf Course Extension Road and Gurugram.",
    focus: ["Premium gated communities", "Plots"],
    priceFrom: "₹1.9 Cr",
    rating: 4.3,
    projects: [
      { name: "Emaar Urban Oasis", location: "Sector 62", type: "High-Rise", status: "Under Construction" },
      { name: "Emaar Palm Heights", location: "Sector 77", type: "High-Rise", status: "Ready" },
    ],
    faqs: [],
  },
  {
    slug: "birla-estates",
    name: "Birla Estates",
    tagline: "Where life lives",
    founded: "2016",
    intro:
      "Birla Estates brings the Aditya Birla Group's legacy to premium residential development, with sought-after launches on Golf Course Road.",
    focus: ["Premium residences"],
    priceFrom: "₹3.5 Cr",
    rating: 4.4,
    projects: [
      { name: "Birla Navya", location: "Golf Course Extension Road", type: "Low-Rise", status: "Ready" },
      { name: "Birla Arika", location: "Sector 31", type: "High-Rise", status: "New Launch" },
    ],
    faqs: [],
  },
  {
    slug: "ats",
    name: "ATS Infrastructure",
    tagline: "Building dreams",
    founded: "1998",
    intro:
      "ATS is known for spacious, green, family-oriented communities with strong construction quality across Gurugram and the SPR belt.",
    focus: ["Family residences", "Green communities"],
    priceFrom: "₹1.6 Cr",
    rating: 4.2,
    projects: [
      { name: "ATS Triumph", location: "Sector 104, Dwarka Expressway", type: "High-Rise", status: "Ready" },
      { name: "ATS Kocoon", location: "Sector 109", type: "High-Rise", status: "Ready" },
    ],
    faqs: [],
  },
];

export function getBuilderBySlug(slug: string): Builder | undefined {
  return builders.find((b) => b.slug === slug);
}

export function getAllBuilderSlugs(): string[] {
  return builders.map((b) => b.slug);
}
