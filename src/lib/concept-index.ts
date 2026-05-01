import type { Concept, Domain, GradeBand } from "@/types/concept";
import { concepts } from "@/data/concepts/index";

export type ConceptSummary = {
  id: string;
  title: string;
  domain: Domain;
  gradeBand: GradeBand;
  level: number;
  difficulty: number;
  prerequisites: string[];
  tags: string[];
  oneLiner: string;
};

export const conceptSummaries: ConceptSummary[] = concepts.map((c: Concept) => ({
  id: c.id,
  title: c.title,
  domain: c.domain,
  gradeBand: c.gradeBand,
  level: c.level,
  difficulty: c.difficulty,
  prerequisites: c.prerequisites,
  tags: c.tags,
  oneLiner: c.oneLiner,
}));

export function searchConcepts(query: string): ConceptSummary[] {
  const q = query.trim().toLowerCase();
  if (!q) return conceptSummaries;
  return conceptSummaries.filter((c) => {
    return (
      c.title.toLowerCase().includes(q) ||
      c.oneLiner.toLowerCase().includes(q) ||
      c.tags.some((t) => t.toLowerCase().includes(q)) ||
      c.domain.toLowerCase().includes(q)
    );
  });
}
