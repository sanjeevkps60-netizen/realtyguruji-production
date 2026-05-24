"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const STATUSES = ["new", "contacted", "site_visit", "negotiation", "closed", "lost"];

export default function LeadRow({ id, status }: { id: number; status: string }) {
  const [value, setValue] = useState(status);
  const [busy, setBusy] = useState(false);
  const sb = createClient();

  async function change(next: string) {
    setBusy(true);
    setValue(next);
    await sb.from("leads").update({ status: next }).eq("id", id);
    setBusy(false);
  }

  return (
    <select
      value={value}
      disabled={busy}
      onChange={(e) => change(e.target.value)}
      className="rounded-lg border border-line bg-ink-soft px-2 py-1.5 text-xs capitalize text-cream focus:border-gold focus:outline-none disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>{s.replace("_", " ")}</option>
      ))}
    </select>
  );
}
