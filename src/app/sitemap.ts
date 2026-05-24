import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { properties, blogPosts } from "@/data/properties";
import { getAllSectorSlugs } from "@/data/sectors";
import { getAllBuilderSlugs } from "@/data/builders";
import { categories } from "@/data/categories";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const now = new Date();

  const staticRoutes = ["", "/properties", "/plots", "/categories", "/sectors", "/builders", "/about", "/blog", "/contact"].map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.8,
  }));

  const categoryRoutes = categories.map((c) => ({
    url: `${base}/categories/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const propertyRoutes = properties.map((p) => ({
    url: `${base}/properties/${p.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const sectorRoutes = getAllSectorSlugs().map((slug) => ({
    url: `${base}/sectors/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const builderRoutes = getAllBuilderSlugs().map((slug) => ({
    url: `${base}/builders/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const blogRoutes = blogPosts.map((p) => ({
    url: `${base}/blog/${p.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...categoryRoutes, ...propertyRoutes, ...sectorRoutes, ...builderRoutes, ...blogRoutes];
}
