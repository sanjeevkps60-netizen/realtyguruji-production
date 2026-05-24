import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/supabase/auth";
import PropertyActions from "@/components/admin/PropertyActions";

export const dynamic = "force-dynamic";

function money(p: number) {
  if (p >= 10000000) return `₹${(p / 10000000).toFixed(2)} Cr`;
  if (p >= 100000) return `₹${Math.round(p / 100000)} L`;
  return `₹${p.toLocaleString("en-IN")}`;
}

export default async function AdminDashboard() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="card-rg p-8">
        <h1 className="font-display text-xl font-bold">Supabase not connected</h1>
        <p className="mt-2 text-sm text-muted">Add your Supabase env vars and run the schema. See DEPLOY.md.</p>
      </div>
    );
  }

  const profile = await getSessionProfile();
  const sb = await createClient();
  const { data: rows } = await sb
    .from("properties")
    .select("id, title, category, deal_type, sector, price, status, is_featured")
    .order("created_at", { ascending: false });

  const list = rows ?? [];
  const available = list.filter((r) => r.status === "available").length;
  const sold = list.filter((r) => r.status === "sold" || r.status === "rented").length;
  const featured = list.filter((r) => r.is_featured).length;
  const allowDelete = !!profile; // any signed-in admin user can delete

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Properties</h1>
          <p className="text-sm text-muted">Manage your live inventory.</p>
        </div>
        <Link href="/admin/properties/new" className="btn-gold">+ Add property</Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Total" value={list.length} />
        <Stat label="Available" value={available} />
        <Stat label="Sold / Rented" value={sold} />
        <Stat label="Featured" value={featured} />
      </div>

      <div className="card-rg mt-8 overflow-x-auto p-0">
        {list.length === 0 ? (
          <div className="p-10 text-center text-muted">
            No properties yet. <Link href="/admin/properties/new" className="text-gold-bright hover:underline">Add your first listing</Link>.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-faint">
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Deal</th>
                <th className="p-4">Sector</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((r) => (
                <tr key={r.id} className="border-b border-line/60">
                  <td className="p-4 font-medium text-cream">
                    {r.title}
                    {r.is_featured && <span className="ml-2 chip">Featured</span>}
                  </td>
                  <td className="p-4 capitalize text-muted">{String(r.category).replace(/-/g, " ")}</td>
                  <td className="p-4 capitalize text-muted">{r.deal_type}</td>
                  <td className="p-4 text-muted">{r.sector}</td>
                  <td className="p-4 text-cream">{money(Number(r.price))}</td>
                  <td className="p-4 capitalize text-muted">{r.status}</td>
                  <td className="p-4">
                    <PropertyActions
                      id={String(r.id)}
                      status={String(r.status)}
                      isFeatured={!!r.is_featured}
                      allowDelete={allowDelete}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card-rg p-5">
      <p className="text-xs uppercase tracking-wide text-faint">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold text-gold-bright">{value}</p>
    </div>
  );
}
