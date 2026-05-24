import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { blogPosts } from "@/data/properties";
import { site, whatsappLink } from "@/lib/site";
import LeadForm from "@/components/LeadForm";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.id === slug);
  if (!post) return { title: "Article not found" };
  return {
    title: post.title,
    description: post.excerpt.slice(0, 155),
    alternates: { canonical: `/blog/${post.id}` },
    openGraph: { type: "article", title: post.title, description: post.excerpt.slice(0, 155) },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.id === slug);
  if (!post) notFound();

  const related = blogPosts.filter((p) => p.id !== post.id).slice(0, 2);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    author: { "@type": "Person", name: site.founder.name },
    publisher: { "@type": "Organization", name: site.name },
    description: post.excerpt,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />

      <article className="container-rg max-w-3xl pt-32 pb-16">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gold-bright">Home</Link><span>/</span>
          <Link href="/blog" className="hover:text-gold-bright">Blog</Link><span>/</span>
          <span className="text-cream line-clamp-1">{post.title}</span>
        </nav>

        <div className="flex items-center gap-3 text-sm text-muted">
          <span className="chip">{post.category}</span>
          <span>{post.readTime}</span>
          <span>{new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
        </div>
        <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-cream sm:text-4xl">{post.title}</h1>

        <div className="prose-rg mt-8 space-y-5 leading-relaxed text-muted">
          <p className="text-lg text-cream/90">{post.excerpt}</p>
          <p>
            Gurgaon's real estate market continues to mature, and informed decisions start with understanding local
            dynamics — pricing, connectivity, builder reputation and rental demand. At Realty Guruji, {site.founder.name}
            brings {site.founder.experienceYears}+ years of on-ground experience to help you read the market correctly.
          </p>
          <h2 className="font-display text-2xl font-bold text-cream">What this means for you</h2>
          <p>
            Whether you're renting a 2/3 BHK, buying a mid-segment home, or investing for appreciation, the fundamentals
            stay the same: buy in well-connected sectors with credible builders, verify every listing, and negotiate from
            data. We help you do exactly that across every Gurgaon corridor.
          </p>
          <h2 className="font-display text-2xl font-bold text-cream">Talk to an expert</h2>
          <p>
            For a personalised, no-pressure consultation on this topic — including current verified listings and fair
            pricing — reach out to Rahul directly. Most enquiries get a callback within minutes.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a href={whatsappLink(`Hi Rahul, I read your article "${post.title}" and have a question.`)} target="_blank" rel="noopener noreferrer" className="btn-gold">
            Ask Rahul on WhatsApp
          </a>
          <Link href="/properties" className="btn-ghost">Browse properties</Link>
        </div>

        <div className="mt-12">
          <LeadForm compact source={`blog-${post.id}`} heading="Get a consultation" sub="Have a question about Gurgaon property? We'll help." />
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-line bg-ink-soft py-16">
          <div className="container-rg max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-cream">Keep reading</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {related.map((r) => (
                <Link key={r.id} href={`/blog/${r.id}`} className="card-rg group p-6">
                  <span className="chip">{r.category}</span>
                  <h3 className="mt-3 font-display text-lg font-semibold text-cream group-hover:text-gold-bright">{r.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted">{r.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
