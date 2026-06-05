import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import LeadRow from "@/components/admin/LeadRow";
import LeadsExport from "@/components/admin/LeadsExport";

export const dynamic = "force-dynamic";

export default async function AdminLeads() {
  if (!isSupabaseConfigured()) {
    return <div className="card-rg p-8">Connect Supabase to manage leads.</div>;
  }
  const sb = await createClient();
  const { data } = await sb
    .from("leads")
    .select("id, name, phone, email, property_type, sector_preference, message, source, status, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const leads = data ?? [];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Leads</h1>
          <p className="text-sm text-muted">{leads.length} enquir{leads.length === 1 ? "y" : "ies"}. Export the list to run WhatsApp campaigns in AiSensy.</p>
        </div>
        <LeadsExport leads={leads} />
      </div>

      <div className="card-rg mt-6 overflow-x-auto p-0">
        {leads.length === 0 ? (
          <div className="p-10 text-center text-muted">No leads yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-faint">
                <th className="p-4">Name</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Looking for</th>
                <th className="p-4">Message</th>
                <th className="p-4">Source</th>
                <th className="p-4">When</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={String(l.id)} className="border-b border-line/60 align-top">
                  <td className="p-4 font-medium text-cream">{l.name}</td>
                  <td className="p-4">
                    <a href={`tel:${l.phone}`} className="text-gold-bright hover:underline">{l.phone}</a>
                    {l.email && <div className="text-xs text-muted">{l.email}</div>}
                  </td>
                  <td className="p-4 capitalize text-muted">
                    {[l.property_type, l.sector_preference].filter(Boolean).join(" · ") || "—"}
                  </td>
                  <td className="p-4 max-w-xs text-muted">{l.message || "—"}</td>
                  <td className="p-4 text-muted">{l.source}</td>
                  <td className="p-4 text-muted">{new Date(String(l.created_at)).toLocaleDateString("en-IN")}</td>
                  <td className="p-4"><LeadRow id={Number(l.id)} status={String(l.status)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
