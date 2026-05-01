"use client";

import * as THREE from "three";
import { Base3DVisualizer } from "./3d-base-visualizer";

export class AdvancedWaves3D extends Base3DVisualizer {
  private waveMeshes: THREE.Mesh[] = [];

  constructor(container: HTMLDivElement) {
    super(container);
    this.objects = [];
    this.waveMeshes = [];
  }

  initialize() {
    this.params = {
      amplitude: 1,
      frequency: 1,
      velocity: 2,
      wavelength: 4,
    };

    // Clear scene
    this.waveMeshes.forEach((mesh) => this.scene.remove(mesh));
    this.objects.forEach((obj) => this.scene.remove(obj));
    this.waveMeshes = [];
    this.objects = [];

    // Create wave plane
    const geometry = new THREE.PlaneGeometry(20, 10, 100, 30);
    const material = new THREE.MeshPhongMaterial({
      color: 0x06b6d4,
      wireframe: false,
      side: THREE.DoubleSide,
    });
    const waveMesh = new THREE.Mesh(geometry, material);
    waveMesh.rotation.x = -Math.PI / 3;
    this.scene.add(waveMesh);
    this.waveMeshes.push(waveMesh);
    this.objects.push(waveMesh);

    // Store original positions for animation
    if (geometry.attributes.position instanceof THREE.BufferAttribute) {
      const positionAttribute = geometry.attributes.position as THREE.BufferAttribute;
      const positions = positionAttribute.array as Float32Array;

      // Store original positions
      const originalPositions = new Float32Array(positions);
      (waveMesh as any).userData.originalPositions = originalPositions;
    }
  }

  public update() {
    if (!this.waveMeshes || !this.waveMeshes.length) return;

    const waveMesh = this.waveMeshes[0];
    const geometry = waveMesh.geometry as THREE.PlaneGeometry;

    if (!geometry.attributes.position || !(geometry.attributes.position instanceof THREE.BufferAttribute)) return;

    const positionAttribute = geometry.attributes.position as THREE.BufferAttribute;
    const positions = positionAttribute.array as Float32Array;
    const originalPositions = (waveMesh as any).userData.originalPositions;

    if (!originalPositions) return;

    // Update positions based on wave equation
    for (let i = 0; i < positions.length; i += 3) {
      const x = originalPositions[i];
      const y = originalPositions[i + 1];

      // Wave equation: z = A * sin(kx - ωt)
      const k = (2 * Math.PI) / this.params.wavelength;
      const omega = 2 * Math.PI * this.params.frequency;
      const z = this.params.amplitude * Math.sin(k * x - omega * this.time);

      positions[i + 2] = z;
    }

    positionAttribute.needsUpdate = true;
    geometry.computeVertexNormals();
  }

  updateParameter(paramName: string, value: number) {
    this.params[paramName] = value;
  }
}
