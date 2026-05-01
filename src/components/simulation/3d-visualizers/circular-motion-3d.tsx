"use client";

import * as THREE from "three";
import { Base3DVisualizer } from "./3d-base-visualizer";

export class CircularMotion3D extends Base3DVisualizer {
  constructor(container: HTMLDivElement) {
    super(container);
    this.objects = [];
  }

  initialize() {
    this.params = {
      mass: 30,
      radius: 10,
      angularVelocity: 0.5,
    };

    // Clear scene
    this.objects.forEach((obj) => this.scene.remove(obj));
    this.objects = [];

    // Central mass (sun/planet)
    const centralGeo = new THREE.SphereGeometry(1, 32, 32);
    const centralMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xfbbf24 });
    const central = new THREE.Mesh(centralGeo, centralMat);
    central.castShadow = true;
    this.scene.add(central);
    this.objects.push(central);

    // Orbital path
    const orbitGeo = new THREE.BufferGeometry();
    const orbitPoints = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      orbitPoints.push(Math.cos(angle) * 10, 0, Math.sin(angle) * 10);
    }
    orbitGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(orbitPoints), 3));

    const orbitMat = new THREE.LineBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.5 });
    const orbit = new THREE.Line(orbitGeo, orbitMat);
    this.scene.add(orbit);
    this.objects.push(orbit);

    // Orbiting body
    const bodyGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, metalness: 0.6 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.set(10, 0, 0);
    body.castShadow = true;
    this.scene.add(body);
    this.objects.push(body);

    // Velocity vector
    const velArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1).normalize(), new THREE.Vector3(10, 0, 0), 3, 0x00ff00);
    this.scene.add(velArrow);
    this.vectors.push(velArrow);

    // Centripetal force vector
    const forceArrow = new THREE.ArrowHelper(new THREE.Vector3(-1, 0, 0).normalize(), new THREE.Vector3(10, 0, 0), 4, 0xff0000);
    this.scene.add(forceArrow);
    this.vectors.push(forceArrow);
  }

  public update() {
    if (!this.objects || this.objects.length < 3) return;

    const body = this.objects[2]; // Third object is the orbiting body
    if (!body) return;

    // Calculate orbital position
    const angle = this.time * this.params.angularVelocity;
    const radius = this.params.radius;

    body.position.x = Math.cos(angle) * radius;
    body.position.z = Math.sin(angle) * radius;

    // Update velocity vector (tangent to orbit)
    if (this.vectors.length > 0) {
      const velocityDir = new THREE.Vector3(-Math.sin(angle), 0, Math.cos(angle));
      this.vectors[0].setDirection(velocityDir);
      this.vectors[0].position.copy(body.position);
    }

    // Update centripetal force vector (pointing to center)
    if (this.vectors.length > 1) {
      const forceDir = new THREE.Vector3(-Math.cos(angle), 0, -Math.sin(angle));
      this.vectors[1].setDirection(forceDir);
      this.vectors[1].position.copy(body.position);
    }
  }

  updateParameter(paramName: string, value: number) {
    this.params[paramName] = value;
  }
}
