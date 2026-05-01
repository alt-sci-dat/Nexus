"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import clsx from "clsx";
import type { ConceptSummary } from "@/lib/concept-index";
import type { Domain, GradeBand } from "@/types/concept";

type Props = {
  summaries: ConceptSummary[];
};

const allDomains: Domain[] = [
  "mechanics", "waves", "thermo", "em", "optics", "quantum",
  "nuclear", "particle", "astro", "propulsion", "plasma", "fluid",
];

const allBands: GradeBand[] = ["K-3", "4-8", "9-12", "undergrad", "grad", "phd"];

export function ConceptExplorer({ summaries }: Props) {
  const [domain, setDomain] = useState<Domain | "all">("all");
  const [band, setBand] = useState<GradeBand | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return summaries.filter((c) => {
      if (domain !== "all" && c.domain !== domain) return false;
      if (band !== "all" && c.gradeBand !== band) return false;
      if (!q) return true;
      return (
        c.title.toLowerCase().includes(q) ||
        c.oneLiner.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [summaries, domain, band, query]);

  const counts = useMemo(() => {
    const byDomain: Record<string, number> = {};
    summaries.forEach((c) => {
      byDomain[c.domain] = (byDomain[c.domain] || 0) + 1;
    });
    return byDomain;
  }, [summaries]);

  return (
    <div className="space-y-6">
      <div className="space-y-3 rounded-[1.75rem] border border-white/10 bg-white/3 p-4 md:p-5">
        <div className="flex flex-wrap gap-2">
          <Chip active={band === "all"} onClick={() => setBand("all")}>All ages</Chip>
          {allBands.map((b) => (
            <Chip key={b} active={band === b} onClick={() => setBand(b)}>{b}</Chip>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip active={domain === "all"} onClick={() => setDomain("all")}>All domains</Chip>
          {allDomains
            .filter((d) => counts[d])
            .map((d) => (
              <Chip key={d} active={domain === d} onClick={() => setDomain(d)}>
                {d} ({counts[d]})
              </Chip>
            ))}
        </div>
        <input
          type="text"
          placeholder="Search title, idea, or tag…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
        />
        <p className="text-xs text-slate-400">
          Showing {filtered.length} of {summaries.length} concepts
        </p>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300">No concepts match those filters.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c) => (
            <Link
              key={c.id}
              href={`/learning/${c.id}` as Parameters<typeof Link>[0]["href"]}
              className="rounded-2xl border border-white/15 bg-white/5 p-5 transition hover:bg-white/10"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                    {c.domain} · {c.gradeBand}
                  </p>
                  <h4 className="mt-2 text-lg font-semibold text-white">{c.title}</h4>
                </div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-slate-300">
                  Difficulty {c.difficulty}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">{c.oneLiner}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {c.tags.slice(0, 4).map((tag) => (
                  <span key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Chip({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] transition",
        active
          ? "border-cyan-400 bg-cyan-400/15 text-cyan-100"
          : "border-white/15 bg-white/5 text-slate-300 hover:bg-white/10",
      )}
    >
      {children}
    </button>
  );
}
