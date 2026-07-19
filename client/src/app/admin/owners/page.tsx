"use client";

import { useEffect, useState, Fragment } from "react";
import { Trash2, Plus, X, Pencil, Check } from "lucide-react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { apiFetch, ApiRequestError } from "@/lib/api";
import { Property } from "@/lib/types";
import { Input } from "@/components/ui/Field";

interface Owner {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  properties: { _id: string; title: string; slug: string }[];
}

// ── Inline edit panel ─────────────────────────────────────────────────────────
function EditPanel({
  owner,
  properties,
  token,
  onSave,
  onCancel,
}: {
  owner: Owner;
  properties: Property[];
  token: string;
  onSave: (updated: Owner) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: owner.name,
    email: owner.email ?? "",
    phone: owner.phone ?? "",
    password: "",
    propertyIds: owner.properties.map((p) => p._id),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function toggleProperty(id: string) {
    setForm((f) => ({
      ...f,
      propertyIds: f.propertyIds.includes(id)
        ? f.propertyIds.filter((p) => p !== id)
        : [...f.propertyIds, id],
    }));
  }

  async function save() {
    if (!form.email && !form.phone) {
      setError("Provide at least an email or a phone number");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const body: Record<string, unknown> = {
        name: form.name,
        email: form.email || "",
        phone: form.phone || "",
        propertyIds: form.propertyIds,
      };
      if (form.password) body.password = form.password;

      const { owner: updated } = await apiFetch<{ owner: Owner }>(
        `/api/admin/owners/${owner._id}`,
        { method: "PATCH", token, body: JSON.stringify(body) }
      );
      onSave(updated);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <tr className="bg-sand/30">
      <td colSpan={5} className="px-5 py-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Input
              label="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              label="Email address"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="owner@example.com"
            />
            <Input
              label="Phone number"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+91 98765 43210"
            />
            <Input
              label="New password (leave blank to keep)"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-ink">Assigned properties</p>
            <div className="flex flex-wrap gap-2">
              {properties.map((p) => (
                <button
                  key={p._id}
                  type="button"
                  onClick={() => toggleProperty(p._id)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    form.propertyIds.includes(p._id)
                      ? "border-forest bg-forest text-cream"
                      : "border-line text-ink-soft hover:border-forest hover:text-forest"
                  }`}
                >
                  {p.title}
                </button>
              ))}
              {properties.length === 0 && (
                <span className="text-xs text-ink-soft">No properties available.</span>
              )}
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex items-center gap-3">
            <button
              onClick={save}
              disabled={saving || !form.name}
              className="flex items-center gap-1.5 rounded-full bg-forest px-5 py-2 text-sm font-medium text-cream hover:bg-forest-light disabled:opacity-40 transition-colors"
            >
              <Check size={14} /> {saving ? "Saving…" : "Save changes"}
            </button>
            <button onClick={onCancel} className="text-sm text-ink-soft hover:text-ink">
              Cancel
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
function OwnersContent() {
  const { token } = useAdminAuth();
  const [owners, setOwners] = useState<Owner[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    propertyIds: [] as string[],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    if (!token) return;
    const [o, p] = await Promise.all([
      apiFetch<{ owners: Owner[] }>("/api/admin/owners", { token }),
      apiFetch<{ properties: Property[] }>("/api/properties?status=all", { token }),
    ]);
    setOwners(o.owners);
    setProperties(p.properties);
    setLoading(false);
  }

  useEffect(() => { load(); }, [token]);

  async function createOwner() {
    if (!token) return;
    if (!form.email && !form.phone) {
      setError("Provide at least an email or a phone number");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await apiFetch("/api/admin/owners", {
        method: "POST",
        token,
        body: JSON.stringify({
          name: form.name,
          email: form.email || undefined,
          phone: form.phone || undefined,
          password: form.password,
          propertyIds: form.propertyIds,
        }),
      });
      setShowForm(false);
      setForm({ name: "", email: "", phone: "", password: "", propertyIds: [] });
      await load();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Failed to create owner");
    } finally {
      setSaving(false);
    }
  }

  async function deleteOwner(id: string) {
    if (!token || !confirm("Delete this owner? This cannot be undone.")) return;
    await apiFetch(`/api/admin/owners/${id}`, { method: "DELETE", token });
    await load();
  }

  function toggleProperty(id: string) {
    setForm((f) => ({
      ...f,
      propertyIds: f.propertyIds.includes(id)
        ? f.propertyIds.filter((p) => p !== id)
        : [...f.propertyIds, id],
    }));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-ink">Property Owners</h1>
          <p className="mt-1 text-sm text-ink-soft">Create owner accounts and assign properties to them.</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); }}
          className="flex items-center gap-1.5 rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-cream hover:bg-forest-light transition-colors"
        >
          <Plus size={15} /> Add owner
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="mt-6 rounded-2xl border border-line/70 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-ink">New owner account</h3>
            <button onClick={() => setShowForm(false)} className="text-ink-soft hover:text-ink">
              <X size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Input
              label="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              label="Email address"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="owner@example.com"
            />
            <Input
              label="Phone number"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+91 98765 43210"
            />
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <p className="mt-2 text-xs text-ink-soft">* Provide at least an email or a phone number.</p>
          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-ink">Assign properties</p>
            <div className="flex flex-wrap gap-2">
              {properties.map((p) => (
                <button
                  key={p._id}
                  type="button"
                  onClick={() => toggleProperty(p._id)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    form.propertyIds.includes(p._id)
                      ? "border-forest bg-forest text-cream"
                      : "border-line text-ink-soft hover:border-forest hover:text-forest"
                  }`}
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          <button
            onClick={createOwner}
            disabled={saving || !form.name || !form.password}
            className="mt-4 rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-cream hover:bg-forest-light disabled:opacity-40 transition-colors"
          >
            {saving ? "Creating…" : "Create owner"}
          </button>
        </div>
      )}

      {/* Owners table */}
      <div className="mt-8 overflow-x-auto rounded-2xl border border-line/70 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line/70 text-xs uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Phone</th>
              <th className="px-5 py-3">Properties</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/70">
            {!loading && owners.map((o) => (
              <Fragment key={o._id}>
                <tr className={editingId === o._id ? "bg-sand/20" : ""}>
                  <td className="px-5 py-3 font-medium text-ink">{o.name}</td>
                  <td className="px-5 py-3 text-ink-soft">{o.email ?? <span className="text-ink-soft/40">—</span>}</td>
                  <td className="px-5 py-3 text-ink-soft">{o.phone ?? <span className="text-ink-soft/40">—</span>}</td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1">
                      {o.properties.length === 0
                        ? <span className="text-xs text-ink-soft">None</span>
                        : o.properties.map((p) => (
                            <span key={p._id} className="rounded-full bg-sand px-2.5 py-0.5 text-xs text-ink">{p.title}</span>
                          ))}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => setEditingId(editingId === o._id ? null : o._id)}
                        className={`transition-colors ${editingId === o._id ? "text-forest" : "text-ink-soft hover:text-forest"}`}
                        title="Edit owner"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => deleteOwner(o._id)}
                        className="text-ink-soft hover:text-red-600 transition-colors"
                        title="Delete owner"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
                {editingId === o._id && token && (
                  <EditPanel
                    owner={o}
                    properties={properties}
                    token={token}
                    onSave={(updated) => {
                      setOwners(owners.map((x) => (x._id === updated._id ? updated : x)));
                      setEditingId(null);
                    }}
                    onCancel={() => setEditingId(null)}
                  />
                )}
              </Fragment>
            ))}
            {!loading && owners.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-center text-ink-soft">No owners yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function OwnersPage() {
  return <AdminGuard><OwnersContent /></AdminGuard>;
}
