"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { site, whatsappLink } from "@/lib/site";

type Msg = { from: "bot" | "user"; text: string; quick?: string[] };

const GREETING: Msg = {
  from: "bot",
  text: `Namaste! I'm Realty Guruji's assistant 🤝 I can help you find rentals, resale homes, the best Gurgaon sectors, or connect you with Rahul. What are you looking for?`,
  quick: ["2/3 BHK Rentals", "Buy / Resale", "Best sectors", "Talk to Rahul"],
};

// Lightweight local knowledge base. If you configure /api/chat.php with an
// AI key later, the widget will prefer that and fall back to this offline.
function localReply(input: string): Msg {
  const q = input.toLowerCase();
  const wa = (m: string) => `__WA__${m}`;

  if (/(rent|rental|2 ?bhk|3 ?bhk|lease)/.test(q)) {
    return {
      from: "bot",
      text: `We specialise in 2 & 3 BHK rentals across Gurgaon, typically ₹20,000–₹35,000/month (semi-furnished). Tell me your preferred sector & budget and I'll line up verified options.`,
      quick: ["Dwarka Expressway", "Sohna Road", wa("Share rental requirement")],
    };
  }
  if (/(buy|resale|purchase|sale|invest|investment)/.test(q)) {
    return {
      from: "bot",
      text: `For buying, our sweet spot is mid-segment homes ₹1 Cr–₹1.65 Cr — builder floors & society flats. We also handle premium & new launches. What's your budget?`,
      quick: ["Under ₹1.2 Cr", "₹1.2–1.65 Cr", wa("Share buying requirement")],
    };
  }
  if (/(sector|area|location|best|where|dwarka|golf|sohna|spr|new gurgaon)/.test(q)) {
    return {
      from: "bot",
      text: `Top picks right now: Dwarka Expressway (high growth), Golf Course Road (luxury), SPR & New Gurgaon (value + appreciation). Want a sector-wise price & investment guide?`,
      quick: ["Dwarka Expressway", "Golf Course Road", wa("Best sector for my budget")],
    };
  }
  if (/(price|budget|cost|emi|loan|cheap|afford)/.test(q)) {
    return {
      from: "bot",
      text: `Quick guide — Rentals: ₹20–35K/mo (2/3 BHK). Resale: ₹95L–₹1.65 Cr (mid-segment), premium up to ₹3.5 Cr. Share your budget and I'll match you.`,
      quick: [wa("My budget is…")],
    };
  }
  if (/(rahul|call|contact|talk|human|agent|phone|number)/.test(q)) {
    return {
      from: "bot",
      text: `Rahul Soni would love to help directly. Call ${site.contact.phoneDisplay} or tap WhatsApp for the fastest response.`,
      quick: [wa("Hi Rahul, I'd like to talk")],
    };
  }
  if (/(nri|abroad|overseas|remote)/.test(q)) {
    return {
      from: "bot",
      text: `We support NRI investors end-to-end — video tours, verified listings, documentation & remote closure. Many clients invest from abroad with us.`,
      quick: [wa("I'm an NRI investor")],
    };
  }
  if (/(hi|hello|hey|namaste|good)/.test(q)) {
    return { ...GREETING };
  }
  return {
    from: "bot",
    text: `I can help with rentals, resale, sectors, pricing and investment in Gurgaon. For anything specific, the quickest is a quick WhatsApp chat with Rahul.`,
    quick: ["2/3 BHK Rentals", "Buy / Resale", wa("Chat with Rahul")],
  };
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function send(text: string) {
    const clean = text.trim();
    if (!clean) return;

    // WhatsApp quick-reply handoff
    if (clean.startsWith("__WA__")) {
      window.open(whatsappLink(clean.replace("__WA__", "")), "_blank");
      return;
    }

    const history = messages.map((m) => ({
      role: m.from === "bot" ? ("assistant" as const) : ("user" as const),
      content: m.text,
    }));
    setMessages((m) => [...m, { from: "user", text: clean }]);
    setInput("");
    setTyping(true);

    // Try the AI route first; gracefully fall back to the guided assistant.
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...history, { role: "user", content: clean }] }),
      });
      const data = await res.json().catch(() => ({}));
      setTyping(false);
      if (data?.ok && data.reply) {
        setMessages((m) => [...m, { from: "bot", text: data.reply, quick: ["__WA__Chat with Rahul"] }]);
      } else {
        setMessages((m) => [...m, localReply(clean)]);
      }
    } catch {
      setTyping(false);
      setMessages((m) => [...m, localReply(clean)]);
    }
  }

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat assistant"}
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gold-bright to-gold-deep text-ink shadow-[0_12px_32px_-8px_rgba(201,164,92,0.6)] transition-transform hover:scale-105"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        )}
      </button>

      <div
        className={`fixed bottom-24 right-5 z-40 flex w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-line bg-ink-soft shadow-2xl transition-all duration-300 ${
          open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
        style={{ height: "min(70vh, 520px)" }}
        role="dialog"
        aria-label="Realty Guruji chat assistant"
      >
        <div className="flex items-center gap-3 border-b border-line bg-gradient-to-r from-surface to-ink-soft p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 font-display text-lg font-bold text-gold-bright">RG</div>
          <div className="leading-tight">
            <p className="font-semibold text-cream">Realty Guruji Assistant</p>
            <p className="flex items-center gap-1.5 text-xs text-muted">
              <span className="h-2 w-2 rounded-full bg-[#25d366]" /> Online · replies instantly
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.map((m, i) => (
            <div key={i}>
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  m.from === "bot"
                    ? "bg-surface text-cream"
                    : "ml-auto bg-gold text-ink"
                }`}
              >
                {m.text}
              </div>
              {m.quick && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {m.quick.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="rounded-full border border-line bg-ink px-3 py-1.5 text-xs text-gold-bright transition-colors hover:border-gold hover:bg-gold/10"
                    >
                      {q.startsWith("__WA__") ? q.replace("__WA__", "💬 ") : q}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          {typing && (
            <div className="flex w-12 items-center gap-1 rounded-2xl bg-surface px-3.5 py-3" aria-label="Assistant is typing">
              <span className="h-2 w-2 animate-bounce rounded-full bg-muted [animation-delay:-0.2s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-muted [animation-delay:-0.1s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-muted" />
            </div>
          )}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2 border-t border-line p-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question…"
            className="flex-1 rounded-full border border-line bg-ink px-4 py-2.5 text-sm text-cream placeholder:text-faint focus:border-gold focus:outline-none"
          />
          <button type="submit" aria-label="Send" className="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-ink">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
          </button>
        </form>
      </div>
    </>
  );
}
