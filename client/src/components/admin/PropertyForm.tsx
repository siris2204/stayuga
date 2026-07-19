"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, AlertCircle } from "lucide-react";
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

function clientValidate(values: PropertyFormValues): Record<string, string> {
  const errs: Record<string, string> = {};
  if (!values.title || values.title.trim().length < 2) errs.title = "Must be at least 2 characters";
  if (!values.description || values.description.trim().length < 10) errs.description = "Must be at least 10 characters";
  if (!values.pricing.basePrice || Number(values.pricing.basePrice) <= 0)
    errs["pricing.basePrice"] = "Must be greater than 0";
  if (values.pricing.weekendPrice && Number(values.pricing.weekendPrice) <= 0)
    errs["pricing.weekendPrice"] = "Must be greater than 0";
  if (!values.location.address.trim()) errs["location.address"] = "This field is required";
  if (!values.location.city.trim()) errs["location.city"] = "This field is required";
  if (!values.location.state.trim()) errs["location.state"] = "This field is required";
  if (!values.capacity.maxGuests || Number(values.capacity.maxGuests) <= 0)
    errs["capacity.maxGuests"] = "Must be greater than 0";
  if (!values.capacity.bedrooms || Number(values.capacity.bedrooms) <= 0)
    errs["capacity.bedrooms"] = "Must be greater than 0";
  if (!values.capacity.bathrooms || Number(values.capacity.bathrooms) <= 0)
    errs["capacity.bathrooms"] = "Must be greater than 0";
  return errs;
}

// Section headings with an error badge if any field in that section failed
function SectionHeader({
  title,
  hasError,
}: {
  title: string;
  hasError: boolean;
}) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <h3 className="font-display text-lg text-ink">{title}</h3>
      {hasError && (
        <span className="flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-600">
          <AlertCircle size={11} /> Has errors
        </span>
      )}
    </div>
  );
}

export function PropertyForm({ property }: { property?: Property }) {
  const { token } = useAdminAuth();
  const router = useRouter();
  const [values, setValues] = useState<PropertyFormValues>(() => toFormValues(property));
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const firstErrorRef = useRef<HTMLDivElement>(null);

  // Scroll to first errored section whenever fieldErrors change
  useEffect(() => {
    if (Object.keys(fieldErrors).length > 0) {
      firstErrorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [fieldErrors]);

  function fe(key: string) {
    return fieldErrors[key];
  }

  function sectionHasError(...keys: string[]) {
    return keys.some((k) => !!fieldErrors[k]);
  }

  function update<K extends keyof PropertyFormValues>(key: K, value: PropertyFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    // Clear field error on change
    setFieldErrors((e) => { const next = { ...e }; delete next[key]; return next; });
  }

  function updateNested<
    K extends "location" | "pricing" | "capacity",
    F extends keyof PropertyFormValues[K],
  >(key: K, field: F, value: PropertyFormValues[K][F]) {
    setValues((v) => ({ ...v, [key]: { ...v[key], [field]: value } }));
    setFieldErrors((e) => { const next = { ...e }; delete next[`${key}.${String(field)}`]; return next; });
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) return;

    // Client-side validation first
    const clientErrors = clientValidate(values);
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      setError("Please fix the errors below.");
      return;
    }

    setSubmitting(true);
    setError("");
    setFieldErrors({});

    const payload = {
      title: values.title,
      slug: values.slug || undefined,
      type: values.type,
      tagline: values.tagline || undefined,
      description: values.description,
      images: values.images,
      amenities: values.amenities.split(",").map((a) => a.trim()).filter(Boolean),
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
      if (err instanceof ApiRequestError) {
        setError(err.message);
        setFieldErrors(err.fields ?? {});
      } else {
        setError("Failed to save property");
      }
    } finally {
      setSubmitting(false);
    }
  }

  const detailsHasError = sectionHasError("title", "slug", "description", "tagline", "amenities");
  const locationHasError = sectionHasError("location.address", "location.city", "location.state", "location.mapEmbedUrl");
  const pricingHasError = sectionHasError("pricing.basePrice", "pricing.weekendPrice", "pricing.currency");
  const capacityHasError = sectionHasError("capacity.maxGuests", "capacity.bedrooms", "capacity.bathrooms");

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ── Property details ── */}
      <section
        ref={detailsHasError ? firstErrorRef : undefined}
        className={`grid grid-cols-1 gap-4 rounded-2xl border bg-white p-6 sm:grid-cols-2 ${detailsHasError ? "border-red-300" : "border-line/70"}`}
      >
        <div className="sm:col-span-2">
          <SectionHeader title="Property details" hasError={detailsHasError} />
        </div>

        <Input
          label="Title"
          required
          value={values.title}
          onChange={(e) => update("title", e.target.value)}
          error={fe("title")}
        />
        <Input
          label="Slug (optional — auto-generated from title)"
          value={values.slug}
          onChange={(e) => update("slug", e.target.value)}
          error={fe("slug")}
        />
        <Select
          label="Type"
          value={values.type}
          onChange={(e) => update("type", e.target.value as PropertyFormValues["type"])}
          error={fe("type")}
        >
          <option value="villa">Villa</option>
          <option value="farmhouse">Farmhouse</option>
        </Select>
        <Select
          label="Status"
          value={values.status}
          onChange={(e) => update("status", e.target.value as PropertyFormValues["status"])}
          error={fe("status")}
        >
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </Select>
        <div className="sm:col-span-2">
          <Input
            label="Tagline"
            value={values.tagline}
            onChange={(e) => update("tagline", e.target.value)}
            error={fe("tagline")}
          />
        </div>
        <div className="sm:col-span-2">
          <Textarea
            label="Description"
            required
            value={values.description}
            onChange={(e) => update("description", e.target.value)}
            error={fe("description")}
          />
        </div>
        <div className="sm:col-span-2">
          <Input
            label="Amenities (comma separated)"
            value={values.amenities}
            onChange={(e) => update("amenities", e.target.value)}
            placeholder="Private pool, Wi-Fi, Bonfire deck"
            error={fe("amenities")}
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

      {/* ── Images ── */}
      <section className="rounded-2xl border border-line/70 bg-white p-6">
        <SectionHeader title="Images" hasError={false} />
        <div className="flex flex-wrap gap-3">
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

      {/* ── Location ── */}
      <section
        ref={locationHasError && !detailsHasError ? firstErrorRef : undefined}
        className={`grid grid-cols-1 gap-4 rounded-2xl border bg-white p-6 sm:grid-cols-3 ${locationHasError ? "border-red-300" : "border-line/70"}`}
      >
        <div className="sm:col-span-3">
          <SectionHeader title="Location" hasError={locationHasError} />
        </div>
        <Input
          label="Address"
          required
          value={values.location.address}
          onChange={(e) => updateNested("location", "address", e.target.value)}
          error={fe("location.address")}
        />
        <Input
          label="City"
          required
          value={values.location.city}
          onChange={(e) => updateNested("location", "city", e.target.value)}
          error={fe("location.city")}
        />
        <Input
          label="State"
          required
          value={values.location.state}
          onChange={(e) => updateNested("location", "state", e.target.value)}
          error={fe("location.state")}
        />
        <div className="sm:col-span-3">
          <Input
            label="Google Maps embed URL (optional)"
            value={values.location.mapEmbedUrl}
            onChange={(e) => updateNested("location", "mapEmbedUrl", e.target.value)}
            placeholder="https://www.google.com/maps?q=...&output=embed"
            error={fe("location.mapEmbedUrl")}
          />
        </div>
      </section>

      {/* ── Pricing ── */}
      <section
        ref={pricingHasError && !detailsHasError && !locationHasError ? firstErrorRef : undefined}
        className={`grid grid-cols-1 gap-4 rounded-2xl border bg-white p-6 sm:grid-cols-3 ${pricingHasError ? "border-red-300" : "border-line/70"}`}
      >
        <div className="sm:col-span-3">
          <SectionHeader title="Pricing" hasError={pricingHasError} />
        </div>
        <Input
          label="Base price / night"
          type="number"
          required
          value={values.pricing.basePrice}
          onChange={(e) => updateNested("pricing", "basePrice", e.target.value)}
          error={fe("pricing.basePrice")}
        />
        <Input
          label="Weekend price (optional)"
          type="number"
          value={values.pricing.weekendPrice}
          onChange={(e) => updateNested("pricing", "weekendPrice", e.target.value)}
          error={fe("pricing.weekendPrice")}
        />
        <Select
          label="Currency"
          value={values.pricing.currency}
          onChange={(e) => updateNested("pricing", "currency", e.target.value)}
          error={fe("pricing.currency")}
        >
          <option value="INR">INR — Indian Rupee</option>
          <option value="USD">USD — US Dollar</option>
          <option value="EUR">EUR — Euro</option>
        </Select>
      </section>

      {/* ── Capacity ── */}
      <section
        ref={capacityHasError && !detailsHasError && !locationHasError && !pricingHasError ? firstErrorRef : undefined}
        className={`grid grid-cols-1 gap-4 rounded-2xl border bg-white p-6 sm:grid-cols-3 ${capacityHasError ? "border-red-300" : "border-line/70"}`}
      >
        <div className="sm:col-span-3">
          <SectionHeader title="Capacity" hasError={capacityHasError} />
        </div>
        <Input
          label="Max guests"
          type="number"
          required
          value={values.capacity.maxGuests}
          onChange={(e) => updateNested("capacity", "maxGuests", e.target.value)}
          error={fe("capacity.maxGuests")}
        />
        <Input
          label="Bedrooms"
          type="number"
          required
          value={values.capacity.bedrooms}
          onChange={(e) => updateNested("capacity", "bedrooms", e.target.value)}
          error={fe("capacity.bedrooms")}
        />
        <Input
          label="Bathrooms"
          type="number"
          required
          value={values.capacity.bathrooms}
          onChange={(e) => updateNested("capacity", "bathrooms", e.target.value)}
          error={fe("capacity.bathrooms")}
        />
      </section>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={15} className="shrink-0" />
          {error}
        </div>
      )}

      <Button type="submit" disabled={submitting || uploading}>
        {submitting ? "Saving..." : property ? "Save changes" : "Create property"}
      </Button>
    </form>
  );
}
