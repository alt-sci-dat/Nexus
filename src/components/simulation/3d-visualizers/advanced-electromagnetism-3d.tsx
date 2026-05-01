"use client";

import * as THREE from "three";
import { Base3DVisualizer } from "./3d-base-visualizer";

export class AdvancedElectromagnetism3D extends Base3DVisualizer {
  constructor(container: HTMLDivElement) {
    super(container);
    this.objects = [];
  }

  initialize() {
    this.params = {
      charge: 2,
      current: 2,
      distance: 5,
    };

    // Clear scene
    this.objects.forEach((obj) => this.scene.remove(obj));
    this.objects = [];

    // Positive charge (red sphere)
    const posChargeGeo = new THREE.SphereGeometry(0.5, 32, 32);
    const posChargeMat = new THREE.MeshStandardMaterial({ color: 0xff0000, metalness: 0.8 });
    const posCharge = new THREE.Mesh(posChargeGeo, posChargeMat);
    posCharge.position.set(-3, 0, 0);
    posCharge.castShadow = true;
    this.scene.add(posCharge);
    this.objects.push(posCharge);

    // Negative charge (blue sphere)
    const negChargeGeo = new THREE.SphereGeometry(0.5, 32, 32);
    const negChargeMat = new THREE.MeshStandardMaterial({ color: 0x0000ff, metalness: 0.8 });
    const negCharge = new THREE.Mesh(negChargeGeo, negChargeMat);
    negCharge.position.set(3, 0, 0);
    negCharge.castShadow = true;
    this.scene.add(negCharge);
    this.objects.push(negCharge);

    // Electric field lines (radial)
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const lineGeo = new THREE.BufferGeometry();
      const points = [];

      // Lines from positive charge
      for (let r = 0; r <= 5; r += 0.5) {
        points.push(Math.cos(angle) * r - 3, Math.sin(angle) * r, 0);
      }

      lineGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(points), 3));
      const lineMat = new THREE.LineBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.6 });
      const line = new THREE.Line(lineGeo, lineMat);
      this.scene.add(line);
      this.objects.push(line);
    }

    // Magnetic field (concentric circles from wire)
    const wireGeo = new THREE.CylinderGeometry(0.2, 0.2, 15);
    const wireMat = new THREE.MeshStandardMaterial({ color: 0x64748b });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    wire.rotation.z = Math.PI / 2;
    wire.position.set(0, -5, 0);
    wire.castShadow = true;
    this.scene.add(wire);
    this.objects.push(wire);

    // Magnetic field rings
    for (let i = 1; i <= 4; i++) {
      const ringGeo = new THREE.TorusGeometry(i * 2, 0.1, 16, 32);
      const ringMat = new THREE.MeshStandardMaterial({ color: 0xa78bfa, emissive: 0xa78bfa, transparent: true, opacity: 0.4 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(0, -5, 0);
      ring.rotation.y = Math.PI / 2;
      this.scene.add(ring);
      this.objects.push(ring);
    }
  }

  public update() {
    // Pulse field lines
    for (let i = 1; i < 13; i++) {
      if (this.objects[i]) {
        const line = this.objects[i] as THREE.Line;
        if (line.material instanceof THREE.LineBasicMaterial) {
          line.material.opacity = 0.3 + Math.sin(this.time * 2 + i) * 0.3;
        }
      }
    }

    // Rotate magnetic field
    if (this.objects.length > 13) {
      for (let i = 14; i < this.objects.length; i++) {
        this.objects[i].rotation.x += 0.01;
      }
    }
  }

  updateParameter(paramName: string, value: number) {
    this.params[paramName] = value;
  }
}
