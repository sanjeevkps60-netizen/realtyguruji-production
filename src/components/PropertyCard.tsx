import Link from "next/link";
import Image from "next/image";
import type { Property } from "@/data/properties";
import { categoryHasBhk } from "@/data/categories";
import CardShare from "@/components/CardShare";

export default function PropertyCard({ property, href }: { property: Property; href?: string }) {
  const p = property;
  const target = href ?? `/properties/${p.id}`;
  const isPlot = p.propertyType === "plot";
  const noBhk = isPlot || p.propertyType === "commercial" || !categoryHasBhk(p.category);
  return (
    <div className="card-rg group flex flex-col overflow-hidden">
      <Link href={target} className="flex flex-1 flex-col">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={p.image}
          alt={p.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
        <div className="absolute left-3 top-3 flex gap-2">
          {p.badge && <span className="chip bg-ink/70 backdrop-blur">{p.badge}</span>}
          <span className="chip bg-ink/70 capitalize backdrop-blur">{p.type}</span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <span className="font-display text-2xl font-bold text-cream drop-shadow">{p.priceLabel}</span>
          <span className="rounded-full bg-ink/70 px-2.5 py-1 text-xs font-medium text-cream backdrop-blur">{p.zone}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 pb-3">
        <h3 className="font-display text-lg font-semibold leading-snug text-cream transition-colors group-hover:text-gold-bright">
          {p.title}
        </h3>
        <p className="mt-1 text-sm text-muted">{p.address}</p>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-line pt-4 text-sm text-muted">
          {noBhk ? (
            <Spec label={isPlot ? "Plot" : "Commercial"} className="capitalize" />
          ) : (
            <Spec label={`${p.bhk} BHK`} />
          )}
          <Spec label={`${p.area} ${p.areaUnit}`} />
          <Spec label={noBhk ? p.facing + " facing" : p.furnishing} className="capitalize" />
        </div>

        <p className="mt-4 text-xs text-faint">Sector {p.sector} · {p.builder}</p>
      </div>
      </Link>

      {/* Footer: view + share (outside the link so the button is valid + clickable) */}
      <div className="flex items-center justify-between border-t border-line px-5 py-3">
        <Link href={target} className="text-sm font-semibold text-gold-bright hover:underline">
          View details →
        </Link>
        <CardShare id={p.id} title={p.title} />
      </div>
    </div>
  );
}

function Spec({ label, className = "" }: { label: string; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-gold-deep" />
      {label}
    </span>
  );
}
