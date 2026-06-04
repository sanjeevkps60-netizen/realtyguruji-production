"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { categories } from "@/data/categories";

type Row = Record<string, unknown>;

const field = "w-full rounded-xl border border-line bg-ink-soft px-4 py-2.5 text-sm text-cream placeholder:text-faint focus:border-gold focus:outline-none";
const labelCls = "mb-1 block text-xs uppercase tracking-wide text-faint";

function csv(v: unknown): string {
  if (Array.isArray(v)) return v.join(", ");
  return typeof v === "string" ? v : "";
}

export default function PropertyForm({ initial }: { initial?: Row }) {
  const router = useRouter();
  const sb = createClient();
  const editing = Boolean(initial?.id);

  const [images, setImages] = useState<string[]>(Array.isArray(initial?.images) ? (initial!.images as string[]) : []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    setError("");
    const urls: string[] = [];
    for (const file of files.slice(0, 10)) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Each image must be under 5 MB.");
        continue;
      }
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await sb.storage.from("property-images").upload(path, file, { upsert: false });
      if (upErr) {
        setError(`Upload failed: ${upErr.message}`);
        continue;
      }
      const { data } = sb.storage.from("property-images").getPublicUrl(path);
      if (data?.publicUrl) urls.push(data.publicUrl);
    }
    setImages((prev) => [...prev, ...urls]);
    setUploading(false);
    e.target.value = "";
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const f = new FormData(e.currentTarget);
    const g = (k: string) => String(f.get(k) ?? "").trim();
    const num = (k: string) => (g(k) === "" ? null : Number(g(k).replace(/[^\d.]/g, "")));
    const list = (k: string) => g(k).split(",").map((x) => x.trim()).filter(Boolean);

    if (g("title").length < 4) { setError("Title is required (min 4 chars)."); setSaving(false); return; }

    const row = {
      title: g("title"),
      slug: g("title").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) + "-" + Math.random().toString(36).slice(2, 6),
      category: g("category"),
      deal_type: g("deal_type"),
      listing_type: g("listing_type"),
      bhk: num("bhk"),
      sector: num("sector"),
      area_name: g("area_name") || null,
      zone: g("zone") || g("area_name") || null,
      price: num("price") ?? 0,
      area: num("area"),
      area_unit: g("area_unit"),
      furnishing: g("furnishing"),
      floor: g("floor") || null,
      facing: g("facing") || null,
      bathrooms: num("bathrooms") ?? 0,
      balconies: num("balconies") ?? 0,
      parking: num("parking") ?? 0,
      description: g("description") || null,
      amenities: list("amenities"),
      highlights: list("highlights"),
      images,
      possession: g("possession") || "Immediate",
      builder: g("builder") || null,
      project_name: g("project_name") || null,
      roi_estimate: g("roi_estimate") || null,
      video_url: g("video_url") || null,
      tour_360_url: g("tour_360_url") || null,
      model_3d_url: g("model_3d_url") || null,
      latitude: num("latitude"),
      longitude: num("longitude"),
      status: g("status") || "available",
      is_featured: f.get("is_featured") === "on",
      is_hot_deal: f.get("is_hot_deal") === "on",
      is_new_launch: f.get("is_new_launch") === "on",
    };

    let res;
    if (editing) {
      const { slug: _slug, ...patch } = row; // keep existing slug on edit
      void _slug;
      res = await sb.from("properties").update(patch).eq("id", initial!.id as string);
    } else {
      res = await sb.from("properties").insert(row);
    }
    setSaving(false);
    if (res.error) { setError(res.error.message); return; }
    router.push("/admin");
    router.refresh();
  }

  const val = (k: string) => (initial?.[k] != null ? String(initial[k]) : "");

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">{error}</div>}

      <Section title="Basics">
        <div className="sm:col-span-2">
          <label className={labelCls}>Title *</label>
          <input name="title" defaultValue={val("title")} className={field} placeholder="Premium 3BHK in Sector 84" required />
        </div>
        <div>
          <label className={labelCls}>Category</label>
          <select name="category" defaultValue={val("category") || "apartments"} className={field}>
            {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Deal type</label>
          <select name="deal_type" defaultValue={val("deal_type") || "sale"} className={field}>
            <option value="sale">Sale / Resale</option>
            <option value="rent">Rent</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Listing stage</label>
          <select name="listing_type" defaultValue={val("listing_type") || "resale"} className={field}>
            <option value="resale">Resale</option>
            <option value="new-launch">New Launch</option>
            <option value="rent">Rent</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Status</label>
          <select name="status" defaultValue={val("status") || "available"} className={field}>
            <option value="available">Available</option>
            <option value="under-offer">Under offer</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
            <option value="draft">Draft (hidden)</option>
          </select>
        </div>
      </Section>

      <Section title="Specs & price">
        <Input name="bhk" label="BHK (blank for plots)" defaultValue={val("bhk")} type="number" />
        <Input name="sector" label="Sector" defaultValue={val("sector")} type="number" />
        <Input name="area_name" label="Corridor / area" defaultValue={val("area_name")} placeholder="Dwarka Expressway" />
        <Input name="price" label="Price (₹ full number)" defaultValue={val("price")} placeholder="15000000" />
        <Input name="area" label="Area" defaultValue={val("area")} type="number" />
        <div>
          <label className={labelCls}>Area unit</label>
          <select name="area_unit" defaultValue={val("area_unit") || "sqft"} className={field}>
            <option value="sqft">sq.ft.</option>
            <option value="sqyd">sq.yd.</option>
            <option value="acre">acre</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Furnishing</label>
          <select name="furnishing" defaultValue={val("furnishing") || "unfurnished"} className={field}>
            <option value="unfurnished">Unfurnished</option>
            <option value="semi-furnished">Semi-furnished</option>
            <option value="furnished">Furnished</option>
          </select>
        </div>
        <Input name="floor" label="Floor" defaultValue={val("floor")} placeholder="5th of 15" />
        <Input name="facing" label="Facing" defaultValue={val("facing")} placeholder="East" />
        <Input name="bathrooms" label="Bathrooms" defaultValue={val("bathrooms")} type="number" />
        <Input name="balconies" label="Balconies" defaultValue={val("balconies")} type="number" />
        <Input name="parking" label="Parking" defaultValue={val("parking")} type="number" />
      </Section>

      <Section title="Details">
        <div className="sm:col-span-2">
          <label className={labelCls}>Description</label>
          <textarea name="description" defaultValue={val("description")} rows={4} className={field} />
        </div>
        <Input name="builder" label="Builder" defaultValue={val("builder")} />
        <Input name="project_name" label="Project name" defaultValue={val("project_name")} />
        <Input name="possession" label="Possession" defaultValue={val("possession")} placeholder="Ready to Move" />
        <Input name="roi_estimate" label="ROI estimate" defaultValue={val("roi_estimate")} placeholder="4.5% rental yield" />
        <Input name="latitude" label="Latitude" defaultValue={val("latitude")} placeholder="28.4120" />
        <Input name="longitude" label="Longitude" defaultValue={val("longitude")} placeholder="76.9480" />
        <div className="sm:col-span-2">
          <label className={labelCls}>Amenities (comma separated)</label>
          <input name="amenities" defaultValue={csv(initial?.amenities)} className={field} placeholder="Lift, Power Backup, Club House" />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Highlights (comma separated)</label>
          <input name="highlights" defaultValue={csv(initial?.highlights)} className={field} placeholder="Park Facing, Italian Marble" />
        </div>
      </Section>

      <Section title="Photos">
        <div className="sm:col-span-2">
          <input type="file" accept="image/*" multiple onChange={onUpload} className={field} />
          {uploading && <p className="mt-2 text-xs text-gold-bright">Uploading…</p>}
          {images.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-3">
              {images.map((src) => (
                <div key={src} className="relative h-20 w-28 overflow-hidden rounded-lg border border-line">
                  <Image src={src} alt="" fill sizes="112px" className="object-cover" />
                  <button type="button" onClick={() => setImages((p) => p.filter((x) => x !== src))} className="absolute right-1 top-1 rounded bg-ink/80 px-1.5 text-xs text-white">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>

      <Section title="Tours & Media (optional)">
        <div className="sm:col-span-2">
          <Input name="video_url" label="Video tour — YouTube / Vimeo / .mp4 link" defaultValue={val("video_url")} placeholder="https://youtube.com/watch?v=..." />
        </div>
        <div className="sm:col-span-2">
          <Input name="tour_360_url" label="360° / Virtual tour embed URL — Matterport, Kuula, or SuperSplat viewer link" defaultValue={val("tour_360_url")} placeholder="https://my.matterport.com/show/?m=..." />
        </div>
        <div className="sm:col-span-2">
          <Input name="model_3d_url" label="3D model — direct .glb / .gltf file URL" defaultValue={val("model_3d_url")} placeholder="https://.../model.glb" />
        </div>
      </Section>

      <Section title="Flags">
        <div className="sm:col-span-2 flex flex-wrap gap-5">
          <Check name="is_featured" label="Featured" defaultChecked={!!initial?.is_featured} />
          <Check name="is_hot_deal" label="Hot deal" defaultChecked={!!initial?.is_hot_deal} />
          <Check name="is_new_launch" label="New launch" defaultChecked={!!initial?.is_new_launch} />
        </div>
      </Section>

      <div className="flex gap-3">
        <button type="submit" disabled={saving || uploading} className="btn-gold disabled:opacity-60">
          {saving ? "Saving…" : editing ? "Save changes" : "Publish property"}
        </button>
        <button type="button" onClick={() => router.push("/admin")} className="btn-ghost">Cancel</button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card-rg p-6">
      <h2 className="mb-4 font-display text-lg font-semibold text-cream">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function Input({ name, label, defaultValue, type = "text", placeholder }: { name: string; label: string; defaultValue?: string; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <input name={name} type={type} defaultValue={defaultValue} placeholder={placeholder} className={field} />
    </div>
  );
}

function Check({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-2 text-sm text-cream">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4 accent-[#c9a45c]" />
      {label}
    </label>
  );
}
