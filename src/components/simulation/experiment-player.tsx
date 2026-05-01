"use client";

import { useEffect, useRef, useState } from "react";
import type { Concept } from "@/types/concept";
import { getModelCtor } from "./models/registry";
import type { BaseModel } from "./models/base-model";

type Props = { concept: Concept };

export function ExperimentPlayer({ concept }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<BaseModel | null>(null);
  const rafRef = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const playStartRef = useRef<number>(0);
  const stepStartRef = useRef<number>(0);

  const visual = concept.visual;
  const steps = concept.experiment.steps;
  const loop = concept.experiment.loop ?? true;

  useEffect(() => {
    if (!containerRef.current) return;
    const Ctor = getModelCtor(visual.modelId);
    if (!Ctor) return;
    const initial: Record<string, number> = { ...(visual.initialParams ?? {}) };
    for (const c of visual.controls) initial[c.param] = c.default;
    const inst = new Ctor(containerRef.current, initial);
    inst.initialize();
    inst.start();
    modelRef.current = inst;
    return () => {
      inst.dispose();
      modelRef.current = null;
    };
  }, [visual.modelId]);

  useEffect(() => {
    if (!playing) {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      return;
    }
    playStartRef.current = performance.now();
    stepStartRef.current = performance.now();
    setStepIdx(0);
    snapToStep(0);

    const tick = () => {
      const now = performance.now();
      const step = steps[stepIdx];
      const dur = (step?.durationSec ?? 4) * 1000;
      const t = (now - stepStartRef.current) / dur;
      setProgress(Math.min(t, 1));
      if (step?.paramSet && modelRef.current) {
        const u = Math.min(t, 1);
        for (const [param, target] of Object.entries(step.paramSet)) {
          const cur = (modelRef.current as unknown as { params: Record<string, number> }).params[param];
          const start = step.paramSet["__start__" + param] as number | undefined;
          const startVal = start ?? cur;
          if (start === undefined) {
            (step.paramSet as Record<string, number>)["__start__" + param] = cur ?? 0;
          }
          const next = startVal + (target - startVal) * easeInOut(u);
          modelRef.current.setParam(param, next);
        }
      }
      if (t >= 1) {
        const next = stepIdx + 1;
        if (next < steps.length) {
          setStepIdx(next);
          stepStartRef.current = now;
          snapToStep(next);
        } else if (loop) {
          setStepIdx(0);
          stepStartRef.current = now;
          resetParams();
          snapToStep(0);
        } else {
          setPlaying(false);
          return;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, stepIdx, steps, loop]);

  function snapToStep(idx: number) {
    const step = steps[idx];
    if (!step?.paramSet) return;
    Object.keys(step.paramSet).forEach((k) => {
      if (k.startsWith("__start__")) delete (step.paramSet as Record<string, number>)[k];
    });
  }

  function resetParams() {
    if (!modelRef.current) return;
    for (const c of visual.controls) {
      modelRef.current.setParam(c.param, c.default);
    }
  }

  function pause() {
    setPlaying(false);
    setProgress(0);
  }

  function reset() {
    setPlaying(false);
    setProgress(0);
    setStepIdx(0);
    resetParams();
  }

  const currentStep = steps[stepIdx];

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl border border-cyan-400/30 bg-slate-950">
        <div ref={containerRef} className="w-full" style={{ height: 460 }} />
        {playing && currentStep && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 space-y-2 bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-transparent p-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-cyan-200">
              <span>Step {stepIdx + 1}/{steps.length}</span>
              <span className="text-slate-400">·</span>
              <span>{Math.round(progress * 100)}%</span>
            </div>
            <p className="text-base font-semibold text-white">{currentStep.action}</p>
            <p className="text-sm text-cyan-100/90">Expect: {currentStep.expect}</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
          >
            {playing ? "Pause" : "Play experiment"}
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-slate-100 hover:bg-white/10"
          >
            Reset
          </button>
          {playing && (
            <button
              type="button"
              onClick={pause}
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-slate-100 hover:bg-white/10"
            >
              Stop
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {steps.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setStepIdx(i);
                stepStartRef.current = performance.now();
                if (s.paramSet && modelRef.current) {
                  for (const [param, target] of Object.entries(s.paramSet)) {
                    if (param.startsWith("__start__")) continue;
                    modelRef.current.setParam(param, target);
                  }
                }
              }}
              className={
                "rounded-full border px-3 py-1 text-xs font-medium transition " +
                (i === stepIdx
                  ? "border-cyan-400 bg-cyan-400/15 text-cyan-100"
                  : "border-white/15 bg-white/5 text-slate-300 hover:bg-white/10")
              }
            >
              Step {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}
