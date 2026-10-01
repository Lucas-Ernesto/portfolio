import { gsap, ScrollTrigger, finePointer } from "../utils/motion.js";
import { qs } from "../utils/dom.js";

// Hero: liga o mouse, o clique e o scroll ao cubo 3D
export class HeroController {
  constructor({ reduceMotion }) {
    // estado compartilhado com o cubo; a intro e o scroll animam isso mesmo antes do cubo carregar
    this.state = { intro: 0, scroll: 0 };
    this.cube = null;
    this.loadCube(reduceMotion);

    window.addEventListener("pointermove", (e) => {
      this.cube?.setPointer((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    });

    // clicar no cubo embaralha (ignora cliques em links/botões por cima dele)
    window.addEventListener("click", (e) => {
      if (e.target.closest("a, button, [data-cursor]") || !this.isOverCube(e)) return;
      this.cube.poke();
    });

    // ao rolar: o cubo "explode" e sobe; o título sobe e esmaece
    ScrollTrigger.create({
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => (this.state.scroll = self.progress),
    });
    gsap.to(".hero__title, .hero__bottom", {
      yPercent: -30,
      opacity: 0.2,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });
  }

  // O Three.js (~570 KB) vem num arquivo separado, baixado só depois da página aparecer
  async loadCube(reduceMotion) {
    await new Promise((r) => requestAnimationFrame(() => setTimeout(r)));
    const { createRubikCube } = await import("../views/webgl/RubikCube.js");
    const lite = !finePointer || window.innerWidth < 800; // celular: modo leve
    this.cube = createRubikCube(qs(".webgl"), { reduceMotion, state: this.state, lite });
  }

  isOverCube(e) {
    return !!this.cube?.hitTest(e.clientX, e.clientY);
  }

  // usado pela intro: o cubo entra girando de baixo
  enter() {
    return gsap.to(this.state, { intro: 1, duration: 1.8, ease: "power4.out" });
  }
}
