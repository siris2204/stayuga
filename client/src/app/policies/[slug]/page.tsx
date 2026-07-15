import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPolicy } from "@/lib/data";
import { ApiRequestError } from "@/lib/api";
import { Container } from "@/components/ui/Container";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function fetchPolicyOr404(slug: string) {
  try {
    return await getPolicy(slug);
  } catch (err) {
    if (err instanceof ApiRequestError && err.status === 404) notFound();
    throw err;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const policy = await fetchPolicyOr404(slug);
  return { title: policy.title };
}

export default async function PolicyPage({ params }: PageProps) {
  const { slug } = await params;
  const policy = await fetchPolicyOr404(slug);

  return (
    <div className="py-16">
      <Container className="max-w-3xl">
        <h1 className="font-display text-3xl text-ink">{policy.title}</h1>
        <p className="mt-6 whitespace-pre-line leading-relaxed text-ink-soft">{policy.content}</p>
      </Container>
    </div>
  );
}
