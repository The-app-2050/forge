import { useEffect, useRef } from "react";

// variant: "matrix" | "rain" | "hex" | "binary"
export default function DataStream({ variant = "matrix", opacity = 0.35 }) {
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

    let frame;

    if (variant === "matrix" || variant === "rain") {
      // Matrix / green rain falling columns
      const CHARS = variant === "matrix"
        ? "アイウエオカキクケコサシスセソタチツテトナニヌネノ01アABCDEF∑∂∇∈∉⊕⊗"
        : "01 10 11 00 ABCDEF∑∂∇∈∉⊕";
      const fontSize = 13;
      const cols = Math.floor(canvas.width / fontSize);
      const drops = Array(cols).fill(1).map(() => Math.random() * -50);
      const colors = variant === "matrix"
        ? ["#8B5CF6", "#7C3AED", "#6D28D9", "#a78bfa", "#c4b5fd"]
        : ["#4F46E5", "#6366F1", "#818CF8", "#8B5CF6"];

      const draw = () => {
        ctx.fillStyle = "rgba(5,5,5,0.07)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < drops.length; i++) {
          const char = CHARS[Math.floor(Math.random() * CHARS.length)];
          ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
          ctx.font = `${fontSize}px monospace`;
          ctx.fillText(char, i * fontSize, drops[i] * fontSize);
          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i] += 0.5;
        }
        frame = requestAnimationFrame(draw);
      };
      draw();

    } else if (variant === "hex") {
      // Hex grid with pulsing nodes and flowing lines
      const nodes = [];
      const HEX_SIZE = 40;
      const cols2 = Math.ceil(canvas.width / (HEX_SIZE * 1.75)) + 1;
      const rows2 = Math.ceil(canvas.height / (HEX_SIZE * 1.5)) + 1;

      for (let r = 0; r < rows2; r++) {
        for (let c = 0; c < cols2; c++) {
          const x = c * HEX_SIZE * 1.75 + (r % 2 === 0 ? 0 : HEX_SIZE * 0.875);
          const y = r * HEX_SIZE * 1.5;
          nodes.push({ x, y, phase: Math.random() * Math.PI * 2, speed: 0.3 + Math.random() * 0.5 });
        }
      }

      let t = 0;
      const drawHex = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        t += 0.016;

        nodes.forEach(n => {
          const pulse = 0.4 + 0.6 * Math.sin(t * n.speed + n.phase);
          const alpha = pulse * 0.6;
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 6;
            const px = n.x + HEX_SIZE * 0.5 * Math.cos(angle);
            const py = n.y + HEX_SIZE * 0.5 * Math.sin(angle);
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.strokeStyle = `rgba(139,92,246,${alpha * 0.5})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();

          // Node dot
          ctx.beginPath();
          ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(167,139,250,${alpha})`;
          ctx.fill();
        });

        frame = requestAnimationFrame(drawHex);
      };
      drawHex();

    } else if (variant === "binary") {
      // Horizontal scrolling binary streams
      const STREAM_COUNT = 18;
      const streams = Array.from({ length: STREAM_COUNT }, (_, i) => ({
        y: (i / STREAM_COUNT) * canvas.height + Math.random() * 30,
        x: Math.random() * canvas.width,
        speed: 0.4 + Math.random() * 1.2,
        bits: Array.from({ length: 60 }, () => Math.round(Math.random())),
        hue: 260 + Math.random() * 40,
      }));

      const drawBinary = () => {
        ctx.fillStyle = "rgba(5,5,5,0.06)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        streams.forEach(s => {
          s.x -= s.speed;
          if (s.x < -800) { s.x = canvas.width + 100; s.y = Math.random() * canvas.height; }
          s.bits.forEach((bit, idx) => {
            const alpha = Math.max(0, 0.8 - idx * 0.015);
            ctx.fillStyle = `hsla(${s.hue},70%,70%,${alpha})`;
            ctx.font = "11px monospace";
            ctx.fillText(bit, s.x + idx * 14, s.y);
          });
          if (Math.random() > 0.98) s.bits = s.bits.map(() => Math.round(Math.random()));
        });
        frame = requestAnimationFrame(drawBinary);
      };
      drawBinary();
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity }}
    />
  );
}
