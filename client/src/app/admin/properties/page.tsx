"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { apiFetch } from "@/lib/api";
import { Property } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { LinkButton } from "@/components/ui/Button";

function PropertiesContent() {
  const { token } = useAdminAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!token) return;
    setLoading(true);
    const { properties } = await apiFetch<{ properties: Property[] }>(
      "/api/properties?status=all",
      { token }
    );
    setProperties(properties);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function handleDelete(id: string) {
    if (!token) return;
    if (!confirm("Delete this property? This cannot be undone.")) return;
    await apiFetch(`/api/properties/${id}`, { method: "DELETE", token });
    load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-ink">Properties</h1>
          <p className="mt-1 text-sm text-ink-soft">Manage your villa &amp; farmhouse listings.</p>
        </div>
        <LinkButton href="/admin/properties/new" variant="primary">
          <Plus size={16} /> New property
        </LinkButton>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-line/70 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line/70 text-xs uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">City</th>
              <th className="px-5 py-3">Price / night</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/70">
            {properties.map((p) => (
              <tr key={p._id}>
                <td className="px-5 py-3 font-medium text-ink">{p.title}</td>
                <td className="px-5 py-3 capitalize text-ink-soft">{p.type}</td>
                <td className="px-5 py-3 text-ink-soft">{p.location.city}</td>
                <td className="px-5 py-3 text-ink-soft">
                  {formatPrice(p.pricing.basePrice, p.pricing.currency)}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                      p.status === "published" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/properties/${p._id}/edit`} className="text-ink-soft hover:text-forest">
                      <Pencil size={16} />
                    </Link>
                    <button onClick={() => handleDelete(p._id)} className="text-ink-soft hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && properties.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-6 text-center text-ink-soft">
                  No properties yet — add your first listing.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <AdminGuard>
      <PropertiesContent />
    </AdminGuard>
  );
}
