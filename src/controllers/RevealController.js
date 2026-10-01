import { gsap } from "../utils/motion.js";
import { qsa } from "../utils/dom.js";

// Títulos grandes com a classe js-lines: cada linha sobe quando aparece na tela
export class RevealController {
  constructor() {
    qsa(".js-lines").forEach((title) =>
      gsap.from(qsa(".line > span", title), {
        yPercent: 110,
        duration: 1.2,
        stagger: 0.1,
        ease: "power4.out",
        scrollTrigger: { trigger: title, start: "top 85%" },
      }),
    );
  }
}
