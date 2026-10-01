import Lenis from "lenis";
import { gsap, ScrollTrigger } from "../utils/motion.js";
import { qsa } from "../utils/dom.js";

// Scroll suave (Lenis) ligado ao GSAP + links internos (#sobre, #contato…)
export class ScrollController {
  constructor() {
    // sempre começa do topo (a intro depende disso)
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    window.addEventListener("beforeunload", () => window.scrollTo(0, 0));

    this.lenis = new Lenis({ lerp: 0.09 });
    this.lenis.stop(); // travado até a intro terminar
    this.lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => this.lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    qsa('a[href^="#"]').forEach((a) =>
      a.addEventListener("click", (e) => {
        e.preventDefault();
        this.lenis.scrollTo(a.getAttribute("href"), { duration: 1.4 });
      }),
    );

    // fontes e imagens mudam as alturas → recalcula os gatilhos
    window.addEventListener("load", () => {
      if (document.body.classList.contains("is-loading")) this.lenis.scrollTo(0, { immediate: true, force: true });
      ScrollTrigger.refresh();
    });
  }

  start() {
    document.body.classList.remove("is-loading");
    this.lenis.start();
  }

  // fn recebe { scroll, velocity, ... } do Lenis
  onScroll(fn) {
    this.lenis.on("scroll", fn);
  }
}
