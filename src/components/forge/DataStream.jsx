import { useEffect, useRef } from "react";

// Realistic futuristic code tokens — clearly readable, sci-fi aesthetic
const CODE_TOKENS = [
  "0x7F3A", "01101001", "∑(nΨ)", "INIT_CORE", "0xDEAD",
  "λ→∞", "SYNC()", "01010110", "∇²Ψ=0", "LOAD[0x3F]",
  "CRC_OK", "∂t/∂x", "EXEC::7", "0b1011", "PING::ACK",
  "ΛΦ=true", "HASH:9A2", "BOOT_SEQ", "∈ℝ³", "TX::FF",
  "Σ[0..n]", "KILL -9", "DECRYPT", "0xCAFE", "∮B·dA",
  "NEURAL+", "FORK()", "01001", "∆v=0", "SYS::OK",
  "RX::ACK", "ΨΩ[t]", "ACCESS+", "0xFF00", "TRACE()",
  "COMPILE", "∫f(x)dx", "UPLINK!", "0x1337", "PURGE::7",
  "AI::WAKE", "FORGE_OS", "∂/∂t", "SCAN[]", "KEY:0xA9",
  "MEM_OK", "∇·E=ρ", "RESUME", "0b11110", "CORE++",
];

export default function DataStream({ variant = "matrix", opacity = 1, crystalY = 120 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const getSink = () => ({ x: canvas.width / 2, y: crystalY });

    // Two layers: column streams (background) + spiraling tokens (foreground)
    // --- COLUMN STREAMS (Matrix-style falling columns that get pulled up) ---
    const FONT_SIZE = 12;
    let cols = [];
    const initCols = () => {
      const count = Math.floor(canvas.width / (FONT_SIZE * 2.8));
      cols = Array.from({ length: count }, (_, i) => ({
        x: i * FONT_SIZE * 2.8 + FONT_SIZE * 0.8,
        y: canvas.height + Math.random() * canvas.height,
        speed: 0.8 + Math.random() * 1.4,
        chars: Array.from({ length: 14 }, () => CODE_TOKENS[Math.floor(Math.random() * CODE_TOKENS.length)]),
        brightness: 0.3 + Math.random() * 0.4,
        hue: 260 + Math.random() * 50,
      }));
    };
    initCols();

    // --- VORTEX TOKENS (spiral into crystal) ---
    const TOKEN_COUNT = 30;

    const makeToken = () => {
      const sink = getSink();
      const side = Math.random();
      let x, y;
      if (side < 0.45) {
        x = Math.random() * canvas.width;
        y = canvas.height + 30 + Math.random() * 80;
      } else if (side < 0.7) {
        x = -10 - Math.random() * 60;
        y = sink.y + 60 + Math.random() * (canvas.height - sink.y);
      } else if (side < 0.95) {
        x = canvas.width + 10 + Math.random() * 60;
        y = sink.y + 60 + Math.random() * (canvas.height - sink.y);
      } else {
        const angle = Math.random() * Math.PI * 2;
        const r = 100 + Math.random() * 200;
        x = sink.x + Math.cos(angle) * r;
        y = sink.y + 100 + Math.random() * 200;
      }
      return {
        x, y,
        vx: 0, vy: 0,
        token: CODE_TOKENS[Math.floor(Math.random() * CODE_TOKENS.length)],
        fontSize: 11 + Math.floor(Math.random() * 6),
        life: 0,
        maxLife: 140 + Math.random() * 180,
        spin: (Math.random() - 0.5) * 0.06,
        flickerTimer: 0,
        flickerInterval: 20 + Math.floor(Math.random() * 40),
        colorIdx: Math.floor(Math.random() * 5),
      };
    };

    let tokens = Array.from({ length: TOKEN_COUNT }, makeToken);

    // Vivid futuristic palette — bright so they stand out
    const COLORS = [
      "#c084fc", // bright violet
      "#a78bfa", // lavender
      "#e879f9", // magenta
      "#818cf8", // indigo
      "#f0abfc", // pink-violet
      "#ddd6fe", // near-white violet
      "#7c3aed", // deep violet
    ];

    let t = 0;
    let frame;

    const draw = () => {
      frame = requestAnimationFrame(draw);
      t += 0.016;

      // Stronger fade — clears faster, less visual noise
      ctx.fillStyle = "rgba(5,5,5,0.28)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const sink = getSink();

      // ── Radial vortex glow at crystal sink ──
      const vortexGrad = ctx.createRadialGradient(sink.x, sink.y, 0, sink.x, sink.y, 110);
      vortexGrad.addColorStop(0, `rgba(192,132,252,${0.28 + Math.sin(t * 2.2) * 0.1})`);
      vortexGrad.addColorStop(0.45, `rgba(124,58,237,${0.12 + Math.sin(t * 1.5) * 0.05})`);
      vortexGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = vortexGrad;
      ctx.fillRect(sink.x - 120, sink.y - 120, 240, 240);

      // ── Expanding absorption rings ──
      for (let ri = 0; ri < 3; ri++) {
        const phase = (t * 0.7 + ri * 0.333) % 1;
        const r = 15 + phase * 100;
        const alpha = (1 - phase) * 0.22;
        ctx.beginPath();
        ctx.arc(sink.x, sink.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(192,132,252,${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // ── Column streams (background layer) ──
      ctx.save();
      cols.forEach(col => {
        // Move column upward toward sink
        const dx = sink.x - col.x;
        const distX = Math.abs(dx);
        // Columns drift upward and slightly toward center
        col.y -= col.speed;
        col.x += dx * 0.0008;

        if (col.y < crystalY - 40) {
          // Reset to bottom
          col.y = canvas.height + Math.random() * 80;
          col.chars = Array.from({ length: 18 }, () => CODE_TOKENS[Math.floor(Math.random() * CODE_TOKENS.length)]);
        }

        col.chars.forEach((ch, idx) => {
          const charY = col.y + idx * (FONT_SIZE + 4);
          if (charY < 0 || charY > canvas.height + 20) return;

          // Head char is brightest
          const isHead = idx === 0;
          const distFromSink = Math.sqrt((col.x - sink.x) ** 2 + (charY - sink.y) ** 2);
          const proximity = Math.max(0, 1 - distFromSink / 320);

          const baseAlpha = isHead ? 0.65 : Math.max(0.05, 0.35 - idx * 0.03);
          const alpha = baseAlpha * (0.4 + proximity * 0.4);

          ctx.globalAlpha = alpha;
          ctx.font = `bold ${FONT_SIZE}px 'Courier New', monospace`;
          ctx.shadowBlur = isHead ? 8 : (proximity > 0.5 ? 5 : 1);

          if (isHead) {
            ctx.fillStyle = "#f0abfc";
            ctx.shadowColor = "#e879f9";
          } else {
            const g = Math.floor(80 + proximity * 120);
            ctx.fillStyle = `hsl(${270 + proximity * 30}, 80%, ${45 + proximity * 30}%)`;
            ctx.shadowColor = "#c084fc";
          }

          ctx.fillText(ch, col.x, charY);

          // Flicker head char
          if (isHead && Math.random() < 0.05) {
            col.chars[0] = CODE_TOKENS[Math.floor(Math.random() * CODE_TOKENS.length)];
          }
        });
      });
      ctx.restore();

      // ── Vortex tokens (foreground — spiral into crystal) ──
      tokens.forEach((p, i) => {
        p.life++;
        p.flickerTimer++;

        const dx = sink.x - p.x;
        const dy = sink.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        // Strong pull + spiral
        const pull = 0.018 + Math.pow(Math.max(0, 1 - dist / 300), 2.2) * 0.3;
        const tangent = p.spin * Math.min(dist / 60, 1.2);
        p.vx += (dx / dist) * pull + (-dy / dist) * tangent;
        p.vy += (dy / dist) * pull + (dx / dist) * tangent;
        p.vx *= 0.90;
        p.vy *= 0.90;
        p.x += p.vx;
        p.y += p.vy;

        // Swap token text occasionally
        if (p.flickerTimer >= p.flickerInterval) {
          p.token = CODE_TOKENS[Math.floor(Math.random() * CODE_TOKENS.length)];
          p.flickerTimer = 0;
        }

        const fadeIn = Math.min(p.life / 20, 1);
        const absorbFade = Math.min(dist / 25, 1);
        // Bright flicker as it approaches
        const flicker = dist < 100 ? (0.7 + 0.3 * Math.sin(t * 8 + i)) : 1;
        const alpha = fadeIn * absorbFade * flicker;

        // Font grows slightly as it nears the crystal (energy surge)
        const surge = dist < 80 ? 1 + (1 - dist / 80) * 0.4 : 1;
        const color = COLORS[p.colorIdx % COLORS.length];

        ctx.save();
        ctx.globalAlpha = Math.min(alpha * 0.75, 0.85);
        ctx.font = `bold ${Math.round(p.fontSize * surge)}px 'Courier New', monospace`;
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = dist < 60 ? 10 : dist < 130 ? 5 : 2;
        ctx.fillText(p.token, p.x, p.y);
        ctx.restore();

        // Energy thread to sink
        if (dist < 160) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / 160) * 0.18;
          ctx.strokeStyle = color;
          ctx.lineWidth = 0.8;
          ctx.setLineDash([3, 5]);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
 
