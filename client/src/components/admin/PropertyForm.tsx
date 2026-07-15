"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { apiFetch, ApiRequestError, uploadImage } from "@/lib/api";
import { Property } from "@/lib/types";
import { Input, Textarea, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export interface PropertyFormValues {
  title: string;
  slug: string;
  type: "villa" | "farmhouse";
  tagline: string;
  description: string;
  images: string[];
  amenities: string;
  location: { address: string; city: string; state: string; mapEmbedUrl: string };
  pricing: { basePrice: string; weekendPrice: string; currency: string };
  capacity: { maxGuests: string; bedrooms: string; bathrooms: string };
  featured: boolean;
  status: "draft" | "published";
}

function toFormValues(property?: Property): PropertyFormValues {
  if (!property) {
    return {
      title: "",
      slug: "",
      type: "villa",
      tagline: "",
      description: "",
      images: [],
      amenities: "",
      location: { address: "", city: "", state: "", mapEmbedUrl: "" },
      pricing: { basePrice: "", weekendPrice: "", currency: "INR" },
      capacity: { maxGuests: "", bedrooms: "", bathrooms: "" },
      featured: false,
      status: "published",
    };
  }
  return {
    title: property.title,
    slug: property.slug,
    type: property.type,
    tagline: property.tagline ?? "",
    description: property.description,
    images: property.images,
    amenities: property.amenities.join(", "),
    location: {
      address: property.location.address,
      city: property.location.city,
      state: property.location.state,
      mapEmbedUrl: property.location.mapEmbedUrl ?? "",
    },
    pricing: {
      basePrice: String(property.pricing.basePrice),
      weekendPrice: property.pricing.weekendPrice ? String(property.pricing.weekendPrice) : "",
      currency: property.pricing.currency,
    },
    capacity: {
      maxGuests: String(property.capacity.maxGuests),
      bedrooms: String(property.capacity.bedrooms),
      bathrooms: String(property.capacity.bathrooms),
    },
    featured: property.featured,
    status: property.status,
  };
}

export function PropertyForm({ property }: { property?: Property }) {
  const { token } = useAdminAuth();
  const router = useRouter();
  const [values, setValues] = useState<PropertyFormValues>(() => toFormValues(property));
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof PropertyFormValues>(key: K, value: PropertyFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function updateNested<
    K extends "location" | "pricing" | "capacity",
    F extends keyof PropertyFormValues[K],
  >(key: K, field: F, value: PropertyFormValues[K][F]) {
    setValues((v) => ({ ...v, [key]: { ...v[key], [field]: value } }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0 || !token) return;
    setUploading(true);
    try {
      const urls = await Promise.all(Array.from(files).map((file) => uploadImage(file, token)));
      update("images", [...values.images, ...urls]);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Image upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSubmitting(true);
    setError("");

    const payload = {
      title: values.title,
      slug: values.slug || undefined,
      type: values.type,
      tagline: values.tagline || undefined,
      description: values.description,
      images: values.images,
      amenities: values.amenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
      location: values.location,
      pricing: {
        basePrice: Number(values.pricing.basePrice),
        weekendPrice: values.pricing.weekendPrice ? Number(values.pricing.weekendPrice) : undefined,
        currency: values.pricing.currency || "INR",
      },
      capacity: {
        maxGuests: Number(values.capacity.maxGuests),
        bedrooms: Number(values.capacity.bedrooms),
        bathrooms: Number(values.capacity.bathrooms),
      },
      featured: values.featured,
      status: values.status,
    };

    try {
      if (property) {
        await apiFetch(`/api/properties/${property._id}`, {
          method: "PUT",
          token,
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch("/api/properties", { method: "POST", token, body: JSON.stringify(payload) });
      }
      router.push("/admin/properties");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Failed to save property");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="grid grid-cols-1 gap-4 rounded-2xl border border-line/70 bg-white p-6 sm:grid-cols-2">
        <Input
          label="Title"
          required
          value={values.title}
          onChange={(e) => update("title", e.target.value)}
        />
        <Input
          label="Slug (optional — auto-generated from title)"
          value={values.slug}
          onChange={(e) => update("slug", e.target.value)}
        />
        <Select label="Type" value={values.type} onChange={(e) => update("type", e.target.value as PropertyFormValues["type"])}>
          <option value="villa">Villa</option>
          <option value="farmhouse">Farmhouse</option>
        </Select>
        <Select label="Status" value={values.status} onChange={(e) => update("status", e.target.value as PropertyFormValues["status"])}>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </Select>
        <div className="sm:col-span-2">
          <Input
            label="Tagline"
            value={values.tagline}
            onChange={(e) => update("tagline", e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <Textarea
            label="Description"
            required
            value={values.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <Input
            label="Amenities (comma separated)"
            value={values.amenities}
            onChange={(e) => update("amenities", e.target.value)}
            placeholder="Private pool, Wi-Fi, Bonfire deck"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-ink sm:col-span-2">
          <input
            type="checkbox"
            checked={values.featured}
            onChange={(e) => update("featured", e.target.checked)}
          />
          Feature on homepage
        </label>
      </section>

      <section className="rounded-2xl border border-line/70 bg-white p-6">
        <h3 className="font-display text-lg text-ink">Images</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          {values.images.map((url) => (
            <div key={url} className="relative h-24 w-32 overflow-hidden rounded-lg border border-line">
              <Image src={url} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => update("images", values.images.filter((i) => i !== url))}
                className="absolute right-1 top-1 rounded-full bg-ink/70 p-1 text-cream"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          disabled={uploading}
          className="mt-4 text-sm"
        />
        {uploading && <p className="mt-2 text-xs text-ink-soft">Uploading...</p>}
      </section>

      <section className="grid grid-cols-1 gap-4 rounded-2xl border border-line/70 bg-white p-6 sm:grid-cols-3">
        <Input
          label="Address"
          required
          value={values.location.address}
          onChange={(e) => updateNested("location", "address", e.target.value)}
        />
        <Input
          label="City"
          required
          value={values.location.city}
          onChange={(e) => updateNested("location", "city", e.target.value)}
        />
        <Input
          label="State"
          required
          value={values.location.state}
          onChange={(e) => updateNested("location", "state", e.target.value)}
        />
        <div className="sm:col-span-3">
          <Input
            label="Google Maps embed URL (optional)"
            value={values.location.mapEmbedUrl}
            onChange={(e) => updateNested("location", "mapEmbedUrl", e.target.value)}
            placeholder="https://www.google.com/maps?q=...&output=embed"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 rounded-2xl border border-line/70 bg-white p-6 sm:grid-cols-3">
        <Input
          label="Base price / night"
          type="number"
          required
          value={values.pricing.basePrice}
          onChange={(e) => updateNested("pricing", "basePrice", e.target.value)}
        />
        <Input
          label="Weekend price (optional)"
          type="number"
          value={values.pricing.weekendPrice}
          onChange={(e) => updateNested("pricing", "weekendPrice", e.target.value)}
        />
        <Input
          label="Currency"
          value={values.pricing.currency}
          onChange={(e) => updateNested("pricing", "currency", e.target.value)}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 rounded-2xl border border-line/70 bg-white p-6 sm:grid-cols-3">
        <Input
          label="Max guests"
          type="number"
          required
          value={values.capacity.maxGuests}
          onChange={(e) => updateNested("capacity", "maxGuests", e.target.value)}
        />
        <Input
          label="Bedrooms"
          type="number"
          required
          value={values.capacity.bedrooms}
          onChange={(e) => updateNested("capacity", "bedrooms", e.target.value)}
        />
        <Input
          label="Bathrooms"
          type="number"
          required
          value={values.capacity.bathrooms}
          onChange={(e) => updateNested("capacity", "bathrooms", e.target.value)}
        />
      </section>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={submitting || uploading}>
        {submitting ? "Saving..." : property ? "Save changes" : "Create property"}
      </Button>
    </form>
  );
}
