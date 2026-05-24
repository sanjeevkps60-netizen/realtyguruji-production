"use client";

import Image from "next/image";
import { useState } from "react";

export default function PropertyGallery({ images, alt }: { images: string[]; alt: string }) {
  const list = images.length ? images : ["/images/property-society.png"];
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-line">
        <Image
          src={list[active]}
          alt={`${alt} — photo ${active + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
        />
        {list.length > 1 && (
          <>
            <GalleryBtn side="left" onClick={() => setActive((a) => (a - 1 + list.length) % list.length)} />
            <GalleryBtn side="right" onClick={() => setActive((a) => (a + 1) % list.length)} />
            <span className="absolute bottom-3 right-3 rounded-full bg-ink/70 px-3 py-1 text-xs text-cream backdrop-blur">
              {active + 1} / {list.length}
            </span>
          </>
        )}
      </div>

      {list.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {list.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                i === active ? "border-gold" : "border-line opacity-70 hover:opacity-100"
              }`}
              aria-label={`View photo ${i + 1}`}
            >
              <Image src={src} alt="" fill sizes="112px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function GalleryBtn({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={side === "left" ? "Previous photo" : "Next photo"}
      className={`absolute top-1/2 -translate-y-1/2 ${side === "left" ? "left-3" : "right-3"} flex h-10 w-10 items-center justify-center rounded-full bg-ink/70 text-cream backdrop-blur transition-colors hover:bg-gold hover:text-ink`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {side === "left" ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
      </svg>
    </button>
  );
}
