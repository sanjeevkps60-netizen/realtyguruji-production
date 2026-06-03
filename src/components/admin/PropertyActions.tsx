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
  title,
}: {
  id: string;
  status: string;
  isFeatured: boolean;
  allowDelete: boolean;
  title?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const sb = createClient();

  async function share() {
    const url = `${window.location.origin}/properties/${id}`;
    const shareTitle = title || "Realty Guruji Property";
    const text = `${shareTitle} — view details:`;
    // Try the native share sheet (mobile / modern desktop)
    type NavWithShare = Navigator & { share?: (data: ShareData) => Promise<void> };
    const nav = navigator as NavWithShare;
    if (nav.share) {
      try {
        await nav.share({ title: shareTitle, text, url });
        return;
      } catch {
        // user cancelled — fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      alert("✓ Link copied!\n\nPaste it in WhatsApp, Email or SMS to share with your client.");
    } catch {
      window.prompt("Copy this link:", url);
    }
  }

  async function update(fields: Record<string, unknown>) {
    setBusy(true);
    const { data, error } = await sb.from("properties").update(fields).eq("id", id).select();
    setBusy(false);
    if (error) {
      alert(`Update failed: ${error.message}`);
      return;
    }
    if (!data || data.length === 0) {
      alert("No changes saved — your admin role doesn't have permission. Ask the Super Admin to grant access.");
      return;
    }
    router.refresh();
  }

  async function remove() {
    if (!confirm("Remove this property permanently?")) return;
    setBusy(true);
    const { data, error } = await sb.from("properties").delete().eq("id", id).select();
    setBusy(false);
    if (error) {
      alert(`Delete failed: ${error.message}`);
      return;
    }
    if (!data || data.length === 0) {
      alert(
        "Delete was blocked by database permissions.\n\nFix: in Supabase → SQL Editor run:\n\ndrop policy if exists properties_admin_delete on public.properties;\ncreate policy properties_admin_delete on public.properties for delete using (public.is_staff());\n\n…or set your account to super_admin."
      );
      return;
    }
    router.refresh();
  }

  const sold = status === "sold" || status === "rented";

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <a href={`/properties/${id}`} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-line px-3 py-1.5 text-xs text-cream hover:border-gold hover:text-gold-bright">
        View
      </a>
      <button
        onClick={share}
        disabled={busy}
        className="rounded-lg border border-line bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold-bright hover:border-gold hover:bg-gold/20 disabled:opacity-50"
      >
        Share link
      </button>
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
