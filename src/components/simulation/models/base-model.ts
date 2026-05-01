"use client";

import * as THREE from "three";

export type ModelParams = Record<string, number>;

export abstract class BaseModel {
  protected scene: THREE.Scene;
  protected camera: THREE.PerspectiveCamera;
  protected renderer: THREE.WebGLRenderer;
  protected container: HTMLDivElement;
  protected animationId: number | null = null;
  protected time = 0;
  protected params: ModelParams;
  protected disposed = false;
  protected resizeHandler: () => void;

  constructor(container: HTMLDivElement, initialParams: ModelParams = {}) {
    this.container = container;
    this.params = { ...initialParams };

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0b1120);

    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.set(6, 4, 8);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.55);
    this.scene.add(ambient);
    const key = new THREE.DirectionalLight(0xffffff, 0.85);
    key.position.set(8, 12, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    this.scene.add(key);
    const fill = new THREE.DirectionalLight(0x88aaff, 0.25);
    fill.position.set(-6, 4, -4);
    this.scene.add(fill);

    this.resizeHandler = () => this.handleResize();
    window.addEventListener("resize", this.resizeHandler);
  }

  protected addGroundPlane(color = 0x1f2937, size = 30): THREE.Mesh {
    const geo = new THREE.PlaneGeometry(size, size);
    const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.95 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -0.01;
    mesh.receiveShadow = true;
    this.scene.add(mesh);
    return mesh;
  }

  protected addAxes(size = 4) {
    const helper = new THREE.AxesHelper(size);
    this.scene.add(helper);
  }

  protected makeArrow(
    dir: THREE.Vector3,
    origin: THREE.Vector3,
    length: number,
    color: number,
  ): THREE.ArrowHelper {
    const arrow = new THREE.ArrowHelper(dir.clone().normalize(), origin, length, color, length * 0.25, length * 0.18);
    this.scene.add(arrow);
    return arrow;
  }

  start() {
    const tick = () => {
      if (this.disposed) return;
      this.animationId = requestAnimationFrame(tick);
      this.time += 1 / 60;
      this.update(this.time);
      this.renderer.render(this.scene, this.camera);
    };
    tick();
  }

  setParam(name: string, value: number) {
    this.params[name] = value;
    this.onParamChange(name, value);
  }

  protected onParamChange(_name: string, _value: number) {}

  protected handleResize() {
    const width = this.container.clientWidth || 600;
    const height = this.container.clientHeight || 500;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  abstract initialize(): void;

  abstract update(t: number): void;

  dispose() {
    this.disposed = true;
    if (this.animationId !== null) cancelAnimationFrame(this.animationId);
    window.removeEventListener("resize", this.resizeHandler);
    this.scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose?.();
      const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose?.());
      else mat?.dispose?.();
    });
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
