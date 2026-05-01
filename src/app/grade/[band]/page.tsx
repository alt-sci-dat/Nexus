import { notFound } from "next/navigation";
import Link from "next/link";
import { getConceptsByGradeBand } from "@/lib/concepts";
import { getGradeBandTitle } from "@/lib/teaching";
import { ConceptCard } from "@/components/learning/concept-card";
import type { GradeBand } from "@/types/concept";

const validBands: GradeBand[] = ["K-3", "4-8", "9-12", "undergrad", "grad", "phd"];

export default async function GradePage({ params }: { params: Promise<{ band: string }> }) {
  const { band } = await params;
  const decoded = decodeURIComponent(band) as GradeBand;
  if (!validBands.includes(decoded)) notFound();
  const concepts = getConceptsByGradeBand(decoded);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_28%),linear-gradient(180deg,#020617_0%,#020617_52%,#0f172a_100%)] px-4 py-6 text-white md:px-8 md:py-10">
      <div className="mx-auto max-w-[1440px] space-y-8">
        <Link href="/" className="text-xs uppercase tracking-[0.28em] text-cyan-300">← Back to roadmap</Link>
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Grade band</p>
          <h1 className="text-3xl font-semibold md:text-5xl">{getGradeBandTitle(decoded)}</h1>
          <p className="text-sm text-slate-400">{concepts.length} concept{concepts.length === 1 ? "" : "s"} at this level</p>
        </header>
        {concepts.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300">
            No concepts at this band yet.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {concepts.map((c) => (
              <ConceptCard key={c.id} concept={c} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
