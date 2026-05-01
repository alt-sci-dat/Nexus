import type { Concept, Domain, GradeBand } from "@/types/concept";
import { concepts } from "@/data/concepts/index";

export { concepts };

export function getConceptById(id: string): Concept | undefined {
  return concepts.find((c) => c.id === id);
}

export function getConceptsByDomain(domain: Domain): Concept[] {
  return concepts.filter((c) => c.domain === domain);
}

export function getConceptsByGradeBand(gradeBand: GradeBand): Concept[] {
  return concepts.filter((c) => c.gradeBand === gradeBand);
}

export function getConceptsGroupedByLevel() {
  const levels = Array.from(new Set(concepts.map((c) => c.level))).sort((a, b) => a - b);
  return levels.map((level) => ({ level, concepts: concepts.filter((c) => c.level === level) }));
}

export function getConceptsGroupedByGradeBand() {
  const order: GradeBand[] = ["K-3", "4-8", "9-12", "undergrad", "grad", "phd"];
  return order
    .map((band) => ({ band, concepts: concepts.filter((c) => c.gradeBand === band) }))
    .filter((g) => g.concepts.length > 0);
}

export function getUnlockedConceptIds(completedConceptIds: string[]) {
  return concepts
    .filter((c) => c.prerequisites.every((p) => completedConceptIds.includes(p)))
    .map((c) => c.id);
}
