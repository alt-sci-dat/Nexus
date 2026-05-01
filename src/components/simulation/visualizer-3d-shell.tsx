"use client";

import type { Concept } from "@/types/concept";
import { Concept3DViewer } from "./concept-3d-viewer";

type Props = { concept: Concept };

export function Visualizer3DShell({ concept }: Props) {
  if (!concept.visual) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6">
        <p className="text-slate-400">No 3D visualization defined for this concept yet.</p>
      </div>
    );
  }
  return <Concept3DViewer visual={concept.visual} />;
}
