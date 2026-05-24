import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { categories, categoryBySlug } from "@/data/categories";
import { getAllProperties } from "@/lib/properties";
import PropertiesBrowser from "@/components/PropertiesBrowser";
import LeadForm from "@/components/LeadForm";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = categoryBySlug(slug);
  if (!c) return { title: "Category not found" };
  return {
    title: `${c.name} in Gurugram`,
    description: `${c.name} for sale & rent in Gurugram — ${c.blurb} Verified listings from Realty Guruji.`,
    alternates: { canonical: `/categories/${c.slug}` },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = categoryBySlug(slug);
  if (!c) notFound();

  const all = await getAllProperties();
  const items = all.filter((p) => p.category === c.slug);

  return (
    <>
      <section className="relative overflow-hidden border-b border-line pt-32 pb-12">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-surface to-ink" />
        <div className="container-rg">
          <nav className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-gold-bright">Home</Link><span>/</span>
            <Link href="/categories" className="hover:text-gold-bright">Categories</Link><span>/</span>
            <span className="text-cream">{c.name}</span>
          </nav>
          <h1 className="font-display text-4xl font-bold text-cream sm:text-5xl">
            <span className="text-gradient-gold">{c.name}</span> in Gurugram
          </h1>
          <p className="mt-4 max-w-2xl text-muted">{c.blurb}</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container-rg">
          {items.length > 0 ? (
            <Suspense fallback={<div className="py-20 text-center text-muted">Loading…</div>}>
              <PropertiesBrowser items={items} fixedCategory={c.slug} />
            </Suspense>
          ) : (
            <div className="card-rg p-12 text-center">
              <p className="font-display text-xl text-cream">No {c.name.toLowerCase()} listed right now</p>
              <p className="mt-2 text-sm text-muted">New inventory is added regularly. Tell us your requirement and we&apos;ll source matching options for you.</p>
              <Link href="/contact" className="btn-gold mt-5">Share your requirement</Link>
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-line bg-ink-soft py-16">
        <div className="container-rg max-w-2xl">
          <LeadForm source={`category-${c.slug}`} heading={`Enquire about ${c.name}`} sub="Share your budget and preferred location — we'll send matching options." />
        </div>
      </section>
    </>
  );
}
