import type { Base3DVisualizer } from "./3d-visualizers/3d-base-visualizer";
import { AdvancedMechanics3D } from "./3d-visualizers/advanced-mechanics-3d";
import { AdvancedWaves3D } from "./3d-visualizers/advanced-waves-3d";
import { AdvancedOptics3D } from "./3d-visualizers/advanced-optics-3d";
import { AdvancedQuantum3D } from "./3d-visualizers/advanced-quantum-3d";
import { AdvancedElectromagnetism3D } from "./3d-visualizers/advanced-electromagnetism-3d";
import { AdvancedFluid3D } from "./3d-visualizers/advanced-fluid-3d";
import { CircularMotion3D } from "./3d-visualizers/circular-motion-3d";

export interface VisualizerConfig {
  Class: new (container: HTMLDivElement) => Base3DVisualizer;
  controls?: Array<{
    param: string;
    label: string;
    min: number;
    max: number;
    step: number;
    default: number;
    unit?: string;
  }>;
  description: string;
}

// Domain-based mappings - return appropriate visualizer for domain
export const domainConfigs: Record<string, VisualizerConfig> = {
  mechanics: {
    Class: AdvancedMechanics3D,
    controls: [
      { param: "velocity", label: "Velocity", min: 5, max: 50, step: 1, default: 20, unit: "m/s" },
      { param: "angle", label: "Launch Angle", min: 0, max: 90, step: 5, default: 45, unit: "°" },
      { param: "amplitude", label: "Amplitude", min: 0.5, max: 5, step: 0.1, default: 2, unit: "m" },
      { param: "frequency", label: "Frequency", min: 0.5, max: 5, step: 0.1, default: 1, unit: "Hz" },
    ],
    description: "Interactive 3D mechanics simulator with projectile motion, pendulums, springs, and energy visualization",
  },
  waves: {
    Class: AdvancedWaves3D,
    controls: [
      { param: "amplitude", label: "Amplitude", min: 0.5, max: 3, step: 0.1, default: 1, unit: "m" },
      { param: "frequency", label: "Frequency", min: 0.5, max: 5, step: 0.1, default: 1, unit: "Hz" },
      { param: "velocity", label: "Wave Velocity", min: 1, max: 10, step: 0.5, default: 2, unit: "m/s" },
      { param: "wavelength", label: "Wavelength", min: 1, max: 10, step: 0.5, default: 4, unit: "m" },
    ],
    description: "Wave phenomena visualization including sine, square, interference, standing, and Doppler effects",
  },
  electromagnetism: {
    Class: AdvancedElectromagnetism3D,
    controls: [
      { param: "charge", label: "Charge", min: -5, max: 5, step: 0.5, default: 2, unit: "C" },
      { param: "current", label: "Current", min: 0.5, max: 5, step: 0.5, default: 2, unit: "A" },
      { param: "distance", label: "Distance", min: 1, max: 10, step: 0.5, default: 5, unit: "m" },
    ],
    description: "Electromagnetic phenomena with field lines, charges, magnetic dipoles, and force visualization",
  },
  optics: {
    Class: AdvancedOptics3D,
    controls: [
      { param: "refractiveIndex", label: "Refractive Index", min: 1, max: 2.5, step: 0.1, default: 1.5, unit: "" },
      { param: "angle", label: "Incident Angle", min: 0, max: 80, step: 5, default: 30, unit: "°" },
      { param: "focalLength", label: "Focal Length", min: 1, max: 10, step: 0.5, default: 5, unit: "cm" },
    ],
    description: "Optical phenomena including prisms, lenses, mirrors, refraction, and diffraction",
  },
  quantum: {
    Class: AdvancedQuantum3D,
    controls: [
      { param: "energy", label: "Energy Level", min: 1, max: 10, step: 1, default: 1, unit: "" },
      { param: "probability", label: "Probability", min: 0, max: 1, step: 0.1, default: 0.7, unit: "" },
      { param: "spinAngle", label: "Spin Angle", min: 0, max: 180, step: 10, default: 0, unit: "°" },
    ],
    description: "Quantum mechanics visualization with electron orbitals, superposition, and entanglement",
  },
  fluid: {
    Class: AdvancedFluid3D,
    controls: [
      { param: "velocity", label: "Flow Velocity", min: 0.5, max: 5, step: 0.5, default: 2, unit: "m/s" },
      { param: "viscosity", label: "Viscosity", min: 0.1, max: 2, step: 0.1, default: 1, unit: "Pa·s" },
      { param: "pressure", label: "Pressure", min: 1, max: 10, step: 0.5, default: 5, unit: "Pa" },
    ],
    description: "Fluid dynamics visualization with laminar, turbulent, and vortex flows",
  },
  thermodynamics: {
    Class: AdvancedMechanics3D,
    controls: [
      { param: "temperature", label: "Temperature", min: 0, max: 100, step: 5, default: 20, unit: "°C" },
      { param: "pressure", label: "Pressure", min: 1, max: 10, step: 0.5, default: 1, unit: "atm" },
      { param: "volume", label: "Volume", min: 1, max: 10, step: 0.5, default: 5, unit: "L" },
    ],
    description: "Thermodynamics visualization with energy distribution and molecular motion",
  },
  astro: {
    Class: CircularMotion3D,
    controls: [
      { param: "mass", label: "Orbital Mass", min: 1, max: 100, step: 5, default: 30, unit: "kg" },
      { param: "radius", label: "Orbit Radius", min: 1, max: 20, step: 1, default: 10, unit: "m" },
      { param: "angularVelocity", label: "Angular Velocity", min: 0.1, max: 2, step: 0.1, default: 0.5, unit: "rad/s" },
    ],
    description: "Circular motion and orbital mechanics visualization",
  },
  modern: {
    Class: AdvancedQuantum3D,
    controls: [
      { param: "energy", label: "Photon Energy", min: 1, max: 100, step: 5, default: 10, unit: "eV" },
      { param: "frequency", label: "Frequency", min: 10, max: 1000, step: 50, default: 100, unit: "GHz" },
    ],
    description: "Modern physics visualization with quantum effects and photon phenomena",
  },
};

/**
 * Get visualizer config for a concept based on its domain
 * Falls back to mechanics if domain is unknown
 */
function getVisualizerForConcept(conceptId: string): VisualizerConfig {
  // Extract domain from concept ID (format: "domain.concept-name")
  const domain = conceptId.split(".")[0];

  // Return domain-based config, or default to mechanics if domain unknown
  return domainConfigs[domain] || domainConfigs.mechanics;
}

/**
 * Check if a concept has a 3D visualizer
 * ALWAYS returns true - every concept gets a 3D model!
 */
export function has3DVisualizer(conceptId: string): boolean {
  return true;
}

/**
 * Get 3D visualizer config for a concept
 * ALWAYS returns a config - no concept is left without a 3D model
 */
export function get3DVisualizer(conceptId: string): VisualizerConfig {
  return getVisualizerForConcept(conceptId);
}

/**
 * Get all concept IDs that have BESPOKE 3D visualizers
 */
export function get3DConceptIds(): string[] {
  return Object.keys(domainConfigs);
}
