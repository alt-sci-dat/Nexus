import { notFound } from "next/navigation";
import Link from "next/link";
import { getConceptsByDomain } from "@/lib/concepts";
import { ConceptCard } from "@/components/learning/concept-card";
import type { Domain } from "@/types/concept";

const validDomains: Domain[] = [
  "mechanics",
  "waves",
  "thermo",
  "em",
  "optics",
  "modern",
  "quantum",
  "atomic",
  "nuclear",
  "particle",
  "astro",
  "propulsion",
  "plasma",
  "fluid",
  "biophysics",
  "geophysics",
  "math",
];

const domainTitles: Record<Domain, string> = {
  mechanics: "Mechanics",
  waves: "Waves & Oscillations",
  thermo: "Thermodynamics",
  em: "Electromagnetism",
  optics: "Optics & Light",
  modern: "Modern Physics",
  quantum: "Quantum Physics",
  atomic: "Atomic Physics",
  nuclear: "Nuclear Physics",
  particle: "Particle Physics",
  astro: "Astrophysics & Cosmology",
  propulsion: "Propulsion",
  plasma: "Plasma Physics",
  fluid: "Fluid Mechanics",
  biophysics: "Biophysics",
  geophysics: "Geophysics",
  math: "Mathematical Methods",
};

export default async function DomainPage({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params;
  if (!validDomains.includes(domain as Domain)) notFound();
  const concepts = getConceptsByDomain(domain as Domain);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_28%),linear-gradient(180deg,#020617_0%,#020617_52%,#0f172a_100%)] px-4 py-6 text-white md:px-8 md:py-10">
      <div className="mx-auto max-w-[1440px] space-y-8">
        <Link href="/" className="text-xs uppercase tracking-[0.28em] text-cyan-300">← Back to roadmap</Link>
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Domain</p>
          <h1 className="text-3xl font-semibold md:text-5xl">{domainTitles[domain as Domain]}</h1>
          <p className="text-sm text-slate-400">{concepts.length} concept{concepts.length === 1 ? "" : "s"} live</p>
        </header>
        {concepts.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300">
            No concepts authored yet for this domain. Check back as the curriculum grows.
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
