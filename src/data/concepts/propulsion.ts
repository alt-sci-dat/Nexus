import type { Concept } from "@/types/concept";

export const propulsionConcepts: Concept[] = [
  {
    id: "propulsion.rocket-thrust",
    title: "Rocket Thrust and the Tsiolkovsky Equation",
    domain: "propulsion",
    gradeBand: "undergrad",
    level: 4,
    difficulty: 4,
    prerequisites: ["mech.newtons-second-law"],
    tags: ["rocket", "thrust", "propulsion", "delta-v"],
    oneLiner: "A rocket pushes mass backward at high speed; conservation of momentum pushes it forward — Δv depends logarithmically on mass ratio.",
    explain: {
      kid: "A rocket throws hot gas down really fast. The rocket gets shoved up. Same as a balloon you let go.",
      teen: "Thrust F = ṁ·v_e (mass flow × exhaust velocity). To gain a given speed, you need a heavy fuel ratio. Most of a rocket is fuel.",
      adult: "Tsiolkovsky: Δv = v_e·ln(m₀/m_f) = I_sp·g·ln(m₀/m_f). Specific impulse I_sp = v_e/g; chemical engines ≈ 250–450 s, ion engines ≈ 3000–5000 s.",
      phd: "Multi-stage staging optimizes payload by jettisoning empty mass. Combustion chamber thermodynamics (CEA), nozzle flow (de Laval, choked at throat) determine v_e. Liquid bipropellant (LOX/LH2, RP-1) vs solid vs hybrid; ion thrusters use electrostatic acceleration of Xe ions.",
    },
    realWorld: [
      { context: "Saturn V", insight: "First stage (F-1 engines) burned RP-1/LOX, producing 34 MN thrust to escape gravity well." },
      { context: "SpaceX Raptor", insight: "Full-flow staged combustion methane/LOX engine; reusable, high I_sp ~330 s sea level." },
      { context: "Dawn (NASA)", insight: "Ion drive with I_sp ~3100 s; tiny thrust but huge total Δv over years." },
    ],
    memoryTip: "Δv = v_e·ln(m₀/m_f). Burn 90% of mass at v_e=3000 m/s → Δv ≈ 3000·ln(10) ≈ 6900 m/s. Orbit needs ~9.4 km/s.",
    experiment: {
      title: "Thrust vs mass",
      hypothesis: "Higher thrust-to-mass = faster ascent.",
      steps: [
        { action: "Modest thrust, light rocket.", expect: "Rocket lifts smoothly.", paramSet: { thrust: 8, mass: 4 }, durationSec: 5 },
        { action: "Crank thrust.", expect: "Sharp acceleration, thick exhaust.", paramSet: { thrust: 18, mass: 4 }, durationSec: 5 },
        { action: "Add payload mass.", expect: "Climb slows; thrust-to-weight ratio drops.", paramSet: { thrust: 18, mass: 9 }, durationSec: 5 },
      ],
      whatToNotice: ["Exhaust particles fly down — rocket flies up (Newton's third).", "Net upward acceleration is (thrust − weight)/mass."],
      commonMistake: "Believing rockets push against air. They work in vacuum because momentum is conserved with the exhaust.",
    },
    equations: [
      {
        label: "Tsiolkovsky equation",
        expression: "Δv = v_e·ln(m₀/m_f)",
        meaning: "Velocity gain depends logarithmically on mass ratio.",
        memoryTip: "Logarithm punishes heavy payloads — staging is essential.",
        visualHint: "Watch fuel mass shrink as orange exhaust streams away.",
      },
      {
        label: "Thrust",
        expression: "F = ṁ·v_e",
        meaning: "Force = mass flow rate × exhaust velocity.",
        memoryTip: "Two ways to push harder: throw more mass or throw it faster.",
        visualHint: "More particles per frame at higher thrust.",
      },
    ],
    visual: {
      modelId: "rocket-thrust",
      description: "A rocket lifts off; orange exhaust streams downward as fuel burns.",
      controls: [
        { label: "Thrust", param: "thrust", min: 4, max: 20, step: 0.5, default: 8, unit: "N" },
        { label: "Rocket mass", param: "mass", min: 1, max: 10, step: 0.5, default: 4, unit: "kg" },
      ],
    },
    quiz: [
      {
        question: "Doubling exhaust velocity v_e for the same mass ratio multiplies Δv by:",
        options: ["√2", "2", "4", "ln(2)"],
        answerIndex: 1,
        explanation: "Δv ∝ v_e linearly when m₀/m_f is fixed.",
      },
    ],
  },
];
