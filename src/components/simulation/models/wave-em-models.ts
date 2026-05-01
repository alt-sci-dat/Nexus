"use client";

import * as THREE from "three";
import { BaseModel } from "./base-model";

export class MagnetCoilInductionModel extends BaseModel {
  private coil!: THREE.Group;
  private magnet!: THREE.Group;
  private currentArrow!: THREE.ArrowHelper;
  private led!: THREE.Mesh;
  private ledMat!: THREE.MeshStandardMaterial;

  initialize() {
    this.addGroundPlane(0x0f172a);
    this.coil = new THREE.Group();
    const turns = 18;
    for (let i = 0; i < turns; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.9, 0.05, 8, 32),
        new THREE.MeshStandardMaterial({ color: 0xb45309 }),
      );
      ring.rotation.y = Math.PI / 2;
      ring.position.x = (i - turns / 2) * 0.12;
      this.coil.add(ring);
    }
    this.coil.position.set(2, 1.5, 0);
    this.scene.add(this.coil);

    this.magnet = new THREE.Group();
    const north = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.4), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
    north.position.x = -0.3;
    const south = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.4), new THREE.MeshStandardMaterial({ color: 0x60a5fa }));
    south.position.x = 0.3;
    this.magnet.add(north, south);
    this.magnet.position.set(-3, 1.5, 0);
    this.scene.add(this.magnet);

    this.currentArrow = this.makeArrow(new THREE.Vector3(0, 1, 0), new THREE.Vector3(2, 2.6, 0), 0.6, 0xfacc15);

    const ledGeo = new THREE.SphereGeometry(0.3, 24, 24);
    this.ledMat = new THREE.MeshStandardMaterial({ color: 0x84cc16, emissive: 0x84cc16, emissiveIntensity: 0.1 });
    this.led = new THREE.Mesh(ledGeo, this.ledMat);
    this.led.position.set(2, 3.2, 0);
    this.scene.add(this.led);

    this.addLabel("Magnet", new THREE.Vector3(-3, 1.5, 0), { color: "#fca5a5", scale: 0.5, offsetY: 0.6 });
    this.addLabel("Coil (N turns)", new THREE.Vector3(2, 1.5, 0), { color: "#fdba74", scale: 0.5, offsetY: 1.2 });
    this.addLabel("Induced I", new THREE.Vector3(2, 2.6, 0), { color: "#fde047", scale: 0.45, offsetY: 0.4 });
    this.addLabel("LED", new THREE.Vector3(2, 3.2, 0), { color: "#bbf7d0", scale: 0.4, offsetY: 0.4 });
    this.camera.position.set(0, 4, 7);
    this.camera.lookAt(0, 1.5, 0);
  }

  update(t: number) {
    const speed = this.params.magnetSpeed ?? 1;
    this.magnet.position.x = -3 + Math.sin(t * speed) * 1.6;
    const v = Math.cos(t * speed) * speed;
    const emf = Math.abs(v) * (this.params.turns ?? 18);
    this.ledMat.emissiveIntensity = THREE.MathUtils.clamp(emf * 0.05, 0.05, 2);
    this.currentArrow.setDirection(new THREE.Vector3(0, v >= 0 ? 1 : -1, 0));
    this.currentArrow.setLength(THREE.MathUtils.clamp(0.3 + emf * 0.05, 0.3, 1.5), 0.2, 0.15);
  }
}

export class SnellRefractionModel extends BaseModel {
  private incident!: THREE.Line;
  private refracted!: THREE.Line;
  private surface!: THREE.Mesh;
  private normal!: THREE.Line;

  initialize() {
    this.addGroundPlane(0x0b1120);
    const surfaceGeo = new THREE.BoxGeometry(8, 3, 4);
    const surfaceMat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.45 });
    this.surface = new THREE.Mesh(surfaceGeo, surfaceMat);
    this.surface.position.set(0, -1.5, 0);
    this.scene.add(this.surface);

    const incidentGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-3, 3, 0), new THREE.Vector3(0, 0, 0)]);
    this.incident = new THREE.Line(incidentGeo, new THREE.LineBasicMaterial({ color: 0xfde047 }));
    this.scene.add(this.incident);

    const refractedGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(2, -2.8, 0)]);
    this.refracted = new THREE.Line(refractedGeo, new THREE.LineBasicMaterial({ color: 0x22d3ee }));
    this.scene.add(this.refracted);

    const normalGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 3, 0), new THREE.Vector3(0, -3, 0)]);
    this.normal = new THREE.Line(normalGeo, new THREE.LineDashedMaterial({ color: 0xa3a3a3, dashSize: 0.2, gapSize: 0.1 }));
    this.normal.computeLineDistances();
    this.scene.add(this.normal);

    this.addLabel("Air (n₁)", new THREE.Vector3(-2, 2, 0), { color: "#bae6fd", scale: 0.45, offsetY: 0.3 });
    this.addLabel("Water (n₂)", new THREE.Vector3(2, -1.5, 0), { color: "#7dd3fc", scale: 0.45, offsetY: 0.3 });
    this.addLabel("Incident", new THREE.Vector3(-2, 2.5, 0), { color: "#fde047", scale: 0.4, offsetY: 0.4 });
    this.addLabel("Refracted", new THREE.Vector3(1.5, -2, 0), { color: "#67e8f9", scale: 0.4, offsetY: -0.3 });
    this.addLabel("Normal", new THREE.Vector3(0, 2.5, 0), { color: "#a3a3a3", scale: 0.4, offsetY: 0.3 });
    this.camera.position.set(4, 2, 6);
    this.camera.lookAt(0, 0, 0);
  }

  update() {
    const angleDeg = this.params.incidentAngle ?? 35;
    const n1 = this.params.n1 ?? 1;
    const n2 = this.params.n2 ?? 1.33;
    const theta1 = (angleDeg * Math.PI) / 180;
    const sinT2 = Math.min((n1 / n2) * Math.sin(theta1), 1);
    const theta2 = Math.asin(sinT2);
    const inStart = new THREE.Vector3(-Math.sin(theta1) * 4, Math.cos(theta1) * 4, 0);
    const refrEnd = new THREE.Vector3(Math.sin(theta2) * 4, -Math.cos(theta2) * 4, 0);
    this.incident.geometry.dispose();
    this.incident.geometry = new THREE.BufferGeometry().setFromPoints([inStart, new THREE.Vector3(0, 0, 0)]);
    this.refracted.geometry.dispose();
    this.refracted.geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), refrEnd]);
  }
}

export class DopplerSourceModel extends BaseModel {
  private source!: THREE.Mesh;
  private wavefronts: { mesh: THREE.Mesh; born: number; bornX: number }[] = [];
  private observer!: THREE.Mesh;

  initialize() {
    this.addGroundPlane(0x0b1120);
    this.source = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 0.4 }),
    );
    this.source.position.set(-4, 1, 0);
    this.scene.add(this.source);

    this.observer = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0x22c55e }),
    );
    this.observer.position.set(5, 1, 0);
    this.scene.add(this.observer);

    this.addLabel("Source", new THREE.Vector3(-4, 1, 0), { color: "#fca5a5", scale: 0.5, offsetY: 0.5 });
    this.addLabel("Observer", new THREE.Vector3(5, 1, 0), { color: "#86efac", scale: 0.5, offsetY: 0.5 });
    this.camera.position.set(0, 5, 8);
    this.camera.lookAt(0, 1, 0);
  }

  update(t: number) {
    const sourceSpeed = this.params.sourceSpeed ?? 0.6;
    const waveSpeed = this.params.waveSpeed ?? 1.2;
    const period = 0.4;
    const sourceX = -4 + sourceSpeed * t;
    if (sourceX > 6) this.source.position.x = -4;
    else this.source.position.x = sourceX;
    if ((t % period) < 0.02) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.05, 0.07, 48),
        new THREE.MeshBasicMaterial({ color: 0x60a5fa, side: THREE.DoubleSide, transparent: true, opacity: 0.7 }),
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(this.source.position.x, 1, 0);
      this.scene.add(ring);
      this.wavefronts.push({ mesh: ring, born: t, bornX: this.source.position.x });
    }
    this.wavefronts = this.wavefronts.filter((wf) => {
      const age = t - wf.born;
      const r = age * waveSpeed;
      if (r > 6) {
        this.scene.remove(wf.mesh);
        wf.mesh.geometry.dispose();
        return false;
      }
      wf.mesh.geometry.dispose();
      wf.mesh.geometry = new THREE.RingGeometry(r, r + 0.04, 64);
      wf.mesh.position.x = wf.bornX;
      const mat = wf.mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, 0.7 - age / 6);
      return true;
    });
  }
}

export class PrismSpectrumModel extends BaseModel {
  private prism!: THREE.Mesh;
  private incoming!: THREE.Line;
  private outgoing: THREE.Line[] = [];

  initialize() {
    this.addGroundPlane(0x0b1120);
    const prismGeo = new THREE.CylinderGeometry(1, 1, 0.6, 3);
    const prismMat = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, transparent: true, opacity: 0.4 });
    this.prism = new THREE.Mesh(prismGeo, prismMat);
    this.prism.rotation.x = Math.PI / 2;
    this.scene.add(this.prism);

    this.incoming = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-5, 0.4, 0), new THREE.Vector3(-0.6, 0, 0)]),
      new THREE.LineBasicMaterial({ color: 0xffffff }),
    );
    this.scene.add(this.incoming);

    const colors = [0xef4444, 0xf97316, 0xfde047, 0x22c55e, 0x3b82f6, 0x6366f1, 0x9333ea];
    colors.forEach((color, i) => {
      const drop = (i - 3) * 0.15;
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0.6, 0, 0), new THREE.Vector3(5, drop - 0.5, 0)]),
        new THREE.LineBasicMaterial({ color }),
      );
      this.scene.add(line);
      this.outgoing.push(line);
    });

    this.addLabel("White light", new THREE.Vector3(-4, 0.6, 0), { color: "#f8fafc", scale: 0.5, offsetY: 0.3 });
    this.addLabel("Prism", new THREE.Vector3(0, 0, 0), { color: "#cbd5e1", scale: 0.5, offsetY: 1.2 });
    this.addLabel("Spectrum", new THREE.Vector3(5, 0, 0), { color: "#86efac", scale: 0.5, offsetY: 0.6 });
    this.camera.position.set(0, 3, 6);
    this.camera.lookAt(0, 0, 0);
  }

  update() {
    const dispersion = this.params.dispersion ?? 1;
    this.outgoing.forEach((line, i) => {
      const drop = (i - 3) * 0.18 * dispersion;
      line.geometry.dispose();
      line.geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0.6, 0, 0), new THREE.Vector3(5, drop - 0.7, 0)]);
    });
  }
}

export class SpringMassModel extends BaseModel {
  private mass!: THREE.Mesh;
  private spring!: THREE.Line;
  private wall!: THREE.Mesh;

  initialize() {
    this.addGroundPlane(0x111827);
    const wallGeo = new THREE.BoxGeometry(0.3, 2, 1);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x6b7280 });
    this.wall = new THREE.Mesh(wallGeo, wallMat);
    this.wall.position.set(-4, 1, 0);
    this.scene.add(this.wall);

    const massGeo = new THREE.BoxGeometry(0.7, 0.7, 0.7);
    const massMat = new THREE.MeshStandardMaterial({ color: 0xfb7185 });
    this.mass = new THREE.Mesh(massGeo, massMat);
    this.mass.castShadow = true;
    this.scene.add(this.mass);

    this.spring = new THREE.Line(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({ color: 0xa3a3a3 }),
    );
    this.scene.add(this.spring);

    this.addLabel("Wall", new THREE.Vector3(-4, 1, 0), { color: "#cbd5e1", scale: 0.45, offsetY: 1.2 });
    this.addLabel("Spring (k)", new THREE.Vector3(-2, 1, 0), { color: "#a3a3a3", scale: 0.45, offsetY: 0.5 });
    this.addLabel("Mass (m)", new THREE.Vector3(0, 1, 0), { color: "#fda4af", scale: 0.5, offsetY: 0.6 });
    this.camera.position.set(0, 3, 7);
    this.camera.lookAt(0, 1, 0);
  }

  update(t: number) {
    const k = this.params.stiffness ?? 4;
    const m = this.params.mass ?? 1;
    const A = this.params.amplitude ?? 1;
    const omega = Math.sqrt(k / m);
    const x0 = -1;
    const x = x0 + A * Math.cos(omega * t);
    this.mass.position.set(x, 1, 0);
    const start = new THREE.Vector3(-3.85, 1, 0);
    const end = new THREE.Vector3(x - 0.35, 1, 0);
    const points: THREE.Vector3[] = [];
    const coils = 14;
    for (let i = 0; i <= coils; i++) {
      const u = i / coils;
      const px = start.x + (end.x - start.x) * u;
      const py = 1 + Math.sin(u * Math.PI * coils) * 0.18;
      points.push(new THREE.Vector3(px, py, 0));
    }
    this.spring.geometry.dispose();
    this.spring.geometry = new THREE.BufferGeometry().setFromPoints(points);
  }
}
