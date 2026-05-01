"use client";

import * as THREE from "three";
import { BaseModel } from "./base-model";

export class PressureColumnModel extends BaseModel {
  private column!: THREE.Mesh;
  private fish!: THREE.Mesh;
  private gauges: { mesh: THREE.Mesh; baseLen: number; depth: number }[] = [];

  initialize() {
    this.addGroundPlane(0x0f172a);
    const colGeo = new THREE.BoxGeometry(2.4, 6, 1);
    const colMat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.55 });
    this.column = new THREE.Mesh(colGeo, colMat);
    this.column.position.set(0, 3, 0);
    this.scene.add(this.column);

    const fishGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const fishMat = new THREE.MeshStandardMaterial({ color: 0xfacc15 });
    this.fish = new THREE.Mesh(fishGeo, fishMat);
    this.fish.position.set(0, 4, 0);
    this.scene.add(this.fish);

    for (let i = 0; i < 5; i++) {
      const depth = i + 0.5;
      const baseLen = 0.3 + depth * 0.25;
      const arrowMat = new THREE.MeshStandardMaterial({ color: 0xf87171 });
      const arrowGeo = new THREE.BoxGeometry(baseLen, 0.06, 0.06);
      const arrow = new THREE.Mesh(arrowGeo, arrowMat);
      arrow.position.set(1.2 + baseLen / 2, 6 - depth * 1.1, 0);
      this.scene.add(arrow);
      this.gauges.push({ mesh: arrow, baseLen, depth });
    }

    this.addLabel("Surface", new THREE.Vector3(0, 6, 0), { color: "#7dd3fc", scale: 0.5, offsetY: 0.3 });
    this.addLabel("Fluid column", new THREE.Vector3(-1.4, 3, 0), { color: "#bae6fd", scale: 0.55, offsetY: 0 });
    this.addLabel("Pressure ↑", new THREE.Vector3(2.4, 2, 0), { color: "#fca5a5", scale: 0.5, offsetY: 0 });
    this.camera.position.set(5, 4, 6);
    this.camera.lookAt(0, 3, 0);
  }

  update(t: number) {
    const density = this.params.density ?? 1000;
    const g = this.params.gravity ?? 9.8;
    this.gauges.forEach((gauge) => {
      const p = density * g * gauge.depth * 0.0003;
      const len = THREE.MathUtils.clamp(p, 0.2, 3);
      gauge.mesh.scale.x = len;
      gauge.mesh.position.x = 1.2 + (gauge.baseLen * len) / 2;
    });
    this.fish.position.y = 4 + Math.sin(t * 0.8) * 0.5;
    this.fish.position.x = Math.cos(t * 0.5) * 0.6;
  }
}

export class ConvexLensModel extends BaseModel {
  private lens!: THREE.Mesh;
  private rays: THREE.Line[] = [];
  private focalDot!: THREE.Mesh;
  private object!: THREE.Mesh;

  initialize() {
    this.addGroundPlane(0x111827);
    const lensGeo = new THREE.SphereGeometry(1.4, 32, 32);
    const lensMat = new THREE.MeshStandardMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.45 });
    this.lens = new THREE.Mesh(lensGeo, lensMat);
    this.lens.scale.set(0.25, 1, 1);
    this.lens.position.set(0, 1.5, 0);
    this.scene.add(this.lens);

    this.focalDot = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xfde047, emissive: 0xfde047, emissiveIntensity: 1 }),
    );
    this.focalDot.position.set(2, 1.5, 0);
    this.scene.add(this.focalDot);

    this.object = new THREE.Mesh(
      new THREE.ConeGeometry(0.2, 0.8, 16),
      new THREE.MeshStandardMaterial({ color: 0xfb923c }),
    );
    this.object.position.set(-3, 2, 0);
    this.object.rotation.z = Math.PI;
    this.scene.add(this.object);

    for (let i = 0; i < 5; i++) {
      const offY = 1.5 + (i - 2) * 0.18;
      const points = [new THREE.Vector3(-5, offY, 0), new THREE.Vector3(0, offY, 0), new THREE.Vector3(2, 1.5, 0), new THREE.Vector3(6, 1.5 - (offY - 1.5) * 1.5, 0)];
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({ color: 0xfde047 });
      const line = new THREE.Line(geo, mat);
      this.scene.add(line);
      this.rays.push(line);
    }

    this.addLabel("Object", new THREE.Vector3(-3, 2, 0), { color: "#fb923c", scale: 0.5, offsetY: 0.4 });
    this.addLabel("Lens", new THREE.Vector3(0, 1.5, 0), { color: "#93c5fd", scale: 0.45, offsetY: 1.4 });
    this.addLabel("F", new THREE.Vector3(2, 1.5, 0), { color: "#fde047", scale: 0.4, offsetY: 0.4 });
    this.addLabel("Image plane", new THREE.Vector3(5, 1.5, 0), { color: "#a3a3a3", scale: 0.45, offsetY: 0.5 });
    this.camera.position.set(0, 3, 8);
    this.camera.lookAt(0, 1.5, 0);
  }

  update() {
    const f = this.params.focalLength ?? 2;
    this.focalDot.position.x = f;
    const objX = -(this.params.objectDistance ?? 3);
    this.object.position.x = objX;
    this.rays.forEach((line, i) => {
      const offY = 1.5 + (i - 2) * 0.18;
      const points = [new THREE.Vector3(objX - 1, offY, 0), new THREE.Vector3(0, offY, 0), new THREE.Vector3(f, 1.5, 0), new THREE.Vector3(6, 1.5 - (offY - 1.5) * (1 + (6 - f) / 3), 0)];
      line.geometry.dispose();
      line.geometry = new THREE.BufferGeometry().setFromPoints(points);
    });
  }
}

export class SimpleCircuitModel extends BaseModel {
  private bulb!: THREE.Mesh;
  private bulbLight!: THREE.PointLight;
  private electrons: THREE.Mesh[] = [];
  private path: THREE.Vector3[] = [];

  initialize() {
    this.addGroundPlane(0x0b1120);
    const battery = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 1, 0.4),
      new THREE.MeshStandardMaterial({ color: 0x16a34a }),
    );
    battery.position.set(-3, 0.5, 0);
    battery.castShadow = true;
    this.scene.add(battery);

    const bulbGeo = new THREE.SphereGeometry(0.4, 24, 24);
    const bulbMat = new THREE.MeshStandardMaterial({ color: 0xfde047, emissive: 0xfde047, emissiveIntensity: 0.2 });
    this.bulb = new THREE.Mesh(bulbGeo, bulbMat);
    this.bulb.position.set(3, 1.6, 0);
    this.scene.add(this.bulb);
    this.bulbLight = new THREE.PointLight(0xfde047, 0.5, 8);
    this.bulb.add(this.bulbLight);

    this.path = [
      new THREE.Vector3(-3, 1, 0),
      new THREE.Vector3(-3, 2, 0),
      new THREE.Vector3(3, 2, 0),
      new THREE.Vector3(3, 1.6, 0),
      new THREE.Vector3(3, 0.5, 0),
      new THREE.Vector3(-3, 0.5, 0),
      new THREE.Vector3(-3, 1, 0),
    ];
    const wireGeo = new THREE.BufferGeometry().setFromPoints(this.path);
    const wireMat = new THREE.LineBasicMaterial({ color: 0x9ca3af });
    const wire = new THREE.Line(wireGeo, wireMat);
    this.scene.add(wire);

    for (let i = 0; i < 12; i++) {
      const e = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0x60a5fa, emissive: 0x60a5fa, emissiveIntensity: 0.6 }),
      );
      this.scene.add(e);
      this.electrons.push(e);
    }

    this.addLabel("Battery", new THREE.Vector3(-3, 0.5, 0), { color: "#86efac", scale: 0.5, offsetY: 0.7 });
    this.addLabel("Bulb", new THREE.Vector3(3, 1.6, 0), { color: "#fde047", scale: 0.5, offsetY: 0.6 });
    this.addLabel("Wire", new THREE.Vector3(0, 2, 0), { color: "#cbd5e1", scale: 0.45, offsetY: 0.3 });
    this.addLabel("e⁻ flow", new THREE.Vector3(-2.5, 2.2, 0), { color: "#93c5fd", scale: 0.4, offsetY: 0.3 });
    this.camera.position.set(0, 3, 7);
    this.camera.lookAt(0, 1.2, 0);
  }

  update(t: number) {
    const voltage = this.params.voltage ?? 6;
    const resistance = this.params.resistance ?? 3;
    const current = voltage / resistance;
    this.bulbLight.intensity = THREE.MathUtils.clamp(current * 0.6, 0, 4);
    (this.bulb.material as THREE.MeshStandardMaterial).emissiveIntensity = THREE.MathUtils.clamp(current * 0.4, 0.2, 2);
    this.electrons.forEach((e, i) => {
      const u = ((t * current * 0.05) + i / this.electrons.length) % 1;
      const idx = u * (this.path.length - 1);
      const i0 = Math.floor(idx);
      const f = idx - i0;
      const p0 = this.path[i0];
      const p1 = this.path[Math.min(i0 + 1, this.path.length - 1)];
      e.position.lerpVectors(p0, p1, f);
    });
  }
}

export class ProjectileArcModel extends BaseModel {
  private ball!: THREE.Mesh;
  private cannon!: THREE.Group;
  private trajectory!: THREE.Line;

  initialize() {
    this.addGroundPlane(0x1f2937);
    this.cannon = new THREE.Group();
    const barrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 1.4, 16),
      new THREE.MeshStandardMaterial({ color: 0x374151 }),
    );
    barrel.rotation.z = -Math.PI / 4;
    barrel.position.set(0.5, 0.5, 0);
    this.cannon.add(barrel);
    const wheel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 0.2, 16),
      new THREE.MeshStandardMaterial({ color: 0x6b7280 }),
    );
    wheel.rotation.z = Math.PI / 2;
    this.cannon.add(wheel);
    this.cannon.position.set(-4, 0.5, 0);
    this.scene.add(this.cannon);

    const ballGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const ballMat = new THREE.MeshStandardMaterial({ color: 0xef4444 });
    this.ball = new THREE.Mesh(ballGeo, ballMat);
    this.ball.castShadow = true;
    this.scene.add(this.ball);

    const trajGeo = new THREE.BufferGeometry();
    const trajMat = new THREE.LineDashedMaterial({ color: 0x22d3ee, dashSize: 0.2, gapSize: 0.1 });
    this.trajectory = new THREE.Line(trajGeo, trajMat);
    this.scene.add(this.trajectory);

    this.addLabel("Cannon", new THREE.Vector3(-4, 1, 0), { color: "#cbd5e1", scale: 0.5, offsetY: 0.4 });
    this.addLabel("Projectile", new THREE.Vector3(2, 3.5, 0), { color: "#fca5a5", scale: 0.45, offsetY: 0.3 });
    this.addLabel("Trajectory", new THREE.Vector3(0, 4.5, 0), { color: "#67e8f9", scale: 0.45, offsetY: 0 });
    this.camera.position.set(0, 4, 10);
    this.camera.lookAt(0, 2, 0);
    this.recomputeTrajectory();
  }

  protected onParamChange() {
    this.recomputeTrajectory();
  }

  private recomputeTrajectory() {
    const v = this.params.speed ?? 12;
    const angle = ((this.params.angle ?? 45) * Math.PI) / 180;
    const g = this.params.gravity ?? 9.8;
    const points: THREE.Vector3[] = [];
    for (let t = 0; t <= 4; t += 0.05) {
      const x = -4 + v * Math.cos(angle) * t;
      const y = 0.5 + v * Math.sin(angle) * t - 0.5 * g * t * t;
      if (y < 0.05) break;
      points.push(new THREE.Vector3(x, y, 0));
    }
    this.trajectory.geometry.dispose();
    this.trajectory.geometry = new THREE.BufferGeometry().setFromPoints(points);
    this.trajectory.computeLineDistances();
  }

  update(t: number) {
    const v = this.params.speed ?? 12;
    const angle = ((this.params.angle ?? 45) * Math.PI) / 180;
    const g = this.params.gravity ?? 9.8;
    const flight = (2 * v * Math.sin(angle)) / g;
    const tt = (t * 0.6) % flight;
    const x = -4 + v * Math.cos(angle) * tt;
    const y = 0.5 + v * Math.sin(angle) * tt - 0.5 * g * tt * tt;
    this.ball.position.set(x, Math.max(y, 0.18), 0);
  }
}

export class ForceCartModel extends BaseModel {
  private cart!: THREE.Group;
  private forceArrow!: THREE.ArrowHelper;
  private accelArrow!: THREE.ArrowHelper;

  initialize() {
    this.addGroundPlane(0x111827);
    this.cart = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.6, 0.8),
      new THREE.MeshStandardMaterial({ color: 0x6366f1 }),
    );
    body.castShadow = true;
    this.cart.add(body);
    for (const sx of [-0.5, 0.5]) {
      for (const sz of [-0.35, 0.35]) {
        const wheel = new THREE.Mesh(
          new THREE.CylinderGeometry(0.2, 0.2, 0.12, 16),
          new THREE.MeshStandardMaterial({ color: 0x111827 }),
        );
        wheel.rotation.x = Math.PI / 2;
        wheel.position.set(sx, -0.4, sz);
        this.cart.add(wheel);
      }
    }
    this.cart.position.set(-3, 0.4, 0);
    this.scene.add(this.cart);

    this.forceArrow = this.makeArrow(new THREE.Vector3(1, 0, 0), this.cart.position.clone(), 1, 0xfde047);
    this.accelArrow = this.makeArrow(new THREE.Vector3(1, 0, 0), this.cart.position.clone().add(new THREE.Vector3(0, 0.7, 0)), 1, 0x22d3ee);

    this.addLabel("Cart (m)", new THREE.Vector3(-3, 0.4, 0), { color: "#a5b4fc", scale: 0.45, offsetY: 0.7 });
    this.addLabel("F", new THREE.Vector3(-2, 0.4, 0), { color: "#fde047", scale: 0.4, offsetY: 0 });
    this.addLabel("a", new THREE.Vector3(-3, 1, 0), { color: "#67e8f9", scale: 0.4, offsetY: 0 });
    this.camera.position.set(0, 3, 7);
    this.camera.lookAt(0, 0.5, 0);
  }

  update(t: number) {
    const force = this.params.force ?? 8;
    const mass = this.params.mass ?? 2;
    const a = force / mass;
    const cycle = 5;
    const tt = (t * 0.8) % cycle;
    const x = -3 + 0.5 * a * tt * tt * 0.05;
    const clamped = Math.min(x, 4);
    this.cart.position.x = clamped;
    this.forceArrow.position.set(clamped + 0.7, 0.4, 0);
    this.forceArrow.setLength(THREE.MathUtils.clamp(0.4 + force * 0.15, 0.4, 3), 0.4, 0.25);
    this.accelArrow.position.set(clamped, 1, 0);
    this.accelArrow.setLength(THREE.MathUtils.clamp(0.4 + a * 0.3, 0.4, 3), 0.3, 0.2);
  }
}

export class OhmsCircuitModel extends BaseModel {
  private bulb!: THREE.Mesh;
  private bulbLight!: THREE.PointLight;
  private resistor!: THREE.Mesh;
  private electrons: THREE.Mesh[] = [];
  private path: THREE.Vector3[] = [];

  initialize() {
    this.addGroundPlane(0x0b1120);
    const battery = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 1.2, 0.4),
      new THREE.MeshStandardMaterial({ color: 0x16a34a }),
    );
    battery.position.set(-3, 0.6, 0);
    this.scene.add(battery);

    this.resistor = new THREE.Mesh(
      new THREE.BoxGeometry(1, 0.3, 0.3),
      new THREE.MeshStandardMaterial({ color: 0xb45309 }),
    );
    this.resistor.position.set(0, 2.2, 0);
    this.scene.add(this.resistor);

    this.bulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0xfde047, emissive: 0xfde047, emissiveIntensity: 0.2 }),
    );
    this.bulb.position.set(3, 1.6, 0);
    this.scene.add(this.bulb);
    this.bulbLight = new THREE.PointLight(0xfde047, 0.5, 8);
    this.bulb.add(this.bulbLight);

    this.path = [
      new THREE.Vector3(-3, 1.2, 0),
      new THREE.Vector3(-3, 2.2, 0),
      new THREE.Vector3(3, 2.2, 0),
      new THREE.Vector3(3, 1.6, 0),
      new THREE.Vector3(3, 0.6, 0),
      new THREE.Vector3(-3, 0.6, 0),
      new THREE.Vector3(-3, 1.2, 0),
    ];
    const wire = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(this.path),
      new THREE.LineBasicMaterial({ color: 0x9ca3af }),
    );
    this.scene.add(wire);

    for (let i = 0; i < 14; i++) {
      const e = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0x60a5fa, emissive: 0x60a5fa, emissiveIntensity: 0.6 }),
      );
      this.scene.add(e);
      this.electrons.push(e);
    }

    this.addLabel("Battery V", new THREE.Vector3(-3, 0.6, 0), { color: "#86efac", scale: 0.5, offsetY: 0.9 });
    this.addLabel("Resistor R", new THREE.Vector3(0, 2.2, 0), { color: "#fbbf24", scale: 0.5, offsetY: 0.4 });
    this.addLabel("Bulb", new THREE.Vector3(3, 1.6, 0), { color: "#fde047", scale: 0.45, offsetY: 0.6 });
    this.camera.position.set(0, 3, 7);
    this.camera.lookAt(0, 1.4, 0);
  }

  update(t: number) {
    const V = this.params.voltage ?? 9;
    const R = this.params.resistance ?? 3;
    const I = V / R;
    this.bulbLight.intensity = THREE.MathUtils.clamp(I * 0.5, 0, 5);
    (this.bulb.material as THREE.MeshStandardMaterial).emissiveIntensity = THREE.MathUtils.clamp(I * 0.3, 0.1, 2);
    this.resistor.scale.x = THREE.MathUtils.clamp(R / 3, 0.5, 3);
    this.electrons.forEach((e, i) => {
      const u = ((t * I * 0.04) + i / this.electrons.length) % 1;
      const idx = u * (this.path.length - 1);
      const i0 = Math.floor(idx);
      const f = idx - i0;
      const p0 = this.path[i0];
      const p1 = this.path[Math.min(i0 + 1, this.path.length - 1)];
      e.position.lerpVectors(p0, p1, f);
    });
  }
}
