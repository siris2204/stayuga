"use client";

import { use, useEffect, useState } from "react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { PropertyForm } from "@/components/admin/PropertyForm";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { getPropertyById } from "@/lib/data";
import { Property } from "@/lib/types";

function EditPropertyContent({ id }: { id: string }) {
  const { token } = useAdminAuth();
  const [property, setProperty] = useState<Property | null>(null);

  useEffect(() => {
    if (!token) return;
    getPropertyById(id, token).then(setProperty);
  }, [id, token]);

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">Edit property</h1>
      <p className="mt-1 text-sm text-ink-soft">Update listing details.</p>
      <div className="mt-8 max-w-3xl">
        {property ? <PropertyForm property={property} /> : <p className="text-ink-soft">Loading...</p>}
      </div>
    </div>
  );
}

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <AdminGuard>
      <EditPropertyContent id={id} />
    </AdminGuard>
  );
}
