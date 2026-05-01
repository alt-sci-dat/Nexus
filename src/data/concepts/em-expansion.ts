import type { Concept } from "@/types/concept";

export const emExpansion: Concept[] = [
  {
    id: "em.coulombs-law",
    title: "Coulomb's Law",
    domain: "em", gradeBand: "9-12", level: 2, difficulty: 3,
    prerequisites: ["em.magnets-attract"], tags: ["coulomb", "charge", "force", "inverse-square"],
    oneLiner: "Two point charges attract or repel with a force proportional to charge product and inversely to distance squared.",
    explain: {
      kid: "Two charged balloons push or pull each other. The closer they are, the stronger the push or pull.",
      teen: "F = k·|q1·q2|/r². Like signs repel, opposite attract. Twice the distance, one-quarter the force.",
      adult: "F = (1/4πε₀)·q1·q2·r̂/r². Linear superposition. Vector sum over multiple charges.",
      phd: "Limit of QED in static regime. In dielectrics, replace ε₀ → ε. Relativistic version uses retarded potentials (Liénard-Wiechert).",
    },
    realWorld: [
      { context: "Static cling", insight: "Friction transfers electrons; resulting Coulomb forces stick clothes together." },
      { context: "Lightning", insight: "Thundercloud charge separation creates fields exceeding 3 MV/m → breakdown." },
      { context: "Particle accelerators", insight: "Electrostatic stages use kV–MV potentials to inject ions." },
    ],
    memoryTip: "k ≈ 9·10⁹ N·m²/C². Inverse square — same shape as gravity, but with sign.",
    experiment: {
      title: "Two charged poles",
      hypothesis: "Force grows with charge magnitude and falls with distance squared.",
      steps: [
        { action: "Magnets close (analog).", expect: "Strong force in field lines.", paramSet: { separation: 1.5, repel: 0 }, durationSec: 4 },
        { action: "Pull apart.", expect: "Force visibly weakens (1/r²).", paramSet: { separation: 5.5, repel: 0 }, durationSec: 4 },
      ],
      whatToNotice: ["Same-sign repel; opposite-sign attract.", "Distance dominates (r² in denominator)."],
      commonMistake: "Treating 1/r²-distance the same as 1/r-distance. Big difference at short range.",
      loop: true,
    },
    equations: [
      { label: "Coulomb force", expression: "F = k·q₁·q₂/r²", meaning: "Inverse-square force between point charges.", memoryTip: "Sign of product gives attract/repel.", visualHint: "Field lines bunch up where force is strong." },
    ],
    visual: {
      modelId: "bar-magnets",
      description: "Two-pole analog of Coulomb interaction (magnetic, but same field-line geometry).",
      controls: [
        { label: "Separation", param: "separation", min: 1.5, max: 6, step: 0.25, default: 4 },
        { label: "Repel mode (1=on)", param: "repel", min: 0, max: 1, step: 1, default: 0 },
      ],
    },
    quiz: [
      { question: "Triple the distance between two charges. Force changes by:", options: ["1/3", "1/9", "1/27", "Same"], answerIndex: 1, explanation: "F ∝ 1/r²; 1/3² = 1/9." },
    ],
  },
  {
    id: "em.electric-field",
    title: "Electric Field",
    domain: "em", gradeBand: "9-12", level: 2, difficulty: 3,
    prerequisites: ["em.coulombs-law"], tags: ["E-field", "force", "field-lines"],
    oneLiner: "A field that fills space around charges and exerts force on any charge placed in it: F = qE.",
    explain: {
      kid: "Around a charge there's an invisible push-zone. Drop another charge in and it gets pushed.",
      teen: "E = F/q (test charge). Field lines: out of +, into −. From point charge: E = kq/r².",
      adult: "Vector field E(r). Gauss's law: ∮E·dA = Q_enc/ε₀. Conservative: ∇×E = 0 in electrostatics.",
      phd: "Maxwell unifies E with B in F^μν. Quantum: photon as gauge boson mediates electromagnetic interaction; fields become operators in QED.",
    },
    realWorld: [
      { context: "Capacitors", insight: "Uniform E between plates stores energy ½ε₀E²·V." },
      { context: "Lightning rods", insight: "Sharp tips concentrate field, ionize air → safe discharge path." },
      { context: "Photocopiers", insight: "Charged drum holds toner where E pattern says yes." },
    ],
    memoryTip: "E points from + to − along field lines. Magnitude of field = force per unit positive test charge.",
    experiment: {
      title: "Field from two poles",
      hypothesis: "Field-line density encodes field strength.",
      steps: [
        { action: "Standard separation, opposite poles.", expect: "Smooth dipole field lines.", paramSet: { separation: 4, repel: 0 }, durationSec: 4 },
        { action: "Bring poles close.", expect: "Lines bunch — strong field between.", paramSet: { separation: 2, repel: 0 }, durationSec: 4 },
      ],
      whatToNotice: ["Field lines never cross.", "Density of lines tracks |E|."],
      commonMistake: "Confusing field with potential. E is a vector at each point; V is a scalar.",
      loop: true,
    },
    equations: [
      { label: "Field of point charge", expression: "E = k·q/r²", meaning: "Field magnitude due to a single charge.", memoryTip: "Same form as Coulomb force without the test charge.", visualHint: "Outward arrows from +, inward to −." },
    ],
    visual: {
      modelId: "bar-magnets",
      description: "Visual analog of dipole field lines.",
      controls: [
        { label: "Separation", param: "separation", min: 1.5, max: 6, step: 0.25, default: 4 },
        { label: "Repel mode (1=on)", param: "repel", min: 0, max: 1, step: 1, default: 0 },
      ],
    },
    quiz: [
      { question: "Doubling charge q at fixed r changes E by:", options: ["½×", "Same", "2×", "4×"], answerIndex: 2, explanation: "E ∝ q." },
    ],
  },
  {
    id: "em.electric-potential",
    title: "Electric Potential (Voltage)",
    domain: "em", gradeBand: "9-12", level: 3, difficulty: 3,
    prerequisites: ["em.electric-field"], tags: ["potential", "voltage", "energy"],
    oneLiner: "Voltage is potential energy per unit charge — the height of an electric hill.",
    explain: {
      kid: "Voltage is like the steepness of a slide. The taller, the more energy each charge gets when it slides down.",
      teen: "V = U/q. ΔV = −∫E·dr. From point charge: V = kq/r. Charges flow from high V to low V (positive convention).",
      adult: "E = −∇V. Equipotential surfaces ⊥ field lines. Capacitance C = Q/V; energy ½CV².",
      phd: "Gauge potential A^μ = (V/c, A) generalizes; gauge invariance under V → V + ∂χ/∂t.",
    },
    realWorld: [
      { context: "Batteries", insight: "Maintain constant V between terminals; chemistry pumps charges uphill." },
      { context: "Power grid", insight: "Long-distance transmission at very high V to minimize I²R losses." },
      { context: "Defibrillator", insight: "~2000 V capacitor delivers controlled energy to restart heart rhythm." },
    ],
    memoryTip: "V is like elevation. ΔV between two points = work per unit charge to move between them.",
    experiment: {
      title: "Battery + bulb at varying V",
      hypothesis: "Higher V drives more current, brighter bulb.",
      steps: [
        { action: "Low voltage.", expect: "Faint bulb, slow electrons.", paramSet: { voltage: 2, resistance: 3 }, durationSec: 4 },
        { action: "High voltage.", expect: "Bright bulb.", paramSet: { voltage: 11, resistance: 3 }, durationSec: 4 },
      ],
      whatToNotice: ["V across battery defines potential difference.", "Higher V increases current at fixed R."],
      commonMistake: "Confusing voltage with current. V is potential; I is flow.",
      loop: true,
    },
    equations: [
      { label: "Point-charge potential", expression: "V = k·q/r", meaning: "Scalar potential from a charge.", memoryTip: "1/r decay; positive for +q.", visualHint: "Brighter bulb = higher V." },
    ],
    visual: {
      modelId: "ohms-circuit",
      description: "Battery + resistor + bulb circuit; tweak V to see effect.",
      controls: [
        { label: "Voltage", param: "voltage", min: 1, max: 15, step: 0.5, default: 9 },
        { label: "Resistance", param: "resistance", min: 1, max: 12, step: 0.5, default: 3 },
      ],
    },
    quiz: [
      { question: "Capacitor of 1 F at 12 V stores energy:", options: ["6 J", "72 J", "144 J", "12 J"], answerIndex: 1, explanation: "U = ½CV² = ½·1·144 = 72 J." },
    ],
  },
  {
    id: "em.capacitance",
    title: "Capacitance",
    domain: "em", gradeBand: "9-12", level: 3, difficulty: 3,
    prerequisites: ["em.electric-potential"], tags: ["capacitor", "charge", "voltage"],
    oneLiner: "A capacitor stores charge proportional to voltage: Q = CV. C is the device's storage capacity.",
    explain: {
      kid: "A capacitor is like a tiny battery — it grabs charges fast and lets them go fast.",
      teen: "C = Q/V (farads). Parallel-plate: C = ε₀A/d. Stored energy U = ½CV².",
      adult: "RC time constant τ = RC sets charging rate: V(t) = V₀(1 − e^{−t/τ}). Dielectrics multiply C by κ.",
      phd: "Mutual capacitance matrix in many-conductor systems. Kelvin probe and capacitance spectroscopy probe surface potentials in nanoscale devices.",
    },
    realWorld: [
      { context: "Camera flash", insight: "Capacitor charges from battery, releases ~100 J in milliseconds." },
      { context: "DRAM cells", insight: "Each bit is a tiny capacitor; refresh needed because of leakage." },
      { context: "Touchscreens", insight: "Sense changes in capacitance from your finger's proximity." },
    ],
    memoryTip: "Q = CV. Bigger plates, closer plates → bigger C. Energy stored grows with V².",
    experiment: {
      title: "RC charging analog",
      hypothesis: "Higher voltage stores more energy.",
      steps: [
        { action: "Low V, low R.", expect: "Modest current, short transient.", paramSet: { voltage: 3, resistance: 2 }, durationSec: 4 },
        { action: "High V, high R.", expect: "More stored energy, slower charging.", paramSet: { voltage: 12, resistance: 8 }, durationSec: 5 },
      ],
      whatToNotice: ["Energy ∝ V² — voltage matters more than charge.", "RC sets the timescale."],
      commonMistake: "Treating capacitor like a battery in steady state. It blocks DC eventually (no current at full charge).",
      loop: true,
    },
    equations: [
      { label: "Capacitance", expression: "C = Q/V", meaning: "Charge stored per unit voltage.", memoryTip: "Bigger C = more charge at same V.", visualHint: "Bulb brightness rises with stored energy." },
    ],
    visual: {
      modelId: "ohms-circuit",
      description: "Simplified RC analog: V drives I through R.",
      controls: [
        { label: "Voltage", param: "voltage", min: 1, max: 15, step: 0.5, default: 9 },
        { label: "Resistance", param: "resistance", min: 1, max: 12, step: 0.5, default: 3 },
      ],
    },
    quiz: [
      { question: "C = 2 F at 5 V. Charge stored?", options: ["2.5 C", "10 C", "25 C", "0.4 C"], answerIndex: 1, explanation: "Q = CV = 2·5 = 10 C." },
    ],
  },
  {
    id: "em.kirchhoff-laws",
    title: "Kirchhoff's Laws",
    domain: "em", gradeBand: "9-12", level: 3, difficulty: 4,
    prerequisites: ["em.ohms-law"], tags: ["kirchhoff", "circuit", "node", "loop"],
    oneLiner: "Currents at a node sum to zero; voltage drops around a loop sum to zero.",
    explain: {
      kid: "Whatever electricity flows into a junction must flow out. Around a loop, the rises and drops cancel.",
      teen: "KCL: ΣI_in = ΣI_out at each node (charge conservation). KVL: ΣV = 0 around any loop (energy conservation).",
      adult: "Used with Ohm's law to solve any linear network. Mesh-current and node-voltage methods systematize.",
      phd: "Discrete analog of Maxwell's continuity ∇·J = −∂ρ/∂t and Faraday's law in DC limit.",
    },
    realWorld: [
      { context: "Home wiring", insight: "Parallel circuits keep voltage constant; series strings divide it." },
      { context: "Battery in parallel", insight: "Same V across all; currents add." },
      { context: "PCB design", insight: "SPICE simulators apply Kirchhoff equations symbolically." },
    ],
    memoryTip: "Node = charge conservation. Loop = energy conservation. Two laws solve any DC circuit.",
    experiment: {
      title: "Single-loop circuit",
      hypothesis: "EMF = I·R sum around the loop.",
      steps: [
        { action: "9 V, 3 Ω.", expect: "Current = 3 A; bulb glow proportional.", paramSet: { voltage: 9, resistance: 3 }, durationSec: 4 },
        { action: "Triple R.", expect: "Current ↓ by 3×.", paramSet: { voltage: 9, resistance: 9 }, durationSec: 4 },
      ],
      whatToNotice: ["V across battery = sum of V drops across all elements.", "Current is the same through every element in series."],
      commonMistake: "Forgetting sign conventions: choose a direction and stick with it for the loop walk.",
      loop: true,
    },
    equations: [
      { label: "KCL", expression: "Σ I_in = Σ I_out", meaning: "Charge conservation at each node.", memoryTip: "What goes in, comes out.", visualHint: "Same electron-flow rate through every series element." },
      { label: "KVL", expression: "Σ V = 0 (around loop)", meaning: "Energy conservation around any loop.", memoryTip: "Drops + rises cancel.", visualHint: "EMF rise equals R drops." },
    ],
    visual: {
      modelId: "ohms-circuit",
      description: "Battery-resistor-bulb loop; demonstrates KVL with one mesh.",
      controls: [
        { label: "Voltage", param: "voltage", min: 1, max: 15, step: 0.5, default: 9 },
        { label: "Resistance", param: "resistance", min: 1, max: 12, step: 0.5, default: 3 },
      ],
    },
    quiz: [
      { question: "12 V battery, two 3 Ω resistors in series. Current?", options: ["1 A", "2 A", "4 A", "12 A"], answerIndex: 1, explanation: "R_total = 6, I = V/R = 2 A." },
    ],
  },
  {
    id: "em.lorentz-force",
    title: "Lorentz Force",
    domain: "em", gradeBand: "9-12", level: 3, difficulty: 4,
    prerequisites: ["em.electric-field", "em.magnets-attract"], tags: ["lorentz", "magnetic", "charge", "motion"],
    oneLiner: "A charged particle in fields feels F = q(E + v×B): electric pushes parallel; magnetic pushes perpendicular to velocity.",
    explain: {
      kid: "Magnets push moving electric charges sideways. The faster the charge, the stronger the sideways shove.",
      teen: "F_magnetic = q·v·B·sinθ, perpendicular to both v and B. Does no work (perpendicular).",
      adult: "F = q(E + v×B). Charged particles in uniform B execute circular motion at cyclotron radius r = mv/(qB).",
      phd: "Lorentz invariant in covariant form. In QED, vertex factor is q·γ^μ A_μ. Gauge transformations preserve dynamics.",
    },
    realWorld: [
      { context: "CRT TVs", insight: "Magnetic deflection coils steer electron beam to scan the screen." },
      { context: "Mass spectrometer", insight: "Bending radius reveals m/q." },
      { context: "Tokamak plasmas", insight: "Confinement uses v×B to keep particles on field lines." },
    ],
    memoryTip: "F_mag is sideways. Fast straight particle in B → curves into a circle.",
    experiment: {
      title: "Magnet near coil",
      hypothesis: "Moving magnet drives electrons in coil — Lorentz at work.",
      steps: [
        { action: "Move magnet slowly.", expect: "Mild EMF (small dB/dt).", paramSet: { magnetSpeed: 0.5, turns: 18 }, durationSec: 4 },
        { action: "Move fast.", expect: "Large induced current.", paramSet: { magnetSpeed: 4, turns: 18 }, durationSec: 4 },
      ],
      whatToNotice: ["Forces shape paths into circles or helices.", "Direction follows right-hand rule."],
      commonMistake: "Using right-hand rule for negative charges. Reverse the result for electrons.",
      loop: true,
    },
    equations: [
      { label: "Lorentz force", expression: "F = q(E + v × B)", meaning: "Total electromagnetic force on a charge.", memoryTip: "Sideways from B, parallel from E.", visualHint: "Induced LED glow follows v·B coupling." },
    ],
    visual: {
      modelId: "magnet-coil-induction",
      description: "Bar magnet through coil — shows magnetic field interaction with charges.",
      controls: [
        { label: "Magnet speed", param: "magnetSpeed", min: 0, max: 4, step: 0.25, default: 1.5 },
        { label: "Coil turns", param: "turns", min: 4, max: 40, step: 2, default: 18 },
      ],
    },
    quiz: [
      { question: "Magnetic force on a charge moving parallel to B is:", options: ["Maximum", "Zero", "qvB", "qE"], answerIndex: 1, explanation: "v×B = 0 when parallel." },
    ],
  },
  {
    id: "em.maxwell-equations",
    title: "Maxwell's Equations",
    domain: "em", gradeBand: "undergrad", level: 4, difficulty: 5,
    prerequisites: ["em.lorentz-force", "em.faraday-induction"], tags: ["maxwell", "field", "wave"],
    oneLiner: "Four equations unify electricity, magnetism, and light: changing E makes B and vice versa, and waves propagate at c.",
    explain: {
      kid: "Four rules describe everything about electricity, magnets, and light.",
      teen: "Gauss for E, Gauss for B (no monopoles), Faraday's law, Ampère-Maxwell law. Together: light is an electromagnetic wave at c.",
      adult: "∇·E = ρ/ε₀, ∇·B = 0, ∇×E = −∂B/∂t, ∇×B = μ₀J + μ₀ε₀∂E/∂t. c = 1/√(μ₀ε₀).",
      phd: "Covariant form: ∂_μ F^μν = μ₀ J^ν, dF = 0. Gauge symmetry U(1). Foundation of QED via path integral with field-strength Lagrangian.",
    },
    realWorld: [
      { context: "Radio", insight: "Antennas radiate Maxwell waves at MHz–GHz; receivers tune resonant circuits to extract signal." },
      { context: "Light", insight: "Visible light is the same EM wave, just at ~10¹⁴ Hz." },
      { context: "MRI", insight: "Strong B + RF E-fields manipulate nuclear spins via Maxwell-driven dynamics." },
    ],
    memoryTip: "Gauss × 2 (E, B), Faraday, Ampère-Maxwell. Changing E ↔ B → light propagates at c.",
    experiment: {
      title: "Magnet through coil = induction",
      hypothesis: "dB/dt creates E (Faraday's law).",
      steps: [
        { action: "Magnet moving slowly.", expect: "Small induced EMF.", paramSet: { magnetSpeed: 0.5, turns: 18 }, durationSec: 4 },
        { action: "Magnet moving fast.", expect: "Strong induced EMF; LED bright.", paramSet: { magnetSpeed: 4, turns: 18 }, durationSec: 4 },
      ],
      whatToNotice: ["Changing magnetic flux drives E loop in coil.", "All four laws are coupled."],
      commonMistake: "Believing Maxwell only describes radiation. They cover statics, induction, and propagation in one frame.",
      loop: true,
    },
    equations: [
      { label: "Faraday's law", expression: "∇×E = −∂B/∂t", meaning: "Time-changing B fields create circulating E.", memoryTip: "Curl of E from changing B.", visualHint: "Coil EMF rises with dB/dt." },
      { label: "Ampère-Maxwell", expression: "∇×B = μ₀J + μ₀ε₀ ∂E/∂t", meaning: "Currents and changing E both source B.", memoryTip: "Maxwell's displacement current closes the gap.", visualHint: "Coil current creates its own B." },
    ],
    visual: {
      modelId: "magnet-coil-induction",
      description: "Bar magnet oscillating through coil exemplifies Faraday's law.",
      controls: [
        { label: "Magnet speed", param: "magnetSpeed", min: 0, max: 4, step: 0.25, default: 1.5 },
        { label: "Coil turns", param: "turns", min: 4, max: 40, step: 2, default: 18 },
      ],
    },
    quiz: [
      { question: "Which Maxwell equation predicts EM waves?", options: ["Gauss for E only", "Faraday + Ampère-Maxwell", "Gauss for B alone", "None"], answerIndex: 1, explanation: "Coupling of changing E and B fields produces waves at c." },
    ],
  },
  {
    id: "em.electromagnetic-spectrum",
    title: "Electromagnetic Spectrum",
    domain: "em", gradeBand: "9-12", level: 2, difficulty: 3,
    prerequisites: ["em.maxwell-equations"], tags: ["spectrum", "light", "frequency", "wavelength"],
    oneLiner: "All EM waves move at c, span radio to gamma. Frequency × wavelength = c.",
    explain: {
      kid: "Radio, microwave, visible light, X-rays — all the same kind of wave, just at different sizes.",
      teen: "c = f·λ. Visible: 400–700 nm. Radio: km. X-ray: 0.01–10 nm. Energy of photon E = hf.",
      adult: "Spectrum spans 21 orders of magnitude. Each band has unique sources, detectors, applications.",
      phd: "Stefan-Boltzmann law σT⁴ for thermal radiation; Planck distribution. Cosmological context: 21 cm hyperfine line, CMB at 2.7 K.",
    },
    realWorld: [
      { context: "Microwave oven", insight: "2.45 GHz heats water via dipole rotation." },
      { context: "X-ray imaging", insight: "Penetrates soft tissue, blocked by bone." },
      { context: "Wi-Fi", insight: "2.4/5 GHz radio carries data via modulated EM waves." },
    ],
    memoryTip: "Wavelength: long radio → short gamma. Energy: low → high. All travel at c.",
    experiment: {
      title: "Prism splits EM range",
      hypothesis: "Different frequencies bend differently.",
      steps: [
        { action: "Mild dispersion.", expect: "Narrow visible spectrum.", paramSet: { dispersion: 0.5 }, durationSec: 4 },
        { action: "Strong dispersion.", expect: "Wide rainbow — frequencies separate.", paramSet: { dispersion: 2.5 }, durationSec: 4 },
      ],
      whatToNotice: ["Higher frequency = shorter wavelength.", "Same speed c — only frequency/λ change across spectrum."],
      commonMistake: "Believing different EM bands obey different physics. They are all Maxwell waves.",
      loop: true,
    },
    equations: [
      { label: "Wave relation", expression: "c = f·λ", meaning: "Speed of light = frequency × wavelength.", memoryTip: "Inverse relation between f and λ.", visualHint: "Different colors bend by different amounts." },
      { label: "Photon energy", expression: "E = h·f", meaning: "Energy per photon.", memoryTip: "Higher f = higher energy.", visualHint: "Violet (high f) more energetic than red." },
    ],
    visual: {
      modelId: "prism-spectrum",
      description: "Visible-light spectrum is one slice of the EM spectrum.",
      controls: [{ label: "Dispersion strength", param: "dispersion", min: 0, max: 2.5, step: 0.1, default: 1 }],
    },
    quiz: [
      { question: "Which has shorter wavelength: radio or X-ray?", options: ["Radio", "X-ray", "Same", "Depends on antenna"], answerIndex: 1, explanation: "X-rays are nm-scale; radio km-scale." },
    ],
  },
  {
    id: "em.series-vs-parallel",
    title: "Series vs Parallel Resistors",
    domain: "em", gradeBand: "9-12", level: 2, difficulty: 2,
    prerequisites: ["em.kirchhoff-laws"], tags: ["series", "parallel", "resistance"],
    oneLiner: "Series resistors add directly; parallel resistors combine reciprocally.",
    explain: {
      kid: "Lights wired one after another (series): one out, all out. Wired side-by-side (parallel): one out, others stay on.",
      teen: "Series: R_eq = R₁+R₂+... Parallel: 1/R_eq = 1/R₁+1/R₂+...",
      adult: "Voltage divides in series proportional to R; current divides in parallel inversely with R.",
      phd: "Generalizes to mesh/node analysis for arbitrary networks. Linear algebra (Y-matrix, Z-matrix) solves complex circuits.",
    },
    realWorld: [
      { context: "House wiring", insight: "Outlets in parallel — independent voltage." },
      { context: "Christmas lights", insight: "Old strings were series — one bulb out, all out. Modern: parallel." },
      { context: "Multimeter shunts", insight: "Parallel low-R diverts current to extend ammeter range." },
    ],
    memoryTip: "Series stretches voltage. Parallel stretches current. Equivalent R: ↑ in series, ↓ in parallel.",
    experiment: {
      title: "Single resistor brightness",
      hypothesis: "Adding R reduces current; bulb dims.",
      steps: [
        { action: "Low R.", expect: "Bright bulb.", paramSet: { voltage: 9, resistance: 1 }, durationSec: 4 },
        { action: "Increase R (like adding series resistor).", expect: "Bulb dims.", paramSet: { voltage: 9, resistance: 10 }, durationSec: 4 },
      ],
      whatToNotice: ["Series adds R; parallel reduces R.", "Total power = sum of element powers."],
      commonMistake: "Reciprocal mistake in parallel formula.",
      loop: true,
    },
    equations: [
      { label: "Series", expression: "R_eq = R₁ + R₂ + ...", meaning: "Resistors in series add.", memoryTip: "Same current; voltage divides.", visualHint: "Increasing R simulates added series resistor." },
      { label: "Parallel", expression: "1/R_eq = 1/R₁ + 1/R₂ + ...", meaning: "Parallel resistors combine reciprocally.", memoryTip: "Same V; current divides.", visualHint: "Lower effective R; brighter bulb." },
    ],
    visual: {
      modelId: "ohms-circuit",
      description: "Single-resistor circuit; effective R changes with combinations.",
      controls: [
        { label: "Voltage", param: "voltage", min: 1, max: 15, step: 0.5, default: 9 },
        { label: "Resistance", param: "resistance", min: 1, max: 12, step: 0.5, default: 3 },
      ],
    },
    quiz: [
      { question: "Two 6 Ω resistors in parallel. R_eq?", options: ["12 Ω", "6 Ω", "3 Ω", "0 Ω"], answerIndex: 2, explanation: "1/R_eq = 1/6 + 1/6 = 1/3 → R_eq = 3 Ω." },
    ],
  },
  {
    id: "em.lc-oscillator",
    title: "LC Oscillator",
    domain: "em", gradeBand: "undergrad", level: 4, difficulty: 4,
    prerequisites: ["em.capacitance", "em.faraday-induction"], tags: ["LC circuit", "oscillation", "resonance"],
    oneLiner: "A capacitor + inductor swap energy back and forth at frequency f = 1/(2π√(LC)).",
    explain: {
      kid: "Charge bounces between two electrical buckets like water sloshing — at a fixed rhythm.",
      teen: "Energy oscillates between E (capacitor) and B (inductor). f = 1/(2π√(LC)). LC tank is the heart of radios.",
      adult: "Differential eq: L·d²Q/dt² + Q/C = 0. Solution: Q(t) = Q₀cos(ωt) with ω = 1/√(LC).",
      phd: "Quantum LC: harmonic oscillator with E_n = ℏω(n+½). Superconducting LC circuits → qubits in transmons.",
    },
    realWorld: [
      { context: "Radio tuning", insight: "Variable C tunes resonant f to pick a station." },
      { context: "Pacemaker oscillators", insight: "LC sets the rhythm of pulse generation." },
      { context: "Wireless charging", insight: "Coupled LC tanks transfer energy at resonant f." },
    ],
    memoryTip: "f = 1/(2π√LC). Bigger L or C → slower oscillation.",
    experiment: {
      title: "Spring-mass oscillator analog",
      hypothesis: "Mechanical SHM mirrors LC circuit.",
      steps: [
        { action: "Light spring (low k = high L).", expect: "Slow oscillation.", paramSet: { stiffness: 1, mass: 2, amplitude: 1 }, durationSec: 5 },
        { action: "Stiffer spring (low L).", expect: "Faster oscillation.", paramSet: { stiffness: 12, mass: 2, amplitude: 1 }, durationSec: 5 },
      ],
      whatToNotice: ["Energy moves between PE and KE (analog of E and B).", "Resonant f set by L and C."],
      commonMistake: "Treating L as resistance. L stores energy in B; R dissipates.",
      loop: true,
    },
    equations: [
      { label: "Resonant frequency", expression: "f = 1/(2π√(LC))", meaning: "Natural oscillation frequency.", memoryTip: "Square root in denominator — large LC slows things down.", visualHint: "Spring period changes with k, m." },
    ],
    visual: {
      modelId: "spring-mass",
      description: "Mechanical SHM is the direct analog of LC oscillation.",
      controls: [
        { label: "Stiffness k", param: "stiffness", min: 1, max: 20, step: 0.5, default: 4 },
        { label: "Mass", param: "mass", min: 0.5, max: 8, step: 0.25, default: 1 },
        { label: "Amplitude", param: "amplitude", min: 0.2, max: 2.5, step: 0.1, default: 1 },
      ],
    },
    quiz: [
      { question: "Quadrupling L. Frequency changes by:", options: ["½×", "Same", "2×", "4×"], answerIndex: 0, explanation: "f ∝ 1/√L; √4 = 2 → f halves." },
    ],
  },
];
