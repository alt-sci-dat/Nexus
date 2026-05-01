"use client";

import Link from "next/link";
import clsx from "clsx";
import { getUnlockedConceptIds } from "@/lib/concepts";
import { getGradeBandTitle } from "@/lib/teaching";
import type { Concept, GradeBand } from "@/types/concept";

type ConceptGraphProps = {
  concepts: Concept[];
  completedConceptIds: string[];
};

const order: GradeBand[] = ["K-3", "4-8", "9-12", "undergrad", "grad", "phd"];

export function ConceptGraph({ concepts, completedConceptIds }: ConceptGraphProps) {
  const unlocked = new Set(getUnlockedConceptIds(completedConceptIds));
  const groups = order
    .map((band) => ({ band, concepts: concepts.filter((c) => c.gradeBand === band) }))
    .filter((g) => g.concepts.length > 0);

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <section key={group.band} className="space-y-4 rounded-[1.75rem] border border-white/10 bg-white/3 p-4 md:p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{group.band}</p>
              <h3 className="mt-2 text-xl font-semibold text-white">{getGradeBandTitle(group.band)}</h3>
            </div>
            <p className="text-sm text-slate-400">
              {group.concepts.length} concept{group.concepts.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {group.concepts.map((concept) => {
              const completed = completedConceptIds.includes(concept.id);
              const isUnlocked = unlocked.has(concept.id) || concept.prerequisites.length === 0;
              return (
                <Link
                  key={concept.id}
                  href={`/learning/${concept.id}` as Parameters<typeof Link>[0]["href"]}
                  className={clsx(
                    "rounded-2xl border p-5 transition",
                    completed
                      ? "border-emerald-400/60 bg-emerald-400/10"
                      : isUnlocked
                        ? "border-white/15 bg-white/5 hover:bg-white/10"
                        : "border-white/10 bg-white/3 opacity-60",
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{concept.domain}</p>
                      <h4 className="mt-2 text-lg font-semibold text-white">{concept.title}</h4>
                    </div>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-slate-300">
                      {completed ? "Done" : isUnlocked ? "Open" : "Locked"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{concept.oneLiner}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {concept.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
