import type { Concept } from "@/types/concept";
import { mechanicsConcepts } from "./mechanics";
import { emConcepts } from "./electromagnetism";
import { opticsConcepts } from "./optics";
import { wavesConcepts } from "./waves";
import { fluidConcepts } from "./fluid";
import { astroConcepts } from "./astro";
import { quantumConcepts } from "./quantum";
import { propulsionConcepts } from "./propulsion";
import { thermoConcepts } from "./thermo";
import { nuclearParticleConcepts } from "./nuclear-particle";
import { extraConcepts } from "./extra";
import { extraConceptsTwo } from "./extra-2";

export const concepts: Concept[] = [
  ...mechanicsConcepts,
  ...emConcepts,
  ...opticsConcepts,
  ...wavesConcepts,
  ...fluidConcepts,
  ...astroConcepts,
  ...quantumConcepts,
  ...propulsionConcepts,
  ...thermoConcepts,
  ...nuclearParticleConcepts,
  ...extraConcepts,
  ...extraConceptsTwo,
];
