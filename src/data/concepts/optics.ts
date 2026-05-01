import type { Concept } from "@/types/concept";

export const opticsConcepts: Concept[] = [
  {
    id: "optics.shadow",
    title: "Light and Shadows",
    domain: "optics",
    gradeBand: "K-3",
    level: 0,
    difficulty: 1,
    prerequisites: [],
    tags: ["light", "shadow", "ray", "block"],
    oneLiner: "Light travels in straight lines. When something blocks it, a shadow forms behind the object.",
    explain: {
      kid: "Stand in front of a lamp at night. The wall behind you has a dark You-shape. That is your shadow. Light cannot bend around you.",
      teen: "Light from a small source travels in straight rays. An opaque object blocks rays, leaving a shadow whose size depends on the object's distance from the source vs the wall.",
      adult: "Geometric optics: in homogeneous media, light follows straight lines (Fermat's principle). Penumbra/umbra structure depends on source size and geometry.",
      phd: "Diffraction smears edges when feature size approaches wavelength. Full treatment via Kirchhoff/Fresnel integrals; geometric shadows are λ → 0 limit.",
    },
    realWorld: [
      { context: "Sundials", insight: "Sun's apparent path moves the shadow, marking time." },
      { context: "Eclipses", insight: "Moon's shadow falls on Earth (solar) or Earth's on Moon (lunar)." },
      { context: "Stage lighting", insight: "Multiple sources blur shadows by overlapping bright regions." },
    ],
    memoryTip: "Light = arrows from the bulb. Block one = shadow stripe. Move object closer to light → bigger shadow.",
    experiment: {
      title: "Shadow size test",
      hypothesis: "Closer to lamp = larger shadow.",
      steps: [
        { action: "Cube near the wall.", expect: "Shadow nearly cube-size.", paramSet: { objectDistance: 2.5 }, durationSec: 4 },
        { action: "Slide cube toward the lamp.", expect: "Shadow grows huge.", paramSet: { objectDistance: -1.5 }, durationSec: 5 },
      ],
      whatToNotice: ["Shadow is just where rays cannot reach.", "Edge sharpness depends on source size."],
      commonMistake: "Thinking shadow is 'a thing' the object emits. It is just the absence of light there.",
    },
    equations: [
      {
        label: "Similar triangles",
        expression: "h_shadow / h_object = d_wall / d_object",
        meaning: "Shadow scales linearly with distance ratio.",
        memoryTip: "Closer to source → bigger projection.",
        visualHint: "Shadow rectangle on wall scales with cube position.",
      },
    ],
    visual: {
      modelId: "lamp-shadow",
      description: "Lamp on the left, blocking cube in middle, wall on the right.",
      controls: [{ label: "Cube position", param: "objectDistance", min: -2, max: 3, step: 0.1, default: 0, unit: "m" }],
    },
    quiz: [
      {
        question: "You move closer to a streetlight. Your shadow on the ground:",
        options: ["Shrinks", "Grows", "Vanishes", "Splits"],
        answerIndex: 1,
        explanation: "Closer to source = wider rays diverge more around you → bigger shadow.",
      },
    ],
  },
  {
    id: "optics.convex-lens",
    title: "Convex Lens: Focusing Light",
    domain: "optics",
    gradeBand: "4-8",
    level: 1,
    difficulty: 2,
    prerequisites: ["optics.shadow"],
    tags: ["lens", "convex", "focus", "image"],
    oneLiner: "A convex lens bends parallel rays to a focal point and forms images of objects.",
    explain: {
      kid: "A magnifying glass can focus sunlight to a tiny bright dot — hot enough to burn paper.",
      teen: "Convex lens (thicker in middle) bends rays toward each other. Parallel rays meet at focal length f. Object at 2f gives same-size inverted image at 2f.",
      adult: "Thin-lens equation: 1/f = 1/d_o + 1/d_i. Magnification m = −d_i/d_o. Sign conventions: object real (d_o>0), image real if d_i>0.",
      phd: "Aberrations beyond paraxial: spherical, coma, astigmatism, chromatic. Modern systems use aspherics + multi-element designs minimizing wavefront error per Zernike polynomials.",
    },
    realWorld: [
      { context: "Eyeglasses", insight: "Convex lenses correct farsightedness by bringing rays to a closer focus." },
      { context: "Camera", insight: "Multi-element lens forms a real inverted image on the sensor." },
      { context: "Solar concentrators", insight: "Large convex lenses or Fresnel sheets focus sunlight to drive thermal engines." },
    ],
    memoryTip: "Convex = converges. Concave = diverges. f is where parallel rays meet behind the lens.",
    experiment: {
      title: "Focal length and image",
      hypothesis: "Object at 2f makes a same-size inverted image at 2f.",
      steps: [
        { action: "Object at 2f (4 m).", expect: "Image at 2f, inverted, same size.", paramSet: { focalLength: 2, objectDistance: 4 }, durationSec: 4 },
        { action: "Move object far out.", expect: "Image shrinks toward focal point.", paramSet: { focalLength: 2, objectDistance: 6 }, durationSec: 4 },
        { action: "Slide object inside f.", expect: "Image becomes virtual, upright, magnified.", paramSet: { focalLength: 2, objectDistance: 1.2 }, durationSec: 4 },
      ],
      whatToNotice: ["Center ray passes straight through.", "Parallel rays bend toward f."],
      commonMistake: "Believing the image is always real. Inside f, you get a virtual upright image (magnifier mode).",
    },
    equations: [
      {
        label: "Thin-lens equation",
        expression: "1/f = 1/d_o + 1/d_i",
        meaning: "Relates focal length, object distance, image distance.",
        memoryTip: "Reciprocals add.",
        visualHint: "Slide object distance and watch image position shift along the axis.",
      },
    ],
    visual: {
      modelId: "convex-lens",
      description: "Convex lens with rays from an object converging behind it.",
      controls: [
        { label: "Focal length", param: "focalLength", min: 0.5, max: 4, step: 0.1, default: 2, unit: "m" },
        { label: "Object distance", param: "objectDistance", min: 1, max: 6, step: 0.1, default: 3, unit: "m" },
      ],
    },
    quiz: [
      {
        question: "Magnifying glass holds object close. Image is...",
        options: ["Real, inverted", "Virtual, upright, larger", "Real, smaller", "Same size"],
        answerIndex: 1,
        explanation: "Object inside focal length → virtual upright magnified image.",
      },
    ],
  },
  {
    id: "optics.snells-law",
    title: "Snell's Law: Bending Light",
    domain: "optics",
    gradeBand: "9-12",
    level: 2,
    difficulty: 3,
    prerequisites: ["optics.shadow"],
    tags: ["snell", "refraction", "index", "boundary"],
    oneLiner: "Light bends when it crosses between media with different refractive indices: n₁·sinθ₁ = n₂·sinθ₂.",
    explain: {
      kid: "Stick a pencil in a glass of water. It looks broken at the surface. Light bends going into water.",
      teen: "Light slows down in denser media. The angle changes so that n·sinθ stays constant across the boundary.",
      adult: "n = c/v_phase. At critical angle θ_c = arcsin(n₂/n₁) (n₁>n₂), total internal reflection occurs. Fiber optics use TIR for signal containment.",
      phd: "Derived from Fermat's principle (least optical path). Generalizes to anisotropic media (birefringence) and metasurfaces (generalized Snell with phase gradient).",
    },
    realWorld: [
      { context: "Eye glasses", insight: "Glass refractive index ≈ 1.5; corrects ray paths into the retina." },
      { context: "Optical fibers", insight: "Total internal reflection traps light in glass cladding for internet and endoscopes." },
      { context: "Mirages", insight: "Hot air near road has lower n; light bends, mimicking water reflections." },
    ],
    memoryTip: "Going slow = bend toward normal. Air→water: bends in. Water→air: bends out (and may totally reflect past θ_c).",
    experiment: {
      title: "Water surface ray",
      hypothesis: "Ray bends toward normal entering water, away leaving.",
      steps: [
        { action: "Air → water at 35°.", expect: "Ray bends toward normal (~25°).", paramSet: { incidentAngle: 35, n1: 1, n2: 1.33 }, durationSec: 4 },
        { action: "Steeper incidence.", expect: "More bending.", paramSet: { incidentAngle: 70, n1: 1, n2: 1.33 }, durationSec: 4 },
        { action: "Flip media: water → air, past critical angle.", expect: "Total internal reflection.", paramSet: { incidentAngle: 60, n1: 1.33, n2: 1 }, durationSec: 4 },
      ],
      whatToNotice: ["Both angles measured from the normal.", "Equal n on both sides → ray passes straight (no bending)."],
      commonMistake: "Measuring from the surface instead of from the normal.",
    },
    equations: [
      {
        label: "Snell's law",
        expression: "n₁·sinθ₁ = n₂·sinθ₂",
        meaning: "n times sine of angle is conserved across the boundary.",
        memoryTip: "Slower medium pulls ray toward normal.",
        visualHint: "Watch ray kink at the water surface as you change indices.",
      },
    ],
    visual: {
      modelId: "snell-refraction",
      description: "Light ray crossing water surface. Adjust incidence angle and refractive indices.",
      controls: [
        { label: "Incidence angle", param: "incidentAngle", min: 0, max: 89, step: 1, default: 35, unit: "°" },
        { label: "n₁ (top)", param: "n1", min: 1, max: 2, step: 0.05, default: 1 },
        { label: "n₂ (bottom)", param: "n2", min: 1, max: 2.5, step: 0.05, default: 1.33 },
      ],
    },
    quiz: [
      {
        question: "Light from water (n=1.33) to air, angle 60°. What happens?",
        options: ["Bends toward normal", "Total internal reflection", "Bends away", "Passes straight"],
        answerIndex: 1,
        explanation: "θ_c ≈ 49° for water-air. 60° exceeds it → total internal reflection.",
      },
    ],
  },
  {
    id: "optics.prism-dispersion",
    title: "Prism Dispersion: Splitting White Light",
    domain: "optics",
    gradeBand: "9-12",
    level: 2,
    difficulty: 3,
    prerequisites: ["optics.snells-law"],
    tags: ["prism", "dispersion", "spectrum", "color"],
    oneLiner: "Different colors bend by different amounts in glass — a prism spreads white light into a rainbow.",
    explain: {
      kid: "Shine sunlight through a glass prism. White light fans out into red, orange, yellow, green, blue, indigo, violet.",
      teen: "Refractive index depends on wavelength. Shorter wavelengths (blue, violet) bend more; longer (red) bend less. A prism uses this to spread colors.",
      adult: "n(λ) increases as λ decreases (normal dispersion). Cauchy's equation: n(λ) ≈ A + B/λ². Angular dispersion = dθ_2/dλ derived from Snell's law.",
      phd: "Origin: Lorentz oscillator model — bound electrons resonate near UV; refractive index follows Sellmeier equation across visible range. Anomalous dispersion near absorption bands.",
    },
    realWorld: [
      { context: "Rainbows", insight: "Water droplets act as tiny prisms + reflectors, splitting sunlight into color arcs." },
      { context: "Spectrometers", insight: "Prisms or gratings analyze starlight to identify elements via emission/absorption lines." },
      { context: "Camera lens", insight: "Chromatic aberration is unwanted dispersion; achromatic doublets cancel it." },
    ],
    memoryTip: "Red bends Least, Violet bends Most. ROYGBIV order = increasing bend angle.",
    experiment: {
      title: "Spectrum spread",
      hypothesis: "More dispersive glass = wider rainbow.",
      steps: [
        { action: "Mild dispersion.", expect: "Narrow rainbow.", paramSet: { dispersion: 0.5 }, durationSec: 4 },
        { action: "Crank dispersion.", expect: "Full spectrum fan.", paramSet: { dispersion: 2.5 }, durationSec: 4 },
        { action: "Drop to zero.", expect: "Rays exit parallel — no splitting.", paramSet: { dispersion: 0 }, durationSec: 3 },
      ],
      whatToNotice: ["Refraction happens twice (entering + exiting prism).", "White light into prism = ordered colors out."],
      commonMistake: "Thinking the prism creates colors. It only separates colors already in white light.",
    },
    equations: [
      {
        label: "Cauchy dispersion",
        expression: "n(λ) ≈ A + B/λ²",
        meaning: "Index falls as wavelength grows.",
        memoryTip: "Blue λ small → big n → big bend.",
        visualHint: "Violet ray exits steepest below red.",
      },
    ],
    visual: {
      modelId: "prism-spectrum",
      description: "Triangular prism splits a white ray into a fan of colors.",
      controls: [{ label: "Dispersion strength", param: "dispersion", min: 0, max: 2.5, step: 0.1, default: 1 }],
    },
    quiz: [
      {
        question: "Which color bends the most in a glass prism?",
        options: ["Red", "Yellow", "Green", "Violet"],
        answerIndex: 3,
        explanation: "Shortest visible wavelength → largest n → greatest deviation.",
      },
    ],
  },
];
