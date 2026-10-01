import { gsap, bindTilt } from "../utils/motion.js";
import { qs, qsa } from "../utils/dom.js";
import { wordsHTML } from "../views/components/Words.js";

// Sobre: texto que acende palavra por palavra, fotos com revelação e a foto que vira
export class AboutController {
  constructor({ cursor, onLangChange, reduceMotion }) {
    this.cursor = cursor;
    this.reduceMotion = reduceMotion;
    this.flipped = false;

    this.splitWords();
    onLangChange(() => this.splitWords(true)); // o texto novo precisa ser quebrado de novo

    this.revealPhotos();
    this.bindFlip();
  }

  // acende cada palavra do parágrafo grande conforme rola
  // (a view já entrega as palavras quebradas; só refaz quando o texto muda)
  splitWords(force = false) {
    this.wordsTween?.scrollTrigger?.kill();
    this.wordsTween?.kill();
    const el = qs(".js-words");
    if (force || !qs(".w", el)) el.innerHTML = wordsHTML(el.textContent);
    this.wordsTween = gsap.to(qsa(".w", el), {
      opacity: 1,
      stagger: 0.1,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true },
    });
  }

  revealPhotos() {
    // fotos sobem de dentro de uma máscara + parallax leve
    qsa(".photo").forEach((photo, i) => {
      gsap.to(qs(".photo__inner", photo), {
        clipPath: "inset(0% 0 0 0)",
        duration: 1.4,
        delay: i * 0.15,
        ease: "power4.inOut",
        scrollTrigger: { trigger: photo, start: "top 85%" },
      });
      gsap.fromTo(
        qs("img", photo),
        { yPercent: -12 },
        { yPercent: 0, ease: "none", scrollTrigger: { trigger: photo, start: "top bottom", end: "bottom top", scrub: true } },
      );
    });

    gsap.from(".about__sticker", {
      scale: 0,
      rotate: -30,
      duration: 1,
      ease: "back.out(2)",
      scrollTrigger: { trigger: ".about__photos", start: "top 60%" },
    });
    gsap.from(".about__small, .about__facts li", {
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.08,
      ease: "power3.out",
      scrollTrigger: { trigger: ".about__small", start: "top 85%" },
    });
  }

  bindFlip() {
    this.flip = qs(".flip");
    this.flip.addEventListener("click", () => this.toggleFlip());
    this.flip.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.toggleFlip();
      }
    });
    bindTilt(this.flip, { strength: 10 });
  }

  // frente = foto; verso = cruz dourada sendo desenhada + versículo
  toggleFlip() {
    const flipped = (this.flipped = !this.flipped);
    const flip = this.flip;
    const inner = qs(".flip__inner", flip);

    flip.setAttribute("aria-pressed", String(flipped));
    flip.dataset.cursor = flipped ? "cursor.unflip" : "cursor.flip";
    this.cursor.setLabel(flip.dataset.cursor);

    gsap.to(inner, { rotateY: flipped ? 180 : 0, duration: this.reduceMotion ? 0.01 : 1.1, ease: "power3.inOut" });
    gsap.fromTo(inner, { scale: 1 }, { scale: 0.93, duration: 0.55, yoyo: true, repeat: 1, ease: "power2.inOut" });

    // a foto pequena sai da frente do verso
    gsap.to(".photo--small", {
      x: flipped ? 40 : 0,
      y: flipped ? 50 : 0,
      rotate: flipped ? 8 : 0,
      opacity: flipped ? 0 : 1,
      duration: 0.9,
      ease: "power3.inOut",
    });
    gsap.to(".about__sticker", { autoAlpha: flipped ? 0 : 1, duration: 0.4 });
    if (!flipped) return;

    gsap.fromTo(
      qsa(".cross path", flip),
      { strokeDashoffset: 1 },
      { strokeDashoffset: 0, duration: 0.9, stagger: 0.35, delay: 0.55, ease: "power2.inOut" },
    );
    gsap.fromTo(
      qsa(".verse, .flip__faith", flip),
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.8, delay: 1.2, stagger: 0.12, ease: "power3.out" },
    );
    gsap.delayedCall(0.6, () => {
      const r = flip.getBoundingClientRect();
      this.cursor.burst(r.left + r.width / 2, r.top + r.height * 0.38);
    });
  }
}
