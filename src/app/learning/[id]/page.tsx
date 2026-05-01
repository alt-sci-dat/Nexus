import { notFound } from "next/navigation";
import { concepts } from "@/lib/concepts";
import { ConceptPageClient } from "@/components/learning/concept-page-client";

type ConceptPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ConceptPage({ params }: ConceptPageProps) {
  const { id } = await params;
  const concept = concepts.find((entry) => entry.id === id);

  if (!concept) {
    notFound();
  }

  return <ConceptPageClient concept={concept} />;
}


