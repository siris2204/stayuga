"use client";

import { useEffect, useState } from "react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { apiFetch } from "@/lib/api";
import { Lead, LeadStatus } from "@/lib/types";
import { formatDate } from "@/lib/format";

const STATUS_STYLES: Record<LeadStatus, string> = {
  new: "bg-amber-100 text-amber-800",
  contacted: "bg-sky-100 text-sky-800",
  closed: "bg-emerald-100 text-emerald-800",
};

function LeadsContent() {
  const { token } = useAdminAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!token) return;
    setLoading(true);
    const { leads } = await apiFetch<{ leads: Lead[] }>("/api/leads", { token });
    setLeads(leads);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function updateStatus(id: string, status: LeadStatus) {
    if (!token) return;
    await apiFetch(`/api/leads/${id}/status`, {
      method: "PATCH",
      token,
      body: JSON.stringify({ status }),
    });
    load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">Leads</h1>
      <p className="mt-1 text-sm text-ink-soft">Contact form submissions from the website.</p>

      <div className="mt-8 space-y-4">
        {leads.map((lead) => (
          <div key={lead._id} className="rounded-2xl border border-line/70 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-medium text-ink">{lead.name}</p>
                <p className="text-sm text-ink-soft">
                  {lead.email} {lead.phone && `· ${lead.phone}`}
                </p>
                {lead.subject && <p className="mt-1 text-sm font-medium text-ink">{lead.subject}</p>}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-ink-soft">{formatDate(lead.createdAt)}</span>
                <select
                  value={lead.status}
                  onChange={(e) => updateStatus(lead._id, e.target.value as LeadStatus)}
                  className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${STATUS_STYLES[lead.status]}`}
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{lead.message}</p>
          </div>
        ))}
        {!loading && leads.length === 0 && (
          <p className="py-6 text-center text-ink-soft">No leads yet.</p>
        )}
      </div>
    </div>
  );
}

export default function LeadsPage() {
  return (
    <AdminGuard>
      <LeadsContent />
    </AdminGuard>
  );
}
