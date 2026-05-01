import type { Concept } from "@/types/concept";

export const wavesConcepts: Concept[] = [
  {
    id: "waves.doppler-effect",
    title: "Doppler Effect",
    domain: "waves",
    gradeBand: "9-12",
    level: 2,
    difficulty: 3,
    prerequisites: [],
    tags: ["doppler", "frequency", "motion", "wave"],
    oneLiner: "When a wave source moves, the wave fronts pile up in front and stretch behind, shifting the observed frequency.",
    explain: {
      kid: "An ambulance siren sounds higher when coming toward you and lower as it passes. The siren itself does not change pitch — your ears hear different spacing.",
      teen: "Source motion squeezes wavefronts ahead (higher frequency) and stretches them behind (lower frequency). Observer hears f' ≠ f_source.",
      adult: "Classical: f' = f·(c ± v_obs) / (c ∓ v_src) for sound. For light, use relativistic Doppler: f' = f·√((1−β)/(1+β)) for receding source.",
      phd: "Cosmological redshift: not a kinematic Doppler but expansion of space. z = a(now)/a(emit) − 1. Measurements of z map cosmic history (Hubble–Lemaître law).",
    },
    realWorld: [
      { context: "Police radar", insight: "Doppler shift on reflected microwaves measures car speed." },
      { context: "Ultrasound", insight: "Blood-flow imaging uses Doppler shift to map velocity in arteries." },
      { context: "Galaxy redshift", insight: "Distant galaxies' light is shifted to longer wavelengths — universe is expanding." },
    ],
    memoryTip: "Approaching source = squeezed waves = higher pitch. Receding = stretched = lower pitch.",
    experiment: {
      title: "Source motion test",
      hypothesis: "Faster source = larger pitch shift.",
      steps: [
        { action: "Increase source speed past wave speed.", expect: "Wavefronts in front collapse — sonic boom analog." },
        { action: "Slow source to zero.", expect: "Concentric circles — no shift." },
      ],
      whatToNotice: ["Wavefront circles centered where the source emitted them.", "Observer pitch depends on relative motion."],
      commonMistake: "Thinking the source's frequency itself changes. It does not — only the observed frequency does.",
    },
    equations: [
      {
        label: "Doppler (sound, source moving)",
        expression: "f' = f·c/(c − v_src)",
        meaning: "Frequency observed when source approaches at v_src in medium with wave speed c.",
        memoryTip: "Source closes in → denominator shrinks → f' grows.",
        visualHint: "Wavefronts crowd in front of the moving red sphere.",
      },
    ],
    visual: {
      modelId: "doppler-source",
      description: "A moving source emits expanding wavefronts. Observer (green) sits to the right.",
      controls: [
        { label: "Source speed", param: "sourceSpeed", min: 0, max: 1.6, step: 0.05, default: 0.6 },
        { label: "Wave speed", param: "waveSpeed", min: 0.5, max: 2, step: 0.05, default: 1.2 },
      ],
    },
    quiz: [
      {
        question: "A train horn sounds higher pitch as it approaches because:",
        options: ["Train horn changes", "Air pressure rises", "Wavefronts crowd", "Sound speeds up"],
        answerIndex: 2,
        explanation: "Source motion compresses wavefronts ahead → higher observed frequency.",
      },
    ],
  },
];
