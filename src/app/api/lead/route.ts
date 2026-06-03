import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

// Fire-and-forget WhatsApp notification to the owner via CallMeBot.
// Set CALLMEBOT_PHONE (digits-only, with country code e.g. 919811290102) and
// CALLMEBOT_APIKEY in Vercel env. Silent no-op if not configured.
async function notifyWhatsApp(lead: Record<string, unknown>) {
  const phone = process.env.CALLMEBOT_PHONE;
  const apikey = process.env.CALLMEBOT_APIKEY;
  if (!phone || !apikey) return;
  const lines = [
    "🔔 *New Lead — Realty Guruji*",
    `👤 ${lead.name}`,
    `📞 ${lead.phone}`,
    lead.email ? `✉ ${lead.email}` : null,
    lead.property_type ? `🏠 ${lead.property_type}` : null,
    lead.sector_preference ? `📍 ${lead.sector_preference}` : null,
    lead.message ? `💬 ${lead.message}` : null,
    `🌐 Source: ${lead.source}`,
  ].filter(Boolean).join("\n");
  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(lines)}&apikey=${encodeURIComponent(apikey)}`;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 5000);
    await fetch(url, { signal: ctrl.signal, cache: "no-store" });
    clearTimeout(t);
  } catch {
    // ignore — never block the form response on notification
  }
}

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
    // Notify the owner on WhatsApp (no-op if CallMeBot env vars not set).
    await notifyWhatsApp(lead);
    return NextResponse.json({ success: true, message: "Thank you! We'll contact you within minutes." });
  } catch {
    // Don't lose the lead from the user's perspective — they also get a WhatsApp fallback in the UI.
    return NextResponse.json({ success: true, message: "Thank you! Please also reach us on WhatsApp for the fastest response.", stored: false });
  }
}
