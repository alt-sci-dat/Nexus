"use client";

import * as THREE from "three";
import { BaseModel } from "./base-model";

export class GasParticlesModel extends BaseModel {
  private particles: { mesh: THREE.Mesh; vel: THREE.Vector3 }[] = [];
  private gasBox!: THREE.Mesh;
  private boxSize = 4;

  initialize() {
    this.scene.background = new THREE.Color(0x05070d);
    const boxGeo = new THREE.BoxGeometry(this.boxSize, this.boxSize, this.boxSize);
    const boxMat = new THREE.MeshStandardMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.12, side: THREE.DoubleSide, wireframe: false });
    this.gasBox = new THREE.Mesh(boxGeo, boxMat);
    this.scene.add(this.gasBox);
    const wire = new THREE.LineSegments(new THREE.EdgesGeometry(boxGeo), new THREE.LineBasicMaterial({ color: 0x93c5fd }));
    this.scene.add(wire);

    const N = 60;
    for (let i = 0; i < N; i++) {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xfacc15, emissiveIntensity: 0.4 }),
      );
      m.position.set((Math.random() - 0.5) * this.boxSize, (Math.random() - 0.5) * this.boxSize, (Math.random() - 0.5) * this.boxSize);
      const v = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize().multiplyScalar(2);
      this.scene.add(m);
      this.particles.push({ mesh: m, vel: v });
    }
    this.camera.position.set(6, 5, 8);
    this.camera.lookAt(0, 0, 0);
  }

  update(_t: number) {
    const T = this.params.temperature ?? 300;
    const speedScale = Math.sqrt(T / 300);
    const half = this.boxSize / 2;
    this.particles.forEach((p) => {
      p.mesh.position.addScaledVector(p.vel, 0.02 * speedScale);
      ["x", "y", "z"].forEach((axis) => {
        const pos = p.mesh.position[axis as "x"];
        if (pos > half || pos < -half) {
          p.vel[axis as "x"] *= -1;
          p.mesh.position[axis as "x"] = THREE.MathUtils.clamp(pos, -half, half);
        }
      });
      const speed = p.vel.length() * speedScale;
      const hue = 0.6 - Math.min(speed / 4, 0.6);
      (p.mesh.material as THREE.MeshStandardMaterial).color.setHSL(hue, 0.8, 0.55);
      (p.mesh.material as THREE.MeshStandardMaterial).emissive.setHSL(hue, 0.8, 0.5);
    });
  }
}

export class CarnotCycleModel extends BaseModel {
  private piston!: THREE.Mesh;
  private cylinder!: THREE.Mesh;
  private hotPlate!: THREE.Mesh;
  private coldPlate!: THREE.Mesh;
  private pvCurve!: THREE.Line;
  private indicator!: THREE.Mesh;

  initialize() {
    this.addGroundPlane(0x0b1120);
    const cylGeo = new THREE.CylinderGeometry(0.8, 0.8, 3, 24, 1, true);
    const cylMat = new THREE.MeshStandardMaterial({ color: 0x9ca3af, side: THREE.DoubleSide, transparent: true, opacity: 0.4 });
    this.cylinder = new THREE.Mesh(cylGeo, cylMat);
    this.cylinder.position.set(-3, 1.5, 0);
    this.scene.add(this.cylinder);

    const pistonGeo = new THREE.CylinderGeometry(0.78, 0.78, 0.3, 24);
    const pistonMat = new THREE.MeshStandardMaterial({ color: 0xef4444 });
    this.piston = new THREE.Mesh(pistonGeo, pistonMat);
    this.piston.position.set(-3, 2, 0);
    this.scene.add(this.piston);

    const hotGeo = new THREE.BoxGeometry(2, 0.2, 1.6);
    this.hotPlate = new THREE.Mesh(hotGeo, new THREE.MeshStandardMaterial({ color: 0xdc2626, emissive: 0xdc2626, emissiveIntensity: 0.3 }));
    this.hotPlate.position.set(-3, -0.1, -1.5);
    this.scene.add(this.hotPlate);

    this.coldPlate = new THREE.Mesh(hotGeo.clone(), new THREE.MeshStandardMaterial({ color: 0x60a5fa, emissive: 0x60a5fa, emissiveIntensity: 0.3 }));
    this.coldPlate.position.set(-3, -0.1, 1.5);
    this.scene.add(this.coldPlate);

    const points: THREE.Vector3[] = [];
    for (let i = 0; i < 200; i++) {
      const u = i / 199;
      const angle = u * Math.PI * 2;
      const V = 1.5 + 0.8 * Math.cos(angle);
      const P = 1.5 + 0.8 * Math.sin(angle);
      points.push(new THREE.Vector3(2 + V * 1.2, P * 1.2, 0));
    }
    this.pvCurve = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: 0x22d3ee }));
    this.scene.add(this.pvCurve);

    this.indicator = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), new THREE.MeshStandardMaterial({ color: 0xfde047, emissive: 0xfde047, emissiveIntensity: 0.7 }));
    this.scene.add(this.indicator);

    const labelMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
    void labelMat;

    this.camera.position.set(2, 4, 8);
    this.camera.lookAt(0, 1.5, 0);
  }

  update(t: number) {
    const speed = this.params.cycleSpeed ?? 0.4;
    const u = (t * speed) % 1;
    const angle = u * Math.PI * 2;
    const V = 1.5 + 0.8 * Math.cos(angle);
    const P = 1.5 + 0.8 * Math.sin(angle);
    this.piston.position.y = 1.6 + V * 0.5;
    this.indicator.position.set(2 + V * 1.2, P * 1.2, 0);
    const hotMat = this.hotPlate.material as THREE.MeshStandardMaterial;
    const coldMat = this.coldPlate.material as THREE.MeshStandardMaterial;
    hotMat.emissiveIntensity = 0.2 + (u < 0.25 ? 0.6 : 0);
    coldMat.emissiveIntensity = 0.2 + (u >= 0.5 && u < 0.75 ? 0.6 : 0);
  }
}
