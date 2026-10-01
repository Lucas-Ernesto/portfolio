import { gsap, ScrollTrigger } from "../utils/motion.js";
import { qs } from "../utils/dom.js";

// Botão PT/EN: esmaece os textos, troca o idioma no model e mostra de novo
// (quem atualiza a tela são as views/controllers inscritos em onLangChange)
export class LanguageController {
  constructor({ toggleLang }) {
    const targets = "main [data-i18n]:not(.contact__toast), main [data-i18n-html], .nav__links";

    qs(".lang").addEventListener("click", () => {
      gsap.to(targets, {
        opacity: 0,
        duration: 0.25,
        onComplete: () => {
          toggleLang();
          ScrollTrigger.refresh();
          gsap.to(targets, { opacity: 1, duration: 0.5, clearProps: "opacity" });
        },
      });
    });
  }
}
