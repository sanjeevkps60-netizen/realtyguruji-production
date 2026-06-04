"use client";

import Script from "next/script";
import { useState } from "react";

type Props = {
  videoUrl?: string;
  tour360Url?: string;
  model3dUrl?: string;
  title: string;
};

// Convert a YouTube/Vimeo watch URL into an embeddable URL.
function toEmbed(url: string): { kind: "iframe" | "video"; src: string } {
  const u = url.trim();
  // YouTube
  const yt = u.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  if (yt) return { kind: "iframe", src: `https://www.youtube.com/embed/${yt[1]}?rel=0` };
  // Vimeo
  const vm = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return { kind: "iframe", src: `https://player.vimeo.com/video/${vm[1]}` };
  // Direct video file
  if (/\.(mp4|webm|ogg)(\?|$)/i.test(u)) return { kind: "video", src: u };
  // Anything else (already an embed URL)
  return { kind: "iframe", src: u };
}

export default function PropertyMedia({ videoUrl, tour360Url, model3dUrl, title }: Props) {
  const tabs: { key: string; label: string; icon: string }[] = [];
  if (videoUrl) tabs.push({ key: "video", label: "Video Tour", icon: "▶" });
  if (tour360Url) tabs.push({ key: "tour", label: "360° Tour", icon: "🌐" });
  if (model3dUrl) tabs.push({ key: "3d", label: "3D Model", icon: "🧊" });

  const [active, setActive] = useState(tabs[0]?.key ?? "");
  if (tabs.length === 0) return null;

  const video = videoUrl ? toEmbed(videoUrl) : null;

  return (
    <section className="mt-10">
      {model3dUrl && (
        <Script
          type="module"
          src="https://unpkg.com/@google/model-viewer@3.5.0/dist/model-viewer.min.js"
          strategy="afterInteractive"
        />
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-bold text-cream">Immersive Tour</h2>
        <div className="flex gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                active === t.key ? "bg-gold text-ink" : "border border-line text-muted hover:text-cream"
              }`}
            >
              <span className="mr-1.5" aria-hidden>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-ink-soft">
        {/* VIDEO */}
        {active === "video" && video && (
          <div className="relative aspect-video w-full">
            {video.kind === "video" ? (
              <video src={video.src} controls playsInline className="h-full w-full object-cover" />
            ) : (
              <iframe
                src={video.src}
                title={`${title} — video tour`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            )}
          </div>
        )}

        {/* 360 / VIRTUAL TOUR (Matterport, Kuula, SuperSplat viewer, etc.) */}
        {active === "tour" && tour360Url && (
          <div className="relative aspect-video w-full">
            <iframe
              src={tour360Url}
              title={`${title} — 360° tour`}
              className="h-full w-full"
              allow="xr-spatial-tracking; gyroscope; accelerometer; fullscreen; autoplay"
              allowFullScreen
              loading="lazy"
            />
          </div>
        )}

        {/* 3D MODEL (.glb / .gltf via Google model-viewer) */}
        {active === "3d" && model3dUrl && (
          <div className="relative aspect-video w-full bg-[#0d1730]">
            {/* @ts-expect-error — web component injected by model-viewer script */}
            <model-viewer
              src={model3dUrl}
              alt={`${title} — 3D model`}
              camera-controls
              auto-rotate
              touch-action="pan-y"
              shadow-intensity="1"
              exposure="1"
              style={{ width: "100%", height: "100%", backgroundColor: "#0d1730" }}
            />
            <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-ink/70 px-3 py-1 text-xs text-cream/80 backdrop-blur">
              Drag to rotate · scroll to zoom
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
