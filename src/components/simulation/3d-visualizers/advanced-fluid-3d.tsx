"use client";

import * as THREE from "three";
import { Base3DVisualizer } from "./3d-base-visualizer";

export class AdvancedFluid3D extends Base3DVisualizer {
  private particles: THREE.Mesh[] = [];

  constructor(container: HTMLDivElement) {
    super(container);
    this.objects = [];
    this.particles = [];
  }

  initialize() {
    this.params = {
      velocity: 2,
      viscosity: 1,
      pressure: 5,
    };

    // Clear scene
    this.objects.forEach((obj) => this.scene.remove(obj));
    this.particles.forEach((p) => this.scene.remove(p));
    this.objects = [];
    this.particles = [];

    // Pipe structure
    const pipeGeo = new THREE.CylinderGeometry(1, 1, 15, 32);
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0x4b5563, metalness: 0.6 });
    const pipe = new THREE.Mesh(pipeGeo, pipeMat);
    pipe.rotation.z = Math.PI / 2;
    pipe.castShadow = true;
    this.scene.add(pipe);
    this.objects.push(pipe);

    // Inlet
    const inletGeo = new THREE.SphereGeometry(1.5, 16, 16);
    const inletMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x06b6d4 });
    const inlet = new THREE.Mesh(inletGeo, inletMat);
    inlet.position.set(-8, 0, 0);
    inlet.castShadow = true;
    this.scene.add(inlet);
    this.objects.push(inlet);

    // Outlet
    const outletGeo = new THREE.SphereGeometry(1.5, 16, 16);
    const outletMat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, emissive: 0x0ea5e9 });
    const outlet = new THREE.Mesh(outletGeo, outletMat);
    outlet.position.set(8, 0, 0);
    outlet.castShadow = true;
    this.scene.add(outlet);
    this.objects.push(outlet);

    // Fluid particles
    const particleGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const particleMat = new THREE.MeshStandardMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.7 });

    for (let i = 0; i < 50; i++) {
      const particle = new THREE.Mesh(particleGeo, particleMat.clone());
      particle.position.x = Math.random() * 12 - 6;
      particle.position.y = (Math.random() - 0.5) * 2;
      particle.position.z = (Math.random() - 0.5) * 2;
      this.scene.add(particle);
      this.particles.push(particle);
      this.objects.push(particle);
    }
  }

  public update() {
    if (!this.particles || !this.particles.length) return;

    // Animate particles through pipe
    this.particles.forEach((particle, idx) => {
      const speed = this.params.velocity * 0.05;
      particle.position.x += speed;

      // Wrap around and add turbulence
      if (particle.position.x > 8) {
        particle.position.x = -8;
        particle.position.y = (Math.random() - 0.5) * 2;
        particle.position.z = (Math.random() - 0.5) * 2;
      }

      // Add turbulence based on viscosity
      const turbulence = 1 - this.params.viscosity * 0.2;
      particle.position.y += (Math.random() - 0.5) * 0.1 * turbulence;
      particle.position.z += (Math.random() - 0.5) * 0.1 * turbulence;

      // Keep particles in pipe bounds
      particle.position.y = Math.max(-0.8, Math.min(0.8, particle.position.y));
      particle.position.z = Math.max(-0.8, Math.min(0.8, particle.position.z));
    });

    // Pulse inlets/outlets
    if (this.objects.length > 2) {
      const inlet = this.objects[1] as THREE.Mesh;
      const outlet = this.objects[2] as THREE.Mesh;
      if (inlet && inlet.material instanceof THREE.MeshStandardMaterial) {
        inlet.material.emissive.setHSL(0.5, 1, Math.sin(this.time * 2) * 0.5 + 0.5);
      }
      if (outlet && outlet.material instanceof THREE.MeshStandardMaterial) {
        outlet.material.emissive.setHSL(0.5, 1, Math.cos(this.time * 2) * 0.5 + 0.5);
      }
    }
  }

  updateParameter(paramName: string, value: number) {
    this.params[paramName] = value;
  }
}
