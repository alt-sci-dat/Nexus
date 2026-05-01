import Link from "next/link";
import { conceptSummaries } from "@/lib/concept-index";
import { ConceptExplorer } from "@/components/home/concept-explorer";

export default function HomePage() {
  const firstConcept = conceptSummaries[0];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_28%),linear-gradient(180deg,#020617_0%,#020617_52%,#0f172a_100%)] px-4 py-6 text-white md:px-8 md:py-10">
      <div className="mx-auto max-w-[1440px] space-y-8">
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/75 shadow-2xl shadow-black/35 backdrop-blur">
          <div className="grid gap-0 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="p-6 md:p-10 xl:p-12">
              <div className="max-w-3xl space-y-5">
                <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Physics for everyone</p>
                <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
                  From kindergarten curiosity to graduate-level theory.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-300">
                  Each concept comes with four explanation modes (kid → teen → adult → PhD), a bespoke interactive 3D
                  model using real-life objects, real-world examples, a memory tip, an experiment, math equations, and a
                  quiz.
                </p>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <InfoCard label="Audience toggle" value="One pill switches between simple words and full PhD-level depth." />
                <InfoCard label="3D over waveforms" value="Each concept maps to a real-world object — planets, rockets, lenses, magnets, atoms." />
                <InfoCard label="Real-life memory" value="Every concept ties to something you can recall: an apple, a swing, a flashlight." />
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {firstConcept && (
                  <Link
                    href={`/learning/${firstConcept.id}` as Parameters<typeof Link>[0]["href"]}
                    className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
                  >
                    Start at K-3
                  </Link>
                )}
                <Link
                  href={"/progress" as Parameters<typeof Link>[0]["href"]}
                  className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/10"
                >
                  Your progress
                </Link>
                <a
                  href="#explorer"
                  className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/10"
                >
                  Browse concepts
                </a>
              </div>
            </div>

            <div className="border-t border-white/10 bg-slate-900/80 p-4 md:p-6 xl:border-l xl:border-t-0">
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5 space-y-4">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Jump in by age</p>
                <div className="grid grid-cols-2 gap-2">
                  {(["K-3", "4-8", "9-12", "undergrad", "grad", "phd"] as const).map((b) => (
                    <Link
                      key={b}
                      href={`/grade/${b}` as Parameters<typeof Link>[0]["href"]}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 hover:bg-white/10"
                    >
                      {b}
                    </Link>
                  ))}
                </div>
                <p className="pt-2 text-xs uppercase tracking-[0.28em] text-slate-400">Jump in by domain</p>
                <div className="grid grid-cols-2 gap-2">
                  {(["mechanics", "em", "optics", "thermo", "quantum", "astro", "propulsion", "fluid"] as const).map((d) => (
                    <Link
                      key={d}
                      href={`/domain/${d}` as Parameters<typeof Link>[0]["href"]}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 hover:bg-white/10"
                    >
                      {d}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="explorer" className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Concept explorer</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Find a concept</h2>
            </div>
            <p className="text-sm text-slate-400">{conceptSummaries.length} concepts live</p>
          </div>
          <ConceptExplorer summaries={conceptSummaries} />
        </section>
      </div>
    </main>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm leading-6 text-slate-200">{value}</p>
    </article>
  );
}
