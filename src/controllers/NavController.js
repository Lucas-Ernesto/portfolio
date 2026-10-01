import { ScrollTrigger } from "../utils/motion.js";
import { qs } from "../utils/dom.js";

// Menu: some ao descer, volta ao subir, e fica escuro em cima do Contato
export class NavController {
  constructor({ scroll }) {
    const nav = qs(".nav");
    let lastY = 0;

    scroll.onScroll(({ scroll: y }) => {
      nav.classList.toggle("is-scrolled", y > 40);
      nav.classList.toggle("is-hidden", y > lastY && y > 300);
      lastY = y;
    });

    ScrollTrigger.create({
      trigger: ".contact",
      start: "top 40px",
      end: "max",
      toggleClass: { targets: nav, className: "is-dark" },
    });
  }
}
