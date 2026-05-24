"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { featuredSectors } from "@/data/sectors";

export default function HeroSearch() {
  const router = useRouter();
  const [type, setType] = useState<"rental" | "resale">("rental");
  const [zone, setZone] = useState("");
  const [bhk, setBhk] = useState("");

  function search() {
    const params = new URLSearchParams();
    params.set("type", type);
    if (zone) params.set("zone", zone);
    if (bhk) params.set("bhk", bhk);
    router.push(`/properties?${params.toString()}`);
  }

  return (
    <div className="glass rounded-2xl p-2.5 shadow-2xl">
      <div className="mb-2.5 flex gap-2">
        {(["rental", "resale"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`rounded-full px-5 py-2 text-sm font-semibold capitalize transition-colors ${
              type === t ? "bg-gold text-ink" : "text-muted hover:text-cream"
            }`}
          >
            {t === "rental" ? "Rent" : "Buy"}
          </button>
        ))}
      </div>

      <div className="grid gap-2.5 sm:grid-cols-[1.4fr_1fr_auto]">
        <select
          value={zone}
          onChange={(e) => setZone(e.target.value)}
          aria-label="Location"
          className="rounded-xl border border-line bg-ink-soft px-4 py-3 text-sm text-cream focus:border-gold focus:outline-none"
        >
          <option value="">All Gurugram locations</option>
          {featuredSectors.map((s) => (
            <option key={s.slug} value={s.zone}>{s.name}</option>
          ))}
        </select>

        <select
          value={bhk}
          onChange={(e) => setBhk(e.target.value)}
          aria-label="BHK"
          className="rounded-xl border border-line bg-ink-soft px-4 py-3 text-sm text-cream focus:border-gold focus:outline-none"
        >
          <option value="">Any BHK</option>
          <option value="2">2 BHK</option>
          <option value="3">3 BHK</option>
          <option value="4">4+ BHK</option>
        </select>

        <button onClick={search} className="btn-gold px-6">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          Search
        </button>
      </div>
    </div>
  );
}
