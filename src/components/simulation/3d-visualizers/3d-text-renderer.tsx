import * as THREE from "three";
import { Base3DVisualizer } from "./3d-base-visualizer";

interface TextConfig {
  text?: string;
  size?: number;
  height?: number;
  color?: number;
  emissive?: number;
  metalness?: number;
  roughness?: number;
  animation?: "rotate" | "float" | "pulse" | "none";
}

interface TextConfigRequired {
  text: string;
  size: number;
  height: number;
  color: number;
  emissive: number;
  metalness: number;
  roughness: number;
  animation: "rotate" | "float" | "pulse" | "none";
}

export class Text3DRenderer extends Base3DVisualizer {
  private textMesh: THREE.Mesh | null = null;
  private config: TextConfigRequired;
  private fontLoaded: boolean = false;
  private animationSpeed: number = 0.01;

  constructor(container: HTMLDivElement, config: TextConfig = {}) {
    super(container);
    this.config = {
      text: config.text ?? "Nexus",
      size: config.size ?? 2,
      height: config.height ?? 0.5,
      color: config.color ?? 0x00d9ff,
      emissive: config.emissive ?? 0x0088ff,
      metalness: config.metalness ?? 0.7,
      roughness: config.roughness ?? 0.2,
      animation: config.animation ?? "rotate",
    };
    this.initialize();
  }

  public initialize(): void {
    // Enhanced lighting for 3D text
    this.scene.background = new THREE.Color(0x0a0e27);
    
    // Add rim light for dramatic effect
    const rimLight = new THREE.DirectionalLight(0x00d9ff, 0.5);
    rimLight.position.set(-10, 15, 10);
    this.scene.add(rimLight);

    // Main key light
    const keyLight = new THREE.DirectionalLight(0xffffff, 1);
    keyLight.position.set(10, 20, 10);
    keyLight.castShadow = true;
    this.scene.add(keyLight);

    // Fill light
    const fillLight = new THREE.DirectionalLight(0x0088ff, 0.4);
    fillLight.position.set(-15, 5, -10);
    this.scene.add(fillLight);

    // Ambient for overall glow
    const ambientLight = new THREE.AmbientLight(0x0055aa, 0.5);
    this.scene.add(ambientLight);

    this.createText3D();
  }

  private createText3D(): void {
    // Create canvas-based text texture as fallback
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    canvas.width = 512;
    canvas.height = 256;
    
    const displayText = this.config.text || "Nexus";

    if (ctx) {
      ctx.fillStyle = "transparent";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00d9ff";
      ctx.font = "bold 120px 'Arial', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "#0088ff";
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.fillText(displayText, canvas.width / 2, canvas.height / 2);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearFilter;

    // Create extruded geometry for 3D effect
    const geometry = new THREE.PlaneGeometry(this.config.size * 2, this.config.size);
    
    // Create material with emissive glow
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      emissiveMap: texture,
      emissive: this.config.emissive,
      emissiveIntensity: 0.6,
      metalness: this.config.metalness,
      roughness: this.config.roughness,
      transparent: true,
      side: THREE.DoubleSide,
    });

    // Create extruded version with depth
    const extrudeGeometry = new THREE.BoxGeometry(
      this.config.size * 2,
      this.config.size,
      this.config.height
    );

    const extrudeMaterial = new THREE.MeshStandardMaterial({
      color: this.config.color,
      emissive: this.config.emissive,
      emissiveIntensity: 0.4,
      metalness: 0.8,
      roughness: 0.1,
      side: THREE.FrontSide,
    });

    this.textMesh = new THREE.Mesh(extrudeGeometry, extrudeMaterial);
    this.textMesh.castShadow = true;
    this.textMesh.receiveShadow = true;
    this.scene.add(this.textMesh);

    // Add glowing halo effect
    this.addHaloEffect();

    // Position camera to view text properly
    this.camera.position.z = 8;
    this.camera.lookAt(0, 0, 0);
  }

  private addHaloEffect(): void {
    if (!this.textMesh) return;

    // Create outer glow geometry
    const glowGeometry = new THREE.BoxGeometry(
      this.config.size * 2.2,
      this.config.size * 1.2,
      this.config.height * 1.2
    );

    const glowMaterial = new THREE.MeshBasicMaterial({
      color: this.config.emissive,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide,
    });

    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    glowMesh.position.z = this.textMesh.position.z - 0.1;
    this.scene.add(glowMesh);

    // Store in objects array for animation
    this.objects.push(glowMesh);
  }

  public update(): void {
    if (!this.textMesh) return;

    switch (this.config.animation) {
      case "rotate":
        this.textMesh.rotation.x += this.animationSpeed * 0.5;
        this.textMesh.rotation.y += this.animationSpeed;
        this.textMesh.rotation.z += this.animationSpeed * 0.3;
        break;

      case "float":
        this.textMesh.position.y = Math.sin(this.time * 2) * 0.3;
        this.textMesh.rotation.z = Math.cos(this.time * 1.5) * 0.2;
        break;

      case "pulse":
        const scale = 1 + Math.sin(this.time * 3) * 0.1;
        this.textMesh.scale.set(scale, scale, scale);
        
        // Pulsing emissive intensity
        if (this.textMesh.material instanceof THREE.MeshStandardMaterial) {
          this.textMesh.material.emissiveIntensity = 0.3 + Math.sin(this.time * 3) * 0.3;
        }
        break;

      case "none":
      default:
        break;
    }

    this.time += 0.016;
  }

  public updateParameter(paramName: string, value: number): void {
    switch (paramName) {
      case "animationSpeed":
        this.animationSpeed = value;
        break;
      case "emissiveIntensity":
        if (this.textMesh?.material instanceof THREE.MeshStandardMaterial) {
          this.textMesh.material.emissiveIntensity = value;
        }
        break;
    }
  }
}

/**
 * React component for 3D text rendering
 */
import React, { useEffect, useRef } from "react";

interface Text3DProps {
  text: string;
  size?: number;
  height?: number;
  animation?: "rotate" | "float" | "pulse" | "none";
  className?: string;
}

export function Text3D({
  text,
  size = 2,
  height = 0.5,
  animation = "rotate",
  className = "",
}: Text3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<Text3DRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const renderer = new Text3DRenderer(containerRef.current, {
      text,
      size,
      height,
      animation,
      color: 0x00d9ff,
      emissive: 0x0088ff,
    });

    rendererRef.current = renderer;

    return () => {
      renderer.dispose();
    };
  }, [text, size, height, animation]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-950 to-slate-900 ${className}`}
      style={{
        height: "300px",
        background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)",
      }}
    />
  );
}
