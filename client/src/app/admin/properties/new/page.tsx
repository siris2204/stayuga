"use client";

import { AdminGuard } from "@/components/admin/AdminGuard";
import { PropertyForm } from "@/components/admin/PropertyForm";

function NewPropertyContent() {
  return (
    <div>
      <h1 className="font-display text-2xl text-ink">New property</h1>
      <p className="mt-1 text-sm text-ink-soft">Add a new villa or farmhouse listing.</p>
      <div className="mt-8 max-w-3xl">
        <PropertyForm />
      </div>
    </div>
  );
}

export default function NewPropertyPage() {
  return (
    <AdminGuard>
      <NewPropertyContent />
    </AdminGuard>
  );
}
