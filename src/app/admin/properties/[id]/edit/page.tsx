import { notFound } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import PropertyForm from "@/components/admin/PropertyForm";

export const dynamic = "force-dynamic";

export default async function EditProperty({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isSupabaseConfigured()) {
    return <div className="card-rg p-8">Connect Supabase to edit properties.</div>;
  }
  const sb = await createClient();
  const { data } = await sb.from("properties").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  return (
    <>
      <h1 className="mb-6 font-display text-3xl font-bold">Edit property</h1>
      <PropertyForm initial={data} />
    </>
  );
}
