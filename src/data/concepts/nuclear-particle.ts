import type { Concept } from "@/types/concept";

export const nuclearParticleConcepts: Concept[] = [
  {
    id: "nuclear.radioactive-decay",
    title: "Radioactive Decay",
    domain: "nuclear",
    gradeBand: "9-12",
    level: 3,
    difficulty: 3,
    prerequisites: [],
    tags: ["decay", "halflife", "alpha", "beta", "gamma"],
    oneLiner: "Unstable nuclei spontaneously emit alpha, beta, or gamma radiation, halving in number each half-life.",
    explain: {
      kid: "Some atoms are wobbly. They throw out a tiny piece every now and then to feel better. After enough throws, half are gone.",
      teen: "Decay is random per nucleus but predictable in bulk: N(t) = N₀·(1/2)^(t/T₁/₂). Alpha = He nucleus; beta = electron + antineutrino; gamma = photon.",
      adult: "dN/dt = −λN gives N(t) = N₀·e^(−λt). Half-life T₁/₂ = ln 2/λ. Activity A = λN. Decay channels selected by quantum tunneling and weak interaction.",
      phd: "Alpha tunneling: Gamow factor explains huge half-life range (μs to billions of years) from small Q-value differences. Beta decay tests V−A weak Lagrangian; neutrino properties constrained by endpoint spectra.",
    },
    realWorld: [
      { context: "Carbon-14 dating", insight: "T₁/₂ = 5730 yr. Measure remaining ratio to calibrate organic age." },
      { context: "Smoke detectors", insight: "Americium-241 emits alphas to ionize air; smoke disrupts current." },
      { context: "PET scan", insight: "Tracer beta+ decays; positron annihilates with electron → 511 keV gamma pair detected." },
    ],
    memoryTip: "After 1 half-life: ½ left. After 2: ¼. After n: (½)ⁿ. Time-rate constant: λ = ln 2 / T₁/₂.",
    experiment: {
      title: "Watch the nucleus emit",
      hypothesis: "Smaller half-life → more frequent emission events.",
      steps: [
        { action: "Set half-life small.", expect: "Rapid emission; fast burst of yellow alphas + blue betas." },
        { action: "Increase half-life.", expect: "Sparse, slow emissions." },
      ],
      whatToNotice: ["Direction of each emission is random.", "Nucleus glow pulses, suggesting collective excitation."],
      commonMistake: "Thinking decay is age-dependent. It is not — each nucleus has constant decay probability per unit time.",
    },
    equations: [
      { label: "Decay law", expression: "N(t) = N₀·e^(−λt)", meaning: "Exponential decay of nuclei over time.", memoryTip: "Logarithm gives half-life: T₁/₂ = ln 2/λ.", visualHint: "Emission rate scales with current N." },
    ],
    visual: {
      modelId: "decay-chain",
      description: "Glowing nucleus emitting alpha (yellow) and beta (blue) particles.",
      controls: [{ label: "Half-life", param: "halfLife", min: 0.5, max: 8, step: 0.25, default: 2 }],
    },
    quiz: [
      { question: "After 3 half-lives, what fraction of original nuclei remain?", options: ["1/3", "1/8", "1/6", "1/9"], answerIndex: 1, explanation: "(1/2)³ = 1/8." },
    ],
  },
  {
    id: "particle.feynman-diagrams",
    title: "Feynman Diagrams: The Language of Particles",
    domain: "particle",
    gradeBand: "grad",
    level: 6,
    difficulty: 5,
    prerequisites: [],
    tags: ["feynman", "QED", "vertex", "interaction"],
    oneLiner: "Cartoon-like diagrams encode particle interactions; each vertex contributes a factor in calculating scattering amplitudes.",
    explain: {
      kid: "Imagine drawings of particles bumping. Lines are particles, dots are where they meet. Physicists turn each picture into a number.",
      teen: "Particles enter from the left, interact at vertices, exit on the right. Each vertex couples the particles via a force-carrier (photon, gluon, W/Z).",
      adult: "Each Feynman diagram is a perturbative term in S-matrix expansion. Internal lines = propagators; vertices = coupling constants. Sum diagrams to all orders for exact amplitude (in principle).",
      phd: "Diagrammatic shorthand for time-ordered Wick contractions in interaction picture. Loop diagrams encode quantum corrections (renormalization). Path integral formulation generates diagrams from generating functional Z[J].",
    },
    realWorld: [
      { context: "Electron-electron scattering", insight: "Lowest-order: photon exchange (Mott scattering). Higher loops give Lamb shift." },
      { context: "Higgs discovery (LHC 2012)", insight: "Detected via diboson decay channels — sums of Feynman diagrams predicted rates." },
      { context: "Anomalous magnetic moment g−2", insight: "Theory matches experiment to 10 decimals — strongest test of QED." },
    ],
    memoryTip: "Lines in/out = real particles. Lines inside = virtual carriers. Each vertex = coupling factor. Sum = amplitude.",
    experiment: {
      title: "Two-body scattering vertex",
      hypothesis: "Diagram represents one perturbative order.",
      steps: [
        { action: "Observe the schematic vertices and exchange line.", expect: "Two electrons in (left), two electrons out (right), photon (red wavy) exchanged." },
        { action: "Pulse animation indicates coupling.", expect: "Vertices glow gently — represents amplitude flow." },
      ],
      whatToNotice: ["Photon line is wavy (boson), fermion lines straight.", "Vertices are points where particles couple."],
      commonMistake: "Reading diagrams as actual paths. They are mnemonic devices for terms in a math series, not trajectories.",
    },
    equations: [
      { label: "QED vertex", expression: "ψ̄ γ^μ ψ A_μ", meaning: "Dirac field coupling to photon at each vertex.", memoryTip: "Three-line vertex: two fermion lines + one photon.", visualHint: "Two yellow vertices linked by red wavy photon." },
      { label: "Amplitude", expression: "M = Σ (each diagram)", meaning: "Sum over all topologies up to a perturbative order.", memoryTip: "More vertices = higher order in coupling.", visualHint: "Schematic shows leading-order tree diagram." },
    ],
    visual: {
      modelId: "feynman-diagram",
      description: "Tree-level QED Feynman diagram: e⁻e⁻ → e⁻e⁻ via photon exchange.",
      controls: [],
    },
    quiz: [
      { question: "In a Feynman diagram, the wavy line typically represents:", options: ["Electron", "Photon", "Quark", "Position"], answerIndex: 1, explanation: "Wavy lines denote bosonic force carriers (e.g., photon)." },
    ],
  },
  {
    id: "plasma.magnetic-confinement",
    title: "Plasma in a Magnetic Bottle",
    domain: "plasma",
    gradeBand: "undergrad",
    level: 4,
    difficulty: 4,
    prerequisites: [],
    tags: ["plasma", "fusion", "tokamak", "confinement"],
    oneLiner: "Charged particles spiral around magnetic field lines; mirror configurations trap plasma between high-field 'corks'.",
    explain: {
      kid: "Plasma is super-hot gas of charged bits. Magnets can hold it without touching — like an invisible bowl.",
      teen: "Charged particles circle field lines (gyration). Where field is stronger, they bounce back. Two strong-field regions = a bottle.",
      adult: "Lorentz force F = qv × B causes gyromotion at frequency ω_c = qB/m. Magnetic moment μ = mv⊥²/(2B) is adiabatic invariant; particles bounce when v∥ → 0.",
      phd: "MHD equilibrium: J × B = ∇p in tokamak. Stability via energy principle (δW). Drift waves, ELMs, neoclassical transport govern confinement quality (τ_E).",
    },
    realWorld: [
      { context: "Sun's corona", insight: "Plasma loops trace magnetic field arches; instabilities drive flares." },
      { context: "Tokamaks (ITER)", insight: "Toroidal field + poloidal field = stable confined plasma for fusion research." },
      { context: "Earth's Van Allen belts", insight: "Charged particles bottled by Earth's field; bounce between hemispheres." },
    ],
    memoryTip: "Particles spiral around B. Strong B at ends = mirrors. Lose particles only if v∥/v gets too high (loss cone).",
    experiment: {
      title: "Plasma bottle dynamics",
      hypothesis: "Stronger B = tighter spirals + better confinement.",
      steps: [
        { action: "Increase field strength.", expect: "Particles spiral tighter; oscillation frequency up." },
        { action: "Observe particle motion along axis.", expect: "Particles drift slowly along axis while spiraling." },
      ],
      whatToNotice: ["Coil rings produce mirror geometry (peaks at ends).", "Particles bounce between mirrors."],
      commonMistake: "Thinking plasma can be confined by E fields alone. Need magnetic forces because plasma is quasi-neutral.",
    },
    equations: [
      { label: "Cyclotron frequency", expression: "ω_c = qB/m", meaning: "Spin rate around B field.", memoryTip: "Stronger B, faster spin.", visualHint: "Particles orbit faster at higher field." },
      { label: "Magnetic mirror", expression: "v∥² = v² − v⊥²·B/B_max", meaning: "Mirror reflects particles when v∥ → 0.", memoryTip: "High-field walls reflect.", visualHint: "Particles bounce at the coil ends." },
    ],
    visual: {
      modelId: "plasma-bottle",
      description: "Two coils create a magnetic mirror; charged particles spiral and bounce between ends.",
      controls: [{ label: "Field strength", param: "fieldStrength", min: 0.2, max: 3, step: 0.1, default: 1 }],
    },
    quiz: [
      { question: "What invariant lets a magnetic mirror trap particles?", options: ["Total energy", "Magnetic moment", "Charge", "Position"], answerIndex: 1, explanation: "Adiabatic invariant μ = mv⊥²/(2B) is conserved as B changes slowly." },
    ],
  },
];
