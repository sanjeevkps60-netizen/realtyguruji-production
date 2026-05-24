import type { Metadata } from "next";
import { getSessionProfile, roleLabels } from "@/lib/supabase/auth";
import AdminTopbar from "@/components/admin/AdminTopbar";

export const metadata: Metadata = {
  title: "Admin — Realty Guruji",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await getSessionProfile();
  return (
    <div className="min-h-screen bg-ink text-cream">
      {profile && (
        <AdminTopbar
          name={profile.fullName || profile.email || "Admin"}
          role={roleLabels[profile.role]}
        />
      )}
      <div className={profile ? "container-rg py-8" : ""}>{children}</div>
    </div>
  );
}
