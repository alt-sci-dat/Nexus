"use client";

import * as THREE from "three";
import { Base3DVisualizer } from "./3d-base-visualizer";

export class AdvancedOptics3D extends Base3DVisualizer {
  constructor(container: HTMLDivElement) {
    super(container);
    this.objects = [];
  }

  initialize() {
    this.params = {
      refractiveIndex: 1.5,
      angle: 30,
      focalLength: 5,
    };

    // Clear scene
    this.objects.forEach((obj) => this.scene.remove(obj));
    this.objects = [];

    // Create prism (triangular)
    const prismGeo = new THREE.TetrahedronGeometry(2);
    const prismMat = new THREE.MeshStandardMaterial({ color: 0x64748b, transparent: true, opacity: 0.6 });
    const prism = new THREE.Mesh(prismGeo, prismMat);
    prism.position.set(0, 0, 0);
    this.scene.add(prism);
    this.objects.push(prism);

    // Light ray entering
    const rayGeo = new THREE.CylinderGeometry(0.1, 0.1, 5);
    const rayMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xfbbf24 });
    const ray = new THREE.Mesh(rayGeo, rayMat);
    ray.position.set(-5, 0, 0);
    ray.rotation.z = Math.PI / 2;
    this.scene.add(ray);
    this.objects.push(ray);

    // Refracted rays (spectrum)
    const colors = [0xff0000, 0xffa500, 0xffff00, 0x00ff00, 0x0000ff, 0x4b0082, 0x9400d3];
    for (let i = 0; i < colors.length; i++) {
      const angle = (i - 3) * 0.2;
      const spectrumRayGeo = new THREE.CylinderGeometry(0.05, 0.05, 3);
      const spectrumMat = new THREE.MeshStandardMaterial({ color: colors[i], emissive: colors[i] });
      const spectrumRay = new THREE.Mesh(spectrumRayGeo, spectrumMat);
      spectrumRay.position.set(3, angle * 3, 0);
      spectrumRay.rotation.z = Math.PI / 2;
      this.scene.add(spectrumRay);
      this.objects.push(spectrumRay);
    }
  }

  public update() {
    // Rotate prism for animation
    if (this.objects.length > 0) {
      this.objects[0].rotation.x += 0.01;
      this.objects[0].rotation.y += 0.005;
    }

    // Pulse light rays
    for (let i = 1; i < this.objects.length; i++) {
      const obj = this.objects[i] as THREE.Mesh;
      const material = obj.material as THREE.MeshStandardMaterial;
      if (material && material.emissive) {
        material.emissive.setHSL(0, 0, Math.sin(this.time * 2) * 0.5 + 0.5);
      }
    }
  }

  updateParameter(paramName: string, value: number) {
    this.params[paramName] = value;
  }
}
