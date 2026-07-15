import { apiFetch } from "@/lib/api";
import { ContentBlocks, Experience, FaqItem, PolicyPage, Property } from "@/lib/types";

export async function getProperties(params?: Record<string, string>) {
  const query = params ? `?${new URLSearchParams(params).toString()}` : "";
  const { properties } = await apiFetch<{ properties: Property[] }>(`/api/properties${query}`);
  return properties;
}

export async function getProperty(slug: string) {
  const { property } = await apiFetch<{ property: Property }>(`/api/properties/${slug}`);
  return property;
}

export async function getPropertyById(id: string, token: string) {
  const { property } = await apiFetch<{ property: Property }>(`/api/properties/id/${id}`, {
    token,
  });
  return property;
}

export async function getExperiences(params?: Record<string, string>) {
  const query = params ? `?${new URLSearchParams(params).toString()}` : "";
  const { experiences } = await apiFetch<{ experiences: Experience[] }>(
    `/api/experiences${query}`
  );
  return experiences;
}

export async function getExperience(slug: string) {
  const { experience } = await apiFetch<{ experience: Experience }>(`/api/experiences/${slug}`);
  return experience;
}

export async function getContent() {
  return apiFetch<{ blocks: ContentBlocks; faqs: FaqItem[]; policies: PolicyPage[] }>(
    "/api/content"
  );
}

export async function getPolicy(slug: string) {
  const { policy } = await apiFetch<{ policy: PolicyPage }>(`/api/content/policies/${slug}`);
  return policy;
}
