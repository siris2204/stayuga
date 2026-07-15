import { MetadataRoute } from "next";
import { getProperties } from "@/lib/data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const STATIC_ROUTES = ["", "/properties", "/experiences", "/about", "/contact", "/faq"];
const POLICY_SLUGS = ["terms", "privacy", "cancellation"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await getProperties();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));

  const policyEntries: MetadataRoute.Sitemap = POLICY_SLUGS.map((slug) => ({
    url: `${siteUrl}/policies/${slug}`,
    lastModified: new Date(),
  }));

  const propertyEntries: MetadataRoute.Sitemap = properties.map((p) => ({
    url: `${siteUrl}/properties/${p.slug}`,
    lastModified: p.updatedAt,
  }));

  return [...staticEntries, ...policyEntries, ...propertyEntries];
}
