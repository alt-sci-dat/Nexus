"use client";

import * as THREE from "three";
import { Base3DVisualizer } from "./3d-base-visualizer";

export class AdvancedMechanics3D extends Base3DVisualizer {
  private visualizationType: "projectile" | "pendulum" | "spring" | "energy" | "momentum" = "projectile";

  constructor(container: HTMLDivElement) {
    super(container);
    this.objects = [];
    this.vectors = [];
  }

  initialize() {
    this.params = {
      velocity: 20,
      angle: 45,
      amplitude: 2,
      frequency: 1,
      length: 5,
      mass: 1,
    };

    this.visualizationType = "projectile";
    this.initializeProjectile();
  }

  private initializeProjectile() {
    // Clear scene
    this.objects.forEach((obj) => this.scene.remove(obj));
    this.vectors.forEach((vec) => vec.dispose());
    this.objects = [];
    this.vectors = [];

    // Launch platform
    const platformGeo = new THREE.BoxGeometry(2, 0.2, 2);
    const platformMat = new THREE.MeshStandardMaterial({ color: 0x4f46e5 });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.castShadow = true;
    platform.receiveShadow = true;
    this.scene.add(platform);
    this.objects.push(platform);

    // Projectile
    const ballGeo = new THREE.SphereGeometry(0.3, 32, 32);
    const ballMat = new THREE.MeshStandardMaterial({ color: 0xff6b6b, metalness: 0.4, roughness: 0.4 });
    const ball = new THREE.Mesh(ballGeo, ballMat);
    ball.castShadow = true;
    ball.position.set(0, 1, 0);
    this.scene.add(ball);
    this.objects.push(ball);

    // Velocity arrow
    const velArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0.5, 0).normalize(), new THREE.Vector3(0, 1, 0), 3, 0x00ff00);
    this.scene.add(velArrow);
    this.vectors.push(velArrow);

    // Ground plane
    const groundGeo = new THREE.PlaneGeometry(50, 50);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0, roughness: 0.8 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -10;
    ground.receiveShadow = true;
    this.scene.add(ground);
    this.objects.push(ground);
  }

  public update() {
    if (!this.objects || !this.objects.length) return;

    const ball = this.objects[1]; // Second object is the ball
    if (!ball) return;

    const angleRad = (this.params.angle * Math.PI) / 180;
    const vx = this.params.velocity * Math.cos(angleRad) * 0.05;
    const vy = this.params.velocity * Math.sin(angleRad) * 0.05 - 9.8 * this.time * 0.01;

    const t = this.time * 0.05;
    ball.position.x = vx * t;
    ball.position.y = 1 + (this.params.velocity * Math.sin(angleRad) * 0.05 * t) - 4.9 * t * t;
    ball.position.z = 0;

    // Reset if ball goes too low
    if (ball.position.y < -5) {
      this.time = 0;
      ball.position.set(0, 1, 0);
    }

    // Update velocity arrow
    if (this.vectors.length > 0) {
      const arrow = this.vectors[0];
      const direction = new THREE.Vector3(Math.cos(angleRad), Math.sin(angleRad), 0);
      arrow.setDirection(direction);
      arrow.setLength(Math.sqrt(this.params.velocity) * 0.3);
    }
  }

  updateParameter(paramName: string, value: number) {
    this.params[paramName] = value;
    if (paramName === "visualizationType") {
      this.visualizationType = value === 1 ? "pendulum" : value === 2 ? "spring" : "projectile";
      this.initialize();
    }
  }
}
