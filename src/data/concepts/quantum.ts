import type { Concept } from "@/types/concept";

export const quantumConcepts: Concept[] = [
  {
    id: "quantum.atomic-orbitals",
    title: "Atomic Orbitals: Where Electrons Live",
    domain: "quantum",
    gradeBand: "undergrad",
    level: 5,
    difficulty: 4,
    prerequisites: [],
    tags: ["orbital", "quantum", "wavefunction", "atom"],
    oneLiner: "Electrons in atoms are not tiny planets — they live in 3D probability clouds called orbitals.",
    explain: {
      kid: "An electron near a nucleus is fuzzy — you can't say where it is, only where it might be. Different orbital types have different cloud shapes.",
      teen: "Solving Schrödinger's equation for hydrogen gives orbitals labeled by n, l, m. The shapes (s, p, d, f) describe the electron probability distribution.",
      adult: "ψ_{nlm}(r,θ,φ) = R_nl(r)·Y_l^m(θ,φ). |ψ|² is the probability density. Energy levels: E_n = −13.6 eV/n² for hydrogen.",
      phd: "Multi-electron atoms require Hartree–Fock or DFT; spin-orbit coupling, relativistic corrections, QED Lamb shift refine spectra. Orbitals are eigenfunctions of L² and L_z.",
    },
    realWorld: [
      { context: "Periodic table", insight: "Group structure follows orbital filling: s (2), p (6), d (10), f (14)." },
      { context: "Chemical bonding", insight: "Overlap of orbitals (sigma, pi) determines bond strength and geometry." },
      { context: "Lasers", insight: "Electron transitions between orbitals emit photons at fixed wavelengths." },
    ],
    memoryTip: "s = sphere (no nodes in angle). p = dumbbell (along axis). d = clover. f = exotic. n = shell, l = shape, m = orientation.",
    experiment: {
      title: "Orbital shape sampler",
      hypothesis: "Different orbital types have distinctive cloud shapes.",
      steps: [
        { action: "1s orbital.", expect: "Spherical cloud around the nucleus.", paramSet: { orbital: 0 }, durationSec: 4 },
        { action: "2p_z orbital.", expect: "Two lobes along the vertical axis.", paramSet: { orbital: 1 }, durationSec: 4 },
        { action: "3d_z² orbital.", expect: "Lobes plus equatorial ring.", paramSet: { orbital: 2 }, durationSec: 4 },
        { action: "3d_x²−y² orbital.", expect: "Four-lobed clover in the horizontal plane.", paramSet: { orbital: 3 }, durationSec: 4 },
      ],
      whatToNotice: ["Higher l = more nodes.", "Cloud density = probability."],
      commonMistake: "Drawing electrons as orbits. They are stationary states with no defined trajectory.",
    },
    equations: [
      {
        label: "Hydrogen energy",
        expression: "E_n = −13.6 eV / n²",
        meaning: "Bound state energies of hydrogen.",
        memoryTip: "Ground state n=1: −13.6 eV. n=2: −3.4 eV.",
        visualHint: "Cloud size grows with n (not directly toggled here).",
      },
      {
        label: "Probability density",
        expression: "P(r) = |ψ|²",
        meaning: "Square of wavefunction = chance of finding the electron.",
        memoryTip: "Bright zone in cloud = high probability.",
        visualHint: "Density of points in 3D = probability.",
      },
    ],
    visual: {
      modelId: "atomic-orbital",
      description: "3D point cloud showing electron probability for hydrogen-like orbitals. Toggle orbital type.",
      controls: [{ label: "Orbital (0=s, 1=p_z, 2=d_z², 3=d_x²-y²)", param: "orbital", min: 0, max: 3, step: 1, default: 1 }],
    },
    quiz: [
      {
        question: "What does |ψ|² represent?",
        options: ["Energy", "Position", "Probability density", "Charge"],
        answerIndex: 2,
        explanation: "Born rule: probability of finding the particle in volume dV is |ψ|²·dV.",
      },
    ],
  },
];
