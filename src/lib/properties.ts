import { properties as seed, type Property } from "@/data/properties";
import { propertyTypeToCategory, plotCategorySlugs } from "@/data/categories";
import { isSupabaseConfigured } from "./supabase/config";
import { createClient } from "./supabase/server";

type DbProperty = Record<string, unknown>;

const areaUnitMap: Record<string, string> = { sqft: "sq.ft.", sqyd: "sq.yd.", acre: "acre" };

function n(v: unknown, d = 0): number {
  const x = Number(v);
  return Number.isFinite(x) ? x : d;
}
function s(v: unknown, d = ""): string {
  return v == null ? d : String(v);
}
function arr<T = unknown>(v: unknown): T[] {
  if (Array.isArray(v)) return v as T[];
  if (typeof v === "string") {
    try { const p = JSON.parse(v); return Array.isArray(p) ? p : []; } catch { return []; }
  }
  return [];
}

export function formatPrice(price: number, type: "rental" | "resale"): string {
  if (type === "rental") return `₹${price.toLocaleString("en-IN")}/mo`;
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${Math.round(price / 100000)} Lakh`;
  return `₹${price.toLocaleString("en-IN")}`;
}

// Plot-like categories should render without BHK.
const plotSet = new Set(plotCategorySlugs);

function mapDbToProperty(db: DbProperty): Property {
  const type: Property["type"] = s(db.deal_type) === "rent" ? "rental" : "resale";
  const category = s(db.category, "apartments");
  const price = n(db.price);
  const images = arr<string>(db.images);
  const zone = s(db.zone) || s(db.area_name, "Gurugram");
  const isPlot = plotSet.has(category);

  return {
    id: s(db.id),
    title: s(db.title, "Gurugram Property"),
    type,
    propertyType: isPlot ? "plot" : "society-flat",
    bhk: n(db.bhk),
    sector: n(db.sector),
    zone,
    price,
    priceLabel: formatPrice(price, type),
    area: n(db.area),
    areaUnit: areaUnitMap[s(db.area_unit, "sqft")] ?? "sq.ft.",
    furnishing: (s(db.furnishing, "unfurnished") as Property["furnishing"]) || "unfurnished",
    image: images[0] || "/images/property-society.png",
    images: images.length ? images : ["/images/property-society.png"],
    description: s(db.description),
    amenities: arr<string>(db.amenities),
    floor: s(db.floor, "N/A"),
    facing: s(db.facing, "—"),
    possession: s(db.possession, "Immediate"),
    builder: s(db.builder, "—"),
    address: `${zone}, Sector ${n(db.sector)}, Gurugram`,
    lat: n(db.latitude, 28.45),
    lng: n(db.longitude, 77.02),
    badge: db.is_new_launch ? "New Launch" : db.is_hot_deal ? "Hot" : undefined,
    featured: !!db.is_featured,
    nearbyPlaces: arr<{ name: string; distance: string; type: string }>(db.nearby_places),
    roi: s(db.roi_estimate) || undefined,
    category,
    videoUrl: s(db.video_url) || undefined,
    tour360Url: s(db.tour_360_url) || undefined,
    model3dUrl: s(db.model_3d_url) || undefined,
  };
}

function withCategory(p: Property): Property {
  return { ...p, category: p.category ?? propertyTypeToCategory(p.propertyType) };
}

const seedWithCategory = (): Property[] => seed.map(withCategory);

/** All public properties. Supabase when configured & non-empty, else seed. */
export async function getAllProperties(): Promise<Property[]> {
  if (!isSupabaseConfigured()) return seedWithCategory();
  try {
    const sb = await createClient();
    const { data, error } = await sb
      .from("properties")
      .select("*")
      .neq("status", "draft")
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false });
    if (error || !data || data.length === 0) return seedWithCategory();
    return (data as DbProperty[]).map(mapDbToProperty);
  } catch {
    return seedWithCategory();
  }
}

export async function getFeaturedProperties(limit = 6): Promise<Property[]> {
  const all = await getAllProperties();
  const feat = all.filter((p) => p.featured);
  return (feat.length ? feat : all).slice(0, limit);
}

export async function getPropertyById(id: string): Promise<Property | null> {
  if (isSupabaseConfigured()) {
    try {
      const sb = await createClient();
      const { data } = await sb.from("properties").select("*").eq("id", id).maybeSingle();
      if (data) return mapDbToProperty(data as DbProperty);
    } catch {
      // fall through to seed
    }
  }
  const found = seed.find((p) => p.id === id);
  return found ? withCategory(found) : null;
}
