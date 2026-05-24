"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import type { Property } from "@/data/properties";
import { categories } from "@/data/categories";
import PropertyCard from "@/components/PropertyCard";

export default function PropertiesBrowser({
  items,
  fixedCategory,
  hideCategory = false,
}: {
  items: Property[];
  fixedCategory?: string;
  hideCategory?: boolean;
}) {
  const sp = useSearchParams();

  const [type, setType] = useState("all");
  const [category, setCategory] = useState(fixedCategory ?? "");
  const [bhk, setBhk] = useState("");
  const [zone, setZone] = useState("");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("featured");

  useEffect(() => {
    setType(sp.get("type") || "all");
    setBhk(sp.get("bhk") || "");
    setZone(sp.get("zone") || "");
    setQ(sp.get("q") || "");
    if (!fixedCategory) setCategory(sp.get("category") || "");
  }, [sp, fixedCategory]);

  const zones = useMemo(() => Array.from(new Set(items.map((p) => p.zone))).sort(), [items]);
  const activeCategory = fixedCategory ?? category;
  const isPlotView = activeCategory.includes("plot");

  const results = useMemo(() => {
    const list = items.filter((p) => {
      if (type !== "all" && p.type !== type) return false;
      if (activeCategory && p.category !== activeCategory) return false;
      if (bhk && p.bhk !== Number(bhk)) return false;
      if (zone && p.zone !== zone) return false;
      if (q) {
        const hay = `${p.title} ${p.address} ${p.zone} ${p.builder} ${p.sector}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
    return [...list].sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      return Number(b.featured) - Number(a.featured);
    });
  }, [items, type, activeCategory, bhk, zone, q, sort]);

  function reset() {
    setType("all");
    if (!fixedCategory) setCategory("");
    setBhk("");
    setZone("");
    setQ("");
    setSort("featured");
  }

  return (
    <>
      <div className="card-rg sticky top-20 z-20 mb-8 p-4">
        <div className="flex flex-wrap gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by sector, area, builder…"
            className="min-w-[12rem] flex-1 rounded-xl border border-line bg-ink-soft px-4 py-2.5 text-sm text-cream placeholder:text-faint focus:border-gold focus:outline-none"
          />
          <div className="flex gap-1 rounded-xl border border-line bg-ink-soft p-1">
            {[
              { v: "all", l: "All" },
              { v: "rental", l: "Rent" },
              { v: "resale", l: "Buy" },
            ].map((t) => (
              <button
                key={t.v}
                onClick={() => setType(t.v)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  type === t.v ? "bg-gold text-ink" : "text-muted hover:text-cream"
                }`}
              >
                {t.l}
              </button>
            ))}
          </div>
          {!fixedCategory && !hideCategory && (
            <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category" className="rounded-xl border border-line bg-ink-soft px-3 py-2.5 text-sm text-cream focus:border-gold focus:outline-none">
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          )}
          {!isPlotView && (
            <select value={bhk} onChange={(e) => setBhk(e.target.value)} aria-label="BHK" className="rounded-xl border border-line bg-ink-soft px-3 py-2.5 text-sm text-cream focus:border-gold focus:outline-none">
              <option value="">Any BHK</option>
              <option value="2">2 BHK</option>
              <option value="3">3 BHK</option>
              <option value="4">4+ BHK</option>
            </select>
          )}
          <select value={zone} onChange={(e) => setZone(e.target.value)} aria-label="Location" className="rounded-xl border border-line bg-ink-soft px-3 py-2.5 text-sm text-cream focus:border-gold focus:outline-none">
            <option value="">All locations</option>
            {zones.map((z) => (
              <option key={z} value={z}>{z}</option>
            ))}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort" className="rounded-xl border border-line bg-ink-soft px-3 py-2.5 text-sm text-cream focus:border-gold focus:outline-none">
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted">
          <span className="font-semibold text-cream">{results.length}</span> propert{results.length === 1 ? "y" : "ies"} found
        </p>
        <button onClick={reset} className="text-sm text-gold-bright hover:underline">Reset filters</button>
      </div>

      {results.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      ) : (
        <div className="card-rg p-12 text-center">
          <p className="font-display text-xl text-cream">No exact matches</p>
          <p className="mt-2 text-sm text-muted">Try widening your filters — or tell Rahul your requirement and we&apos;ll source it for you.</p>
          <button onClick={reset} className="btn-ghost mt-5">Clear filters</button>
        </div>
      )}
    </>
  );
}
