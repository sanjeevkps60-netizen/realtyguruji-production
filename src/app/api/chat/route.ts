import { NextResponse } from "next/server";
import OpenAI from "openai";
import { site } from "@/lib/site";

const SYSTEM_PROMPT = `You are the assistant for "Realty Guruji", a Gurugram real estate consultancy led by Rahul Soni (14+ years experience).
Help users with: rentals (2/3 BHK, ₹20,000–₹35,000/month), resale homes (mid-segment ₹1 Cr–₹1.65 Cr, premium up to ₹3.5 Cr+), plots (residential, commercial, SCO), penthouses, farmhouses, villas, builder floors and commercial/office spaces.
Top corridors: Dwarka Expressway, Golf Course Road, Golf Course Extension, SPR, Sohna Road, New Gurugram, DLF Phases, Manesar. We cover all sectors 1–115.
Be concise (2-4 sentences), warm and helpful. Qualify leads by asking budget, preferred sector and BHK. For serious enquiries, suggest WhatsApp or calling ${site.contact.phoneDisplay}. Never invent specific live listings or prices beyond the ranges above — instead offer to connect them with Rahul. Do not discuss anything unrelated to Gurugram real estate.`;

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // No key configured → tell the client to use its built-in guided assistant.
    return NextResponse.json({ ok: false, fallback: true });
  }

  let messages: ChatMessage[] = [];
  try {
    const body = await request.json();
    messages = Array.isArray(body.messages) ? body.messages.slice(-10) : [];
  } catch {
    return NextResponse.json({ ok: false, fallback: true });
  }

  try {
    const client = new OpenAI({ apiKey });
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 300,
      temperature: 0.6,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((m) => ({
          role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
          content: String(m.content).slice(0, 1500),
        })),
      ],
    });
    const reply = completion.choices[0]?.message?.content?.trim();
    if (!reply) return NextResponse.json({ ok: false, fallback: true });
    return NextResponse.json({ ok: true, reply });
  } catch {
    return NextResponse.json({ ok: false, fallback: true });
  }
}
