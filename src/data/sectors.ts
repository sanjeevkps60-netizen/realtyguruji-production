// Gurgaon location data — powers /sectors/[slug] pages.
// Covers named corridors (rich, hand-written) plus all numbered sectors 1–115
// (generated with deterministic, locally-relevant content for programmatic SEO).

export interface SectorPage {
  slug: string;
  name: string;
  kind: "corridor" | "sector";
  zone: string;
  tagline: string;
  intro: string;
  priceFrom: string;
  priceTrend: string; // YoY
  rentRange: string;
  investmentScore: number; // out of 10
  highlight: string;
  connectivity: string[];
  infrastructure: string[];
  schools: string[];
  hospitals: string[];
  builders: string[];
  faqs: { q: string; a: string }[];
  featured?: boolean;
}

// ---- Major named corridors (hand-curated) ----
const corridors: SectorPage[] = [
  {
    slug: "dwarka-expressway",
    name: "Dwarka Expressway",
    kind: "corridor",
    zone: "Dwarka Expressway",
    tagline: "Sectors 81–115 · The fastest-growing corridor in NCR",
    intro:
      "Dwarka Expressway (NH-248BB) is Gurugram's most talked-about growth corridor, connecting the city to Delhi and IGI Airport. With the 16-lane expressway now operational, sectors 81–115 are seeing rapid appreciation, premium high-rise launches, and strong rental demand from professionals.",
    priceFrom: "₹95 Lakh",
    priceTrend: "+18% YoY",
    rentRange: "₹20K – ₹40K / month",
    investmentScore: 9.2,
    highlight: "High Growth",
    connectivity: [
      "Direct access to IGI Airport (~15 km)",
      "16-lane Dwarka Expressway operational",
      "Proposed metro extension along the corridor",
      "Seamless link to Delhi via Dwarka",
    ],
    infrastructure: [
      "New commercial hubs and retail at sectors 83, 84, 102",
      "Schools and hospitals coming up rapidly",
      "Gated high-rise societies with full amenities",
    ],
    schools: ["DPS Sector 84", "Euro International", "St. Xavier's High School"],
    hospitals: ["Aarvy Hospital", "Genesis Hospital", "Medanta (~6 km)"],
    builders: ["Signature Global", "M3M", "Sobha", "Godrej", "Smartworld"],
    faqs: [
      {
        q: "Is Dwarka Expressway a good investment in 2026?",
        a: "Yes. With the expressway fully operational and metro plans in motion, sectors 81–95 offer some of the strongest capital appreciation and rental yields in Gurugram.",
      },
      {
        q: "What is the price range on Dwarka Expressway?",
        a: "Builder floors and society flats start around ₹95 Lakh, with premium high-rise apartments ranging ₹1.5 Cr–₹3.5 Cr depending on sector and project.",
      },
    ],
    featured: true,
  },
  {
    slug: "golf-course-road",
    name: "Golf Course Road",
    kind: "corridor",
    zone: "Golf Course Road",
    tagline: "DLF Phase 1–5 · Gurugram's most premium address",
    intro:
      "Golf Course Road is the luxury heart of Gurugram — home to DLF Phases, top corporate offices, fine-dining and the city's most coveted high-rises. Backed by Rapid Metro connectivity, it commands the highest per-sq-ft rates in the city.",
    priceFrom: "₹2.5 Cr",
    priceTrend: "+12% YoY",
    rentRange: "₹50K – ₹2 Lakh / month",
    investmentScore: 8.8,
    highlight: "Luxury",
    connectivity: [
      "Rapid Metro along the entire stretch",
      "Direct link to Cyber City & NH-48",
      "8-lane high-speed signalised road",
    ],
    infrastructure: [
      "Galleria & Grand Mall retail",
      "Premium clubhouses and concierge living",
      "Walk-to-work for Cyber City professionals",
    ],
    schools: ["The Shri Ram School", "Lancers International", "Scottish High"],
    hospitals: ["Max Hospital", "Paras Hospital", "Artemis (~5 km)"],
    builders: ["DLF", "M3M", "Emaar", "Birla Estates"],
    faqs: [
      {
        q: "Why is Golf Course Road so expensive?",
        a: "It offers the best of location, connectivity, social infrastructure and brand developments. Limited supply and high demand from HNIs keep prices premium.",
      },
    ],
    featured: true,
  },
  {
    slug: "golf-course-extension-road",
    name: "Golf Course Extension Road",
    kind: "corridor",
    zone: "Golf Course Extension",
    tagline: "Sectors 56–67 · Premium living at smarter prices",
    intro:
      "Golf Course Extension Road (SPR-linked) extends the luxury of Golf Course Road at more accessible pricing. Sectors 56–67 blend premium high-rises, retail and excellent connectivity, making it a favourite for upgraders and investors.",
    priceFrom: "₹1.8 Cr",
    priceTrend: "+14% YoY",
    rentRange: "₹35K – ₹80K / month",
    investmentScore: 8.5,
    highlight: "Premium",
    connectivity: [
      "Connects Golf Course Rd to Sohna Rd & SPR",
      "Proposed metro link",
      "Quick access to NH-48",
    ],
    infrastructure: [
      "AIPL Joy Street, M3M retail hubs",
      "New-age gated communities",
      "Growing F&B and office presence",
    ],
    schools: ["GD Goenka", "Heritage Xperiential", "Pathways"],
    hospitals: ["Park Hospital", "Aarvy Hospital"],
    builders: ["M3M", "Emaar", "Elan", "ATS"],
    faqs: [],
    featured: true,
  },
  {
    slug: "sohna-road",
    name: "Sohna Road",
    kind: "corridor",
    zone: "Sohna Road",
    tagline: "Sectors 47–71 · The value-for-money belt",
    intro:
      "Sohna Road is one of Gurugram's most established residential and commercial corridors, offering excellent value with ready social infrastructure, malls, hospitals and quick access to Cyber City and Sohna's new launches.",
    priceFrom: "₹1.1 Cr",
    priceTrend: "+10% YoY",
    rentRange: "₹25K – ₹55K / month",
    investmentScore: 8.0,
    highlight: "Value",
    connectivity: [
      "Direct route to Cyber Hub & NH-48",
      "Sohna Elevated Road to Sohna town",
      "Subhash Chowk junction access",
    ],
    infrastructure: [
      "Omaxe, Ardee, Vatika retail and offices",
      "Established schools and hospitals",
      "Mature, ready-to-move societies",
    ],
    schools: ["KR Mangalam", "Alpine Convent", "Manav Rachna"],
    hospitals: ["Park Hospital", "Medeor", "Artemis (~7 km)"],
    builders: ["BPTP", "Vatika", "Tulip", "Central Park"],
    faqs: [],
    featured: true,
  },
  {
    slug: "spr-southern-peripheral-road",
    name: "SPR (Southern Peripheral Road)",
    kind: "corridor",
    zone: "SPR Corridor",
    tagline: "Sectors 70–80 · The next big upgrade story",
    intro:
      "The Southern Peripheral Road (SPR) links Golf Course Extension Road to NH-48, fast emerging as a premium residential and commercial belt. With major road widening underway, SPR sectors are attracting strong investor interest.",
    priceFrom: "₹1.4 Cr",
    priceTrend: "+16% YoY",
    rentRange: "₹28K – ₹60K / month",
    investmentScore: 8.7,
    highlight: "Upcoming",
    connectivity: [
      "Links GCER, Sohna Rd and NH-48",
      "Ongoing widening to 8/10 lanes",
      "Quick access to IMT Manesar",
    ],
    infrastructure: [
      "New premium launches by top builders",
      "Commercial corridors developing fast",
      "Low-density plotted + high-rise mix",
    ],
    schools: ["DPS", "GD Goenka", "Euro International"],
    hospitals: ["Park Hospital", "Aarvy Hospital"],
    builders: ["M3M", "Smartworld", "Elan", "Whiteland"],
    faqs: [],
    featured: true,
  },
  {
    slug: "new-gurgaon",
    name: "New Gurgaon",
    kind: "corridor",
    zone: "New Gurgaon",
    tagline: "Sectors 86–95 · Emerging affordable-premium hub",
    intro:
      "New Gurgaon (sectors 86–95) along NH-48 and Pataudi Road is the city's emerging value belt, offering modern societies at accessible prices with strong appreciation potential as NPR and metro connectivity expand.",
    priceFrom: "₹85 Lakh",
    priceTrend: "+15% YoY",
    rentRange: "₹18K – ₹35K / month",
    investmentScore: 8.3,
    highlight: "Emerging",
    connectivity: [
      "Direct NH-48 access",
      "Northern Peripheral Road (NPR)",
      "Proposed metro expansion",
    ],
    infrastructure: [
      "Mix of affordable and mid-premium societies",
      "Growing retail and schools",
      "Strong rental demand from IMT Manesar",
    ],
    schools: ["RPS International", "St. Xavier's", "Delhi World School"],
    hospitals: ["Aarvy Hospital", "Genesis Hospital"],
    builders: ["Signature Global", "M3M", "Godrej", "Conscient"],
    faqs: [],
    featured: true,
  },
  {
    slug: "dlf-phases",
    name: "DLF Phases (1–5)",
    kind: "corridor",
    zone: "DLF Phases",
    tagline: "Cyber City's doorstep · Established luxury",
    intro:
      "The DLF Phases 1–5 are Gurugram's original premium townships, offering builder floors, plots and high-rises beside Cyber City and Golf Course Road — a perennial favourite for end-users and investors.",
    priceFrom: "₹2.2 Cr",
    priceTrend: "+11% YoY",
    rentRange: "₹40K – ₹1.5 Lakh / month",
    investmentScore: 8.6,
    highlight: "Established Luxury",
    connectivity: [
      "Adjacent to Cyber City & Rapid Metro",
      "Golf Course Road frontage",
      "Quick NH-48 access",
    ],
    infrastructure: [
      "Galleria Market & premium retail",
      "Top schools and hospitals",
      "Independent floors and gated condos",
    ],
    schools: ["The Shri Ram School", "DPS", "Lancers"],
    hospitals: ["Max", "Paras", "Fortis"],
    builders: ["DLF", "Ambience", "Emaar"],
    faqs: [],
    featured: true,
  },
  {
    slug: "manesar",
    name: "Manesar / IMT",
    kind: "corridor",
    zone: "Manesar",
    tagline: "Industrial + affordable residential growth",
    intro:
      "Manesar and IMT are Gurugram's industrial powerhouse, driving strong rental demand for affordable housing nearby. With NH-48 and KMP Expressway access, it's a steady choice for rental-focused investors.",
    priceFrom: "₹55 Lakh",
    priceTrend: "+9% YoY",
    rentRange: "₹12K – ₹25K / month",
    investmentScore: 7.4,
    highlight: "Rental Demand",
    connectivity: ["NH-48 frontage", "KMP / Dwarka Expressway link", "Close to IMT industries"],
    infrastructure: ["Industrial townships", "Affordable housing societies", "Growing retail"],
    schools: ["St. Crispin's", "DAV Public School"],
    hospitals: ["Sanjeevani Hospital", "ESIC Hospital"],
    builders: ["Signature Global", "Pyramid", "Raheja"],
    faqs: [],
  },
];

// ---- Numbered-sector zone mapping (1–115) ----
function zoneForSector(n: number): { zone: string; priceFrom: string; score: number } {
  if (n >= 81 && n <= 115) return { zone: "Dwarka Expressway", priceFrom: "₹95 Lakh", score: 8.8 };
  if (n >= 86 && n <= 95) return { zone: "New Gurgaon", priceFrom: "₹85 Lakh", score: 8.2 };
  if (n >= 47 && n <= 57) return { zone: "Sohna Road", priceFrom: "₹1.1 Cr", score: 8.0 };
  if (n >= 58 && n <= 67) return { zone: "Golf Course Extension", priceFrom: "₹1.6 Cr", score: 8.4 };
  if (n >= 68 && n <= 80) return { zone: "SPR Corridor", priceFrom: "₹1.3 Cr", score: 8.3 };
  if (n >= 25 && n <= 46) return { zone: "Golf Course Road / Old Gurgaon", priceFrom: "₹1.4 Cr", score: 8.1 };
  return { zone: "Gurugram", priceFrom: "₹80 Lakh", score: 7.6 };
}

function buildNumberedSector(n: number): SectorPage {
  const { zone, priceFrom, score } = zoneForSector(n);
  return {
    slug: `sector-${n}`,
    name: `Sector ${n}`,
    kind: "sector",
    zone,
    tagline: `${zone}, Gurugram`,
    intro: `Sector ${n} sits within Gurugram's ${zone} belt — a sought-after pocket for ${
      n >= 81 ? "new high-rise launches and builder floors" : "ready-to-move society flats and builder floors"
    }. Realty Guruji tracks live inventory, fair pricing and verified deals across Sector ${n} for both rental and resale.`,
    priceFrom,
    priceTrend: "+12% YoY",
    rentRange: "₹18K – ₹45K / month",
    investmentScore: score,
    highlight: zone,
    connectivity: [
      `Connected via the ${zone} corridor`,
      "Road links to NH-48 / Dwarka Expressway",
      "Close to upcoming/existing metro nodes",
    ],
    infrastructure: [
      "Gated societies and independent builder floors",
      "Daily-needs retail and markets nearby",
      "Parks, schools and clinics within reach",
    ],
    schools: ["DPS", "Euro International", "St. Xavier's"],
    hospitals: ["Aarvy Hospital", "Genesis Hospital", "Park Hospital"],
    builders: ["DLF", "M3M", "Signature Global", "Godrej"],
    faqs: [
      {
        q: `Is Sector ${n} good for buying property in Gurgaon?`,
        a: `Sector ${n} in the ${zone} belt offers a solid mix of connectivity, social infrastructure and price appreciation. Contact Realty Guruji for current verified listings and an expert area consultation.`,
      },
    ],
  };
}

const numberedSectors: SectorPage[] = Array.from({ length: 115 }, (_, i) => buildNumberedSector(i + 1));

// Corridors first (featured), then numbered sectors. Corridor slugs win on conflict.
const corridorSlugs = new Set(corridors.map((c) => c.slug));
export const allSectors: SectorPage[] = [
  ...corridors,
  ...numberedSectors.filter((s) => !corridorSlugs.has(s.slug)),
];

export const featuredSectors: SectorPage[] = corridors.filter((c) => c.featured);

export function getSectorBySlug(slug: string): SectorPage | undefined {
  return allSectors.find((s) => s.slug === slug);
}

export function getAllSectorSlugs(): string[] {
  return allSectors.map((s) => s.slug);
}
