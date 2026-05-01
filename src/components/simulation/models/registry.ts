import type { BaseModel } from "./base-model";
import {
  CartPushModel,
  AppleFallModel,
  BarMagnetsModel,
  LampShadowModel,
  PendulumModel,
  InclinedRampModel,
  LeverSeesawModel,
} from "./everyday-models";
import {
  PressureColumnModel,
  ConvexLensModel,
  SimpleCircuitModel,
  ProjectileArcModel,
  ForceCartModel,
  OhmsCircuitModel,
} from "./classical-models";
import {
  MagnetCoilInductionModel,
  SnellRefractionModel,
  DopplerSourceModel,
  PrismSpectrumModel,
  SpringMassModel,
} from "./wave-em-models";
import {
  KeplerOrbitModel,
  AtomicOrbitalModel,
  RocketThrustModel,
  BlackholeLensingModel,
} from "./advanced-models";
import { GasParticlesModel, CarnotCycleModel } from "./thermo-models";
import {
  DoubleSlitModel,
  TransformerModel,
  DecayChainModel,
  NeutronStarModel,
  PlasmaBottleModel,
  IonEngineModel,
  BECModel,
  FeynmanModel,
} from "./extended-models";
import type { VisualModelId } from "@/types/concept";

export type ModelCtor = new (container: HTMLDivElement, params?: Record<string, number>) => BaseModel;

export const modelRegistry: Record<VisualModelId, ModelCtor> = {
  "cart-push": CartPushModel,
  "apple-fall": AppleFallModel,
  "bar-magnets": BarMagnetsModel,
  "lamp-shadow": LampShadowModel,
  "pendulum": PendulumModel,
  "inclined-ramp": InclinedRampModel,
  "lever-seesaw": LeverSeesawModel,
  "pressure-column": PressureColumnModel,
  "convex-lens": ConvexLensModel,
  "simple-circuit": SimpleCircuitModel,
  "projectile-arc": ProjectileArcModel,
  "force-cart": ForceCartModel,
  "ohms-circuit": OhmsCircuitModel,
  "magnet-coil-induction": MagnetCoilInductionModel,
  "snell-refraction": SnellRefractionModel,
  "doppler-source": DopplerSourceModel,
  "prism-spectrum": PrismSpectrumModel,
  "spring-mass": SpringMassModel,
  "kepler-orbit": KeplerOrbitModel,
  "atomic-orbital": AtomicOrbitalModel,
  "rocket-thrust": RocketThrustModel,
  "blackhole-lensing": BlackholeLensingModel,
  "gas-particles": GasParticlesModel,
  "carnot-cycle": CarnotCycleModel,
  "double-slit": DoubleSlitModel,
  "transformer": TransformerModel,
  "decay-chain": DecayChainModel,
  "neutron-star": NeutronStarModel,
  "plasma-bottle": PlasmaBottleModel,
  "ion-engine": IonEngineModel,
  "bose-einstein-condensate": BECModel,
  "feynman-diagram": FeynmanModel,
};

export function getModelCtor(id: VisualModelId): ModelCtor {
  return modelRegistry[id];
}
