import type { GradeBand } from "@/types/concept";

export function getLevelTitle(level: number): string {
  switch (level) {
    case 0:
      return "Foundations (K-3)";
    case 1:
      return "Building Blocks (Grades 4-8)";
    case 2:
      return "High School Physics";
    case 3:
      return "Advanced High School / Intro Undergrad";
    case 4:
      return "Undergraduate Physics";
    case 5:
      return "Advanced Undergraduate / Quantum";
    case 6:
      return "Graduate Physics / Astrophysics";
    case 7:
      return "PhD-level Theory";
    default:
      return `Level ${level}`;
  }
}

export function getGradeBandTitle(band: GradeBand): string {
  switch (band) {
    case "K-3":
      return "K-3 — Curious kids";
    case "4-8":
      return "Grades 4-8 — Middle school";
    case "9-12":
      return "Grades 9-12 — High school";
    case "undergrad":
      return "Undergraduate";
    case "grad":
      return "Graduate";
    case "phd":
      return "PhD";
  }
}
