import { gsap, bindTilt } from "../utils/motion.js";
import { qsa } from "../utils/dom.js";

// Projetos: as pastas entram em sequência e inclinam seguindo o mouse
// (o hover de abrir a pasta é só CSS, em styles/sections/work.css)
export class WorkController {
  constructor() {
    gsap.from(".folder", {
      y: 120,
      rotateX: -25,
      opacity: 0,
      duration: 1.3,
      stagger: 0.12,
      ease: "power4.out",
      scrollTrigger: { trigger: ".folders", start: "top 85%" },
    });
    qsa(".folder").forEach((folder) => bindTilt(folder, { strength: 12, perspective: 1000 }));
  }
}
