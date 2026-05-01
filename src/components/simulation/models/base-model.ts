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

  protected makeLabel(text: string, color = "#e2e8f0", scale = 1): THREE.Sprite {
    const fontPx = 64;
    const padding = 12;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    ctx.font = `bold ${fontPx}px system-ui, -apple-system, "Segoe UI", sans-serif`;
    const metrics = ctx.measureText(text);
    const textWidth = Math.ceil(metrics.width);
    canvas.width = textWidth + padding * 2;
    canvas.height = fontPx + padding * 2;
    const ctx2 = canvas.getContext("2d")!;
    ctx2.font = ctx.font;
    ctx2.fillStyle = "rgba(15, 23, 42, 0.82)";
    ctx2.strokeStyle = "rgba(148, 163, 184, 0.55)";
    ctx2.lineWidth = 2;
    roundRect(ctx2, 1, 1, canvas.width - 2, canvas.height - 2, 14);
    ctx2.fill();
    ctx2.stroke();
    ctx2.fillStyle = color;
    ctx2.textBaseline = "middle";
    ctx2.fillText(text, padding, canvas.height / 2);
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false, depthWrite: false });
    const sprite = new THREE.Sprite(material);
    const aspect = canvas.width / canvas.height;
    sprite.scale.set(aspect * scale, scale, 1);
    sprite.renderOrder = 999;
    return sprite;
  }

  protected addLabel(text: string, position: THREE.Vector3, options: { color?: string; scale?: number; offsetY?: number } = {}): THREE.Sprite {
    const { color = "#e2e8f0", scale = 0.55, offsetY = 0.6 } = options;
    const sprite = this.makeLabel(text, color, scale);
    sprite.position.set(position.x, position.y + offsetY, position.z);
    this.scene.add(sprite);
    return sprite;
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

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
