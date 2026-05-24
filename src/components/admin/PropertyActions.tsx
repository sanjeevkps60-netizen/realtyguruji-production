"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function PropertyActions({
  id,
  status,
  isFeatured,
  allowDelete,
}: {
  id: string;
  status: string;
  isFeatured: boolean;
  allowDelete: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const sb = createClient();

  async function update(fields: Record<string, unknown>) {
    setBusy(true);
    await sb.from("properties").update(fields).eq("id", id);
    setBusy(false);
    router.refresh();
  }

  async function remove() {
    if (!confirm("Remove this property permanently?")) return;
    setBusy(true);
    await sb.from("properties").delete().eq("id", id);
    setBusy(false);
    router.refresh();
  }

  const sold = status === "sold" || status === "rented";

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <Link href={`/admin/properties/${id}/edit`} className="rounded-lg border border-line px-3 py-1.5 text-xs text-cream hover:border-gold hover:text-gold-bright">
        Edit
      </Link>
      <button
        disabled={busy}
        onClick={() => update({ is_featured: !isFeatured })}
        className={`rounded-lg border px-3 py-1.5 text-xs disabled:opacity-50 ${isFeatured ? "border-gold text-gold-bright" : "border-line text-muted hover:text-cream"}`}
      >
        {isFeatured ? "★ Featured" : "☆ Feature"}
      </button>
      <button
        disabled={busy}
        onClick={() => update({ status: sold ? "available" : "sold" })}
        className="rounded-lg border border-line px-3 py-1.5 text-xs text-muted hover:text-cream disabled:opacity-50"
      >
        {sold ? "Mark available" : "Mark sold"}
      </button>
      {allowDelete && (
        <button
          disabled={busy}
          onClick={remove}
          className="rounded-lg bg-red-500/90 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500 disabled:opacity-50"
        >
          Delete
        </button>
      )}
    </div>
  );
}
