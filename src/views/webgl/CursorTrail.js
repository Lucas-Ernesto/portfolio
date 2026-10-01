import gsap from "gsap";

// Rastro dourado do cursor-estrela: uma linha suave que afina + faíscas que caem e somem
const GOLD = "201, 164, 106";
const TRAIL_LEN = 24;

function drawStar(ctx, x, y, r, rot) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.quadraticCurveTo(0, 0, 0, r);
  ctx.quadraticCurveTo(0, 0, -r, 0);
  ctx.quadraticCurveTo(0, 0, 0, -r);
  ctx.fill();
  ctx.restore();
}

// cursor = elemento da estrela; o rastro segue a posição/opacidade dele (animadas pelo CursorController)
export function createCursorTrail(canvas, cursor, { reduceMotion = false } = {}) {
  const ctx = canvas.getContext("2d");
  let dpr = 1;
  const resize = () => {
    dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
  };
  resize();
  window.addEventListener("resize", resize);

  const points = [];
  const sparks = [];
  // chuva de faíscas num ponto (usada quando a foto vira)
  const burst = (bx, by, n = 36) => {
    if (reduceMotion) return;
    for (let i = 0; i < n; i++) {
      const ang = Math.random() * Math.PI * 2;
      const sp = 120 + Math.random() * 380;
      sparks.push({
        x: bx,
        y: by,
        vx: Math.cos(ang) * sp,
        vy: Math.sin(ang) * sp - 80,
        life: 1 + Math.random() * 0.4,
        size: 3 + Math.random() * 5,
        rot: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 8,
      });
    }
  };
  if (reduceMotion) return { burst };
  let last = null;
  let visible = 1;

  gsap.ticker.add((_, deltaMs) => {
    const dt = Math.min(deltaMs / 1000, 0.05);
    const x = gsap.getProperty(cursor, "x");
    const y = gsap.getProperty(cursor, "y");
    visible += (Number(gsap.getProperty(cursor, "opacity")) - visible) * 0.2;

    points.unshift({ x, y });
    if (points.length > TRAIL_LEN) points.pop();

    // faíscas: nascem proporcionais à velocidade
    if (last) {
      const speed = Math.hypot(x - last.x, y - last.y);
      if (speed > 3 && Math.random() < Math.min(speed / 40, 0.7) && sparks.length < 60) {
        sparks.push({
          x: x + (Math.random() - 0.5) * 10,
          y: y + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 30 - (x - last.x) * 0.8,
          vy: (Math.random() - 0.5) * 30 - (y - last.y) * 0.8,
          life: 1,
          size: 2.5 + Math.random() * 3.5,
          rot: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 6,
        });
      }
    }
    last = { x, y };

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    if (visible < 0.01) {
      sparks.length = 0;
      return;
    }

    // linha que afina e esmaece (curvas pelos pontos médios = suave)
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (let i = 1; i < points.length - 1; i++) {
      const k = 1 - i / points.length;
      const a = points[i - 1];
      const b = points[i];
      const c = points[i + 1];
      if (Math.abs(a.x - c.x) + Math.abs(a.y - c.y) < 0.5) continue;
      ctx.beginPath();
      ctx.moveTo((a.x + b.x) / 2, (a.y + b.y) / 2);
      ctx.quadraticCurveTo(b.x, b.y, (b.x + c.x) / 2, (b.y + c.y) / 2);
      ctx.strokeStyle = `rgba(${GOLD}, ${0.55 * k * k * visible})`;
      ctx.lineWidth = 7 * k;
      ctx.stroke();
    }

    // faíscas
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.life -= dt * 1.3;
      if (s.life <= 0) {
        sparks.splice(i, 1);
        continue;
      }
      s.vx *= 0.94;
      s.vy = s.vy * 0.94 + 40 * dt; // gravidadezinha
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.rot += s.spin * dt;
      ctx.fillStyle = `rgba(${GOLD}, ${Math.min(s.life, 1) * visible})`;
      drawStar(ctx, s.x, s.y, s.size * (0.4 + s.life * 0.6), s.rot);
    }
  });
  return { burst };
}
