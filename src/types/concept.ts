export type Audience = "kid" | "teen" | "adult" | "phd";

export type GradeBand =
  | "K-3"
  | "4-8"
  | "9-12"
  | "undergrad"
  | "grad"
  | "phd";

export type Domain =
  | "mechanics"
  | "waves"
  | "thermo"
  | "em"
  | "optics"
  | "modern"
  | "quantum"
  | "atomic"
  | "nuclear"
  | "particle"
  | "astro"
  | "propulsion"
  | "plasma"
  | "fluid"
  | "biophysics"
  | "geophysics"
  | "math";

export type Equation = {
  label: string;
  expression: string;
  meaning: string;
  memoryTip: string;
  visualHint: string;
};

export type RealWorldExample = {
  context: string;
  insight: string;
};

export type ExperimentStep = {
  action: string;
  expect: string;
};

export type Experiment = {
  title: string;
  hypothesis: string;
  steps: ExperimentStep[];
  whatToNotice: string[];
  commonMistake: string;
};

export type QuizItem = {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

export type AudienceExplain = {
  kid: string;
  teen: string;
  adult: string;
  phd: string;
};

export type VisualModelId =
  | "cart-push"
  | "apple-fall"
  | "bar-magnets"
  | "lamp-shadow"
  | "pendulum"
  | "inclined-ramp"
  | "lever-seesaw"
  | "pressure-column"
  | "convex-lens"
  | "simple-circuit"
  | "projectile-arc"
  | "force-cart"
  | "ohms-circuit"
  | "magnet-coil-induction"
  | "snell-refraction"
  | "doppler-source"
  | "kepler-orbit"
  | "atomic-orbital"
  | "rocket-thrust"
  | "blackhole-lensing"
  | "prism-spectrum"
  | "spring-mass"
  | "gas-particles"
  | "carnot-cycle"
  | "double-slit"
  | "transformer"
  | "decay-chain"
  | "neutron-star"
  | "plasma-bottle"
  | "ion-engine"
  | "bose-einstein-condensate"
  | "feynman-diagram";

export type VisualModelControl = {
  label: string;
  param: string;
  min: number;
  max: number;
  step: number;
  default: number;
  unit?: string;
};

export type VisualModel = {
  modelId: VisualModelId;
  description: string;
  controls: VisualModelControl[];
  initialParams?: Record<string, number>;
};

export type Concept = {
  id: string;
  title: string;
  domain: Domain;
  gradeBand: GradeBand;
  level: number;
  difficulty: number;
  prerequisites: string[];
  tags: string[];
  oneLiner: string;
  explain: AudienceExplain;
  realWorld: RealWorldExample[];
  memoryTip: string;
  experiment: Experiment;
  equations: Equation[];
  visual: VisualModel;
  quiz: QuizItem[];
};
