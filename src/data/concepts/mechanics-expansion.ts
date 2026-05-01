import type { Concept } from "@/types/concept";

export const mechanicsExpansion: Concept[] = [
  {
    id: "mech.distance-vs-displacement",
    title: "Distance vs Displacement",
    domain: "mechanics", gradeBand: "4-8", level: 1, difficulty: 2,
    prerequisites: [], tags: ["distance", "displacement", "vector", "scalar"],
    oneLiner: "Distance counts every meter walked; displacement is the straight-line vector from start to finish.",
    explain: {
      kid: "Walk a square once. You walked 4 sides (distance), but you ended where you started — displacement is zero.",
      teen: "Distance is total path length (scalar). Displacement is end position minus start (vector). On a round trip, displacement is zero, distance is not.",
      adult: "Δr = r_f − r_i. |Δr| ≤ s (path length). Equal only for straight-line motion in one direction.",
      phd: "Generalizes to a curve length functional ∫|dr/dt|dt vs the arc-secant Euclidean norm ‖r(t_f) − r(t_i)‖.",
    },
    realWorld: [
      { context: "Marathon", insight: "Course distance ~42 km, displacement is whatever the start-to-finish vector is (often near 0 for loops)." },
      { context: "Car GPS", insight: "Tells you displacement (straight-line) but the road's distance is longer." },
      { context: "Treadmill running", insight: "Distance accrues, displacement stays zero — no progress in space." },
    ],
    memoryTip: "Distance = total walked. Displacement = arrow from start to end. Round trip: displacement = 0.",
    experiment: {
      title: "Cart on a track",
      hypothesis: "Out-and-back gives non-zero distance but zero displacement.",
      steps: [
        { action: "Push cart forward.", expect: "Distance and displacement grow together.", paramSet: { force: 8, mass: 2 }, durationSec: 4 },
        { action: "Imagine pushing it back.", expect: "Distance keeps growing; displacement returns toward zero.", paramSet: { force: 1, mass: 6 }, durationSec: 4 },
      ],
      whatToNotice: ["Vectors have direction; scalars don't.", "Displacement can be negative."],
      commonMistake: "Treating distance and displacement as interchangeable.",
      loop: true,
    },
    equations: [
      { label: "Displacement", expression: "Δr = r_f − r_i", meaning: "End minus start position vector.", memoryTip: "Subtraction in coordinates.", visualHint: "Arrow from start to current cart position." },
    ],
    visual: {
      modelId: "force-cart",
      description: "Cart moving on a track — watch position vs path length.",
      controls: [
        { label: "Force", param: "force", min: 1, max: 20, step: 1, default: 8 },
        { label: "Mass", param: "mass", min: 1, max: 8, step: 0.5, default: 2 },
      ],
    },
    quiz: [
      { question: "You walk 3 m east, then 3 m west. Distance and displacement?", options: ["6 m, 6 m", "6 m, 0", "0, 0", "3 m, 3 m"], answerIndex: 1, explanation: "Path is 6 m total; net position is unchanged." },
    ],
  },
  {
    id: "mech.speed-vs-velocity",
    title: "Speed vs Velocity",
    domain: "mechanics", gradeBand: "4-8", level: 1, difficulty: 2,
    prerequisites: ["mech.distance-vs-displacement"], tags: ["speed", "velocity", "vector", "scalar"],
    oneLiner: "Speed is how fast (magnitude); velocity is how fast and which direction (vector).",
    explain: {
      kid: "Driving 60 mph north and 60 mph south have the same speed but different velocities.",
      teen: "Speed = |dr/dt|. Velocity = dr/dt (vector). Average speed = distance/time. Average velocity = displacement/time.",
      adult: "Instantaneous velocity v(t) = dr/dt. Speed = ‖v‖. Direction matters for kinematics; both speeds equal in opposite directions cancel in average velocity.",
      phd: "Velocity is a tangent vector along worldline. In SR, four-velocity u^μ = dx^μ/dτ has constant magnitude c (timelike).",
    },
    realWorld: [
      { context: "Police radar", insight: "Reads speed, not velocity — direction has to be inferred." },
      { context: "Wind reports", insight: "Always include direction (NE 25 km/h) — full vector matters for forecasts." },
      { context: "Aircraft navigation", insight: "Pilots add wind velocity vectorially to airspeed to get ground velocity." },
    ],
    memoryTip: "Velocity has a direction sticker. Speed is just the number on the speedometer.",
    experiment: {
      title: "Cart speed at different forces",
      hypothesis: "Greater force → greater velocity in the push direction.",
      steps: [
        { action: "Small force.", expect: "Slow forward velocity.", paramSet: { force: 3, mass: 2 }, durationSec: 4 },
        { action: "Large force.", expect: "Fast forward velocity.", paramSet: { force: 18, mass: 2 }, durationSec: 4 },
      ],
      whatToNotice: ["Speed has no sign; velocity does.", "Average speed ≥ |average velocity|."],
      commonMistake: "Calling speed 'velocity' interchangeably in physics calculations.",
      loop: true,
    },
    equations: [
      { label: "Average velocity", expression: "v̄ = Δr / Δt", meaning: "Net displacement over time.", memoryTip: "Vector divided by scalar.", visualHint: "Average direction connects start to end position." },
    ],
    visual: {
      modelId: "force-cart",
      description: "Adjust force to see velocity grow under acceleration.",
      controls: [
        { label: "Force", param: "force", min: 1, max: 20, step: 1, default: 8 },
        { label: "Mass", param: "mass", min: 1, max: 8, step: 0.5, default: 2 },
      ],
    },
    quiz: [
      { question: "Two cars: 60 km/h north and 60 km/h south. Equal speeds, equal velocities?", options: ["Yes, yes", "Yes, no", "No, yes", "No, no"], answerIndex: 1, explanation: "Same speed, opposite velocities." },
    ],
  },
  {
    id: "mech.acceleration-graphs",
    title: "Reading Motion Graphs",
    domain: "mechanics", gradeBand: "9-12", level: 2, difficulty: 3,
    prerequisites: ["mech.speed-vs-velocity"], tags: ["graphs", "kinematics", "slope", "area"],
    oneLiner: "Slope of a position-time graph is velocity; slope of a velocity-time graph is acceleration; area under v-t is displacement.",
    explain: {
      kid: "A graph of where you are vs time tells the speed by how steeply the line goes up.",
      teen: "x-t slope = v. v-t slope = a. Area under v-t = displacement. Area under a-t = Δv.",
      adult: "Differentiation moves down the chain (x → v → a); integration moves up. Curved x-t means changing velocity.",
      phd: "Generalizes to phase-space trajectories. Hamiltonian flow preserves phase volume (Liouville's theorem).",
    },
    realWorld: [
      { context: "Car odometer + clock", insight: "Slope of distance vs time = average speed." },
      { context: "Stock charts", insight: "Same calculus: slope = velocity (price change rate)." },
      { context: "Astronaut training", insight: "Pilots learn to read v-t graphs for fuel-burn vs Δv estimation." },
    ],
    memoryTip: "x-t slope = v. v-t slope = a. v-t area = Δx. Reading graphs is reading derivatives.",
    experiment: {
      title: "Force = constant a",
      hypothesis: "Constant force gives a straight v-t line and parabolic x-t.",
      steps: [
        { action: "Apply low constant force.", expect: "Slow linear velocity growth.", paramSet: { force: 4, mass: 2 }, durationSec: 4 },
        { action: "Apply high constant force.", expect: "Steep linear velocity growth.", paramSet: { force: 18, mass: 2 }, durationSec: 4 },
      ],
      whatToNotice: ["Acceleration arrow stays constant when F and m are constant.", "Velocity arrow grows linearly with time."],
      commonMistake: "Confusing 'high on graph' with 'fast'. A high x-t flat line means at-rest at distance, not moving fast.",
      loop: true,
    },
    equations: [
      { label: "Kinematic chain", expression: "v = dx/dt, a = dv/dt", meaning: "Velocity is slope of position; acceleration is slope of velocity.", memoryTip: "Take a derivative each step.", visualHint: "Steeper line = faster value." },
    ],
    visual: {
      modelId: "force-cart",
      description: "Cart with force/acceleration arrows visualizing the kinematic chain.",
      controls: [
        { label: "Force", param: "force", min: 1, max: 20, step: 1, default: 8 },
        { label: "Mass", param: "mass", min: 1, max: 8, step: 0.5, default: 2 },
      ],
    },
    quiz: [
      { question: "A flat horizontal line on a v-t graph means:", options: ["Object accelerates", "Object decelerates", "Constant velocity", "At rest"], answerIndex: 2, explanation: "Constant v → zero slope → zero acceleration." },
    ],
  },
  {
    id: "mech.uniform-circular-motion",
    title: "Uniform Circular Motion",
    domain: "mechanics", gradeBand: "9-12", level: 2, difficulty: 3,
    prerequisites: ["mech.newtons-second-law"], tags: ["circular", "centripetal", "rotation"],
    oneLiner: "Object moving in a circle at constant speed is always accelerating toward the center.",
    explain: {
      kid: "Swing a ball on a string in a circle. The string yanks it inward — that pull keeps it curving.",
      teen: "Speed constant, direction always changing. Centripetal acceleration a_c = v²/r points toward the center.",
      adult: "F_c = m·v²/r = m·ω²·r. Period T = 2π·r/v. No tangential force needed for uniform speed; only radial.",
      phd: "Generalizes to circular orbits in central potentials. Effective potential V_eff(r) has a minimum at circular orbit radius.",
    },
    realWorld: [
      { context: "Cars on a curve", insight: "Friction supplies centripetal force; too fast → tires slide outward." },
      { context: "Satellites", insight: "Gravity supplies centripetal force for circular orbits." },
      { context: "Centrifuges", insight: "Spin samples; denser components 'feel' larger outward force in rotating frame." },
    ],
    memoryTip: "a = v²/r, always pointed inward. Faster or tighter circle → bigger pull needed.",
    experiment: {
      title: "Orbit at fixed radius",
      hypothesis: "Centripetal force rises with v² and falls with r.",
      steps: [
        { action: "Tight slow orbit.", expect: "Modest centripetal force needed.", paramSet: { semiMajor: 2, eccentricity: 0, orbitalSpeed: 0.3 }, durationSec: 5 },
        { action: "Faster orbit.", expect: "Required centripetal force grows quadratically.", paramSet: { semiMajor: 2, eccentricity: 0, orbitalSpeed: 0.8 }, durationSec: 5 },
      ],
      whatToNotice: ["Speed magnitude unchanged; only direction.", "Without inward force, object flies off tangentially."],
      commonMistake: "Believing there is an outward 'centrifugal force' in inertial frames. It is a fictitious force in rotating frames.",
      loop: true,
    },
    equations: [
      { label: "Centripetal acceleration", expression: "a_c = v²/r", meaning: "Inward acceleration to maintain circular motion.", memoryTip: "Square the speed, divide by radius.", visualHint: "Inward arrow at every position." },
    ],
    visual: {
      modelId: "kepler-orbit",
      description: "Set eccentricity 0 to view circular motion.",
      controls: [
        { label: "Semi-major axis", param: "semiMajor", min: 2, max: 6, step: 0.25, default: 3 },
        { label: "Eccentricity", param: "eccentricity", min: 0, max: 0.85, step: 0.05, default: 0 },
        { label: "Orbital speed", param: "orbitalSpeed", min: 0.1, max: 1, step: 0.05, default: 0.4 },
      ],
    },
    quiz: [
      { question: "Double v at fixed r. Centripetal force changes by:", options: ["Same", "2×", "4×", "½×"], answerIndex: 2, explanation: "F ∝ v²." },
    ],
  },
  {
    id: "mech.work-done",
    title: "Work Done by a Force",
    domain: "mechanics", gradeBand: "9-12", level: 2, difficulty: 3,
    prerequisites: ["mech.newtons-second-law"], tags: ["work", "energy", "displacement"],
    oneLiner: "Work = force component along motion times distance moved.",
    explain: {
      kid: "Push a box across the floor: you do work. Push a wall that doesn't move: zero work.",
      teen: "W = F·d·cosθ. Only the part of the force along the displacement counts. Perpendicular forces do no work.",
      adult: "W = ∫F·dr (line integral). Conservative forces have path-independent work; non-conservative (friction) don't.",
      phd: "Work-energy theorem: W_net = ΔKE. Generalizes to action S = ∫L dt in Lagrangian mechanics.",
    },
    realWorld: [
      { context: "Lifting a backpack", insight: "Work = mgh. Carrying horizontally at constant height: zero work in physics terms." },
      { context: "Pulling a sled at angle", insight: "Only horizontal component of pull contributes." },
      { context: "Orbit", insight: "Gravity does no net work over closed orbit (conservative force)." },
    ],
    memoryTip: "W = F·d when aligned. Perpendicular force, zero work. Static wall push: zero work.",
    experiment: {
      title: "Force on a cart",
      hypothesis: "Bigger force or longer travel → more work done.",
      steps: [
        { action: "Small force.", expect: "Cart moves a bit; small work.", paramSet: { force: 3, mass: 2 }, durationSec: 4 },
        { action: "Larger force.", expect: "Cart speeds up; bigger KE = more work done.", paramSet: { force: 15, mass: 2 }, durationSec: 4 },
      ],
      whatToNotice: ["Work transfers energy.", "Cart with no displacement = no work, no matter the push."],
      commonMistake: "Thinking holding heavy things still is 'work'. In physics, no displacement = no work.",
      loop: true,
    },
    equations: [
      { label: "Work", expression: "W = F·d·cosθ", meaning: "Force component along displacement times distance.", memoryTip: "Cosine projects force onto motion.", visualHint: "Aligned arrow vs sideways arrow." },
    ],
    visual: {
      modelId: "force-cart",
      description: "Cart accelerated by an applied force — work transfers to KE.",
      controls: [
        { label: "Force", param: "force", min: 1, max: 20, step: 1, default: 8 },
        { label: "Mass", param: "mass", min: 1, max: 8, step: 0.5, default: 2 },
      ],
    },
    quiz: [
      { question: "Pushing perpendicular to motion: work done?", options: ["F·d", "0", "F·d/2", "Negative F·d"], answerIndex: 1, explanation: "cos90° = 0." },
    ],
  },
  {
    id: "mech.kinetic-energy",
    title: "Kinetic Energy",
    domain: "mechanics", gradeBand: "9-12", level: 2, difficulty: 3,
    prerequisites: ["mech.work-done"], tags: ["KE", "energy", "motion"],
    oneLiner: "Kinetic energy is the energy of motion: ½mv².",
    explain: {
      kid: "A fast bowling ball can knock down pins; a slow one barely moves them. Speed gives energy.",
      teen: "KE = ½mv². Doubling speed quadruples KE. Heavier object at same speed has more KE proportionally.",
      adult: "Work-energy theorem: W_net = ΔKE. Relativistic: KE = (γ−1)mc² → reduces to ½mv² for v≪c.",
      phd: "Quantum: ⟨T⟩ = ⟨p²⟩/2m via expectation values in position basis. Field theory generalizes via energy-momentum tensor.",
    },
    realWorld: [
      { context: "Car safety", insight: "Doubling speed quadruples crash energy. Why limits matter." },
      { context: "Hydroelectric dam", insight: "Falling water's KE drives turbines." },
      { context: "Bullet vs train", insight: "Bullet has high v but low m; train has low v but huge m. Both can carry massive KE." },
    ],
    memoryTip: "KE = ½mv². Velocity squared dominates — fast things have a lot more energy than they look.",
    experiment: {
      title: "Cart velocity → KE",
      hypothesis: "KE ∝ v² → bigger force gives more than linear KE growth.",
      steps: [
        { action: "Modest force.", expect: "Cart reaches modest v, modest KE.", paramSet: { force: 5, mass: 2 }, durationSec: 4 },
        { action: "Triple the force.", expect: "v also triples, KE grows ~9×.", paramSet: { force: 15, mass: 2 }, durationSec: 4 },
      ],
      whatToNotice: ["KE grows with v² — disproportionately fast.", "Heavier mass at same v has more KE."],
      commonMistake: "Linear-thinking: doubling speed feels like doubling energy. It quadruples.",
      loop: true,
    },
    equations: [
      { label: "Kinetic energy", expression: "KE = ½ m v²", meaning: "Energy of a mass moving at speed v.", memoryTip: "Half mass times speed squared.", visualHint: "Cart accelerating gains energy quadratically with v." },
    ],
    visual: {
      modelId: "force-cart",
      description: "Cart accelerates under force; v grows, KE grows as v².",
      controls: [
        { label: "Force", param: "force", min: 1, max: 20, step: 1, default: 8 },
        { label: "Mass", param: "mass", min: 1, max: 8, step: 0.5, default: 2 },
      ],
    },
    quiz: [
      { question: "Triple v of a body. KE rises by:", options: ["3×", "6×", "9×", "12×"], answerIndex: 2, explanation: "KE ∝ v². 3² = 9." },
    ],
  },
  {
    id: "mech.potential-energy",
    title: "Gravitational Potential Energy",
    domain: "mechanics", gradeBand: "9-12", level: 2, difficulty: 3,
    prerequisites: ["mech.gravity-falls-down", "mech.work-done"], tags: ["PE", "gravity", "height"],
    oneLiner: "Lifting an object stores energy as gravitational potential: PE = mgh.",
    explain: {
      kid: "A book on a high shelf has stored energy. Drop it and the energy turns into motion.",
      teen: "PE = mgh near Earth's surface. Reference height is arbitrary; only differences matter.",
      adult: "PE = −GMm/r generally. For uniform g, PE = mgh + const. Conservative force F = −∇U.",
      phd: "Potential is a scalar field; total energy E = T + V conserved when ∂L/∂t = 0 (Noether's theorem for time translation).",
    },
    realWorld: [
      { context: "Roller coaster", insight: "Tall climb stores PE; drop converts to KE." },
      { context: "Hydroelectric reservoir", insight: "Water at altitude is stored gravitational PE." },
      { context: "Pendulum", insight: "Top of swing = max PE; bottom = max KE; total stays constant." },
    ],
    memoryTip: "PE = mgh — height pays for energy. Twice the height = twice the stored energy.",
    experiment: {
      title: "Pendulum energy exchange",
      hypothesis: "PE at top fully converts to KE at bottom.",
      steps: [
        { action: "Long rope, small swing.", expect: "Slow PE↔KE oscillation.", paramSet: { length: 4, amplitudeDeg: 15, gravity: 9.8 }, durationSec: 5 },
        { action: "Same rope, big swing.", expect: "Bigger amplitude = more PE → faster bottom speed.", paramSet: { length: 4, amplitudeDeg: 50, gravity: 9.8 }, durationSec: 5 },
      ],
      whatToNotice: ["Total energy conserved (no friction).", "Bottom of swing = fastest, highest = slowest."],
      commonMistake: "Forgetting that PE depends on a chosen reference height — values are not absolute.",
      loop: true,
    },
    equations: [
      { label: "Gravitational PE", expression: "PE = m·g·h", meaning: "Energy stored by lifting m by h.", memoryTip: "Height earns energy linearly.", visualHint: "Higher pendulum bob = more PE." },
    ],
    visual: {
      modelId: "pendulum",
      description: "Pendulum exchanges PE at top with KE at bottom.",
      controls: [
        { label: "Rope length", param: "length", min: 0.5, max: 5, step: 0.1, default: 2.5 },
        { label: "Start angle", param: "amplitudeDeg", min: 5, max: 60, step: 1, default: 25 },
        { label: "Gravity", param: "gravity", min: 1.6, max: 24, step: 0.2, default: 9.8 },
      ],
    },
    quiz: [
      { question: "Lifting 5 kg by 2 m on Earth. PE gained?", options: ["10 J", "49 J", "98 J", "9.8 J"], answerIndex: 2, explanation: "5 × 9.8 × 2 = 98 J." },
    ],
  },
  {
    id: "mech.conservation-of-energy",
    title: "Conservation of Energy",
    domain: "mechanics", gradeBand: "9-12", level: 2, difficulty: 3,
    prerequisites: ["mech.kinetic-energy", "mech.potential-energy"], tags: ["conservation", "energy", "system"],
    oneLiner: "Energy is neither created nor destroyed — it transforms between kinetic, potential, thermal, and other forms.",
    explain: {
      kid: "A swing's energy moves between height (potential) and speed (kinetic). Total stays the same.",
      teen: "ΔKE + ΔPE = 0 in conservative systems. Friction converts to heat — total energy still conserved.",
      adult: "First law of thermodynamics generalizes: ΔU = Q − W. In closed isolated systems, total energy is invariant.",
      phd: "Noether's theorem: energy conservation follows from time-translation invariance of the Lagrangian. Breaks in expanding cosmologies.",
    },
    realWorld: [
      { context: "Roller coaster", insight: "Total mechanical energy roughly constant ignoring friction; height ↔ speed trade-off." },
      { context: "Electric vehicle", insight: "Regenerative braking converts KE back to battery PE." },
      { context: "Sun", insight: "Nuclear PE → photons → life on Earth → heat radiation. Energy chain." },
    ],
    memoryTip: "Track all forms. Mechanical → thermal → electrical → chemical. Sum stays put.",
    experiment: {
      title: "Frictionless pendulum",
      hypothesis: "Sum KE+PE is constant over the swing.",
      steps: [
        { action: "Default swing.", expect: "KE peaks at bottom, PE at extremes; total constant.", paramSet: { length: 2.5, amplitudeDeg: 30, gravity: 9.8 }, durationSec: 6 },
        { action: "Bigger amplitude.", expect: "More PE at top, more KE at bottom — total still constant.", paramSet: { length: 2.5, amplitudeDeg: 55, gravity: 9.8 }, durationSec: 6 },
      ],
      whatToNotice: ["Energy moves between forms.", "Real swings damp because of friction → heat."],
      commonMistake: "Thinking energy 'disappears'. It just changes form (often to invisible thermal energy).",
      loop: true,
    },
    equations: [
      { label: "Mechanical energy", expression: "E = KE + PE = const (no friction)", meaning: "Total energy is conserved.", memoryTip: "Sum stays put.", visualHint: "PE ↔ KE in pendulum." },
    ],
    visual: {
      modelId: "pendulum",
      description: "Watch potential and kinetic energy trade off in real time.",
      controls: [
        { label: "Rope length", param: "length", min: 0.5, max: 5, step: 0.1, default: 2.5 },
        { label: "Start angle", param: "amplitudeDeg", min: 5, max: 60, step: 1, default: 25 },
        { label: "Gravity", param: "gravity", min: 1.6, max: 24, step: 0.2, default: 9.8 },
      ],
    },
    quiz: [
      { question: "A pendulum at the highest point has:", options: ["Max KE", "Max PE", "Zero energy", "Max KE+PE"], answerIndex: 1, explanation: "At the extreme, motion stops momentarily — all energy is PE." },
    ],
  },
  {
    id: "mech.elastic-vs-inelastic-collisions",
    title: "Elastic vs Inelastic Collisions",
    domain: "mechanics", gradeBand: "9-12", level: 3, difficulty: 3,
    prerequisites: ["mech.conservation-of-energy"], tags: ["collision", "elastic", "inelastic", "momentum"],
    oneLiner: "Momentum conserves in any collision; kinetic energy conserves only in elastic ones.",
    explain: {
      kid: "Billiard balls click and bounce off (elastic). Two cars crash and crumple (inelastic).",
      teen: "Elastic: KE conserved. Inelastic: KE lost to heat/sound/deformation. Perfectly inelastic: stick together.",
      adult: "1D elastic: v1' = ((m1−m2)v1 + 2m2v2)/(m1+m2), v2' = ((m2−m1)v2 + 2m1v1)/(m1+m2). Coefficient of restitution e = |v_rel'|/|v_rel|.",
      phd: "Cross-sections, S-matrix in scattering theory. Reaction kinematics in particle physics: invariant √s decides accessible final states.",
    },
    realWorld: [
      { context: "Pool table", insight: "Near-elastic collisions; momentum + energy nearly conserved." },
      { context: "Car crash test", insight: "Crumple zones absorb KE — make collision more inelastic to protect occupants." },
      { context: "Atomic scattering", insight: "Elastic in low-energy regimes; inelastic when internal states excited." },
    ],
    memoryTip: "Momentum always conserves (no external force). KE conserves only in elastic.",
    experiment: {
      title: "Cart collisions",
      hypothesis: "Force ratio decides which side recoils more.",
      steps: [
        { action: "Light cart hit by heavy.", expect: "Light cart shoots off fast.", paramSet: { force: 12, mass: 1 }, durationSec: 4 },
        { action: "Heavy mass.", expect: "Acceleration lower; cart slugs forward.", paramSet: { force: 12, mass: 6 }, durationSec: 4 },
      ],
      whatToNotice: ["Momentum balance reigns.", "Inelastic collisions lose KE to heat/deformation."],
      commonMistake: "Thinking momentum vanishes if cars stick. It does not — they move together with combined mass.",
      loop: true,
    },
    equations: [
      { label: "Momentum conservation", expression: "Σp_before = Σp_after", meaning: "Total momentum invariant in isolated system.", memoryTip: "Vector sum.", visualHint: "Cart momentum changes when force applied." },
    ],
    visual: {
      modelId: "force-cart",
      description: "Cart momentum responds to applied force.",
      controls: [
        { label: "Force", param: "force", min: 1, max: 20, step: 1, default: 8 },
        { label: "Mass", param: "mass", min: 1, max: 8, step: 0.5, default: 2 },
      ],
    },
    quiz: [
      { question: "Two clay balls collide and stick. This is:", options: ["Elastic", "Inelastic", "Perfectly inelastic", "Reflective"], answerIndex: 2, explanation: "Sticking → coefficient of restitution = 0." },
    ],
  },
  {
    id: "mech.impulse",
    title: "Impulse and Momentum Change",
    domain: "mechanics", gradeBand: "9-12", level: 2, difficulty: 3,
    prerequisites: ["mech.newtons-second-law"], tags: ["impulse", "momentum", "force", "time"],
    oneLiner: "Impulse = force × time = change in momentum. Bigger or longer push = bigger Δp.",
    explain: {
      kid: "Push a swing harder, it speeds up more. Push for longer time, even more. That total push is impulse.",
      teen: "J = F·Δt = Δp. Spreading the force over longer time reduces peak force needed for given Δp.",
      adult: "J = ∫F dt = Δp. Useful when forces vary in time. Crash safety extends Δt to reduce peak F.",
      phd: "Generalizes to four-momentum exchange in scattering. Impulse approximation in QM: Δp ≈ F̄·Δt for short interactions.",
    },
    realWorld: [
      { context: "Airbags", insight: "Extend Δt of head deceleration → smaller peak F → less injury." },
      { context: "Catching a ball", insight: "Pulling hands back adds Δt, reduces sting." },
      { context: "Rockets", insight: "Total impulse over burn time determines Δv via Δp = m·Δv." },
    ],
    memoryTip: "Big impulse = big push × time. To survive a hit, stretch the time.",
    experiment: {
      title: "Force on a cart",
      hypothesis: "Same cart, longer force application = more momentum change.",
      steps: [
        { action: "Brief moderate push.", expect: "Modest velocity gained.", paramSet: { force: 6, mass: 2 }, durationSec: 3 },
        { action: "Longer steady push.", expect: "Velocity grows more.", paramSet: { force: 6, mass: 2 }, durationSec: 6 },
      ],
      whatToNotice: ["Final velocity scales with force·time / mass.", "Impulse cumulates over time."],
      commonMistake: "Treating impulse and force as the same. Force is rate; impulse is total.",
      loop: true,
    },
    equations: [
      { label: "Impulse", expression: "J = F·Δt = Δp", meaning: "Force times duration equals momentum change.", memoryTip: "Push × time.", visualHint: "Cart velocity grows with continued force." },
    ],
    visual: {
      modelId: "force-cart",
      description: "Cart subject to constant force — impulse cumulates as Δp.",
      controls: [
        { label: "Force", param: "force", min: 1, max: 20, step: 1, default: 8 },
        { label: "Mass", param: "mass", min: 1, max: 8, step: 0.5, default: 2 },
      ],
    },
    quiz: [
      { question: "Doubling the time of a constant force...", options: ["Doubles momentum change", "Halves it", "Same", "Quadruples it"], answerIndex: 0, explanation: "J = F·Δt." },
    ],
  },
  {
    id: "mech.torque",
    title: "Torque: Twist Around an Axis",
    domain: "mechanics", gradeBand: "9-12", level: 2, difficulty: 3,
    prerequisites: ["mech.newtons-second-law", "mech.lever"], tags: ["torque", "rotation", "moment-arm"],
    oneLiner: "Torque is the rotational equivalent of force: τ = r × F.",
    explain: {
      kid: "Pushing far from a door's hinge swings it open; pushing near the hinge barely moves it.",
      teen: "τ = r·F·sinθ. Net torque causes angular acceleration: τ_net = I·α.",
      adult: "Vector: τ = r × F. Generalizes Newton's law to rotation. Conserved with no external torque.",
      phd: "Stress tensor and angular-momentum density in continuum mechanics. Quantum operators: orbital + spin contributions.",
    },
    realWorld: [
      { context: "Wrenches", insight: "Long handles multiply torque to break stuck bolts." },
      { context: "Bicycles", insight: "Pedaling at the right gear matches torque to wheel resistance." },
      { context: "Spacecraft", insight: "Reaction wheels generate internal torques to reorient without thrusters." },
    ],
    memoryTip: "Long arm + perpendicular force = max torque. Push along the arm = zero torque.",
    experiment: {
      title: "Seesaw torque balance",
      hypothesis: "Net torque = 0 ⇒ balance.",
      steps: [
        { action: "Equal masses, equal arms.", expect: "Balance.", paramSet: { leftMass: 3, leftDistance: 2, rightMass: 3, rightDistance: 2 }, durationSec: 4 },
        { action: "Heavy close, light far.", expect: "Bar still balances when m·d products equal.", paramSet: { leftMass: 4, leftDistance: 1, rightMass: 1, rightDistance: 4 }, durationSec: 5 },
        { action: "Asymmetric.", expect: "Net torque tilts the bar.", paramSet: { leftMass: 4, leftDistance: 3, rightMass: 1, rightDistance: 1 }, durationSec: 4 },
      ],
      whatToNotice: ["Long lever arms multiply force.", "Perpendicular component matters."],
      commonMistake: "Forgetting that only the perpendicular force component contributes to torque.",
      loop: true,
    },
    equations: [
      { label: "Torque", expression: "τ = r × F", meaning: "Cross product of moment arm and force.", memoryTip: "Magnitude r·F·sinθ.", visualHint: "Long arm gives big rotational kick." },
    ],
    visual: {
      modelId: "lever-seesaw",
      description: "Seesaw demonstrates torque balance.",
      controls: [
        { label: "Left mass", param: "leftMass", min: 0.5, max: 6, step: 0.5, default: 2 },
        { label: "Left distance", param: "leftDistance", min: 0.5, max: 4, step: 0.25, default: 3 },
        { label: "Right mass", param: "rightMass", min: 0.5, max: 6, step: 0.5, default: 2 },
        { label: "Right distance", param: "rightDistance", min: 0.5, max: 4, step: 0.25, default: 3 },
      ],
    },
    quiz: [
      { question: "Push a door at the hinge. Torque?", options: ["Maximum", "Half", "Zero", "Negative"], answerIndex: 2, explanation: "r = 0 at hinge → τ = 0." },
    ],
  },
  {
    id: "mech.moment-of-inertia",
    title: "Moment of Inertia",
    domain: "mechanics", gradeBand: "9-12", level: 3, difficulty: 4,
    prerequisites: ["mech.torque", "mech.angular-momentum"], tags: ["moment of inertia", "rotation", "mass-distribution"],
    oneLiner: "Moment of inertia I is rotational mass — measures resistance to angular acceleration.",
    explain: {
      kid: "A tire is hard to spin; a frisbee is easy. Same mass, but how it's spread out matters.",
      teen: "I = Σ m_i·r_i². Solid sphere: (2/5)MR². Thin ring: MR². τ = I·α (rotational F=ma).",
      adult: "I = ∫r² dm. Parallel axis: I_parallel = I_cm + Md². Tensor in 3D: I_ij = ∫(δ_ij·r² − x_i·x_j) dm.",
      phd: "In rigid-body dynamics, I tensor diagonalizes in principal axes. Euler equations describe free rotation; tennis racket theorem from intermediate-axis instability.",
    },
    realWorld: [
      { context: "Figure skater", insight: "Pulling arms in reduces I, ω rises (L conserved)." },
      { context: "Gymnast tucking", insight: "Tuck during rotation to spin faster, extend to slow." },
      { context: "Earth's rotation", insight: "Ice melt redistributes mass → I changes → day length changes minutely." },
    ],
    memoryTip: "I depends on where mass sits relative to axis. Mass far out → large I.",
    experiment: {
      title: "Orbits with different a",
      hypothesis: "Larger orbit (more r²) → effectively larger I.",
      steps: [
        { action: "Tight orbit.", expect: "Small effective I; fast revolution.", paramSet: { semiMajor: 2, eccentricity: 0, orbitalSpeed: 0.5 }, durationSec: 5 },
        { action: "Wide orbit.", expect: "Large effective I; slow revolution.", paramSet: { semiMajor: 6, eccentricity: 0, orbitalSpeed: 0.5 }, durationSec: 6 },
      ],
      whatToNotice: ["Mass distribution decides resistance to spin.", "Axis location matters (parallel-axis theorem)."],
      commonMistake: "Using mass alone for rotation. Rotation needs I, which depends on geometry.",
      loop: true,
    },
    equations: [
      { label: "Moment of inertia", expression: "I = Σ m_i·r_i²", meaning: "Mass-weighted square of distances from axis.", memoryTip: "Far mass dominates (squared).", visualHint: "Wider orbit means harder to angularly accelerate." },
    ],
    visual: {
      modelId: "kepler-orbit",
      description: "Larger orbit = effectively larger moment of inertia.",
      controls: [
        { label: "Semi-major axis", param: "semiMajor", min: 2, max: 6, step: 0.25, default: 4 },
        { label: "Eccentricity", param: "eccentricity", min: 0, max: 0.85, step: 0.05, default: 0 },
        { label: "Orbital speed", param: "orbitalSpeed", min: 0.1, max: 1, step: 0.05, default: 0.4 },
      ],
    },
    quiz: [
      { question: "Solid sphere vs hollow sphere of same M, R. Which I is bigger?", options: ["Solid", "Hollow", "Equal", "Depends on T"], answerIndex: 1, explanation: "Hollow has all mass at R; (2/3)MR² > (2/5)MR²." },
    ],
  },
];
