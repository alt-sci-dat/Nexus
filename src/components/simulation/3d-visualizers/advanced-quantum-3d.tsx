"use client";

import * as THREE from "three";
import { Base3DVisualizer } from "./3d-base-visualizer";

export class AdvancedQuantum3D extends Base3DVisualizer {
  private electrons: THREE.Mesh[] = [];

  constructor(container: HTMLDivElement) {
    super(container);
    this.objects = [];
    this.electrons = [];
  }

  initialize() {
    this.params = {
      energy: 1,
      probability: 0.7,
      spinAngle: 0,
    };

    // Clear scene
    this.objects.forEach((obj) => this.scene.remove(obj));
    this.electrons.forEach((e) => this.scene.remove(e));
    this.objects = [];
    this.electrons = [];

    // Nucleus (red sphere)
    const nucleusGeo = new THREE.SphereGeometry(0.5, 32, 32);
    const nucleusMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.8 });
    const nucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
    nucleus.castShadow = true;
    this.scene.add(nucleus);
    this.objects.push(nucleus);

    // Orbital shells
    for (let i = 1; i <= 3; i++) {
      const shellGeo = new THREE.BufferGeometry();
      const points = [];
      for (let j = 0; j <= 64; j++) {
        const angle = (j / 64) * Math.PI * 2;
        points.push(Math.cos(angle) * i * 3, 0, Math.sin(angle) * i * 3);
      }
      shellGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(points), 3));

      const shellMat = new THREE.LineBasicMaterial({ color: 0x06b6d4, linewidth: 1 });
      const shell = new THREE.Line(shellGeo, shellMat);
      this.scene.add(shell);
      this.objects.push(shell);
    }

    // Probability cloud (wireframe sphere)
    const cloudGeo = new THREE.IcosahedronGeometry(5, 3);
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const cloud = new THREE.Mesh(cloudGeo, cloudMat);
    cloud.castShadow = true;
    this.scene.add(cloud);
    this.objects.push(cloud);

    // Electrons orbiting
    for (let i = 0; i < 3; i++) {
      const electronGeo = new THREE.SphereGeometry(0.3, 16, 16);
      const electronMat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, metalness: 0.6 });
      const electron = new THREE.Mesh(electronGeo, electronMat);
      electron.castShadow = true;
      this.scene.add(electron);
      this.electrons.push(electron);
      this.objects.push(electron);
    }
  }

  public update() {
    if (!this.electrons || !this.electrons.length) return;

    // Animate electrons in orbits
    this.electrons.forEach((electron, index) => {
      const orbitRadius = (index + 1) * 3;
      const orbitSpeed = (1 - index * 0.2) * this.params.energy * 0.5;
      const angle = (this.time * orbitSpeed + (index * Math.PI * 2) / 3) % (Math.PI * 2);

      electron.position.x = Math.cos(angle) * orbitRadius;
      electron.position.y = Math.sin(angle) * orbitRadius * 0.3;
      electron.position.z = Math.sin(angle + Math.PI / 2) * orbitRadius * 0.3;
    });

    // Pulse probability cloud
    if (this.objects.length > 3) {
      const cloud = this.objects[3] as THREE.Mesh;
      if (cloud && cloud.material instanceof THREE.MeshStandardMaterial) {
        cloud.material.opacity = 0.2 + Math.sin(this.time * 2) * 0.1;
      }
    }
  }

  updateParameter(paramName: string, value: number) {
    this.params[paramName] = value;
  }
}
