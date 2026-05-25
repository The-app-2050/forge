import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function CrystalCore({ size = 180 }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const W = size;
    const H = size;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.set(0, 0, 4.5);

    // Crystal geometry — double-terminated hexagonal prism
    const crystalGeo = new THREE.CylinderGeometry(0.55, 0.55, 1.6, 6, 1, false);
    const topCapGeo = new THREE.ConeGeometry(0.55, 0.75, 6);
    const botCapGeo = new THREE.ConeGeometry(0.55, 0.75, 6);

    // Crystal material — translucent violet glass
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x6b21c8),
      emissive: new THREE.Color(0x4c1d95),
      emissiveIntensity: 0.4,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.7,
      thickness: 1.2,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      wireframe: false,
    });

    // Wireframe overlay
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x9333ea,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });

    const body = new THREE.Mesh(crystalGeo, crystalMat);
    const bodyWire = new THREE.Mesh(crystalGeo, wireMat);
    const top = new THREE.Mesh(topCapGeo, crystalMat);
    const topWire = new THREE.Mesh(topCapGeo, wireMat);
    const bot = new THREE.Mesh(botCapGeo, crystalMat);
    const botWire = new THREE.Mesh(botCapGeo, wireMat);

    top.position.y = 1.175;
    topWire.position.y = 1.175;
    bot.position.y = -1.175;
    bot.rotation.z = Math.PI;
    botWire.position.y = -1.175;
    botWire.rotation.z = Math.PI;

    const crystal = new THREE.Group();
    crystal.add(body, bodyWire, top, topWire, bot, botWire);
    scene.add(crystal);

    // Glow sprite
    const glowTex = (() => {
      const canvas = document.createElement("canvas");
      canvas.width = 128; canvas.height = 128;
      const ctx = canvas.getContext("2d");
      const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, "rgba(168,85,247,0.8)");
      grad.addColorStop(0.4, "rgba(139,92,246,0.3)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
      return new THREE.CanvasTexture(canvas);
    })();

    const glowMat = new THREE.SpriteMaterial({ map: glowTex, transparent: true, blending: THREE.AdditiveBlending });
    const glow = new THREE.Sprite(glowMat);
    glow.scale.set(4.5, 4.5, 1);
    scene.add(glow);

    // Sparkle particles
    const sparkGeo = new THREE.BufferGeometry();
    const sparkCount = 40;
    const positions = new Float32Array(sparkCount * 3);
    for (let i = 0; i < sparkCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 1.2 + Math.random() * 1.2;
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    sparkGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const sparkMat = new THREE.PointsMaterial({
      color: 0xc084fc,
      size: 0.04,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const sparks = new THREE.Points(sparkGeo, sparkMat);
    scene.add(sparks);

    // Lights
    const ambient = new THREE.AmbientLight(0x1a0533, 2);
    scene.add(ambient);

    const pointViolet = new THREE.PointLight(0x9333ea, 8, 10);
    pointViolet.position.set(2, 2, 3);
    scene.add(pointViolet);

    const pointWhite = new THREE.PointLight(0xffffff, 3, 10);
    pointWhite.position.set(-2, -1, 2);
    scene.add(pointWhite);

    const pointBlue = new THREE.PointLight(0x4338ca, 4, 8);
    pointBlue.position.set(0, -3, 1);
    scene.add(pointBlue);

    // Animation
    let frame;
    const clock = new THREE.Clock();

    const animate = () => {
      frame = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Fluid rotation
      crystal.rotation.y = t * 0.6;
      crystal.rotation.x = Math.sin(t * 0.4) * 0.25;
      crystal.rotation.z = Math.cos(t * 0.3) * 0.08;

      // Floating bob
      crystal.position.y = Math.sin(t * 0.8) * 0.08;

      // Pulse glow
      const pulse = 0.8 + Math.sin(t * 1.5) * 0.2;
      glow.scale.set(4.5 * pulse, 4.5 * pulse, 1);
      glowMat.opacity = 0.6 + Math.sin(t * 2) * 0.15;

      // Emissive pulse
      crystalMat.emissiveIntensity = 0.35 + Math.sin(t * 1.8) * 0.15;

      // Sparks rotate slowly
      sparks.rotation.y = t * 0.15;
      sparks.rotation.x = t * 0.08;

      // Light orbit
      pointViolet.position.x = Math.cos(t * 0.9) * 3;
      pointViolet.position.z = Math.sin(t * 0.9) * 3;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [size]);

  return (
    <div
      ref={mountRef}
      style={{ width: size, height: size }}
      className="relative"
    />
  );
}
