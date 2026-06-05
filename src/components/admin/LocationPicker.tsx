"use client";

import { useEffect, useRef, useState } from "react";

// Lightweight location picker for the admin property form.
// - "Use my current location" → GPS (great on mobile, asks permission)
// - Interactive map (Leaflet + free OpenStreetMap tiles) → click/drag to drop a pin
// Writes to hidden inputs name="latitude" / name="longitude" so the form submits them.

const labelCls = "mb-1 block text-xs uppercase tracking-wide text-[#6B7280]";
const field =
  "w-full rounded-xl border border-[#2b3c5e] bg-[#0d1730] px-4 py-2.5 text-sm text-[#f5f2ea] placeholder:text-[#6B7280] focus:border-[#c9a45c] focus:outline-none";

// Default centre = Gurugram
const DEFAULT = { lat: 28.4595, lng: 77.0266 };

type LeafletMap = { setView: (c: [number, number], z: number) => LeafletMap; on: (e: string, cb: (ev: { latlng: { lat: number; lng: number } }) => void) => void };
type LeafletMarker = { setLatLng: (c: [number, number]) => LeafletMarker; on: (e: string, cb: () => void) => void; getLatLng: () => { lat: number; lng: number } };
type Leaflet = {
  map: (el: HTMLElement) => LeafletMap;
  tileLayer: (url: string, opts: Record<string, unknown>) => { addTo: (m: LeafletMap) => void };
  marker: (c: [number, number], opts: Record<string, unknown>) => { addTo: (m: LeafletMap) => LeafletMarker };
};

declare global {
  interface Window { L?: Leaflet }
}

function loadLeaflet(): Promise<Leaflet> {
  return new Promise((resolve, reject) => {
    if (window.L) return resolve(window.L);
    // CSS
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    // JS
    const existing = document.getElementById("leaflet-js");
    if (existing) {
      existing.addEventListener("load", () => window.L && resolve(window.L));
      return;
    }
    const script = document.createElement("script");
    script.id = "leaflet-js";
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => (window.L ? resolve(window.L) : reject(new Error("Leaflet failed")));
    script.onerror = () => reject(new Error("Leaflet failed to load"));
    document.body.appendChild(script);
  });
}

export default function LocationPicker({ initialLat, initialLng }: { initialLat?: string; initialLng?: string }) {
  const startLat = initialLat ? Number(initialLat) : DEFAULT.lat;
  const startLng = initialLng ? Number(initialLng) : DEFAULT.lng;

  const [lat, setLat] = useState<number>(Number.isFinite(startLat) ? startLat : DEFAULT.lat);
  const [lng, setLng] = useState<number>(Number.isFinite(startLng) ? startLng : DEFAULT.lng);
  const [status, setStatus] = useState("");
  const [hasPin, setHasPin] = useState(Boolean(initialLat && initialLng));

  const mapEl = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadLeaflet()
      .then((L) => {
        if (cancelled || !mapEl.current || mapRef.current) return;
        const map = L.map(mapEl.current).setView([lat, lng], hasPin ? 16 : 12);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "© OpenStreetMap",
        }).addTo(map);
        const marker = L.marker([lat, lng], { draggable: true }).addTo(map);
        marker.on("dragend", () => {
          const { lat: la, lng: ln } = marker.getLatLng();
          setLat(la); setLng(ln); setHasPin(true); setStatus("Pin set on map.");
        });
        map.on("click", (e) => {
          marker.setLatLng([e.latlng.lat, e.latlng.lng]);
          setLat(e.latlng.lat); setLng(e.latlng.lng); setHasPin(true); setStatus("Pin set on map.");
        });
        mapRef.current = map;
        markerRef.current = marker;
      })
      .catch(() => setStatus("Map could not load — you can still enter coordinates manually below."));
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep map + marker in sync when lat/lng change programmatically (GPS / manual).
  function syncMap(la: number, ln: number, zoom = 16) {
    if (mapRef.current && markerRef.current) {
      markerRef.current.setLatLng([la, ln]);
      mapRef.current.setView([la, ln], zoom);
    }
  }

  function useMyLocation() {
    if (!("geolocation" in navigator)) {
      setStatus("Location not supported on this device.");
      return;
    }
    setStatus("Getting your location… (allow the permission prompt)");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const la = pos.coords.latitude;
        const ln = pos.coords.longitude;
        setLat(la); setLng(ln); setHasPin(true);
        syncMap(la, ln, 17);
        setStatus("✓ Live location captured.");
      },
      (err) => {
        setStatus(
          err.code === err.PERMISSION_DENIED
            ? "Location permission denied. Enable it in your browser, or drop a pin on the map."
            : "Couldn't get location. Drop a pin on the map instead."
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  function onManual(which: "lat" | "lng", v: string) {
    const num = Number(v);
    if (which === "lat") { setLat(num); if (Number.isFinite(num) && Number.isFinite(lng)) syncMap(num, lng); }
    else { setLng(num); if (Number.isFinite(lat) && Number.isFinite(num)) syncMap(lat, num); }
    setHasPin(true);
  }

  return (
    <div className="sm:col-span-2">
      <input type="hidden" name="latitude" value={hasPin && Number.isFinite(lat) ? lat : ""} readOnly />
      <input type="hidden" name="longitude" value={hasPin && Number.isFinite(lng) ? lng : ""} readOnly />

      <div className="mb-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={useMyLocation}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-[#e7c984] to-[#9c7a36] px-4 py-2 text-sm font-semibold text-[#14110a]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
          Use my current location
        </button>
        <span className="text-xs text-[#9aa1ab]">or tap / drag the pin on the map</span>
      </div>

      <div ref={mapEl} className="h-64 w-full overflow-hidden rounded-xl border border-[#2b3c5e]" style={{ background: "#0d1730" }} />

      {status && <p className="mt-2 text-xs text-[#c9a45c]">{status}</p>}

      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Latitude</label>
          <input className={field} inputMode="decimal" value={Number.isFinite(lat) ? String(lat) : ""} onChange={(e) => onManual("lat", e.target.value)} placeholder="28.4595" />
        </div>
        <div>
          <label className={labelCls}>Longitude</label>
          <input className={field} inputMode="decimal" value={Number.isFinite(lng) ? String(lng) : ""} onChange={(e) => onManual("lng", e.target.value)} placeholder="77.0266" />
        </div>
      </div>
    </div>
  );
}
