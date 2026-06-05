"use client";

type Lead = {
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  property_type?: string | null;
  sector_preference?: string | null;
  source?: string | null;
  status?: string | null;
  created_at?: string | null;
};

function csvCell(v: unknown): string {
  const s = v == null ? "" : String(v);
  return `"${s.replace(/"/g, '""')}"`;
}

// AiSensy expects the phone with country code, digits only (e.g. 9198XXXXXXXX).
function intlPhone(raw?: string | null): string {
  const d = String(raw ?? "").replace(/\D/g, "");
  if (d.length === 10) return "91" + d;
  return d;
}

export default function LeadsExport({ leads }: { leads: Lead[] }) {
  function download() {
    const headers = ["Name", "Phone", "Email", "LookingFor", "Sector", "Source", "Status", "Date"];
    const rows = leads.map((l) => [
      l.name ?? "",
      intlPhone(l.phone),
      l.email ?? "",
      l.property_type ?? "",
      l.sector_preference ?? "",
      l.source ?? "",
      l.status ?? "",
      l.created_at ? new Date(l.created_at).toLocaleDateString("en-IN") : "",
    ]);
    const csv = [headers, ...rows].map((r) => r.map(csvCell).join(",")).join("\r\n");
    // Prepend BOM so Excel reads UTF-8 correctly.
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `realtyguruji-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={download}
      disabled={leads.length === 0}
      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-[#e7c984] to-[#9c7a36] px-4 py-2 text-sm font-semibold text-[#14110a] disabled:opacity-50"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" /></svg>
      Export contacts (CSV)
    </button>
  );
}
