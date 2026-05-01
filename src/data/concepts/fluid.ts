import type { Concept } from "@/types/concept";

export const fluidConcepts: Concept[] = [
  {
    id: "fluid.pressure-depth",
    title: "Pressure Grows With Depth",
    domain: "fluid",
    gradeBand: "4-8",
    level: 1,
    difficulty: 2,
    prerequisites: [],
    tags: ["pressure", "depth", "fluid", "hydrostatic"],
    oneLiner: "In a fluid at rest, pressure increases linearly with depth: more water above means more weight pushing down.",
    explain: {
      kid: "Dive deep in a pool and your ears hurt. Why? Water above you presses harder the deeper you go.",
      teen: "P = ρ·g·h: density × gravity × depth. Doubling depth doubles pressure (above atmospheric).",
      adult: "Hydrostatic equation dP/dz = −ρg integrates to P(h) = P₀ + ρgh in incompressible fluids. Pascal's principle: external pressure transmits equally throughout.",
      phd: "Compressible fluids (atmosphere) follow exponential profile P(z) = P₀·exp(−z/H) where H = kT/(mg). Generalization to relativistic fluids in stars uses TOV equation.",
    },
    realWorld: [
      { context: "Submarines", insight: "Hull must withstand massive pressure at depth — ~10 atm per 100 m." },
      { context: "Dam design", insight: "Walls thicker at base because pressure rises with depth." },
      { context: "Hydraulic press", insight: "Pascal's law: small force on small piston → big force on big piston." },
    ],
    memoryTip: "Every 10 m water = +1 atmosphere. Diver at 30 m feels 4 atm total (atmosphere + 3 from water).",
    experiment: {
      title: "Pressure ladder",
      hypothesis: "Pressure arrows grow linearly with depth.",
      steps: [
        { action: "Double the density (e.g., salt water vs fresh).", expect: "All arrows grow proportionally." },
        { action: "Increase gravity (Jupiter sim).", expect: "Pressure scales with g too." },
      ],
      whatToNotice: ["Top of column = ~atmospheric.", "Bottom feels weight of everything above."],
      commonMistake: "Thinking shape matters. A thin tall column gives same pressure as a wide one at the same depth.",
    },
    equations: [
      {
        label: "Hydrostatic pressure",
        expression: "P = P₀ + ρ·g·h",
        meaning: "Pressure at depth h equals surface pressure plus weight of fluid column.",
        memoryTip: "Linear in depth.",
        visualHint: "Red arrows on the right grow longer as you go down.",
      },
    ],
    visual: {
      modelId: "pressure-column",
      description: "Vertical fluid column with pressure gauges at multiple depths.",
      controls: [
        { label: "Density", param: "density", min: 500, max: 2000, step: 50, default: 1000, unit: "kg/m³" },
        { label: "Gravity", param: "gravity", min: 1.6, max: 25, step: 0.2, default: 9.8, unit: "m/s²" },
      ],
    },
    quiz: [
      {
        question: "A diver descends from 10 m to 30 m. Pressure increase from water?",
        options: ["1 atm", "2 atm", "3 atm", "4 atm"],
        answerIndex: 1,
        explanation: "Δh = 20 m → ΔP ≈ 2 atm.",
      },
    ],
  },
];
