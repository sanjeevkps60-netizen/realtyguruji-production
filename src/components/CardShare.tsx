"use client";

import { useState } from "react";

// Share a specific property's public URL (used on property cards).
export default function CardShare({ id, title }: { id: string; title: string }) {
  const [copied, setCopied] = useState(false);

  async function onShare(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/properties/${id}`;
    type NavWithShare = Navigator & { share?: (data: ShareData) => Promise<void> };
    const nav = navigator as NavWithShare;
    if (nav.share) {
      try {
        await nav.share({ title, text: `${title} — view details:`, url });
        return;
      } catch {
        /* cancelled → fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }

  return (
    <button
      onClick={onShare}
      aria-label={`Share ${title}`}
      className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-gold-bright transition-colors hover:border-gold hover:bg-gold/10"
    >
      {copied ? (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M20 6 9 17l-5-5" /></svg>
          Copied
        </>
      ) : (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          Share
        </>
      )}
    </button>
  );
}
