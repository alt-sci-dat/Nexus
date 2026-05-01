import type { Concept } from "@/types/concept";

export const emConcepts: Concept[] = [
  {
    id: "em.magnets-attract",
    title: "Magnets: Attract and Repel",
    domain: "em",
    gradeBand: "K-3",
    level: 0,
    difficulty: 1,
    prerequisites: [],
    tags: ["magnet", "north", "south", "field"],
    oneLiner: "Magnets have two ends — north and south. Opposite ends pull together; same ends push apart.",
    explain: {
      kid: "Hold two magnets close. Sometimes they snap together. Flip one and they push away. Like ends fight, opposite ends hug.",
      teen: "Each magnet has a north and south pole. Field lines go from N to S outside the magnet. Like poles repel; opposite poles attract.",
      adult: "Magnetic force arises from moving charges and aligned electron spins. Field B is described by ∇·B = 0 (no monopoles) and the Biot–Savart law for currents.",
      phd: "Ferromagnetism emerges from exchange interaction between electron spins below the Curie temperature. Domains align under external field; hysteresis encodes memory.",
    },
    realWorld: [
      { context: "Refrigerator magnets", insight: "Permanent ferromagnets stick to steel because they magnetize the steel through induction." },
      { context: "Compass", insight: "Earth's magnetic field aligns the needle — Earth itself is a giant magnet." },
      { context: "Maglev trains", insight: "Repulsive same-poles levitate the train; current-driven coils accelerate it." },
    ],
    memoryTip: "N + S = STICK. N + N = SPLIT. Field lines come OUT of N, INTO S.",
    experiment: {
      title: "Pole flip test",
      hypothesis: "Flipping one magnet reverses the force.",
      steps: [
        { action: "Watch field lines (blue) at default — opposite poles attract.", expect: "Smooth blue arcs between magnets." },
        { action: "Toggle Repel mode.", expect: "Field lines bow outward, magnets push apart." },
      ],
      whatToNotice: ["Field lines never cross.", "Force grows fast as you bring magnets closer (~1/r³ near dipoles)."],
      commonMistake: "Believing magnets always attract iron and other magnets. Same poles repel; non-magnetic metals (aluminum, copper) feel almost nothing statically.",
    },
    equations: [
      {
        label: "No monopoles",
        expression: "∇·B = 0",
        meaning: "Magnetic field lines have no start/end — they form loops.",
        memoryTip: "Cut a magnet in half: you get two magnets, never an isolated N or S.",
        visualHint: "Lines exit N, curve around, enter S.",
      },
    ],
    visual: {
      modelId: "bar-magnets",
      description: "Two bar magnets with field lines between them. Toggle to flip a pole.",
      controls: [
        { label: "Separation", param: "separation", min: 1.5, max: 6, step: 0.25, default: 4, unit: "m" },
        { label: "Repel mode (1=on)", param: "repel", min: 0, max: 1, step: 1, default: 0 },
      ],
    },
    quiz: [
      {
        question: "Which combo attracts?",
        options: ["N–N", "S–S", "N–S", "Always repel"],
        answerIndex: 2,
        explanation: "Opposite poles attract.",
      },
    ],
  },
  {
    id: "em.simple-circuit",
    title: "Simple Circuit: Battery and Bulb",
    domain: "em",
    gradeBand: "4-8",
    level: 1,
    difficulty: 2,
    prerequisites: [],
    tags: ["circuit", "current", "battery", "voltage"],
    oneLiner: "A battery pushes electrons through a wire loop, and a bulb in the loop glows when current flows.",
    explain: {
      kid: "A battery is like a tiny pump. It sends invisible electrons running around the wire. When they pass through the bulb, the bulb lights up.",
      teen: "Voltage is the push, current is the flow. Bulb resists flow and turns electrical energy into light + heat. Break the loop anywhere — flow stops.",
      adult: "Current I = dq/dt. In steady state with EMF source, electrons drift slowly while electric field propagates near the speed of light. Bulb dissipates P = V·I.",
      phd: "Conduction electrons in a metal form a Fermi gas. Drude model gives simple resistivity ρ = m/(n·e²·τ); proper treatment via Boltzmann transport or Kubo formula.",
    },
    realWorld: [
      { context: "Flashlight", insight: "Switch closes the loop; battery drives electrons through filament." },
      { context: "Holiday lights", insight: "Series chains: one bulb out, all out. Parallel chains: independent." },
      { context: "Phone charger", insight: "AC from wall → DC via rectifier → current into your battery." },
    ],
    memoryTip: "Voltage = pump pressure. Current = water flow. Resistance = pipe pinch. Open switch = blocked pipe.",
    experiment: {
      title: "Voltage / resistance brightness",
      hypothesis: "Brightness rises with voltage and falls with resistance.",
      steps: [
        { action: "Increase voltage from 3 V to 12 V.", expect: "Bulb glows brighter, electrons flow faster." },
        { action: "Increase resistance.", expect: "Current drops, bulb dims." },
      ],
      whatToNotice: ["Electrons move slowly but the field switches everything on instantly.", "Brightness ∝ power = V·I."],
      commonMistake: "Saying electrons travel at light speed. They drift slowly (~mm/s); the electric field propagates fast.",
    },
    equations: [
      {
        label: "Ohm's law",
        expression: "V = I·R",
        meaning: "Voltage drives current through resistance.",
        memoryTip: "More push, more flow. More resistance, less flow.",
        visualHint: "Brightness scales with voltage at fixed R.",
      },
    ],
    visual: {
      modelId: "simple-circuit",
      description: "Battery + bulb closed loop with electrons flowing. Adjust voltage and resistance.",
      controls: [
        { label: "Voltage", param: "voltage", min: 1, max: 12, step: 0.5, default: 6, unit: "V" },
        { label: "Resistance", param: "resistance", min: 1, max: 10, step: 0.5, default: 3, unit: "Ω" },
      ],
    },
    quiz: [
      {
        question: "Bulb dim. You increase voltage. Brightness?",
        options: ["Drops", "Same", "Rises", "Inverted"],
        answerIndex: 2,
        explanation: "More voltage → more current → more power dissipated as light/heat.",
      },
    ],
  },
  {
    id: "em.ohms-law",
    title: "Ohm's Law: V = I·R",
    domain: "em",
    gradeBand: "9-12",
    level: 2,
    difficulty: 3,
    prerequisites: ["em.simple-circuit"],
    tags: ["ohm", "voltage", "current", "resistance"],
    oneLiner: "For ohmic materials, current is voltage divided by resistance — a linear relationship.",
    explain: {
      kid: "If a hose is wide, water flows freely. Pinch it — flow drops. Voltage is the pump, resistance is the pinch.",
      teen: "Across a resistor at constant temperature, doubling voltage doubles current. Resistance R is the slope on a V vs I graph.",
      adult: "V = I·R. Power dissipated P = V·I = I²·R = V²/R. Many materials (semiconductors, diodes) are non-ohmic — relationship is non-linear.",
      phd: "Microscopically, σ = n·e²·τ/m (Drude). At low temperatures, quantum effects (weak localization, conductance quantization in nanoscale) modify the simple law.",
    },
    realWorld: [
      { context: "Toaster", insight: "High R nichrome wire heats up under household V → 1500 W." },
      { context: "USB-C cable", insight: "Thin cables = high R = voltage drop, slow charging." },
      { context: "Heart ECG", insight: "Body's bioelectric currents follow Ohm-like behavior in tissues." },
    ],
    memoryTip: "V on top, I × R below. Triangle V/I/R: cover the unknown to find the formula.",
    experiment: {
      title: "Resistor slider test",
      hypothesis: "Current = V/R; brightness = V²/R.",
      steps: [
        { action: "V=9, R from 1 to 10.", expect: "Bulb brightness drops nonlinearly." },
        { action: "Hold R=3, vary V from 3 to 12.", expect: "Brightness scales with V²." },
      ],
      whatToNotice: ["Power grows with V² at fixed R.", "Resistor scale on screen widens with R."],
      commonMistake: "Thinking resistance is constant for any device. Bulbs heat up → R rises with current, slightly non-ohmic.",
    },
    equations: [
      {
        label: "Ohm's law",
        expression: "V = I·R",
        meaning: "Voltage equals current times resistance.",
        memoryTip: "VIR triangle.",
        visualHint: "Slope of V-vs-I line is R.",
      },
      {
        label: "Power",
        expression: "P = V·I = I²·R = V²/R",
        meaning: "Rate of energy dissipation in the resistor.",
        memoryTip: "Three forms — pick the one with knowns.",
        visualHint: "Bulb heat/light rises with P.",
      },
    ],
    visual: {
      modelId: "ohms-circuit",
      description: "Battery, resistor, bulb in series. Resistor visibly grows with R.",
      controls: [
        { label: "Voltage", param: "voltage", min: 1, max: 15, step: 0.5, default: 9, unit: "V" },
        { label: "Resistance", param: "resistance", min: 1, max: 12, step: 0.5, default: 3, unit: "Ω" },
      ],
    },
    quiz: [
      {
        question: "12 V across 4 Ω. Power dissipated?",
        options: ["3 W", "16 W", "36 W", "48 W"],
        answerIndex: 2,
        explanation: "P = V²/R = 144/4 = 36 W.",
      },
    ],
  },
  {
    id: "em.faraday-induction",
    title: "Faraday's Law: Induction",
    domain: "em",
    gradeBand: "9-12",
    level: 3,
    difficulty: 3,
    prerequisites: ["em.magnets-attract", "em.simple-circuit"],
    tags: ["faraday", "induction", "EMF", "flux"],
    oneLiner: "A changing magnetic flux through a coil induces a voltage — the basis of generators and transformers.",
    explain: {
      kid: "Wave a magnet near a coil of wire. A bulb on the coil flickers — moving the magnet makes electricity!",
      teen: "EMF (induced voltage) equals the rate at which magnetic flux through the coil changes. More turns, faster motion, stronger magnet → more EMF.",
      adult: "ε = −N·dΦ_B/dt. Lenz's law: induced current opposes the change. Faraday's law in differential form: ∇×E = −∂B/∂t.",
      phd: "One of Maxwell's equations in covariant form: ∂_μ F^{μν} = J^ν / ε₀. Gauge invariance under A → A + ∇χ; relativistic mixing of E and B under boosts.",
    },
    realWorld: [
      { context: "Power plants", insight: "Steam spins coils inside magnets → AC electricity for the grid." },
      { context: "Wireless phone charging", insight: "Oscillating field in pad induces current in phone coil." },
      { context: "Induction stovetop", insight: "AC field induces eddy currents in pan, pan heats; glass top stays cool." },
    ],
    memoryTip: "Move the magnet OR change the field. Static = no induction. Faster wave = bigger spark.",
    experiment: {
      title: "Magnet through coil",
      hypothesis: "Faster magnet motion → brighter LED.",
      steps: [
        { action: "Increase magnet speed.", expect: "LED brightness pulses up." },
        { action: "Stop the magnet (speed=0).", expect: "LED dies — induction needs change." },
      ],
      whatToNotice: ["Direction of induced current flips with motion direction (Lenz).", "LED brightness depends on |dΦ/dt|, not on B alone."],
      commonMistake: "Thinking constant B fields induce current. They do not — only changes do.",
    },
    equations: [
      {
        label: "Faraday's law (lumped)",
        expression: "ε = −N·dΦ_B/dt",
        meaning: "Induced EMF equals turns × rate of flux change.",
        memoryTip: "Negative sign = Lenz: induced current opposes change.",
        visualHint: "Yellow current arrow flips direction when magnet reverses.",
      },
    ],
    visual: {
      modelId: "magnet-coil-induction",
      description: "Bar magnet oscillates near a multi-turn coil. LED brightness shows induced EMF.",
      controls: [
        { label: "Magnet speed", param: "magnetSpeed", min: 0, max: 4, step: 0.25, default: 1.5 },
        { label: "Coil turns", param: "turns", min: 4, max: 40, step: 2, default: 18 },
      ],
    },
    quiz: [
      {
        question: "A magnet sits motionless inside a coil. Induced EMF?",
        options: ["Maximum", "Half", "Zero", "Negative"],
        answerIndex: 2,
        explanation: "No flux change → no induced EMF.",
      },
    ],
  },
];
