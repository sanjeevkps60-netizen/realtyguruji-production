import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }

  const str = (v: unknown) => (v == null ? null : String(v).trim().slice(0, 1000) || null);
  const name = str(body.name);
  const phoneDigits = String(body.phone ?? "").replace(/\D/g, "");

  if (!name || name.length < 2) {
    return NextResponse.json({ success: false, error: "Please provide a valid name" }, { status: 400 });
  }
  if (!/^\d{10}$/.test(phoneDigits)) {
    return NextResponse.json({ success: false, error: "Please provide a valid 10-digit phone number" }, { status: 400 });
  }

  const lead = {
    name,
    phone: phoneDigits,
    email: str(body.email),
    bhk_preference: body.bhk_preference ? Number(body.bhk_preference) || null : null,
    sector_preference: str(body.sector_preference),
    property_type: str(body.property_type),
    message: str(body.message),
    source: str(body.source) || "website",
    property_id: typeof body.property_id === "string" && /^[0-9a-f-]{36}$/i.test(body.property_id) ? body.property_id : null,
  };

  // If Supabase isn't configured yet, accept gracefully so the form still works.
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: true, message: "Thank you! We'll contact you shortly.", stored: false });
  }

  try {
    const sb = await createClient();
    const { error } = await sb.from("leads").insert(lead);
    if (error) throw error;
    return NextResponse.json({ success: true, message: "Thank you! We'll contact you within minutes." });
  } catch {
    // Don't lose the lead from the user's perspective — they also get a WhatsApp fallback in the UI.
    return NextResponse.json({ success: true, message: "Thank you! Please also reach us on WhatsApp for the fastest response.", stored: false });
  }
}
