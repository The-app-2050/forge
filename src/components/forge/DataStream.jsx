import { useEffect, useRef } from "react";

// Realistic futuristic code tokens
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

    const TOKEN_COUNT = 30;
    const makeToken = () => {
      const sink = getSink();
      const side = Math.random();
      let x, y;
      if (side < 0.45) { x = Math.random() * canvas.width; y = canvas.height + 30 + Math.random() * 80; }
      else if (side < 0.7) { x = -10 - Math.random() * 60; y = sink.y + 60 + Math.random() * (canvas.height - sink.y); }
      else if (side < 0.95) { x = canvas.width + 10 + Math.random() * 60; y = sink.y + 60 + Math.random() * (canvas.height - sink.y); }
      else { const angle = Math.random() * Math.PI * 2; const r = 100 + Math.random() * 200; x = sink.x + Math.cos(angle) * r; y = sink.y + 100 + Math.random() * 200; }
      return { x, y, vx: 0, vy: 0, token: CODE_TOKENS[Math.floor(Math.random() * CODE_TOKENS.length)], fontSize: 11 + Math.floor(Math.random() * 6), life: 0, maxLife: 140 + Math.random() * 180, spin: (Math.random() - 0.5) * 0.06, flickerTimer: 0, flickerInterval: 20 + Math.floor(Math.random() * 40), colorIdx: Math.floor(Math.random() * 5) };
    };

    let tokens = Array.from({ length: TOKEN_COUNT }, makeToken);
    const COLORS = ["#c084fc", "#a78bfa", "#e879f9", "#818cf8", "#f0abfc", "#ddd6fe", "#7c3aed"];

    let t = 0;
    let frame;

    const draw = () => {
      frame = requestAnimationFrame(draw);
      t += 0.016;
      ctx.fillStyle = "rgba(5,5,5,0.28)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const sink = getSink();

      tokens.forEach((p, i) => {
        p.life++;
        p.flickerTimer++;
        const dx = sink.x - p.x;
        const dy = sink.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const pull = 0.018 + Math.pow(Math.max(0, 1 - dist / 300), 2.2) * 0.3;
        const tangent = p.spin * Math.min(dist / 60, 1.2);
        p.vx += (dx / dist) * pull + (-dy / dist) * tangent;
        p.vy += (dy / dist) * pull + (dx / dist) * tangent;
        p.vx *= 0.90; p.vy *= 0.90; p.x += p.vx; p.y += p.vy;

        if (p.flickerTimer >= p.flickerInterval) {
          p.token = CODE_TOKENS[Math.floor(Math.random() * CODE_TOKENS.length)];
          p.flickerTimer = 0;
        }

        const alpha = Math.min(p.life / 20, 1) * Math.min(dist / 25, 1);
        const color = COLORS[p.colorIdx % COLORS.length];

        ctx.save();
        ctx.globalAlpha = Math.min(alpha * 0.75, 0.85);
        ctx.font = `bold ${Math.round(p.fontSize)}px 'Courier New', monospace`;
        ctx.fillStyle = color;
        ctx.fillText(p.token, p.x, p.y);
        ctx.restore();

        if (dist < 160) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / 160) * 0.18;
          ctx.strokeStyle = color;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(sink.x, sink.y);
          ctx.stroke();
          ctx.restore();
        }

        if (dist < 10) tokens[i] = makeToken();
      });
    };

    draw();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [crystalY]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}
