import { gsap } from "../utils/motion.js";
import { qs } from "../utils/dom.js";

// Sequência de abertura: loader (monograma + contador) → cortina sobe → hero entra
export class IntroController {
  constructor({ scroll, hero, reduceMotion }) {
    this.scroll = scroll;
    this.hero = hero;
    this.d = reduceMotion ? 0.01 : 1; // multiplicador de duração
  }

  play() {
    const d = this.d;
    const count = { v: 0 };
    const countEl = qs(".js-count");

    return (
      gsap
        .timeline({ delay: 0.2 })
        // contador e barra correm juntos do começo ao fim
        .to(count, { v: 100, duration: 2.6 * d, ease: "power1.inOut", onUpdate: () => (countEl.textContent = Math.round(count.v)) }, 0)
        .to(".loader__bar span", { scaleX: 1, duration: 2.6 * d, ease: "power1.inOut" }, 0)
        // monograma: surge do desfoque, desenha os traços e o ponto "quica"
        .fromTo(".loader__mark", { opacity: 0, scale: 0.9, filter: "blur(10px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1 * d, ease: "power3.out" }, 0)
        .to(".loader__mark path", { strokeDashoffset: 0, duration: 1.3 * d, stagger: 0.2 * d, ease: "power3.inOut" }, 0.15 * d)
        .to(".loader__mark circle", { attr: { r: 4 }, duration: 1 * d, ease: "elastic.out(1, 0.45)" }, 1.35 * d)
        .fromTo(".loader__name", { opacity: 0.25, filter: "blur(12px)" }, { opacity: 1, filter: "blur(0px)", duration: 1.6 * d, ease: "power2.out" }, 0.3 * d)
        // saída: tudo flutua pra cima antes da cortina subir
        .to(".loader__mark, .loader__name", { y: -28, opacity: 0, filter: "blur(8px)", duration: 0.7 * d, stagger: 0.06, ease: "power2.in" }, "+=0.25")
        .to(".loader__count, .loader__bar", { opacity: 0, duration: 0.5 * d }, "<")
        .to(".loader", { yPercent: -100, duration: 1.1, ease: "power4.inOut" }, "-=0.25")
        .add(() => this.scroll.start())
        // hero
        .add(this.hero.enter(), "-=0.6")
        .from(".hero__title .line > span", { yPercent: 110, duration: 1.2, stagger: 0.1, ease: "power4.out" }, "<0.1")
        .from(".nav > *, .hero__meta, .hero__bottom > *", { opacity: 0, y: 20, duration: 0.8, stagger: 0.06 }, "<0.3")
    );
  }
}
