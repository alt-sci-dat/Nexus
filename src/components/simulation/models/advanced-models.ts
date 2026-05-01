"use client";

import * as THREE from "three";
import { BaseModel } from "./base-model";

export class KeplerOrbitModel extends BaseModel {
  private sun!: THREE.Mesh;
  private planet!: THREE.Mesh;
  private orbitLine!: THREE.Line;
  private trailPoints: THREE.Vector3[] = [];
  private trail!: THREE.Line;

  initialize() {
    this.scene.background = new THREE.Color(0x000000);
    const stars = new THREE.BufferGeometry();
    const starPos: number[] = [];
    for (let i = 0; i < 600; i++) {
      starPos.push((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100);
    }
    stars.setAttribute("position", new THREE.Float32BufferAttribute(starPos, 3));
    const starField = new THREE.Points(stars, new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 }));
    this.scene.add(starField);

    const sunGeo = new THREE.SphereGeometry(0.8, 32, 32);
    const sunMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xfacc15, emissiveIntensity: 0.9 });
    this.sun = new THREE.Mesh(sunGeo, sunMat);
    this.scene.add(this.sun);
    const light = new THREE.PointLight(0xfff5b8, 1.5, 50);
    this.sun.add(light);

    const planetGeo = new THREE.SphereGeometry(0.25, 24, 24);
    const planetMat = new THREE.MeshStandardMaterial({ color: 0x60a5fa });
    this.planet = new THREE.Mesh(planetGeo, planetMat);
    this.scene.add(this.planet);

    this.orbitLine = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0x334155 }));
    this.scene.add(this.orbitLine);
    this.trail = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0x60a5fa }));
    this.scene.add(this.trail);
    this.computeOrbit();

    this.addLabel("Sun", new THREE.Vector3(0, 0, 0), { color: "#fde047", scale: 0.6, offsetY: 1.1 });
    this.addLabel("Planet", new THREE.Vector3(4, 0, 0), { color: "#93c5fd", scale: 0.5, offsetY: 0.6 });
    this.addLabel("Orbit", new THREE.Vector3(0, 0, 4), { color: "#a3a3a3", scale: 0.45, offsetY: 0.4 });
    this.camera.position.set(0, 6, 10);
    this.camera.lookAt(0, 0, 0);
  }

  private computeOrbit() {
    const a = this.params.semiMajor ?? 4;
    const e = this.params.eccentricity ?? 0.4;
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 256; i++) {
      const theta = (i / 256) * Math.PI * 2;
      const r = (a * (1 - e * e)) / (1 + e * Math.cos(theta));
      points.push(new THREE.Vector3(r * Math.cos(theta), 0, r * Math.sin(theta)));
    }
    this.orbitLine.geometry.dispose();
    this.orbitLine.geometry = new THREE.BufferGeometry().setFromPoints(points);
  }

  protected onParamChange() {
    this.computeOrbit();
    this.trailPoints = [];
  }

  update(t: number) {
    const a = this.params.semiMajor ?? 4;
    const e = this.params.eccentricity ?? 0.4;
    const speed = this.params.orbitalSpeed ?? 0.3;
    const M = (t * speed) % (Math.PI * 2);
    let E = M;
    for (let i = 0; i < 5; i++) E = M + e * Math.sin(E);
    const x = a * (Math.cos(E) - e);
    const z = a * Math.sqrt(1 - e * e) * Math.sin(E);
    this.planet.position.set(x, 0, z);
    this.sun.rotation.y += 0.01;
    this.trailPoints.push(new THREE.Vector3(x, 0, z));
    if (this.trailPoints.length > 200) this.trailPoints.shift();
    this.trail.geometry.dispose();
    this.trail.geometry = new THREE.BufferGeometry().setFromPoints(this.trailPoints);
  }
}

export class AtomicOrbitalModel extends BaseModel {
  private nucleus!: THREE.Mesh;
  private cloud!: THREE.Points;

  initialize() {
    this.scene.background = new THREE.Color(0x05070d);
    const nucleusGeo = new THREE.SphereGeometry(0.4, 32, 32);
    const nucleusMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 0.7 });
    this.nucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
    this.scene.add(this.nucleus);
    this.buildCloud();

    this.addLabel("Nucleus", new THREE.Vector3(0, 0, 0), { color: "#fca5a5", scale: 0.5, offsetY: 0.7 });
    this.addLabel("e⁻ probability cloud", new THREE.Vector3(0, 2.5, 0), { color: "#a5b4fc", scale: 0.5, offsetY: 0 });
    this.camera.position.set(5, 4, 6);
    this.camera.lookAt(0, 0, 0);
  }

  protected onParamChange(name: string) {
    if (name === "orbital" || name === "n" || name === "l") {
      this.scene.remove(this.cloud);
      (this.cloud.geometry as THREE.BufferGeometry).dispose();
      this.buildCloud();
    }
  }

  private buildCloud() {
    const orbital = Math.round(this.params.orbital ?? 0);
    const count = 4000;
    const positions: number[] = [];
    const colors: number[] = [];
    for (let i = 0; i < count; i++) {
      let x = 0, y = 0, z = 0;
      const r = Math.abs(gaussian()) * 1.4 + 0.4;
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      x = r * Math.sin(phi) * Math.cos(theta);
      y = r * Math.cos(phi);
      z = r * Math.sin(phi) * Math.sin(theta);
      let prob = 0;
      switch (orbital) {
        case 0:
          prob = Math.exp(-r);
          break;
        case 1:
          prob = (z * z) / (r * r) * Math.exp(-r / 2);
          break;
        case 2:
          prob = ((3 * z * z) / (r * r) - 1) ** 2 * Math.exp(-r / 3);
          break;
        case 3:
          prob = ((x * x - y * y) / (r * r)) ** 2 * Math.exp(-r / 3);
          break;
        default:
          prob = Math.exp(-r);
      }
      if (Math.random() > prob) continue;
      positions.push(x, y, z);
      const c = new THREE.Color().setHSL(0.55 + 0.1 * Math.random(), 0.8, 0.6);
      colors.push(c.r, c.g, c.b);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({ size: 0.06, vertexColors: true, transparent: true, opacity: 0.8 });
    this.cloud = new THREE.Points(geo, mat);
    this.scene.add(this.cloud);
  }

  update(t: number) {
    if (this.cloud) this.cloud.rotation.y = t * 0.1;
  }
}

export class RocketThrustModel extends BaseModel {
  private rocket!: THREE.Group;
  private exhaust: THREE.Points | null = null;
  private particles: { pos: THREE.Vector3; vel: THREE.Vector3; life: number }[] = [];

  initialize() {
    this.addGroundPlane(0x111827);
    this.rocket = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.45, 2.4, 24),
      new THREE.MeshStandardMaterial({ color: 0xe5e7eb, metalness: 0.4, roughness: 0.5 }),
    );
    body.castShadow = true;
    this.rocket.add(body);
    const nose = new THREE.Mesh(
      new THREE.ConeGeometry(0.35, 0.7, 24),
      new THREE.MeshStandardMaterial({ color: 0xef4444 }),
    );
    nose.position.y = 1.55;
    this.rocket.add(nose);
    const nozzle = new THREE.Mesh(
      new THREE.ConeGeometry(0.45, 0.5, 24, 1, true),
      new THREE.MeshStandardMaterial({ color: 0x4b5563, side: THREE.DoubleSide }),
    );
    nozzle.position.y = -1.45;
    nozzle.rotation.x = Math.PI;
    this.rocket.add(nozzle);
    for (const sx of [-1, 1]) {
      const fin = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.6, 0.05),
        new THREE.MeshStandardMaterial({ color: 0xef4444 }),
      );
      fin.position.set(sx * 0.4, -1, 0);
      fin.rotation.y = sx > 0 ? Math.PI / 2 : -Math.PI / 2;
      this.rocket.add(fin);
    }
    this.rocket.position.set(0, 1.4, 0);
    this.scene.add(this.rocket);

    const geo = new THREE.BufferGeometry();
    const mat = new THREE.PointsMaterial({ color: 0xfb923c, size: 0.18, transparent: true, opacity: 0.9 });
    this.exhaust = new THREE.Points(geo, mat);
    this.scene.add(this.exhaust);

    this.addLabel("Rocket", new THREE.Vector3(0, 2.5, 0), { color: "#cbd5e1", scale: 0.5, offsetY: 0.4 });
    this.addLabel("Nozzle", new THREE.Vector3(0, -0.05, 0), { color: "#94a3b8", scale: 0.4, offsetY: 0 });
    this.addLabel("Exhaust v_e", new THREE.Vector3(0, -2, 0), { color: "#fb923c", scale: 0.45, offsetY: 0 });
    this.camera.position.set(5, 4, 7);
    this.camera.lookAt(0, 2, 0);
  }

  update(t: number) {
    const thrust = this.params.thrust ?? 8;
    const mass = this.params.mass ?? 4;
    const a = thrust / mass - 1;
    const cycle = 8;
    const tt = (t * 0.5) % cycle;
    const y = 1.4 + 0.5 * Math.max(a, 0) * tt * tt * 0.05;
    this.rocket.position.y = Math.min(y, 12);

    for (let i = 0; i < Math.floor(thrust); i++) {
      this.particles.push({
        pos: new THREE.Vector3(this.rocket.position.x + (Math.random() - 0.5) * 0.3, this.rocket.position.y - 1.6, this.rocket.position.z + (Math.random() - 0.5) * 0.3),
        vel: new THREE.Vector3((Math.random() - 0.5) * 0.5, -2 - Math.random() * 2, (Math.random() - 0.5) * 0.5),
        life: 1,
      });
    }
    this.particles = this.particles.filter((p) => {
      p.pos.addScaledVector(p.vel, 0.05);
      p.life -= 0.04;
      return p.life > 0 && p.pos.y > -2;
    });
    const positions: number[] = [];
    this.particles.forEach((p) => positions.push(p.pos.x, p.pos.y, p.pos.z));
    this.exhaust!.geometry.dispose();
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    this.exhaust!.geometry = geo;
  }
}

export class BlackholeLensingModel extends BaseModel {
  private hole!: THREE.Mesh;
  private grid!: THREE.LineSegments;
  private accretion!: THREE.Mesh;

  initialize() {
    this.scene.background = new THREE.Color(0x000000);
    const stars = new THREE.BufferGeometry();
    const starPos: number[] = [];
    for (let i = 0; i < 500; i++) {
      starPos.push((Math.random() - 0.5) * 80, (Math.random() - 0.5) * 80, (Math.random() - 0.5) * 80);
    }
    stars.setAttribute("position", new THREE.Float32BufferAttribute(starPos, 3));
    this.scene.add(new THREE.Points(stars, new THREE.PointsMaterial({ color: 0xffffff, size: 0.08 })));

    const holeGeo = new THREE.SphereGeometry(1, 32, 32);
    const holeMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
    this.hole = new THREE.Mesh(holeGeo, holeMat);
    this.scene.add(this.hole);

    const accGeo = new THREE.RingGeometry(1.4, 3.2, 64);
    const accMat = new THREE.MeshBasicMaterial({ color: 0xfb923c, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
    this.accretion = new THREE.Mesh(accGeo, accMat);
    this.accretion.rotation.x = -Math.PI / 2.5;
    this.scene.add(this.accretion);

    const segments: number[] = [];
    const N = 16;
    const D = 18;
    for (let i = -N; i <= N; i++) {
      for (let j = -N; j <= N; j++) {
        const x = (i / N) * D;
        const z = (j / N) * D;
        const r = Math.sqrt(x * x + z * z);
        const dip = -3 / (1 + r * 0.4);
        const x2 = ((i + 1) / N) * D;
        const z2 = ((j + 1) / N) * D;
        const r2 = Math.sqrt(x2 * x2 + z * z);
        const r3 = Math.sqrt(x * x + z2 * z2);
        const dip2 = -3 / (1 + r2 * 0.4);
        const dip3 = -3 / (1 + r3 * 0.4);
        segments.push(x, dip, z, x2, dip2, z);
        segments.push(x, dip, z, x, dip3, z2);
      }
    }
    const gridGeo = new THREE.BufferGeometry();
    gridGeo.setAttribute("position", new THREE.Float32BufferAttribute(segments, 3));
    const gridMat = new THREE.LineBasicMaterial({ color: 0x334155 });
    this.grid = new THREE.LineSegments(gridGeo, gridMat);
    this.grid.position.y = -2;
    this.scene.add(this.grid);

    this.addLabel("Black hole", new THREE.Vector3(0, 1.2, 0), { color: "#fcd34d", scale: 0.55, offsetY: 0 });
    this.addLabel("Accretion disk", new THREE.Vector3(2.8, 0.4, 0), { color: "#fb923c", scale: 0.5, offsetY: 0 });
    this.addLabel("Spacetime grid", new THREE.Vector3(-7, -2.4, 0), { color: "#94a3b8", scale: 0.5, offsetY: 0 });
    this.camera.position.set(0, 8, 12);
    this.camera.lookAt(0, 0, 0);
  }

  update(t: number) {
    this.accretion.rotation.z = t * 0.6;
    const mass = this.params.mass ?? 1;
    this.hole.scale.setScalar(THREE.MathUtils.clamp(mass, 0.3, 3));
  }
}

function gaussian() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}
