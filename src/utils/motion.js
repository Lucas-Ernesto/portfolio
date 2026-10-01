// GSAP configurado num lugar só + preferência de "reduzir movimento" do sistema
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// mouse de verdade (computador). Em celular/tablet: sem cursor-estrela, ímã e inclinação
export const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
export { gsap, ScrollTrigger };

// inclinação 3D seguindo o mouse (usada na foto e nas pastas)
export function bindTilt(el, { strength = 10, perspective = 1200 } = {}) {
  if (!finePointer) return; // no celular não tem "passar o mouse"
  el.addEventListener("pointermove", (e) => {
    const r = el.getBoundingClientRect();
    gsap.to(el, {
      rotateY: ((e.clientX - r.left) / r.width - 0.5) * strength,
      rotateX: -((e.clientY - r.top) / r.height - 0.5) * strength,
      transformPerspective: perspective,
      duration: 0.5,
      ease: "power3.out",
    });
  });
  el.addEventListener("pointerleave", () =>
    gsap.to(el, { rotateX: 0, rotateY: 0, duration: 1, ease: "elastic.out(1, 0.5)" }),
  );
}
