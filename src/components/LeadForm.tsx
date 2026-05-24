"use client";

import { useState } from "react";
import { site, whatsappLink } from "@/lib/site";

const API = "/api/lead";

export default function LeadForm({
  compact = false,
  source = "website",
  propertyId,
  heading = "Get a property consultation",
  sub = "Share your requirement — Rahul will personally call you back, usually within minutes.",
}: {
  compact?: boolean;
  source?: string;
  propertyId?: string;
  heading?: string;
  sub?: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    if (!data.name || String(data.name).trim().length < 2) {
      setStatus("error");
      setMsg("Please enter your name.");
      return;
    }
    if (!/^\d{10}$/.test(String(data.phone).replace(/\D/g, ""))) {
      setStatus("error");
      setMsg("Please enter a valid 10-digit phone number.");
      return;
    }

    setStatus("sending");
    setMsg("");
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source, property_id: propertyId ?? "" }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success) {
        setStatus("ok");
        setMsg(json.message || "Thank you! We'll contact you shortly.");
        form.reset();
      } else {
        throw new Error(json.error || "Something went wrong.");
      }
    } catch {
      // Static-host / API not yet configured → graceful WhatsApp fallback.
      setStatus("error");
      setMsg("Couldn't submit online. Please tap WhatsApp below and we'll respond instantly.");
    }
  }

  if (status === "ok") {
    return (
      <div className="card-rg p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366]/15 text-[#25d366]">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        </div>
        <h3 className="mt-4 font-display text-xl font-bold text-cream">Request received!</h3>
        <p className="mt-2 text-sm text-muted">{msg}</p>
        <a href={whatsappLink("Hi Rahul, I just submitted an enquiry on realtyguruji.com")} target="_blank" rel="noopener noreferrer" className="btn-gold mt-5">
          Continue on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card-rg p-6 sm:p-8">
      <h3 className="font-display text-xl font-bold text-cream">{heading}</h3>
      <p className="mt-1.5 text-sm text-muted">{sub}</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Field name="name" placeholder="Your name *" autoComplete="name" />
        <Field name="phone" placeholder="Phone number *" type="tel" inputMode="numeric" autoComplete="tel" />
      </div>

      {!compact && (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Field name="email" placeholder="Email (optional)" type="email" autoComplete="email" />
          <Select name="property_type" defaultValue="">
            <option value="" disabled>I'm looking for…</option>
            <option value="rental">Rental (2/3 BHK)</option>
            <option value="resale">Buy / Resale</option>
            <option value="builder-floor">Builder Floor</option>
            <option value="society-flat">Society Flat</option>
            <option value="commercial">Commercial / Investment</option>
          </Select>
        </div>
      )}

      {!compact && (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Select name="bhk_preference" defaultValue="">
            <option value="" disabled>BHK preference</option>
            <option value="1">1 BHK</option>
            <option value="2">2 BHK</option>
            <option value="3">3 BHK</option>
            <option value="4">4+ BHK</option>
          </Select>
          <Field name="sector_preference" placeholder="Preferred sector / area" />
        </div>
      )}

      <textarea
        name="message"
        rows={compact ? 2 : 3}
        placeholder="Tell us your budget & requirement…"
        className="mt-3 w-full rounded-xl border border-line bg-ink-soft px-4 py-3 text-sm text-cream placeholder:text-faint focus:border-gold focus:outline-none"
      />

      {status === "error" && <p className="mt-3 text-sm text-red-300">{msg}</p>}

      <button type="submit" disabled={status === "sending"} className="btn-gold mt-4 w-full disabled:opacity-60">
        {status === "sending" ? "Sending…" : "Request a Callback"}
      </button>

      <p className="mt-3 text-center text-xs text-faint">
        Prefer to chat?{" "}
        <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="text-gold-bright hover:underline">
          WhatsApp {site.contact.phoneDisplay}
        </a>
      </p>
    </form>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { name: string }) {
  return (
    <input
      {...props}
      className="w-full rounded-xl border border-line bg-ink-soft px-4 py-3 text-sm text-cream placeholder:text-faint focus:border-gold focus:outline-none"
    />
  );
}

function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { name: string }) {
  return (
    <select
      {...props}
      className="w-full rounded-xl border border-line bg-ink-soft px-4 py-3 text-sm text-cream focus:border-gold focus:outline-none"
    >
      {children}
    </select>
  );
}
