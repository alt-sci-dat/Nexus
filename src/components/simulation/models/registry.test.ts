import { describe, expect, it } from "vitest";
import { concepts } from "@/lib/concepts";
import { modelRegistry, getModelCtor } from "./registry";

describe("model registry smoke", () => {
  it("every concept references an existing 3D model", () => {
    for (const c of concepts) {
      expect(modelRegistry[c.visual.modelId], `missing model for ${c.id}`).toBeDefined();
      expect(typeof getModelCtor(c.visual.modelId)).toBe("function");
    }
  });

  it("every visual control has param + sane bounds", () => {
    for (const c of concepts) {
      for (const ctrl of c.visual.controls) {
        expect(ctrl.param.length).toBeGreaterThan(0);
        expect(ctrl.min).toBeLessThan(ctrl.max);
        expect(ctrl.default).toBeGreaterThanOrEqual(ctrl.min);
        expect(ctrl.default).toBeLessThanOrEqual(ctrl.max);
      }
    }
  });

  it("every concept ships explanations for all four audiences", () => {
    for (const c of concepts) {
      expect(c.explain.kid.length).toBeGreaterThan(20);
      expect(c.explain.teen.length).toBeGreaterThan(20);
      expect(c.explain.adult.length).toBeGreaterThan(20);
      expect(c.explain.phd.length).toBeGreaterThan(20);
    }
  });

  it("every concept has a memory tip and at least one equation, real-world, quiz", () => {
    for (const c of concepts) {
      expect(c.memoryTip.length).toBeGreaterThan(10);
      expect(c.equations.length).toBeGreaterThan(0);
      expect(c.realWorld.length).toBeGreaterThan(0);
      expect(c.quiz.length).toBeGreaterThan(0);
      for (const q of c.quiz) {
        expect(q.options.length).toBeGreaterThanOrEqual(2);
        expect(q.answerIndex).toBeGreaterThanOrEqual(0);
        expect(q.answerIndex).toBeLessThan(q.options.length);
      }
    }
  });
});
