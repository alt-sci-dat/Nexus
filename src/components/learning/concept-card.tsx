import Link from "next/link";
import clsx from "clsx";
import type { Concept } from "@/types/concept";

type Props = {
  concept: Concept;
  completed?: boolean;
  unlocked?: boolean;
};

export function ConceptCard({ concept, completed = false, unlocked = true }: Props) {
  return (
    <Link
      href={`/learning/${concept.id}` as Parameters<typeof Link>[0]["href"]}
      className={clsx(
        "rounded-2xl border p-5 transition",
        completed
          ? "border-emerald-400/60 bg-emerald-400/10"
          : unlocked
            ? "border-white/15 bg-white/5 hover:bg-white/10"
            : "border-white/10 bg-white/3 opacity-60",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{concept.domain} · {concept.gradeBand}</p>
          <h4 className="mt-2 text-lg font-semibold text-white">{concept.title}</h4>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-slate-300">
          {completed ? "Done" : unlocked ? "Open" : "Locked"}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">{concept.oneLiner}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {concept.tags.slice(0, 4).map((tag) => (
          <span key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
