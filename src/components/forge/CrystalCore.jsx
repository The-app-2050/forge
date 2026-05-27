import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function CrystalCore({ size = 180 }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const W = size;
    const H = size;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.set(0, 0, 4.5);

    // Crystal geometry
    const crystalGeo = new THREE.CylinderGeometry(0.55, 0.55, 1.6, 6, 1, false);
    const topCapGeo = new THREE.ConeGeometry(0.55, 0.75, 6);
    const botCapGeo = new THREE.ConeGeometry(0.55, 0.75, 6);

    const crystalMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x7c3aed),
      emissive: new THREE.Color(0x6d28d9),
      emissiveIntensity: 0.8,
      metalness: 0.1,
      roughness: 0.05,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide,
    });

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xc084fc,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });

    // Inner glowing core mesh
    const innerGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.3, 6);
    const innerMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xddd6fe),
      emissive: new THREE.Color(0xa855f7),
      emissiveIntensity: 2.5,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
    });
    const innerTop = new THREE.ConeGeometry(0.3, 0.55, 6);
    const innerBot = new THREE.ConeGeometry(0.3, 0.55, 6);

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

    const innerBodyMesh = new THREE.Mesh(innerGeo, innerMat);
    const innerTopMesh = new THREE.Mesh(innerTop, innerMat);
    const innerBotMesh = new THREE.Mesh(innerBot, innerMat);
    innerTopMesh.position.y = 0.925;
    innerBotMesh.position.y = -0.925;
    innerBotMesh.rotation.z = Math.PI;

    const crystal = new THREE.Group();
    crystal.add(body, bodyWire, top, topWire, bot, botWire,
      innerBodyMesh, innerTopMesh, innerBotMesh);
    scene.add(crystal);

    // Absorption ring plane — flat disc that pulses
    const ringGeo = new THREE.RingGeometry(0.6, 1.2, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.0,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);

    // Glow sprite
    const glowTex = (() => {
      const canvas = document.createElement("canvas");
      canvas.width = 128; canvas.height = 128;
      const ctx = canvas.getContext("2d");
      const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, "rgba(192,132,252,0.9)");
      grad.addColorStop(0.35, "rgba(139,92,246,0.45)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
      return new THREE.CanvasTexture(canvas);
    })();

    const glowMat = new THREE.SpriteMaterial({ map: glowTex, transparent: true, blending: THREE.AdditiveBlending });
    const glow = new THREE.Sprite(glowMat);
    glow.scale.set(5, 5, 1);
    scene.add(glow);

    // Inner glow sprite (smaller, brighter — the absorption core)
    const innerGlowMat = new THREE.SpriteMaterial({ map: glowTex, transparent: true, blending: THREE.AdditiveBlending });
    const innerGlow = new THREE.Sprite(innerGlowMat);
    innerGlow.scale.set(2.2, 2.2, 1);
    scene.add(innerGlow);

    // Particles being sucked in
    const sparkGeo = new THREE.BufferGeometry();
    const sparkCount = 50;
    const positions = new Float32Array(sparkCount * 3);
    for (let i = 0; i < sparkCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 1.3 + Math.random() * 1.0;
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    sparkGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const sparkMat = new THREE.PointsMaterial({
      color: 0xddd6fe,
      size: 0.05,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const sparks = new THREE.Points(sparkGeo, sparkMat);
    scene.add(sparks);

    // Lights
    scene.add(new THREE.AmbientLight(0x1a0533, 2.5));

    const pointViolet = new THREE.PointLight(0x9333ea, 12, 10);
    pointViolet.position.set(2, 2, 3);
    scene.add(pointViolet);

    const pointWhite = new THREE.PointLight(0xffffff, 4, 10);
    pointWhite.position.set(-2, -1, 2);
    scene.add(pointWhite);

    const pointCore = new THREE.PointLight(0xc084fc, 8, 6);
    pointCore.position.set(0, 0, 1);
    scene.add(pointCore);

    let frame;
    const clock = new THREE.Clock();

    const animate = () => {
      frame = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Rotation
      crystal.rotation.y = t * 0.55;
      crystal.rotation.x = Math.sin(t * 0.35) * 0.22;
      crystal.rotation.z = Math.cos(t * 0.28) * 0.07;

      // Float
      crystal.position.y = Math.sin(t * 0.85) * 0.09;

      // Outer glow pulse
      const outerPulse = 0.75 + Math.sin(t * 1.4) * 0.25;
      glow.scale.set(5 * outerPulse, 5 * outerPulse, 1);
      glowMat.opacity = 0.5 + Math.sin(t * 2) * 0.15;

      // Inner glow — absorption heartbeat, faster pulse
      const absorbPulse = 0.8 + Math.sin(t * 3.5) * 0.2;
      innerGlow.scale.set(2.2 * absorbPulse, 2.2 * absorbPulse, 1);
      innerGlowMat.opacity = 0.55 + Math.sin(t * 4) * 0.25;

      // Inner crystal emissive breathe
      innerMat.emissiveIntensity = 2.0 + Math.sin(t * 3.5) * 0.8;
      crystalMat.emissiveIntensity = 0.6 + Math.sin(t * 1.8) * 0.3;

      // Absorption ring pulse (expands out from crystal)
      const ringPhase = (t * 0.9) % 1;
      ring.scale.set(1 + ringPhase * 2, 1 + ringPhase * 2, 1);
      ringMat.opacity = (1 - ringPhase) * 0.3;

      // Core light pulse
      pointCore.intensity = 6 + Math.sin(t * 3.5) * 4;

      // Sparks spiral inward
      const pos = sparkGeo.attributes.position.array;
      for (let i = 0; i < sparkCount; i++) {
        const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;
        const len = Math.sqrt(pos[ix] ** 2 + pos[iy] ** 2 + pos[iz] ** 2);
        // Pull toward center
        pos[ix] *= 0.997;
        pos[iy] *= 0.997;
        pos[iz] *= 0.997;
        // Respawn when close
        if (len < 0.15) {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI;
          const r = 1.3 + Math.random() * 1.0;
          pos[ix] = r * Math.sin(phi) * Math.cos(theta);
          pos[iy] = r * Math.cos(phi);
          pos[iz] = r * Math.sin(phi) * Math.sin(theta);
        }
      }
      sparkGeo.attributes.position.needsUpdate = true;

      // Light orbit
      pointViolet.position.x = Math.cos(t * 0.85) * 3;
      pointViolet.position.z = Math.sin(t * 0.85) * 3;

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
    <div ref={mountRef} style={{ width: size, height: size }} className="relative" />
  );
}
