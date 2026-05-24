"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminTopbar({ name, role }: { name: string; role: string }) {
  const router = useRouter();

  async function logout() {
    try {
      await createClient().auth.signOut();
    } catch {
      // ignore
    }
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink-soft">
      <div className="container-rg flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-display text-lg font-bold">
            Realty <span className="text-gradient-gold">Guruji</span>
            <span className="ml-2 text-xs font-normal text-muted">Admin</span>
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            <NavLink href="/admin">Properties</NavLink>
            <NavLink href="/admin/properties/new">+ Add</NavLink>
            <NavLink href="/admin/leads">Leads</NavLink>
            <NavLink href="/" target>View site</NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-right text-xs leading-tight sm:block">
            <span className="block text-cream">{name}</span>
            <span className="block text-muted">{role}</span>
          </span>
          <button onClick={logout} className="rounded-full border border-line px-4 py-2 text-sm text-cream transition-colors hover:border-gold hover:text-gold-bright">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, children, target }: { href: string; children: React.ReactNode; target?: boolean }) {
  return (
    <Link
      href={href}
      {...(target ? { target: "_blank" } : {})}
      className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-white/5 hover:text-cream"
    >
      {children}
    </Link>
  );
}
