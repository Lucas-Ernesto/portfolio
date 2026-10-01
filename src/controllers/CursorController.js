import { gsap } from "../utils/motion.js";
import { qs } from "../utils/dom.js";
import { createCursorTrail } from "../views/webgl/CursorTrail.js";

// Cursor estrela: segue o mouse e muda de estado conforme o que está embaixo
//   is-hover  → link/botão comum (estrela cresce)
//   is-label  → algo clicável com interação (estrela branca + etiqueta com texto)
//   is-on-btn → em cima do botão dourado (estrela branca)
//   is-dark   → na seção escura de contato
export class CursorController {
  constructor({ t, isOverCube, reduceMotion }) {
    this.t = t;
    this.el = qs(".cursor");
    this.label = qs(".cursor__label", this.el);
    this.trail = createCursorTrail(qs(".cursor-trail"), this.el, { reduceMotion });

    const xTo = gsap.quickTo(this.el, "x", { duration: 0.15, ease: "power3" });
    const yTo = gsap.quickTo(this.el, "y", { duration: 0.15, ease: "power3" });

    window.addEventListener("pointermove", (e) => {
      // só esconde a setinha nativa quando for mouse de verdade
      if (e.pointerType === "mouse") document.documentElement.classList.add("has-cursor");
      xTo(e.clientX);
      yTo(e.clientY);

      const labeled = e.target.closest("[data-cursor]");
      const interactive = !labeled && e.target.closest("a, button");
      const overCube = !labeled && !interactive && isOverCube(e);
      const labelKey = labeled?.dataset.cursor ?? (overCube ? "cursor.cube" : null);

      this.el.classList.toggle("is-hover", !!interactive);
      this.el.classList.toggle("is-label", !!labelKey);
      this.el.classList.toggle("is-dark", !!e.target.closest(".contact"));
      this.el.classList.toggle("is-on-btn", !!e.target.closest(".btn--dark"));
      if (labelKey) this.setLabel(labelKey);
    });

    window.addEventListener("pointerdown", () => this.el.classList.add("is-down"));
    window.addEventListener("pointerup", () => this.el.classList.remove("is-down"));
    document.addEventListener("mouseleave", () => gsap.to(this.el, { opacity: 0, duration: 0.3 }));
    document.addEventListener("mouseenter", () => gsap.to(this.el, { opacity: 1, duration: 0.3 }));
  }

  setLabel(key) {
    this.label.textContent = this.t(key);
  }

  // chuva de faíscas douradas num ponto da tela
  burst(x, y) {
    this.trail.burst(x, y);
  }
}
