"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { concepts } from "@/lib/concepts";
import { loadProgress, saveProgress } from "@/lib/progress";
import { ConceptCard } from "@/components/learning/concept-card";
import type { Domain } from "@/types/concept";

export default function ProgressPage() {
  const [completed, setCompleted] = useState<string[]>([]);
  const [scores, setScores] = useState<Record<string, number>>({});

  useEffect(() => {
    const p = loadProgress();
    setCompleted(p.completedConceptIds);
    setScores(p.quizScores);
  }, []);

  const stats = useMemo(() => {
    const total = concepts.length;
    const done = completed.length;
    const byDomain: Record<string, { total: number; done: number }> = {};
    concepts.forEach((c) => {
      byDomain[c.domain] = byDomain[c.domain] || { total: 0, done: 0 };
      byDomain[c.domain].total += 1;
      if (completed.includes(c.id)) byDomain[c.domain].done += 1;
    });
    return { total, done, byDomain };
  }, [completed]);

  function reset() {
    if (!confirm("Reset all progress?")) return;
    saveProgress({ completedConceptIds: [], quizScores: {} });
    setCompleted([]);
    setScores({});
  }

  const completedConcepts = concepts.filter((c) => completed.includes(c.id));

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_28%),linear-gradient(180deg,#020617_0%,#020617_52%,#0f172a_100%)] px-4 py-6 text-white md:px-8 md:py-10">
      <div className="mx-auto max-w-[1440px] space-y-8">
        <Link href="/" className="text-xs uppercase tracking-[0.28em] text-cyan-300">← Back to roadmap</Link>
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Your progress</p>
          <h1 className="text-3xl font-semibold md:text-5xl">{stats.done}/{stats.total} concepts completed</h1>
          <p className="text-sm text-slate-400">Average quiz score: {Object.values(scores).length ? Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length) : 0}%</p>
        </header>

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 md:p-6">
          <h2 className="text-lg font-semibold text-white">By domain</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {Object.entries(stats.byDomain).map(([domain, { total, done }]) => {
              const pct = total === 0 ? 0 : Math.round((done / total) * 100);
              return (
                <Link
                  key={domain}
                  href={`/domain/${domain}` as Parameters<typeof Link>[0]["href"]}
                  className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 transition hover:bg-white/10"
                >
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{domain}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{done}/{total}</p>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full bg-cyan-400" style={{ width: `${pct}%` }} />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">Completed concepts</h2>
            {completed.length > 0 && (
              <button
                type="button"
                onClick={reset}
                className="rounded-full border border-rose-400/40 bg-rose-500/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-rose-100 hover:bg-rose-500/20"
              >
                Reset progress
              </button>
            )}
          </div>
          {completedConcepts.length === 0 ? (
            <p className="mt-4 text-sm text-slate-300">Nothing yet — open any concept and click Mark complete.</p>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {completedConcepts.map((c) => (
                <ConceptCard key={c.id} concept={c} completed />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
