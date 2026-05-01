"use client";

import * as THREE from "three";
import { BaseModel } from "./base-model";

export class CartPushModel extends BaseModel {
  private cart!: THREE.Group;
  private hand!: THREE.Mesh;
  private forceArrow!: THREE.ArrowHelper;
  private startX = -3;

  initialize() {
    this.addGroundPlane(0x223046);
    this.cart = makeCart(0xef4444);
    this.cart.position.set(this.startX, 0.4, 0);
    this.scene.add(this.cart);

    const handGeo = new THREE.SphereGeometry(0.35, 24, 24);
    const handMat = new THREE.MeshStandardMaterial({ color: 0xfacc15 });
    this.hand = new THREE.Mesh(handGeo, handMat);
    this.hand.castShadow = true;
    this.scene.add(this.hand);

    this.forceArrow = this.makeArrow(new THREE.Vector3(1, 0, 0), new THREE.Vector3(this.startX - 0.6, 0.4, 0), 1, 0xfde047);
    this.addLabel("Cart", new THREE.Vector3(this.startX, 0.4, 0), { color: "#fca5a5", scale: 0.6 });
    this.addLabel("Force F", new THREE.Vector3(this.startX - 0.6, 1.1, 0), { color: "#fde047", scale: 0.55, offsetY: 0.2 });
    this.addLabel("Hand", new THREE.Vector3(this.startX - 0.7, 0.5, 0), { color: "#fcd34d", scale: 0.5, offsetY: 0.4 });
    this.camera.position.set(0, 3, 7);
    this.camera.lookAt(0, 0.5, 0);
  }

  update() {
    const force = this.params.force ?? 5;
    const mass = this.params.mass ?? 2;
    const a = force / mass;
    const cycle = 6;
    const t = this.time % cycle;
    const x = this.startX + 0.5 * a * t * t * 0.05;
    const clampedX = Math.min(x, 4);
    this.cart.position.x = clampedX;
    this.hand.position.set(clampedX - 0.7, 0.5, 0);
    this.forceArrow.position.set(clampedX - 0.7, 0.5, 0);
    const arrowLen = Math.min(0.4 + force * 0.15, 2.5);
    this.forceArrow.setLength(arrowLen, arrowLen * 0.3, arrowLen * 0.2);
  }
}

export class AppleFallModel extends BaseModel {
  private apple!: THREE.Mesh;
  private trunk!: THREE.Mesh;
  private foliage!: THREE.Mesh;
  private startY = 4.5;

  initialize() {
    this.addGroundPlane(0x1f3a26);
    const trunkGeo = new THREE.CylinderGeometry(0.25, 0.35, 3, 16);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x6b3a17 });
    this.trunk = new THREE.Mesh(trunkGeo, trunkMat);
    this.trunk.position.set(-0.5, 1.5, 0);
    this.trunk.castShadow = true;
    this.scene.add(this.trunk);

    const folGeo = new THREE.SphereGeometry(1.4, 24, 24);
    const folMat = new THREE.MeshStandardMaterial({ color: 0x16a34a });
    this.foliage = new THREE.Mesh(folGeo, folMat);
    this.foliage.position.set(-0.5, 4, 0);
    this.foliage.castShadow = true;
    this.scene.add(this.foliage);

    const appleGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const appleMat = new THREE.MeshStandardMaterial({ color: 0xdc2626 });
    this.apple = new THREE.Mesh(appleGeo, appleMat);
    this.apple.position.set(0.4, this.startY, 0);
    this.apple.castShadow = true;
    this.scene.add(this.apple);

    this.addLabel("Apple", new THREE.Vector3(0.4, this.startY, 0), { color: "#fca5a5", scale: 0.5, offsetY: 0.5 });
    this.addLabel("Tree", new THREE.Vector3(-0.5, 4, 0), { color: "#86efac", scale: 0.55, offsetY: 1.6 });
    this.addLabel("Ground", new THREE.Vector3(0, 0, 0), { color: "#a3a3a3", scale: 0.5, offsetY: 0.3 });

    this.camera.position.set(4, 3, 6);
    this.camera.lookAt(0, 2, 0);
  }

  update() {
    const g = this.params.gravity ?? 9.8;
    const cycle = 3;
    const t = this.time % cycle;
    const y = Math.max(0.18, this.startY - 0.5 * g * t * t * 0.1);
    this.apple.position.y = y;
    if (y <= 0.2) {
      this.apple.position.y = 0.18;
    }
  }
}

export class BarMagnetsModel extends BaseModel {
  private north!: THREE.Group;
  private south!: THREE.Group;
  private fieldLines: THREE.Line[] = [];

  initialize() {
    this.addGroundPlane(0x1c2433);
    this.north = makeBarMagnet(0xef4444, 0x60a5fa, "N", "S");
    this.north.position.set(-2, 0.3, 0);
    this.scene.add(this.north);
    this.south = makeBarMagnet(0xef4444, 0x60a5fa, "N", "S");
    this.south.position.set(2, 0.3, 0);
    this.south.rotation.y = Math.PI;
    this.scene.add(this.south);

    this.addLabel("N", new THREE.Vector3(-2.5, 0.3, 0), { color: "#fca5a5", scale: 0.45, offsetY: 0.6 });
    this.addLabel("S", new THREE.Vector3(-1.5, 0.3, 0), { color: "#93c5fd", scale: 0.45, offsetY: 0.6 });
    this.addLabel("S", new THREE.Vector3(1.5, 0.3, 0), { color: "#93c5fd", scale: 0.45, offsetY: 0.6 });
    this.addLabel("N", new THREE.Vector3(2.5, 0.3, 0), { color: "#fca5a5", scale: 0.45, offsetY: 0.6 });

    for (let i = 0; i < 9; i++) {
      const t = (i + 1) / 10;
      const points: THREE.Vector3[] = [];
      const yOff = (t - 0.5) * 1.6;
      for (let j = 0; j <= 60; j++) {
        const u = j / 60;
        const x = -2 + 4 * u;
        const y = 0.3 + yOff * Math.sin(Math.PI * u);
        points.push(new THREE.Vector3(x, y, 0));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.6 });
      const line = new THREE.Line(geo, mat);
      this.scene.add(line);
      this.fieldLines.push(line);
    }
    this.camera.position.set(0, 3, 6);
    this.camera.lookAt(0, 0.4, 0);
  }

  update() {
    const sep = this.params.separation ?? 4;
    const flipped = (this.params.repel ?? 0) > 0.5;
    this.north.position.x = -sep / 2;
    this.south.position.x = sep / 2;
    this.south.rotation.y = flipped ? 0 : Math.PI;
    this.fieldLines.forEach((line, i) => {
      const mat = line.material as THREE.LineBasicMaterial;
      mat.color.setHex(flipped ? 0xfca5a5 : 0x93c5fd);
    });
  }
}

export class LampShadowModel extends BaseModel {
  private bulb!: THREE.Mesh;
  private blocker!: THREE.Mesh;
  private shadow!: THREE.Mesh;
  private rays: THREE.Line[] = [];

  initialize() {
    this.addGroundPlane(0x111827);
    const wallGeo = new THREE.PlaneGeometry(8, 5);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xe5e7eb, side: THREE.DoubleSide });
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.set(4, 2.5, 0);
    wall.rotation.y = -Math.PI / 2;
    wall.receiveShadow = true;
    this.scene.add(wall);

    const bulbGeo = new THREE.SphereGeometry(0.3, 24, 24);
    const bulbMat = new THREE.MeshStandardMaterial({ color: 0xfde047, emissive: 0xfde047, emissiveIntensity: 1.2 });
    this.bulb = new THREE.Mesh(bulbGeo, bulbMat);
    this.bulb.position.set(-3, 2.5, 0);
    this.scene.add(this.bulb);
    const point = new THREE.PointLight(0xfde047, 1.5, 20);
    this.bulb.add(point);

    const blockerGeo = new THREE.BoxGeometry(0.6, 1, 0.6);
    const blockerMat = new THREE.MeshStandardMaterial({ color: 0x4f46e5 });
    this.blocker = new THREE.Mesh(blockerGeo, blockerMat);
    this.blocker.position.set(0, 1, 0);
    this.blocker.castShadow = true;
    this.scene.add(this.blocker);

    const shadowGeo = new THREE.PlaneGeometry(1.5, 2);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.55 });
    this.shadow = new THREE.Mesh(shadowGeo, shadowMat);
    this.shadow.rotation.y = -Math.PI / 2;
    this.shadow.position.set(3.99, 1.5, 0);
    this.scene.add(this.shadow);

    this.addLabel("Lamp", new THREE.Vector3(-3, 2.5, 0), { color: "#fde047", scale: 0.55, offsetY: 0.6 });
    this.addLabel("Object", new THREE.Vector3(0, 1, 0), { color: "#a5b4fc", scale: 0.5, offsetY: 0.7 });
    this.addLabel("Wall", new THREE.Vector3(4, 4.5, 0), { color: "#cbd5e1", scale: 0.5, offsetY: 0.4 });
    this.addLabel("Shadow", new THREE.Vector3(3.99, 1.5, 1.5), { color: "#94a3b8", scale: 0.5, offsetY: 0 });
    this.camera.position.set(0, 3, 8);
    this.camera.lookAt(0, 1, 0);
  }

  update() {
    const dist = this.params.objectDistance ?? 0;
    this.blocker.position.x = dist;
    const ratio = (4 - dist) / (4 - (-3));
    const shadowH = THREE.MathUtils.clamp(2 / ratio, 0.5, 4);
    this.shadow.scale.set(1, shadowH / 2, 1);
  }
}

export class PendulumModel extends BaseModel {
  private pivot!: THREE.Mesh;
  private bob!: THREE.Mesh;
  private rope!: THREE.Line;

  initialize() {
    this.addGroundPlane(0x1f2937);
    const pivotGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.4, 16);
    const pivotMat = new THREE.MeshStandardMaterial({ color: 0x9ca3af });
    this.pivot = new THREE.Mesh(pivotGeo, pivotMat);
    this.pivot.position.set(0, 4, 0);
    this.scene.add(this.pivot);

    const bobGeo = new THREE.SphereGeometry(0.35, 24, 24);
    const bobMat = new THREE.MeshStandardMaterial({ color: 0x10b981 });
    this.bob = new THREE.Mesh(bobGeo, bobMat);
    this.bob.castShadow = true;
    this.scene.add(this.bob);

    const ropeGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 4, 0), new THREE.Vector3(0, 1.5, 0)]);
    const ropeMat = new THREE.LineBasicMaterial({ color: 0xe5e7eb });
    this.rope = new THREE.Line(ropeGeo, ropeMat);
    this.scene.add(this.rope);

    this.addLabel("Pivot", new THREE.Vector3(0, 4, 0), { color: "#cbd5e1", scale: 0.5, offsetY: 0.4 });
    this.addLabel("Bob", new THREE.Vector3(0, 1.5, 0), { color: "#6ee7b7", scale: 0.5, offsetY: 0.5 });
    this.camera.position.set(5, 3, 6);
    this.camera.lookAt(0, 2.5, 0);
  }

  update(t: number) {
    const length = this.params.length ?? 2.5;
    const amp = ((this.params.amplitudeDeg ?? 25) * Math.PI) / 180;
    const g = this.params.gravity ?? 9.8;
    const omega = Math.sqrt(g / length);
    const theta = amp * Math.cos(omega * t);
    const x = length * Math.sin(theta);
    const y = 4 - length * Math.cos(theta);
    this.bob.position.set(x, y, 0);
    const ropeGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 4, 0), new THREE.Vector3(x, y, 0)]);
    this.rope.geometry.dispose();
    this.rope.geometry = ropeGeo;
  }
}

export class InclinedRampModel extends BaseModel {
  private ramp!: THREE.Mesh;
  private ball!: THREE.Mesh;
  private gravityArrow!: THREE.ArrowHelper;
  private normalArrow!: THREE.ArrowHelper;

  initialize() {
    this.addGroundPlane(0x1f2937);
    const rampGeo = new THREE.BoxGeometry(6, 0.2, 2);
    const rampMat = new THREE.MeshStandardMaterial({ color: 0x6366f1 });
    this.ramp = new THREE.Mesh(rampGeo, rampMat);
    this.ramp.castShadow = true;
    this.ramp.receiveShadow = true;
    this.scene.add(this.ramp);

    const ballGeo = new THREE.SphereGeometry(0.3, 24, 24);
    const ballMat = new THREE.MeshStandardMaterial({ color: 0xf97316 });
    this.ball = new THREE.Mesh(ballGeo, ballMat);
    this.ball.castShadow = true;
    this.scene.add(this.ball);

    this.gravityArrow = this.makeArrow(new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 0, 0), 1, 0xef4444);
    this.normalArrow = this.makeArrow(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 1, 0x22d3ee);

    this.applyAngle();
    this.addLabel("Ball", new THREE.Vector3(2.5, 1, 0), { color: "#fdba74", scale: 0.5, offsetY: 0.5 });
    this.addLabel("Ramp", new THREE.Vector3(0, 0.5, 0), { color: "#a5b4fc", scale: 0.55, offsetY: 0.4 });
    this.addLabel("g", new THREE.Vector3(2.5, 0, 0), { color: "#fca5a5", scale: 0.4, offsetY: -0.4 });
    this.addLabel("N", new THREE.Vector3(2.5, 1.5, 0), { color: "#67e8f9", scale: 0.4, offsetY: 0.5 });
    this.camera.position.set(0, 3, 7);
    this.camera.lookAt(0, 1, 0);
  }

  private applyAngle() {
    const angleDeg = this.params.angle ?? 25;
    const angle = (angleDeg * Math.PI) / 180;
    this.ramp.rotation.z = angle;
    this.ramp.position.set(0, Math.sin(angle) * 3 - 0.1, 0);
  }

  protected onParamChange(name: string) {
    if (name === "angle") this.applyAngle();
  }

  update(t: number) {
    const angleDeg = this.params.angle ?? 25;
    const angle = (angleDeg * Math.PI) / 180;
    const friction = this.params.friction ?? 0.1;
    const g = 9.8;
    const a = g * (Math.sin(angle) - friction * Math.cos(angle));
    const cycle = 4;
    const u = (t % cycle) / cycle;
    const s = Math.max(0, 0.5 * Math.max(a, 0.2)) * Math.pow(u * 2, 2);
    const along = Math.min(s, 6);
    const x = 3 - along * Math.cos(angle);
    const y = Math.sin(angle) * 3 + along * Math.sin(angle) * 0 + 0.3;
    const yPos = (3 - x) * Math.tan(angle) + 0.3 - 0.1 + Math.sin(angle) * 0;
    this.ball.position.set(3 - along * Math.cos(angle), Math.sin(angle) * (3 - along) + 0.3 - 0.1, 0);
    this.gravityArrow.position.copy(this.ball.position);
    this.normalArrow.position.copy(this.ball.position);
    this.normalArrow.setDirection(new THREE.Vector3(Math.sin(angle), Math.cos(angle), 0).normalize());
  }
}

export class LeverSeesawModel extends BaseModel {
  private bar!: THREE.Mesh;
  private fulcrum!: THREE.Mesh;
  private leftMass!: THREE.Mesh;
  private rightMass!: THREE.Mesh;

  initialize() {
    this.addGroundPlane(0x1f2937);
    const fulGeo = new THREE.ConeGeometry(0.6, 1, 4);
    const fulMat = new THREE.MeshStandardMaterial({ color: 0x6b7280 });
    this.fulcrum = new THREE.Mesh(fulGeo, fulMat);
    this.fulcrum.position.set(0, 0.5, 0);
    this.fulcrum.rotation.y = Math.PI / 4;
    this.scene.add(this.fulcrum);

    const barGeo = new THREE.BoxGeometry(8, 0.18, 0.6);
    const barMat = new THREE.MeshStandardMaterial({ color: 0xa78bfa });
    this.bar = new THREE.Mesh(barGeo, barMat);
    this.bar.position.set(0, 1.05, 0);
    this.bar.castShadow = true;
    this.scene.add(this.bar);

    this.leftMass = makeWeight(0xef4444, 1);
    this.rightMass = makeWeight(0x22c55e, 1);
    this.scene.add(this.leftMass, this.rightMass);

    this.addLabel("Pivot", new THREE.Vector3(0, 0.5, 0), { color: "#cbd5e1", scale: 0.45, offsetY: 0.7 });
    this.addLabel("m₁", new THREE.Vector3(-3, 1.05, 0), { color: "#fca5a5", scale: 0.4, offsetY: 0.9 });
    this.addLabel("m₂", new THREE.Vector3(3, 1.05, 0), { color: "#86efac", scale: 0.4, offsetY: 0.9 });
    this.camera.position.set(0, 3, 7);
    this.camera.lookAt(0, 1, 0);
  }

  update() {
    const m1 = this.params.leftMass ?? 2;
    const d1 = this.params.leftDistance ?? 3;
    const m2 = this.params.rightMass ?? 2;
    const d2 = this.params.rightDistance ?? 3;
    const torque = m1 * d1 - m2 * d2;
    const tilt = THREE.MathUtils.clamp(torque * 0.05, -0.3, 0.3);
    this.bar.rotation.z = tilt;
    const sx = (x: number) => x;
    const yAt = (x: number) => 1.05 + Math.sin(tilt) * x;
    const lScale = THREE.MathUtils.clamp(0.4 + m1 * 0.15, 0.4, 1.4);
    const rScale = THREE.MathUtils.clamp(0.4 + m2 * 0.15, 0.4, 1.4);
    this.leftMass.scale.setScalar(lScale);
    this.rightMass.scale.setScalar(rScale);
    this.leftMass.position.set(-sx(d1), yAt(-d1) + 0.4, 0);
    this.rightMass.position.set(sx(d2), yAt(d2) + 0.4, 0);
  }
}

function makeCart(color: number): THREE.Group {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.5, 0.7), new THREE.MeshStandardMaterial({ color }));
  body.castShadow = true;
  g.add(body);
  for (const sx of [-0.45, 0.45]) {
    for (const sz of [-0.3, 0.3]) {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.1, 16), new THREE.MeshStandardMaterial({ color: 0x111827 }));
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(sx, -0.3, sz);
      wheel.castShadow = true;
      g.add(wheel);
    }
  }
  return g;
}

function makeBarMagnet(north: number, south: number, _nl: string, _sl: string): THREE.Group {
  const g = new THREE.Group();
  const left = new THREE.Mesh(new THREE.BoxGeometry(1, 0.5, 0.5), new THREE.MeshStandardMaterial({ color: north }));
  left.position.x = -0.5;
  const right = new THREE.Mesh(new THREE.BoxGeometry(1, 0.5, 0.5), new THREE.MeshStandardMaterial({ color: south }));
  right.position.x = 0.5;
  left.castShadow = true;
  right.castShadow = true;
  g.add(left, right);
  return g;
}

function makeWeight(color: number, _w: number): THREE.Mesh {
  const geo = new THREE.BoxGeometry(0.5, 0.7, 0.5);
  const mat = new THREE.MeshStandardMaterial({ color });
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = true;
  return m;
}
