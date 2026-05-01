"use client";

import * as THREE from "three";
import { BaseModel } from "./base-model";

export class DoubleSlitModel extends BaseModel {
  private barrier!: THREE.Mesh;
  private screen!: THREE.Mesh;
  private fringes!: THREE.Mesh;
  private wavefronts: { mesh: THREE.Mesh; born: number }[] = [];
  private source!: THREE.Mesh;

  initialize() {
    this.addGroundPlane(0x05070d);
    this.source = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xfacc15, emissiveIntensity: 0.7 }),
    );
    this.source.position.set(-4, 1, 0);
    this.scene.add(this.source);

    const barrierGeo = new THREE.BoxGeometry(0.2, 2.4, 4);
    this.barrier = new THREE.Mesh(barrierGeo, new THREE.MeshStandardMaterial({ color: 0x4b5563 }));
    this.barrier.position.set(0, 1, 0);
    this.scene.add(this.barrier);

    const screenGeo = new THREE.PlaneGeometry(0.05, 4);
    this.screen = new THREE.Mesh(screenGeo, new THREE.MeshStandardMaterial({ color: 0x1f2937 }));
    this.screen.position.set(4, 1, 0);
    this.screen.rotation.y = Math.PI / 2;
    this.scene.add(this.screen);

    const fringeCanvas = document.createElement("canvas");
    fringeCanvas.width = 8;
    fringeCanvas.height = 256;
    const ctx = fringeCanvas.getContext("2d")!;
    for (let y = 0; y < 256; y++) {
      const u = (y - 128) / 16;
      const intensity = Math.cos(u) * Math.cos(u) * Math.exp(-Math.abs(u) / 6);
      const c = Math.floor(intensity * 255);
      ctx.fillStyle = `rgb(${c},${c},${Math.min(255, c + 50)})`;
      ctx.fillRect(0, y, 8, 1);
    }
    const tex = new THREE.CanvasTexture(fringeCanvas);
    this.fringes = new THREE.Mesh(
      new THREE.PlaneGeometry(0.05, 4),
      new THREE.MeshBasicMaterial({ map: tex }),
    );
    this.fringes.position.set(4.05, 1, 0);
    this.fringes.rotation.y = Math.PI / 2;
    this.scene.add(this.fringes);

    this.addLabel("Source", new THREE.Vector3(-4, 1, 0), { color: "#fde047", scale: 0.5, offsetY: 0.5 });
    this.addLabel("Slits", new THREE.Vector3(0, 2.4, 0), { color: "#94a3b8", scale: 0.45, offsetY: 0.3 });
    this.addLabel("Screen", new THREE.Vector3(4, 3.2, 0), { color: "#cbd5e1", scale: 0.45, offsetY: 0.3 });
    this.addLabel("Fringe pattern", new THREE.Vector3(4.2, -1.2, 0), { color: "#67e8f9", scale: 0.45, offsetY: 0.3 });

    this.camera.position.set(0, 4, 9);
    this.camera.lookAt(0, 1, 0);
  }

  update(t: number) {
    const slitSep = this.params.slitSeparation ?? 1;
    if ((t * 4) % 1 < 0.05) {
      const slits = [
        new THREE.Vector3(0, 1 + slitSep / 2, 0),
        new THREE.Vector3(0, 1 - slitSep / 2, 0),
      ];
      slits.forEach((origin) => {
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(0.05, 0.07, 48),
          new THREE.MeshBasicMaterial({ color: 0x22d3ee, side: THREE.DoubleSide, transparent: true, opacity: 0.7 }),
        );
        ring.position.copy(origin);
        ring.rotation.y = Math.PI / 2;
        this.scene.add(ring);
        this.wavefronts.push({ mesh: ring, born: t });
      });
    }
    this.wavefronts = this.wavefronts.filter((w) => {
      const age = t - w.born;
      const r = age * 1.2;
      if (r > 5) {
        this.scene.remove(w.mesh);
        w.mesh.geometry.dispose();
        return false;
      }
      w.mesh.geometry.dispose();
      w.mesh.geometry = new THREE.RingGeometry(r, r + 0.04, 48);
      const mat = w.mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, 0.7 - age / 5);
      return true;
    });
  }
}

export class TransformerModel extends BaseModel {
  private primary!: THREE.Group;
  private secondary!: THREE.Group;
  private core!: THREE.Mesh;
  private primaryElectrons: THREE.Mesh[] = [];
  private secondaryElectrons: THREE.Mesh[] = [];

  initialize() {
    this.addGroundPlane(0x111827);
    const coreGeo = new THREE.BoxGeometry(4, 2.5, 0.5);
    this.core = new THREE.Mesh(coreGeo, new THREE.MeshStandardMaterial({ color: 0x6b7280, metalness: 0.6 }));
    this.core.position.set(0, 1.5, 0);
    this.scene.add(this.core);
    const innerGeo = new THREE.BoxGeometry(2.4, 1.2, 0.6);
    const inner = new THREE.Mesh(innerGeo, new THREE.MeshStandardMaterial({ color: 0x0b1120 }));
    inner.position.set(0, 1.5, 0);
    this.scene.add(inner);

    this.primary = makeCoil(0xb45309, 8, -1.4, 1.5);
    this.secondary = makeCoil(0xb45309, 16, 1.4, 1.5);
    this.scene.add(this.primary, this.secondary);

    this.addLabel("Iron core", new THREE.Vector3(0, 1.5, 0), { color: "#cbd5e1", scale: 0.5, offsetY: 1.6 });
    this.addLabel("Primary (Nₚ)", new THREE.Vector3(-1.4, 1.5, 0), { color: "#fdba74", scale: 0.45, offsetY: -1 });
    this.addLabel("Secondary (Nₛ)", new THREE.Vector3(1.4, 1.5, 0), { color: "#fdba74", scale: 0.45, offsetY: -1 });

    this.camera.position.set(0, 3.5, 8);
    this.camera.lookAt(0, 1.5, 0);
  }

  update(t: number) {
    const Vp = this.params.primaryVoltage ?? 5;
    const Np = this.params.primaryTurns ?? 8;
    const Ns = this.params.secondaryTurns ?? 16;
    const Vs = Vp * (Ns / Np);
    const flux = Math.sin(t * 4) * Vp * 0.1;
    this.core.rotation.y = flux * 0.05;
    const matCore = this.core.material as THREE.MeshStandardMaterial;
    matCore.emissive = new THREE.Color(0x60a5fa);
    matCore.emissiveIntensity = Math.abs(flux) * 0.5;
    void Vs;
  }
}

export class DecayChainModel extends BaseModel {
  private nucleus!: THREE.Mesh;
  private particles: { mesh: THREE.Mesh; vel: THREE.Vector3; born: number }[] = [];
  private halflives = 0;

  initialize() {
    this.scene.background = new THREE.Color(0x05070d);
    this.nucleus = new THREE.Mesh(
      new THREE.SphereGeometry(0.6, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 0.5 }),
    );
    this.scene.add(this.nucleus);

    this.addLabel("Nucleus", new THREE.Vector3(0, 0, 0), { color: "#fca5a5", scale: 0.5, offsetY: 0.9 });
    this.addLabel("α (yellow) / β (blue)", new THREE.Vector3(0, -2, 0), { color: "#fde047", scale: 0.45, offsetY: 0 });

    this.camera.position.set(4, 3, 6);
    this.camera.lookAt(0, 0, 0);
  }

  update(t: number) {
    const halfLife = this.params.halfLife ?? 2;
    if (Math.random() < 0.02 / halfLife) {
      const dir = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
      const isAlpha = Math.random() < 0.5;
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(isAlpha ? 0.18 : 0.1, 12, 12),
        new THREE.MeshStandardMaterial({ color: isAlpha ? 0xfde047 : 0x60a5fa, emissive: isAlpha ? 0xfde047 : 0x60a5fa, emissiveIntensity: 0.6 }),
      );
      m.position.copy(this.nucleus.position);
      this.scene.add(m);
      this.particles.push({ mesh: m, vel: dir.multiplyScalar(2 + Math.random() * 2), born: t });
    }
    this.particles = this.particles.filter((p) => {
      p.mesh.position.addScaledVector(p.vel, 0.04);
      const age = t - p.born;
      if (age > 4) {
        this.scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        return false;
      }
      return true;
    });
    const intensity = 0.5 + 0.4 * Math.sin(t * 3);
    (this.nucleus.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
  }
}

export class NeutronStarModel extends BaseModel {
  private star!: THREE.Mesh;
  private beam1!: THREE.Mesh;
  private beam2!: THREE.Mesh;

  initialize() {
    this.scene.background = new THREE.Color(0x000000);
    const stars = new THREE.BufferGeometry();
    const sp: number[] = [];
    for (let i = 0; i < 600; i++) sp.push((Math.random() - 0.5) * 80, (Math.random() - 0.5) * 80, (Math.random() - 0.5) * 80);
    stars.setAttribute("position", new THREE.Float32BufferAttribute(sp, 3));
    this.scene.add(new THREE.Points(stars, new THREE.PointsMaterial({ color: 0xffffff, size: 0.08 })));

    this.star = new THREE.Mesh(
      new THREE.SphereGeometry(0.6, 48, 48),
      new THREE.MeshStandardMaterial({ color: 0xe0f2fe, emissive: 0x60a5fa, emissiveIntensity: 0.7 }),
    );
    this.scene.add(this.star);

    const beamGeo = new THREE.ConeGeometry(0.5, 8, 24, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({ color: 0xfde047, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
    this.beam1 = new THREE.Mesh(beamGeo, beamMat);
    this.beam2 = new THREE.Mesh(beamGeo, beamMat.clone());
    this.beam1.position.y = 4;
    this.beam2.position.y = -4;
    this.beam2.rotation.z = Math.PI;
    this.scene.add(this.beam1, this.beam2);

    this.addLabel("Neutron star", new THREE.Vector3(0, 0, 0), { color: "#bae6fd", scale: 0.5, offsetY: 1 });
    this.addLabel("Polar beam", new THREE.Vector3(0, 4, 0), { color: "#fde047", scale: 0.45, offsetY: 0.4 });

    this.camera.position.set(5, 3, 7);
    this.camera.lookAt(0, 0, 0);
  }

  update(t: number) {
    const spin = this.params.spinRate ?? 6;
    this.star.rotation.y = t * spin;
    this.beam1.rotation.y = t * spin;
    this.beam2.rotation.y = t * spin;
    const tilt = Math.PI / 6;
    this.beam1.rotation.z = tilt;
    this.beam2.rotation.z = Math.PI + tilt;
  }
}

export class PlasmaBottleModel extends BaseModel {
  private coilA!: THREE.Mesh;
  private coilB!: THREE.Mesh;
  private particles: { mesh: THREE.Mesh; pos: THREE.Vector3; phase: number; vlong: number }[] = [];
  private fieldLines: THREE.Line[] = [];

  initialize() {
    this.scene.background = new THREE.Color(0x05070d);
    const coilGeo = new THREE.TorusGeometry(1.2, 0.1, 12, 48);
    const coilMat = new THREE.MeshStandardMaterial({ color: 0xb45309 });
    this.coilA = new THREE.Mesh(coilGeo, coilMat);
    this.coilA.rotation.y = Math.PI / 2;
    this.coilA.position.x = -2.5;
    this.coilB = new THREE.Mesh(coilGeo, coilMat);
    this.coilB.rotation.y = Math.PI / 2;
    this.coilB.position.x = 2.5;
    this.scene.add(this.coilA, this.coilB);

    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const pts: THREE.Vector3[] = [];
      for (let j = 0; j <= 60; j++) {
        const u = (j / 60) * 2 - 1;
        const r = 1.2 - Math.cos(u * Math.PI / 1.5) * 0.2;
        pts.push(new THREE.Vector3(u * 2.5, Math.sin(angle) * r, Math.cos(angle) * r));
      }
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.4 }));
      this.scene.add(line);
      this.fieldLines.push(line);
    }

    for (let i = 0; i < 20; i++) {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0xa78bfa, emissive: 0xa78bfa, emissiveIntensity: 0.7 }),
      );
      this.scene.add(m);
      this.particles.push({
        mesh: m,
        pos: new THREE.Vector3((Math.random() - 0.5) * 3, 0, 0),
        phase: Math.random() * Math.PI * 2,
        vlong: (Math.random() - 0.5) * 1.2,
      });
    }

    this.addLabel("Mirror coil A", new THREE.Vector3(-2.5, 0, 0), { color: "#fdba74", scale: 0.45, offsetY: 1.5 });
    this.addLabel("Mirror coil B", new THREE.Vector3(2.5, 0, 0), { color: "#fdba74", scale: 0.45, offsetY: 1.5 });
    this.addLabel("Trapped plasma", new THREE.Vector3(0, 0, 0), { color: "#c4b5fd", scale: 0.45, offsetY: -1.6 });

    this.camera.position.set(0, 4, 7);
    this.camera.lookAt(0, 0, 0);
  }

  update(t: number) {
    const strength = this.params.fieldStrength ?? 1;
    this.particles.forEach((p) => {
      p.pos.x += p.vlong * 0.02;
      if (p.pos.x > 2.4 || p.pos.x < -2.4) p.vlong *= -1;
      const r = 0.5 + 0.4 * Math.cos(p.pos.x * 1.2);
      const angle = p.phase + t * 4 * strength;
      p.mesh.position.set(p.pos.x, Math.sin(angle) * r, Math.cos(angle) * r);
    });
  }
}

export class IonEngineModel extends BaseModel {
  private chamber!: THREE.Mesh;
  private grid!: THREE.Mesh;
  private ions: { mesh: THREE.Mesh; pos: THREE.Vector3; vel: number }[] = [];

  initialize() {
    this.addGroundPlane(0x0b1120);
    const chamGeo = new THREE.CylinderGeometry(0.7, 0.7, 1.6, 24, 1, true);
    this.chamber = new THREE.Mesh(chamGeo, new THREE.MeshStandardMaterial({ color: 0x9ca3af, side: THREE.DoubleSide, transparent: true, opacity: 0.4 }));
    this.chamber.rotation.z = Math.PI / 2;
    this.chamber.position.set(-1, 1.5, 0);
    this.scene.add(this.chamber);

    const gridGeo = new THREE.RingGeometry(0.5, 0.7, 24);
    this.grid = new THREE.Mesh(gridGeo, new THREE.MeshStandardMaterial({ color: 0xfacc15, side: THREE.DoubleSide, emissive: 0xfacc15, emissiveIntensity: 0.4 }));
    this.grid.rotation.y = Math.PI / 2;
    this.grid.position.set(-0.2, 1.5, 0);
    this.scene.add(this.grid);

    for (let i = 0; i < 30; i++) {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0xa78bfa, emissive: 0xa78bfa, emissiveIntensity: 0.8 }),
      );
      this.scene.add(m);
      this.ions.push({ mesh: m, pos: new THREE.Vector3(-1.5 - Math.random() * 0.5, 1.5 + (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5), vel: 0.5 });
    }

    this.addLabel("Ionization chamber", new THREE.Vector3(-1.5, 1.5, 0), { color: "#cbd5e1", scale: 0.45, offsetY: 1 });
    this.addLabel("Accel grid", new THREE.Vector3(-0.2, 1.5, 0), { color: "#fde047", scale: 0.4, offsetY: 0.9 });
    this.addLabel("Ion beam", new THREE.Vector3(2.5, 1.5, 0), { color: "#c4b5fd", scale: 0.45, offsetY: 0.6 });

    this.camera.position.set(2, 3, 6);
    this.camera.lookAt(0, 1.5, 0);
  }

  update(_t: number) {
    const accel = (this.params.gridVoltage ?? 1) * 0.05;
    this.ions.forEach((ion) => {
      if (ion.pos.x > -0.3) ion.vel += accel;
      ion.pos.x += ion.vel * 0.05;
      if (ion.pos.x > 5) {
        ion.pos.x = -1.5 - Math.random() * 0.5;
        ion.pos.y = 1.5 + (Math.random() - 0.5) * 0.5;
        ion.pos.z = (Math.random() - 0.5) * 0.5;
        ion.vel = 0.5;
      }
      ion.mesh.position.copy(ion.pos);
    });
  }
}

export class BECModel extends BaseModel {
  private atoms: { mesh: THREE.Mesh; home: THREE.Vector3; jitter: number }[] = [];

  initialize() {
    this.scene.background = new THREE.Color(0x05070d);
    const N = 80;
    for (let i = 0; i < N; i++) {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.15, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0x60a5fa, emissive: 0x60a5fa, emissiveIntensity: 0.7 }),
      );
      const home = new THREE.Vector3((Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.6);
      this.scene.add(m);
      this.atoms.push({ mesh: m, home, jitter: 1 });
    }

    this.addLabel("Cold atom cloud", new THREE.Vector3(0, 0, 0), { color: "#bae6fd", scale: 0.5, offsetY: 1.5 });

    this.camera.position.set(4, 3, 6);
    this.camera.lookAt(0, 0, 0);
  }

  update(t: number) {
    const T = this.params.temperature ?? 100;
    const Tnano = THREE.MathUtils.clamp(T / 100, 0.001, 1.5);
    this.atoms.forEach((a, i) => {
      const jitter = Tnano * 1.5;
      const phase = i + t * 1.5;
      a.mesh.position.set(
        a.home.x + Math.sin(phase) * jitter * 0.4,
        a.home.y + Math.cos(phase * 1.3) * jitter * 0.4,
        a.home.z + Math.sin(phase * 0.7) * jitter * 0.4,
      );
      const mat = a.mesh.material as THREE.MeshStandardMaterial;
      const cold = Tnano < 0.05;
      mat.color.setHex(cold ? 0xa78bfa : 0x60a5fa);
      mat.emissive.setHex(cold ? 0xa78bfa : 0x60a5fa);
      mat.emissiveIntensity = cold ? 1 : 0.5;
    });
  }
}

export class FeynmanModel extends BaseModel {
  private vertices: THREE.Mesh[] = [];

  initialize() {
    this.scene.background = new THREE.Color(0x0b1120);
    const v1 = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), new THREE.MeshStandardMaterial({ color: 0xfde047 }));
    const v2 = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), new THREE.MeshStandardMaterial({ color: 0xfde047 }));
    v1.position.set(-1, 0, 0);
    v2.position.set(1, 0, 0);
    this.scene.add(v1, v2);
    this.vertices.push(v1, v2);

    const arrowMat = new THREE.LineBasicMaterial({ color: 0x60a5fa, linewidth: 2 });
    const inLeftBottom = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-3, -1.4, 0), new THREE.Vector3(-1, 0, 0)]), arrowMat);
    const inLeftTop = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-3, 1.4, 0), new THREE.Vector3(-1, 0, 0)]), arrowMat);
    const outRightTop = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(1, 0, 0), new THREE.Vector3(3, 1.4, 0)]), arrowMat);
    const outRightBottom = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(1, 0, 0), new THREE.Vector3(3, -1.4, 0)]), arrowMat);
    this.scene.add(inLeftBottom, inLeftTop, outRightTop, outRightBottom);

    const wavyPts: THREE.Vector3[] = [];
    for (let i = 0; i <= 30; i++) {
      const u = i / 30;
      wavyPts.push(new THREE.Vector3(-1 + u * 2, Math.sin(u * Math.PI * 6) * 0.18, 0));
    }
    const wavy = new THREE.Line(new THREE.BufferGeometry().setFromPoints(wavyPts), new THREE.LineBasicMaterial({ color: 0xef4444 }));
    this.scene.add(wavy);

    this.addLabel("Vertex", new THREE.Vector3(-1, 0, 0), { color: "#fde047", scale: 0.4, offsetY: 0.4 });
    this.addLabel("Vertex", new THREE.Vector3(1, 0, 0), { color: "#fde047", scale: 0.4, offsetY: 0.4 });
    this.addLabel("e⁻", new THREE.Vector3(-3, -1.4, 0), { color: "#93c5fd", scale: 0.4, offsetY: 0 });
    this.addLabel("e⁻", new THREE.Vector3(-3, 1.4, 0), { color: "#93c5fd", scale: 0.4, offsetY: 0 });
    this.addLabel("e⁻", new THREE.Vector3(3, 1.4, 0), { color: "#93c5fd", scale: 0.4, offsetY: 0 });
    this.addLabel("e⁻", new THREE.Vector3(3, -1.4, 0), { color: "#93c5fd", scale: 0.4, offsetY: 0 });
    this.addLabel("γ", new THREE.Vector3(0, 0.4, 0), { color: "#fca5a5", scale: 0.4, offsetY: 0.3 });

    this.camera.position.set(0, 1.2, 6);
    this.camera.lookAt(0, 0, 0);
  }

  update(t: number) {
    this.vertices.forEach((v) => {
      v.scale.setScalar(1 + 0.1 * Math.sin(t * 3));
    });
  }
}

function makeCoil(color: number, turns: number, x: number, y: number): THREE.Group {
  const g = new THREE.Group();
  for (let i = 0; i < turns; i++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.55, 0.04, 8, 24),
      new THREE.MeshStandardMaterial({ color }),
    );
    ring.position.x = x;
    ring.position.y = y - 1 + (i / turns) * 2;
    g.add(ring);
  }
  return g;
}
