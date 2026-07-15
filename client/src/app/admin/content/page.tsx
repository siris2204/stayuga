"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { apiFetch } from "@/lib/api";
import { ContentBlocks, FaqItem, PolicyPage } from "@/lib/types";
import { Input, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

const POLICY_SLUGS = [
  { slug: "terms", label: "Terms & Conditions" },
  { slug: "privacy", label: "Privacy Policy" },
  { slug: "cancellation", label: "Cancellation Policy" },
];

function HeroEditor({ token, initial }: { token: string; initial: { heading: string; subheading: string } }) {
  const [heading, setHeading] = useState(initial.heading);
  const [subheading, setSubheading] = useState(initial.subheading);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    await apiFetch("/api/content/blocks/homepage-hero", {
      method: "PUT",
      token,
      body: JSON.stringify({ value: { heading, subheading } }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-4">
      <Input label="Hero heading" value={heading} onChange={(e) => setHeading(e.target.value)} />
      <Textarea label="Hero subheading" value={subheading} onChange={(e) => setSubheading(e.target.value)} />
      <Button type="button" onClick={save} disabled={saving}>
        {saving ? "Saving..." : saved ? "Saved" : "Save"}
      </Button>
    </div>
  );
}

function AboutEditor({ token, initial }: { token: string; initial: { heading: string; body: string } }) {
  const [heading, setHeading] = useState(initial.heading);
  const [body, setBody] = useState(initial.body);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    await apiFetch("/api/content/blocks/about-mission", {
      method: "PUT",
      token,
      body: JSON.stringify({ value: { heading, body } }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-4">
      <Input label="About heading" value={heading} onChange={(e) => setHeading(e.target.value)} />
      <Textarea label="About body" value={body} onChange={(e) => setBody(e.target.value)} />
      <Button type="button" onClick={save} disabled={saving}>
        {saving ? "Saving..." : saved ? "Saved" : "Save"}
      </Button>
    </div>
  );
}

function FaqManager({ token, initial }: { token: string; initial: FaqItem[] }) {
  const [faqs, setFaqs] = useState(initial);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [adding, setAdding] = useState(false);

  async function addFaq(e: React.FormEvent) {
    e.preventDefault();
    if (!question || !answer) return;
    setAdding(true);
    const { faq } = await apiFetch<{ faq: FaqItem }>("/api/content/faqs", {
      method: "POST",
      token,
      body: JSON.stringify({ question, answer, order: faqs.length + 1 }),
    });
    setFaqs([...faqs, faq]);
    setQuestion("");
    setAnswer("");
    setAdding(false);
  }

  async function removeFaq(id: string) {
    await apiFetch(`/api/content/faqs/${id}`, { method: "DELETE", token });
    setFaqs(faqs.filter((f) => f._id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="divide-y divide-line/70 rounded-xl border border-line/70">
        {faqs.map((faq) => (
          <div key={faq._id} className="flex items-start justify-between gap-4 p-4">
            <div>
              <p className="text-sm font-medium text-ink">{faq.question}</p>
              <p className="mt-1 text-sm text-ink-soft">{faq.answer}</p>
            </div>
            <button onClick={() => removeFaq(faq._id)} className="shrink-0 text-ink-soft hover:text-red-600">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {faqs.length === 0 && <p className="p-4 text-sm text-ink-soft">No FAQs yet.</p>}
      </div>

      <form onSubmit={addFaq} className="space-y-3 rounded-xl border border-dashed border-line p-4">
        <Input label="New question" value={question} onChange={(e) => setQuestion(e.target.value)} />
        <Textarea label="Answer" value={answer} onChange={(e) => setAnswer(e.target.value)} />
        <Button type="submit" variant="outline" disabled={adding}>
          {adding ? "Adding..." : "Add FAQ"}
        </Button>
      </form>
    </div>
  );
}

function PolicyEditor({ token, slug, label, initial }: { token: string; slug: string; label: string; initial?: PolicyPage }) {
  const [title, setTitle] = useState(initial?.title ?? label);
  const [content, setContent] = useState(initial?.content ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    await apiFetch(`/api/content/policies/${slug}`, {
      method: "PUT",
      token,
      body: JSON.stringify({ title, content }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-3 rounded-xl border border-line/70 p-4">
      <Input label={`${label} — title`} value={title} onChange={(e) => setTitle(e.target.value)} />
      <Textarea label="Content" value={content} onChange={(e) => setContent(e.target.value)} className="min-h-40" />
      <Button type="button" variant="outline" onClick={save} disabled={saving}>
        {saving ? "Saving..." : saved ? "Saved" : "Save"}
      </Button>
    </div>
  );
}

function ContentContent() {
  const { token } = useAdminAuth();
  const [data, setData] = useState<{ blocks: ContentBlocks; faqs: FaqItem[]; policies: PolicyPage[] } | null>(
    null
  );

  useEffect(() => {
    apiFetch<{ blocks: ContentBlocks; faqs: FaqItem[]; policies: PolicyPage[] }>("/api/content").then(
      setData
    );
  }, []);

  if (!token || !data) return <p className="text-ink-soft">Loading...</p>;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-2xl text-ink">Content</h1>
        <p className="mt-1 text-sm text-ink-soft">Manage homepage copy, FAQs, and policy pages.</p>
      </div>

      <section className="rounded-2xl border border-line/70 bg-white p-6">
        <h2 className="font-display text-lg text-ink">Homepage hero</h2>
        <div className="mt-4">
          <HeroEditor
            token={token}
            initial={
              data.blocks["homepage-hero"] ?? {
                heading: "Curated stays where nature, comfort, and memories meet",
                subheading: "Handpicked villas and farmhouses for the moments worth slowing down for.",
              }
            }
          />
        </div>
      </section>

      <section className="rounded-2xl border border-line/70 bg-white p-6">
        <h2 className="font-display text-lg text-ink">About page</h2>
        <div className="mt-4">
          <AboutEditor
            token={token}
            initial={
              data.blocks["about-mission"] ?? {
                heading: "Our mission",
                body: "Stayuga curates a small, handpicked portfolio of luxury villas and farmhouses.",
              }
            }
          />
        </div>
      </section>

      <section className="rounded-2xl border border-line/70 bg-white p-6">
        <h2 className="font-display text-lg text-ink">FAQs</h2>
        <div className="mt-4">
          <FaqManager token={token} initial={data.faqs} />
        </div>
      </section>

      <section className="rounded-2xl border border-line/70 bg-white p-6">
        <h2 className="font-display text-lg text-ink">Policy pages</h2>
        <div className="mt-4 space-y-4">
          {POLICY_SLUGS.map(({ slug, label }) => (
            <PolicyEditor
              key={slug}
              token={token}
              slug={slug}
              label={label}
              initial={data.policies.find((p) => p.slug === slug)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default function ContentPage() {
  return (
    <AdminGuard>
      <ContentContent />
    </AdminGuard>
  );
}
