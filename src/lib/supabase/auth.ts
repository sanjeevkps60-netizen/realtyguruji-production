import { createClient } from "./server";
import { isSupabaseConfigured } from "./config";

export type Role = "super_admin" | "property_manager" | "sales_executive";

export interface SessionProfile {
  id: string;
  email?: string;
  fullName?: string;
  role: Role;
}

export const roleLabels: Record<Role, string> = {
  super_admin: "Super Admin",
  property_manager: "Property Manager",
  sales_executive: "Sales Executive",
};

export async function getSessionProfile(): Promise<SessionProfile | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const sb = await createClient();
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) return null;
    const { data: profile } = await sb.from("profiles").select("full_name, role").eq("id", user.id).maybeSingle();
    return {
      id: user.id,
      email: user.email ?? undefined,
      fullName: (profile?.full_name as string) ?? undefined,
      role: ((profile?.role as Role) ?? "sales_executive"),
    };
  } catch {
    return null;
  }
}

export function canDelete(role: Role): boolean {
  return role === "super_admin" || role === "property_manager";
}
