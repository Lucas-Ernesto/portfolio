import { gsap, ScrollTrigger } from "../utils/motion.js";
import { qs } from "../utils/dom.js";
import { createRubikCube } from "../views/webgl/RubikCube.js";

// Hero: liga o mouse, o clique e o scroll ao cubo 3D
export class HeroController {
  constructor({ reduceMotion }) {
    this.cube = createRubikCube(qs(".webgl"), { reduceMotion });

    window.addEventListener("pointermove", (e) => {
      this.cube.setPointer((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
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
      onUpdate: (self) => (this.cube.state.scroll = self.progress),
    });
    gsap.to(".hero__title, .hero__bottom", {
      yPercent: -30,
      opacity: 0.2,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });
  }

  isOverCube(e) {
    return this.cube.hitTest(e.clientX, e.clientY);
  }

  // usado pela intro: o cubo entra girando de baixo
  enter() {
    return gsap.to(this.cube.state, { intro: 1, duration: 1.8, ease: "power4.out" });
  }
}
