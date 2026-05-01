"use client";

import { useEffect, useRef, useState } from "react";
import type { VisualModel } from "@/types/concept";
import { getModelCtor } from "./models/registry";
import type { BaseModel } from "./models/base-model";

export function Concept3DViewer({ visual }: { visual: VisualModel }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<BaseModel | null>(null);
  const initialParams = buildInitialParams(visual);
  const [params, setParams] = useState<Record<string, number>>(initialParams);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const Ctor = getModelCtor(visual.modelId);
    if (!Ctor) {
      setError(`Unknown model: ${visual.modelId}`);
      return;
    }
    try {
      const inst = new Ctor(containerRef.current, params);
      inst.initialize();
      inst.start();
      modelRef.current = inst;
      return () => {
        inst.dispose();
        modelRef.current = null;
      };
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [visual.modelId]);

  function handleParamChange(name: string, value: number) {
    setParams((prev) => ({ ...prev, [name]: value }));
    modelRef.current?.setParam(name, value);
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/40 bg-red-950/30 p-4 text-sm text-red-200">
        3D model error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950"
        style={{ height: 500 }}
      />
      <p className="text-sm leading-7 text-slate-300">{visual.description}</p>
      {visual.controls.length > 0 && (
        <div className="grid gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4 md:grid-cols-2">
          {visual.controls.map((c) => (
            <div key={c.param} className="space-y-1">
              <label className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-300">
                <span>{c.label}</span>
                <span className="text-cyan-200">
                  {(params[c.param] ?? c.default).toFixed(2)} {c.unit ?? ""}
                </span>
              </label>
              <input
                type="range"
                min={c.min}
                max={c.max}
                step={c.step}
                value={params[c.param] ?? c.default}
                onChange={(e) => handleParamChange(c.param, parseFloat(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function buildInitialParams(visual: VisualModel) {
  const out: Record<string, number> = { ...(visual.initialParams ?? {}) };
  for (const c of visual.controls) {
    if (out[c.param] === undefined) out[c.param] = c.default;
  }
  return out;
}
