"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { apiFetch } from "@/lib/api";
import { ContentBlocks, FaqItem, PolicyPage, Testimonial } from "@/lib/types";
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

  async function addFaq(e: React.FormEvent<HTMLFormElement>) {
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

function TestimonialsManager({ token, initial }: { token: string; initial: Testimonial[] }) {
  const [items, setItems] = useState(initial);
  const [form, setForm] = useState({ quote: "", author: "", context: "" });
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ quote: "", author: "", context: "" });

  async function addTestimonial(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.quote || !form.author || !form.context) return;
    setAdding(true);
    const { testimonial } = await apiFetch<{ testimonial: Testimonial }>("/api/content/testimonials", {
      method: "POST",
      token,
      body: JSON.stringify({ ...form, order: items.length + 1 }),
    });
    setItems([...items, testimonial]);
    setForm({ quote: "", author: "", context: "" });
    setAdding(false);
  }

  async function saveEdit(id: string) {
    const { testimonial } = await apiFetch<{ testimonial: Testimonial }>(`/api/content/testimonials/${id}`, {
      method: "PUT",
      token,
      body: JSON.stringify(editForm),
    });
    setItems(items.map((t) => (t._id === id ? testimonial : t)));
    setEditId(null);
  }

  async function remove(id: string) {
    await apiFetch(`/api/content/testimonials/${id}`, { method: "DELETE", token });
    setItems(items.filter((t) => t._id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="divide-y divide-line/70 rounded-xl border border-line/70">
        {items.map((t) => (
          <div key={t._id} className="p-4">
            {editId === t._id ? (
              <div className="space-y-2">
                <Textarea label="Quote" value={editForm.quote} onChange={(e) => setEditForm({ ...editForm, quote: e.target.value })} />
                <Input label="Author" value={editForm.author} onChange={(e) => setEditForm({ ...editForm, author: e.target.value })} />
                <Input label="Property / context" value={editForm.context} onChange={(e) => setEditForm({ ...editForm, context: e.target.value })} />
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => saveEdit(t._id)}>Save</Button>
                  <button type="button" onClick={() => setEditId(null)} className="text-sm text-ink-soft hover:text-ink">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-ink">"{t.quote}"</p>
                  <p className="mt-1 text-xs text-ink-soft">{t.author} — {t.context}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => { setEditId(t._id); setEditForm({ quote: t.quote, author: t.author, context: t.context }); }}
                    className="text-ink-soft hover:text-forest"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button onClick={() => remove(t._id)} className="text-ink-soft hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {items.length === 0 && <p className="p-4 text-sm text-ink-soft">No reviews yet. Add one below — or leave empty to show the default reviews.</p>}
      </div>

      <form onSubmit={addTestimonial} className="space-y-3 rounded-xl border border-dashed border-line p-4">
        <Textarea label="Quote (guest review)" value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} />
        <Input label="Guest name / author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="e.g. Meera S." />
        <Input label="Property / context" value={form.context} onChange={(e) => setForm({ ...form, context: e.target.value })} placeholder="e.g. Ananta Villa, Kasauli" />
        <Button type="submit" variant="outline" disabled={adding}>
          {adding ? "Adding..." : "Add review"}
        </Button>
      </form>
    </div>
  );
}

function ContentContent() {
  const { token } = useAdminAuth();
  const [data, setData] = useState<{ blocks: ContentBlocks; faqs: FaqItem[]; policies: PolicyPage[]; testimonials: Testimonial[] } | null>(
    null
  );

  useEffect(() => {
    apiFetch<{ blocks: ContentBlocks; faqs: FaqItem[]; policies: PolicyPage[]; testimonials: Testimonial[] }>("/api/content").then(
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
        <h2 className="font-display text-lg text-ink">Guest reviews</h2>
        <p className="mt-1 text-sm text-ink-soft">These appear in the "What our guests remember" section on the homepage.</p>
        <div className="mt-4">
          <TestimonialsManager token={token} initial={data.testimonials} />
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
