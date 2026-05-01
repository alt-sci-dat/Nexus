"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import clsx from "clsx";
import type { Audience, Concept } from "@/types/concept";
import { loadProgress, saveProgress } from "@/lib/progress";
import { Concept3DViewer } from "@/components/simulation/concept-3d-viewer";

const Visualizer3DShell = dynamic(
  () => import("@/components/simulation/visualizer-3d-shell").then((m) => m.Visualizer3DShell),
  { ssr: false }
);

type Props = { concept: Concept };

const audienceOrder: Audience[] = ["kid", "teen", "adult", "phd"];
const audienceLabel: Record<Audience, string> = {
  kid: "Kid",
  teen: "Teen",
  adult: "Adult",
  phd: "PhD",
};

export function ConceptPageClient({ concept }: Props) {
  const [audience, setAudience] = useState<Audience>("teen");
  const [showMath, setShowMath] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [completed, setCompleted] = useState(false);
  const progress = useMemo(() => loadProgress(), []);

  const explainText = concept.explain?.[audience] || concept.oneLiner;

  function pick(qIdx: number, optIdx: number) {
    setAnswers((p) => ({ ...p, [qIdx]: optIdx }));
  }

  function markComplete() {
    const next = {
      ...progress,
      completedConceptIds: Array.from(new Set([...progress.completedConceptIds, concept.id])),
      quizScores: { ...progress.quizScores, [concept.id]: 100 },
    };
    saveProgress(next);
    setCompleted(true);
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/10 bg-slate-950/65 p-6 shadow-2xl shadow-black/30 backdrop-blur md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="max-w-4xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Pill>{concept.domain}</Pill>
              <Pill>{concept.gradeBand}</Pill>
              <Pill>Difficulty {concept.difficulty}/5</Pill>
            </div>
            <h1 className="text-3xl font-semibold text-white md:text-5xl">{concept.title}</h1>
            <p className="text-base leading-8 text-slate-300 md:text-lg">{concept.oneLiner}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {audienceOrder.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAudience(a)}
                className={clsx(
                  "rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] transition",
                  audience === a
                    ? "border-cyan-400 bg-cyan-400/15 text-cyan-100"
                    : "border-white/15 bg-white/5 text-slate-300 hover:bg-white/10",
                )}
              >
                {audienceLabel[a]}
              </button>
            ))}
          </div>
        </div>

        <article className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Explanation · {audienceLabel[audience]} mode</p>
          <p className="mt-3 text-base leading-8 text-slate-100">{explainText}</p>
        </article>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Card label="Memory tip">
            <p className="text-sm leading-7 text-slate-200">{concept.memoryTip}</p>
          </Card>
          <Card label="Common mistake">
            <p className="text-sm leading-7 text-slate-200">{concept.experiment?.commonMistake || "N/A"}</p>
          </Card>
          <Card label="Hypothesis to test">
            <p className="text-sm leading-7 text-slate-200">{concept.experiment?.hypothesis || "N/A"}</p>
          </Card>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 md:p-6">
        <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Interactive 3D model</p>
            <h2 className="text-xl font-semibold text-white">{concept.title}</h2>
          </div>
        </header>
        {concept.visual ? (
          <Concept3DViewer visual={concept.visual} />
        ) : (
          <Visualizer3DShell concept={concept} />
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Real-world examples</p>
          <ul className="mt-3 space-y-3">
            {concept.realWorld?.map((rw) => (
              <li key={rw.context} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-sm font-semibold text-white">{rw.context}</p>
                <p className="mt-1 text-sm leading-7 text-slate-300">{rw.insight}</p>
              </li>
            )) || <li className="text-slate-400 italic">No examples available</li>}
          </ul>
        </article>

        <article className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Experiment</p>
          </div>
          {concept.experiment ? (
            <>
              <h3 className="mt-2 text-lg font-semibold text-white">{concept.experiment.title}</h3>
              <ol className="mt-3 space-y-3 text-sm leading-7 text-slate-200">
                {concept.experiment.steps?.map((s, i) => (
                  <li key={i} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <p className="font-medium text-white">{i + 1}. {s.action}</p>
                    <p className="mt-1 text-slate-300">Expect: {s.expect}</p>
                  </li>
                )) || null}
              </ol>
              <div className="mt-4 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-4 text-sm leading-7 text-cyan-50/90">
                <p className="font-semibold uppercase tracking-[0.18em] text-cyan-100">Watch for</p>
                <ul className="mt-2 list-disc pl-5">
                  {concept.experiment.whatToNotice?.map((w) => <li key={w}>{w}</li>) || null}
                </ul>
              </div>
            </>
          ) : (
            <p className="mt-3 text-slate-400 italic">No experiment available</p>
          )}
        </article>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Mathematics</p>
            <h2 className="text-xl font-semibold text-white">Equations</h2>
          </div>
          <button
            type="button"
            onClick={() => setShowMath((v) => !v)}
            className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-cyan-100"
          >
            {showMath ? "Hide" : "Reveal"}
          </button>
        </header>
        {showMath && concept.equations && (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {concept.equations.map((eq) => (
              <div key={eq.label} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{eq.label}</p>
                <p className="mt-2 font-mono text-base text-cyan-100">{eq.expression}</p>
                <p className="mt-2 text-sm leading-7 text-slate-200">{eq.meaning}</p>
                <p className="mt-2 text-xs leading-6 text-slate-400">Memory: {eq.memoryTip}</p>
                <p className="text-xs leading-6 text-slate-400">Visual: {eq.visualHint}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Quick check</p>
        <div className="mt-3 space-y-4">
          {concept.quiz?.map((q, qIdx) => {
            const picked = answers[qIdx];
            return (
              <div key={q.question} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-sm font-medium text-white">{q.question}</p>
                <div className="mt-3 grid gap-2">
                  {q.options?.map((opt, oIdx) => {
                    const isPicked = picked === oIdx;
                    const isCorrect = q.answerIndex === oIdx;
                    const reveal = picked !== undefined;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => pick(qIdx, oIdx)}
                        className={clsx(
                          "rounded-xl border px-3 py-2 text-left text-sm transition",
                          !reveal && "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10",
                          reveal && isCorrect && "border-emerald-400 bg-emerald-500/10 text-emerald-100",
                          reveal && isPicked && !isCorrect && "border-rose-400 bg-rose-500/10 text-rose-100",
                          reveal && !isPicked && !isCorrect && "border-white/10 bg-white/5 text-slate-400",
                        )}
                      >
                        {opt}
                      </button>
                    );
                  }) || null}
                </div>
                {picked !== undefined && (
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {picked === q.answerIndex ? "Correct. " : "Not quite. "}
                    {q.explanation}
                  </p>
                )}
              </div>
            );
          }) || <p className="text-slate-400 italic">No quiz available</p>}
        </div>
        <button
          type="button"
          onClick={markComplete}
          className="mt-4 w-full rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
        >
          {completed ? "Completed" : "Mark concept complete"}
        </button>
      </section>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-100">
      {children}
    </span>
  );
}

function Card({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{label}</p>
      <div className="mt-2">{children}</div>
    </article>
  );
}
