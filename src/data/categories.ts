// Full property category taxonomy. Slugs match Supabase property_categories.

export interface Category {
  slug: string;
  name: string;
  kind: "residential" | "plot" | "commercial";
  blurb: string;
  icon: string;
}

export const categories: Category[] = [
  { slug: "apartments", name: "Apartments", kind: "residential", icon: "🏢", blurb: "Society flats & high-rise apartments across Gurgaon's prime corridors." },
  { slug: "villas", name: "Villas", kind: "residential", icon: "🏡", blurb: "Independent and gated-community villas for spacious family living." },
  { slug: "penthouses", name: "Penthouses", kind: "residential", icon: "🌆", blurb: "Top-floor luxury penthouses with private terraces and skyline views." },
  { slug: "builder-floors", name: "Builder Floors", kind: "residential", icon: "🏠", blurb: "Independent builder floors with privacy and terrace rights." },
  { slug: "luxury-homes", name: "Luxury Homes", kind: "residential", icon: "💎", blurb: "Ultra-premium residences on Golf Course Road and beyond." },
  { slug: "farmhouses", name: "Farmhouses", kind: "residential", icon: "🌳", blurb: "Weekend farmhouses and land retreats near Sohna and Gurgaon." },
  { slug: "residential-plots", name: "Residential Plots", kind: "plot", icon: "📐", blurb: "Construction-ready residential plots in approved townships." },
  { slug: "commercial-plots", name: "Commercial Plots", kind: "plot", icon: "🏬", blurb: "High-visibility commercial plots for retail and mixed-use." },
  { slug: "sco-plots", name: "SCO Plots", kind: "plot", icon: "🏪", blurb: "Shop-Cum-Office (SCO) plots — own your commercial frontage." },
  { slug: "office-spaces", name: "Office Spaces", kind: "commercial", icon: "🏢", blurb: "Pre-leased and bare-shell office spaces for investors & occupiers." },
];

export const plotCategorySlugs = categories.filter((c) => c.kind === "plot").map((c) => c.slug);

export function categoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

// Map the seed data's propertyType → a category slug.
export function propertyTypeToCategory(pt: string): string {
  switch (pt) {
    case "builder-floor": return "builder-floors";
    case "society-flat": return "apartments";
    case "villa": return "villas";
    case "penthouse": return "penthouses";
    case "farmhouse": return "farmhouses";
    case "plot": return "residential-plots";
    case "commercial": return "office-spaces";
    default: return "apartments";
  }
}
