import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

// Build a readable lead message used by all notification channels.
function leadText(lead: Record<string, unknown>): string {
  return [
    "🔔 New Lead — Realty Guruji",
    `👤 ${lead.name}`,
    `📞 ${lead.phone}`,
    lead.email ? `✉ ${lead.email}` : null,
    lead.property_type ? `🏠 ${lead.property_type}` : null,
    lead.sector_preference ? `📍 ${lead.sector_preference}` : null,
    lead.message ? `💬 ${lead.message}` : null,
    `🌐 Source: ${lead.source}`,
  ].filter(Boolean).join("\n");
}

async function safeFetch(url: string, init?: RequestInit) {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 6000);
    await fetch(url, { ...init, signal: ctrl.signal, cache: "no-store" });
    clearTimeout(t);
  } catch {
    // never block the form on a notification failure
  }
}

// 1) Telegram — instant phone push. Set TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID.
async function notifyTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  await safeFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}

// 2) Email via Resend — lead lands in your inbox. Set RESEND_API_KEY + LEAD_EMAIL_TO.
async function notifyEmail(lead: Record<string, unknown>, text: string) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_EMAIL_TO;
  if (!key || !to) return;
  const from = process.env.LEAD_EMAIL_FROM || "Realty Guruji <onboarding@resend.dev>";
  const html = `<h2>🔔 New Lead — Realty Guruji</h2>
    <p><b>Name:</b> ${lead.name}<br>
    <b>Phone:</b> <a href="tel:${lead.phone}">${lead.phone}</a><br>
    ${lead.email ? `<b>Email:</b> ${lead.email}<br>` : ""}
    ${lead.property_type ? `<b>Looking for:</b> ${lead.property_type}<br>` : ""}
    ${lead.sector_preference ? `<b>Sector:</b> ${lead.sector_preference}<br>` : ""}
    ${lead.message ? `<b>Message:</b> ${lead.message}<br>` : ""}
    <b>Source:</b> ${lead.source}</p>`;
  await safeFetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ from, to: [to], subject: `New Lead: ${lead.name} (${lead.phone})`, html, text }),
  });
}

// 3) CallMeBot WhatsApp (optional legacy). Set CALLMEBOT_PHONE + CALLMEBOT_APIKEY.
async function notifyCallMeBot(text: string) {
  const phone = process.env.CALLMEBOT_PHONE;
  const apikey = process.env.CALLMEBOT_APIKEY;
  if (!phone || !apikey) return;
  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(apikey)}`;
  await safeFetch(url);
}

async function notifyOwner(lead: Record<string, unknown>) {
  const text = leadText(lead);
  await Promise.allSettled([notifyTelegram(text), notifyEmail(lead, text), notifyCallMeBot(text)]);
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
    // Notify the owner via any configured channel (Telegram / Email / CallMeBot).
    await notifyOwner(lead);
    return NextResponse.json({ success: true, message: "Thank you! We'll contact you within minutes." });
  } catch {
    // Don't lose the lead from the user's perspective — they also get a WhatsApp fallback in the UI.
    return NextResponse.json({ success: true, message: "Thank you! Please also reach us on WhatsApp for the fastest response.", stored: false });
  }
}
