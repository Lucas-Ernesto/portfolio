import { gsap } from "../utils/motion.js";
import { qsa } from "../utils/dom.js";

// Elementos com data-magnetic são "puxados" pelo mouse e voltam com efeito elástico
export class MagneticController {
  constructor() {
    qsa("[data-magnetic]").forEach((el) => {
      const mx = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
      const my = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        mx((e.clientX - r.left - r.width / 2) * 0.3);
        my((e.clientY - r.top - r.height / 2) * 0.3);
      });
      el.addEventListener("pointerleave", () => {
        mx(0);
        my(0);
      });
    });
  }
}
