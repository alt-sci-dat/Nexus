import type { Concept } from "@/types/concept";

export const astroConcepts: Concept[] = [
  {
    id: "astro.keplers-laws",
    title: "Kepler's Laws of Planetary Motion",
    domain: "astro",
    gradeBand: "undergrad",
    level: 4,
    difficulty: 4,
    prerequisites: ["mech.gravity-falls-down", "mech.newtons-second-law"],
    tags: ["kepler", "orbit", "ellipse", "gravity"],
    oneLiner: "Planets orbit the Sun on ellipses; they sweep equal areas in equal times; the square of period scales with cube of semi-major axis.",
    explain: {
      kid: "Planets don't go in perfect circles around the Sun. They go in stretched ovals. Faster near the Sun, slower far away.",
      teen: "Three laws: (1) orbits are ellipses with Sun at one focus; (2) line from Sun to planet sweeps equal areas in equal times; (3) T² ∝ a³.",
      adult: "Derive from Newton's gravity F = G·M·m/r². Conservation of angular momentum gives equal-areas; energy + L² gives ellipse with eccentricity e.",
      phd: "Two-body problem reduces to one-body in relative coordinates with reduced mass μ = m₁m₂/(m₁+m₂). N-body chaos for N≥3; Lagrange points are equilibria of restricted three-body problem.",
    },
    realWorld: [
      { context: "Halley's Comet", insight: "Highly eccentric ellipse — close pass every ~76 years." },
      { context: "GPS satellites", insight: "Near-circular orbits with T² = a³ in geocentric units; precise position depends on relativistic corrections." },
      { context: "Exoplanet detection", insight: "Radial velocity wobble + Kepler's third law gives planet mass and orbit." },
    ],
    memoryTip: "T² = a³ in AU and years. Earth: T=1 yr, a=1 AU. Jupiter: a≈5.2 → T≈11.8 yr.",
    experiment: {
      title: "Eccentricity sweep",
      hypothesis: "Higher eccentricity → planet much faster at perihelion.",
      steps: [
        { action: "Circular orbit (e=0).", expect: "Constant speed; trail evenly spaced.", paramSet: { semiMajor: 4, eccentricity: 0, orbitalSpeed: 0.4 }, durationSec: 5 },
        { action: "Mild ellipse.", expect: "Planet faster near perihelion.", paramSet: { semiMajor: 4, eccentricity: 0.4, orbitalSpeed: 0.4 }, durationSec: 5 },
        { action: "Highly eccentric (e=0.75).", expect: "Comet-like; whips through perihelion, drags far away.", paramSet: { semiMajor: 5, eccentricity: 0.75, orbitalSpeed: 0.35 }, durationSec: 6 },
      ],
      whatToNotice: ["Sun sits at focus, not center.", "Trail spacing reveals speed: tight near Sun, sparse far."],
      commonMistake: "Drawing the Sun at the ellipse center. It is at one focus.",
    },
    equations: [
      {
        label: "Third law",
        expression: "T² = (4π²/GM)·a³",
        meaning: "Period squared scales with semi-major axis cubed.",
        memoryTip: "Far planet, very slow year.",
        visualHint: "Increasing semiMajor stretches orbit; planet takes longer.",
      },
      {
        label: "Orbit equation",
        expression: "r(θ) = a(1−e²)/(1+e·cosθ)",
        meaning: "Radius as function of true anomaly.",
        memoryTip: "Min r at θ=0 (perihelion); max r at θ=π (aphelion).",
        visualHint: "Trail line shows ellipse shape with one focus at the Sun.",
      },
    ],
    visual: {
      modelId: "kepler-orbit",
      description: "Planet orbits a star on an ellipse. Adjust eccentricity and orbit size.",
      controls: [
        { label: "Semi-major axis", param: "semiMajor", min: 2, max: 6, step: 0.25, default: 4, unit: "AU" },
        { label: "Eccentricity", param: "eccentricity", min: 0, max: 0.85, step: 0.05, default: 0.4 },
        { label: "Orbital speed", param: "orbitalSpeed", min: 0.1, max: 1, step: 0.05, default: 0.3 },
      ],
    },
    quiz: [
      {
        question: "Doubling a planet's semi-major axis multiplies its period by:",
        options: ["√2", "2", "2√2", "4"],
        answerIndex: 2,
        explanation: "T ∝ a^(3/2). 2^(3/2) = 2.83 ≈ 2√2.",
      },
    ],
  },
  {
    id: "astro.blackhole-lensing",
    title: "Black Holes and Gravitational Lensing",
    domain: "astro",
    gradeBand: "grad",
    level: 6,
    difficulty: 5,
    prerequisites: ["astro.keplers-laws"],
    tags: ["black hole", "GR", "lensing", "spacetime"],
    oneLiner: "A black hole's intense gravity bends spacetime so much that light passing nearby curves visibly — gravitational lensing.",
    explain: {
      kid: "Imagine a heavy ball on a stretchy sheet. It dips the sheet so a marble rolling by curves toward it. Black holes do this to space itself, even bending light.",
      teen: "Mass curves spacetime. Light follows the shortest path through curved space; near a black hole, this path bends. Heavier black holes bend more.",
      adult: "Schwarzschild radius r_s = 2GM/c². Light deflection angle α = 4GM/(c²·b) for impact parameter b (Einstein's prediction confirmed 1919).",
      phd: "Kerr metric for rotating BHs adds frame-dragging. Photon sphere at 1.5·r_s. Event Horizon Telescope imaged M87* + Sgr A* — direct view of shadow + accretion ring.",
    },
    realWorld: [
      { context: "M87 image (EHT 2019)", insight: "First direct image of black hole — bright ring around dark shadow, predicted by GR." },
      { context: "LIGO mergers", insight: "Black hole pairs spiral and merge, releasing detectable gravitational waves." },
      { context: "Strong lensing", insight: "Galaxy clusters magnify distant galaxies into Einstein rings/arcs, used as cosmic telescopes." },
    ],
    memoryTip: "Mass curves space. Light follows curves. Bigger M → tighter event horizon and shadow ≈ 2.6·r_s.",
    experiment: {
      title: "Spacetime sheet",
      hypothesis: "Bigger mass = deeper curvature dip.",
      steps: [
        { action: "Modest stellar-mass black hole.", expect: "Tight horizon, mild grid dip.", paramSet: { mass: 0.6 }, durationSec: 4 },
        { action: "Crank mass.", expect: "Horizon grows; grid sags deeper.", paramSet: { mass: 2.5 }, durationSec: 5 },
      ],
      whatToNotice: ["Spacetime grid (yellow) deforms near the central mass.", "Event horizon is a one-way membrane."],
      commonMistake: "Thinking black holes 'suck things in.' Far away, gravity is identical to a star of equal mass; you only fall in if you cross the horizon.",
    },
    equations: [
      {
        label: "Schwarzschild radius",
        expression: "r_s = 2·G·M/c²",
        meaning: "Event horizon size for non-rotating BH.",
        memoryTip: "Sun mass → r_s ≈ 3 km. Earth mass → r_s ≈ 9 mm.",
        visualHint: "Black sphere scales with mass slider.",
      },
      {
        label: "Light deflection",
        expression: "α = 4·G·M/(c²·b)",
        meaning: "Angle by which a passing light ray bends.",
        memoryTip: "Twice the Newtonian prediction — full GR factor of 4.",
        visualHint: "Imagine background stars displaced near the BH (not animated here).",
      },
    ],
    visual: {
      modelId: "blackhole-lensing",
      description: "Black hole with accretion disk and a spacetime grid that dips toward the singularity.",
      controls: [{ label: "Mass", param: "mass", min: 0.3, max: 3, step: 0.1, default: 1, unit: "M_unit" }],
    },
    quiz: [
      {
        question: "GR predicts light deflection that is what factor of the Newtonian estimate?",
        options: ["½", "1", "2", "4"],
        answerIndex: 2,
        explanation: "Full GR gives α = 4GM/(c²b), exactly twice the naive Newtonian calculation.",
      },
    ],
  },
];
