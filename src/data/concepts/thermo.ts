import type { Concept } from "@/types/concept";

export const thermoConcepts: Concept[] = [
  {
    id: "thermo.heat-vs-temperature",
    title: "Heat vs Temperature",
    domain: "thermo",
    gradeBand: "4-8",
    level: 1,
    difficulty: 2,
    prerequisites: [],
    tags: ["heat", "temperature", "kinetic", "energy"],
    oneLiner: "Temperature measures average particle speed; heat is total energy transferred between systems at different temperatures.",
    explain: {
      kid: "A spark and a bathtub of warm water — the spark is way hotter (high temperature), but the tub holds way more heat (lots of warm water).",
      teen: "Temperature = average kinetic energy of particles. Heat = energy flowing from hot to cold. A small hot thing and a big warm thing can carry the same heat.",
      adult: "T (Kelvin) ∝ ⟨½mv²⟩. Heat Q = mcΔT for sensible heating. Heat flows down a temperature gradient (Fourier's law q = −k∇T).",
      phd: "Statistical mechanics: T = (∂U/∂S)⁻¹. Equipartition gives ½kT per quadratic degree of freedom. Negative absolute temperatures exist for bounded-energy systems (e.g., spin systems).",
    },
    realWorld: [
      { context: "Sparkler vs hot water", insight: "Spark at 1000°C burns less than 60°C water because heat capacity differs by orders of magnitude." },
      { context: "Body temperature", insight: "Sweating dumps heat at constant T using latent heat of evaporation." },
      { context: "Refrigerator", insight: "Pumps heat against the gradient using work — second law in action." },
    ],
    memoryTip: "Temperature = how fast particles jitter. Heat = how many jittering particles' worth of energy you moved.",
    experiment: {
      title: "Hot vs cold gas",
      hypothesis: "Higher T = faster, more colorful particle motion.",
      steps: [
        { action: "Slide temperature from 100 K to 800 K.", expect: "Particles speed up; color shifts from blue to yellow/red." },
        { action: "Lower to 50 K.", expect: "Particles barely move; near rest." },
      ],
      whatToNotice: ["Speed distribution widens at higher T (Maxwell-Boltzmann).", "Pressure on walls grows with collisions × momentum."],
      commonMistake: "Conflating heat and temperature. Heat is a process (energy transferred); temperature is a state.",
    },
    equations: [
      { label: "Sensible heat", expression: "Q = m·c·ΔT", meaning: "Heat to raise mass m by ΔT.", memoryTip: "Bigger mass or bigger ΔT = more heat.", visualHint: "All particles speed up uniformly when T rises." },
      { label: "Mean kinetic energy", expression: "⟨KE⟩ = (3/2)·k·T", meaning: "Average particle KE scales linearly with T.", memoryTip: "k = Boltzmann's constant; gives micro→macro link.", visualHint: "Color encodes per-particle KE." },
    ],
    visual: {
      modelId: "gas-particles",
      description: "Box of gas atoms bouncing around. Slider controls temperature.",
      controls: [{ label: "Temperature", param: "temperature", min: 50, max: 1000, step: 25, default: 300, unit: "K" }],
    },
    quiz: [
      { question: "Two cups: one tiny boiling, one large warm. Which has more heat?", options: ["Boiling", "Warm large", "Same", "Need more info"], answerIndex: 1, explanation: "More mass × moderate ΔT can exceed small mass × big ΔT." },
    ],
  },
  {
    id: "thermo.kinetic-theory-of-gases",
    title: "Kinetic Theory of Gases",
    domain: "thermo",
    gradeBand: "9-12",
    level: 2,
    difficulty: 3,
    prerequisites: ["thermo.heat-vs-temperature"],
    tags: ["kinetic theory", "ideal gas", "pressure"],
    oneLiner: "A gas's macroscopic pressure and temperature emerge from countless tiny collisions of fast-moving molecules.",
    explain: {
      kid: "Gas in a balloon = lots of tiny balls bouncing on the inside walls. Heat them and they hit harder — balloon puffs up.",
      teen: "Pressure = force per area from molecule collisions. Heating raises speeds, increasing collision rate and momentum transfer.",
      adult: "PV = NkT. Pressure P = (1/3)·ρ·⟨v²⟩. Maxwell-Boltzmann distribution describes speed spread.",
      phd: "Boltzmann transport equation governs distribution f(r,v,t). H-theorem proves entropy increase for dilute gases. Real gases need virial expansion or van der Waals corrections.",
    },
    realWorld: [
      { context: "Tire pressure", insight: "Drives in summer raise pressure as molecules speed up — burst risk." },
      { context: "Aerosol cans", insight: "Heated cans explode because PV = NkT and N, V fixed → P scales with T." },
      { context: "Atmospheric scale", insight: "Density falls exponentially with altitude due to gravity vs thermal motion balance." },
    ],
    memoryTip: "PV = NkT. Hot gas in fixed box → higher P. Cool a balloon → it shrinks.",
    experiment: {
      title: "Box of bouncing atoms",
      hypothesis: "Speed distribution and wall hits scale with T.",
      steps: [
        { action: "Set T low (100 K).", expect: "Slow blue particles, few collisions." },
        { action: "Raise T to 800 K.", expect: "Bright fast particles, dense collisions on walls." },
      ],
      whatToNotice: ["Speed varies among particles (distribution, not single value).", "Doubling T does not double speed — only √2 (KE ∝ v²)."],
      commonMistake: "Believing all gas molecules have the same speed at a given T. They have a Maxwell-Boltzmann distribution.",
    },
    equations: [
      { label: "Ideal gas law", expression: "PV = NkT", meaning: "P, V, N, T linked by Boltzmann constant.", memoryTip: "Fix any three, solve fourth.", visualHint: "Box volume + N constant; only T changes." },
      { label: "Pressure from collisions", expression: "P = (1/3)·ρ·⟨v²⟩", meaning: "Pressure follows from average kinetic energy density.", memoryTip: "Pressure is a statistical force.", visualHint: "Wall thuds proportional to particle KE × hit rate." },
    ],
    visual: {
      modelId: "gas-particles",
      description: "Atoms in a 3D box, color-coded by speed. Adjust temperature.",
      controls: [{ label: "Temperature", param: "temperature", min: 50, max: 1200, step: 25, default: 300, unit: "K" }],
    },
    quiz: [
      { question: "Double T at fixed V, N. What happens to P?", options: ["Halves", "Same", "Doubles", "Quadruples"], answerIndex: 2, explanation: "P ∝ T at fixed V, N." },
    ],
  },
  {
    id: "thermo.first-law",
    title: "First Law of Thermodynamics",
    domain: "thermo",
    gradeBand: "9-12",
    level: 3,
    difficulty: 3,
    prerequisites: ["thermo.heat-vs-temperature"],
    tags: ["first law", "energy", "work", "internal energy"],
    oneLiner: "Energy is conserved: change in internal energy = heat added minus work done by the system.",
    explain: {
      kid: "Pump a bike tire. Your hands get warm because you put work in — energy doesn't vanish, it changes form.",
      teen: "ΔU = Q − W. Heat in raises U; work done by gas lowers U. Cycle back to start: ΔU = 0 (state function).",
      adult: "U is a state function. Differential form: dU = δQ − δW where δQ, δW are inexact (path-dependent). PdV work for quasi-static processes.",
      phd: "First law is energy conservation; statistical-mechanical foundation comes from microcanonical ensemble. Quantum analog: ⟨H⟩ change tracks energy flow under Hamiltonian evolution + measurement.",
    },
    realWorld: [
      { context: "Combustion engine", insight: "Fuel burns (Q in), gas expands (W out), engine cycles back: net W extracted from heat." },
      { context: "Heat pump", insight: "Reverses cycle: W in moves heat from cold to hot reservoir." },
      { context: "Diesel compression", insight: "Adiabatic (Q=0): all work compresses air, heating it enough to ignite fuel." },
    ],
    memoryTip: "ΔU = Q − W. Heat IN positive, work BY system positive. Sign conventions matter.",
    experiment: {
      title: "Carnot cycle visualization",
      hypothesis: "PV-diagram closes after one cycle (ΔU = 0).",
      steps: [
        { action: "Watch one full cycle on the P-V curve.", expect: "Indicator dot returns to starting point." },
        { action: "Watch hot/cold plate glow.", expect: "Hot glows during isothermal expansion; cold during compression." },
      ],
      whatToNotice: ["Area inside P-V loop = net work output.", "Q absorbed from hot source > Q rejected to cold source — difference = work."],
      commonMistake: "Thinking U depends on path. It does not — only on state.",
    },
    equations: [
      { label: "First law", expression: "ΔU = Q − W", meaning: "Energy in − energy out (as work) = change in stored energy.", memoryTip: "Bookkeeping for energy.", visualHint: "Piston rises (work out); plate glows (heat in)." },
    ],
    visual: {
      modelId: "carnot-cycle",
      description: "Cylinder + piston cycling between hot and cold reservoirs; live PV diagram.",
      controls: [{ label: "Cycle speed", param: "cycleSpeed", min: 0.1, max: 1.5, step: 0.1, default: 0.4 }],
    },
    quiz: [
      { question: "Gas absorbs 200 J heat and does 80 J work. ΔU?", options: ["−120 J", "120 J", "280 J", "0"], answerIndex: 1, explanation: "ΔU = Q − W = 200 − 80 = 120 J." },
    ],
  },
  {
    id: "thermo.second-law-entropy",
    title: "Second Law: Entropy Always Wins",
    domain: "thermo",
    gradeBand: "9-12",
    level: 3,
    difficulty: 4,
    prerequisites: ["thermo.first-law"],
    tags: ["entropy", "second law", "irreversibility"],
    oneLiner: "In any isolated system, entropy never decreases — disorder tends to grow, setting time's arrow.",
    explain: {
      kid: "Drop ink in water. It spreads. It never spontaneously gathers back into a drop. Why? Because spreading has way more ways to happen.",
      teen: "Entropy S counts microstates (S = k·ln Ω). Heat flows hot→cold because cold gaining energy adds more microstates than hot losing it.",
      adult: "ΔS_universe ≥ 0. For reversible processes, ΔS = Q_rev/T. Carnot efficiency η = 1 − T_c/T_h is the maximum achievable.",
      phd: "Boltzmann's H-theorem proves entropy growth for dilute gases. Black hole entropy S = A/4ℓ_p² (Bekenstein-Hawking). Tension with unitarity drives information paradox.",
    },
    realWorld: [
      { context: "Egg cannot un-scramble", insight: "Macro reversibility forbidden by overwhelming statistical odds." },
      { context: "Refrigerator efficiency", insight: "No fridge can be 100% efficient — second law caps performance." },
      { context: "Heat death", insight: "Long-term cosmic future trends toward maximum entropy state." },
    ],
    memoryTip: "Entropy = number of ways. Hot+cold mixing = more ways than separated. Time goes the way that adds ways.",
    experiment: {
      title: "Carnot cycle efficiency",
      hypothesis: "Cycle work output below Carnot limit.",
      steps: [
        { action: "Watch heat absorbed (hot plate glow) vs rejected (cold plate).", expect: "Some heat always rejected — cannot be all converted to work." },
        { action: "Speed up cycle.", expect: "Cycle still closed; work output proportional to area." },
      ],
      whatToNotice: ["Cold reservoir cannot be fully cooled by extracting work.", "Carnot efficiency rises with T_h/T_c ratio."],
      commonMistake: "Believing entropy can decrease locally without compensation. It can locally — but elsewhere it must rise more.",
    },
    equations: [
      { label: "Entropy change", expression: "dS = δQ_rev/T", meaning: "Reversible heat exchange divided by temperature.", memoryTip: "Heat at high T contributes less S than at low T.", visualHint: "Hot stage exchange gives smaller dS than cold stage." },
      { label: "Carnot efficiency", expression: "η = 1 − T_c/T_h", meaning: "Maximum work-from-heat efficiency.", memoryTip: "Bigger T_h/T_c gap = closer to 1.", visualHint: "Bigger plate temperature gap = bigger PV loop." },
    ],
    visual: {
      modelId: "carnot-cycle",
      description: "Carnot cycle on PV diagram with hot/cold reservoirs.",
      controls: [{ label: "Cycle speed", param: "cycleSpeed", min: 0.1, max: 1.5, step: 0.1, default: 0.4 }],
    },
    quiz: [
      { question: "Carnot engine between 600 K and 300 K. Max efficiency?", options: ["20%", "33%", "50%", "100%"], answerIndex: 2, explanation: "η = 1 − 300/600 = 0.5." },
    ],
  },
];
