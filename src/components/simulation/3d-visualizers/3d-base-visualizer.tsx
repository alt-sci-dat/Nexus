"use client";

import * as THREE from "three";

export abstract class Base3DVisualizer {
  protected scene: THREE.Scene;
  protected camera: THREE.PerspectiveCamera;
  protected renderer: THREE.WebGLRenderer;
  protected container: HTMLDivElement;
  protected animationId: number | null = null;
  protected time: number = 0;
  protected params: Record<string, number> = {};
  protected objects: THREE.Object3D[] = [];
  protected vectors: THREE.ArrowHelper[] = [];

  constructor(container: HTMLDivElement, width: number = 500, height: number = 500) {
    this.container = container;

    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0f172a);
    this.scene.fog = new THREE.Fog(0x0f172a, 100, 500);

    // Camera setup
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 20);
    this.camera.lookAt(0, 0, 0);

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);

    // Start animation loop
    this.animate();

    // Handle window resize
    window.addEventListener("resize", () => this.onWindowResize());
  }

  protected onWindowResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  abstract initialize(): void;

  public abstract update(): void;

  abstract updateParameter(paramName: string, value: number): void;

  protected render() {
    this.renderer.render(this.scene, this.camera);
  }

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);
    this.time += 0.016; // ~60fps
    this.update();
    this.render();
  };

  dispose() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
    this.renderer.dispose();
    this.container.innerHTML = "";
  }
}
