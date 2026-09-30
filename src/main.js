import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { createCube } from "./cube.js";
import { applyLang, getLang, t } from "./i18n.js";
import { initCursorTrail } from "./cursor.js";

gsap.registerPlugin(ScrollTrigger);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

applyLang();

// sempre começa do topo (a intro depende disso)
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
window.scrollTo(0, 0);
window.addEventListener("beforeunload", () => window.scrollTo(0, 0));

// ---------- Scroll suave ----------
const lenis = new Lenis({ lerp: 0.09 });
lenis.stop();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// Menu: some ao descer, volta ao subir
const nav = document.querySelector(".nav");
let lastY = 0;
lenis.on("scroll", ({ scroll }) => {
  nav.classList.toggle("is-scrolled", scroll > 40);
  nav.classList.toggle("is-hidden", scroll > lastY && scroll > 300);
  lastY = scroll;
});

ScrollTrigger.create({ trigger: ".contact", start: "top 40px", end: "max", toggleClass: { targets: nav, className: "is-dark" } });

document.querySelectorAll('a[href^="#"]').forEach((a) =>
  a.addEventListener("click", (e) => {
    e.preventDefault();
    lenis.scrollTo(a.getAttribute("href"), { duration: 1.4 });
  }),
);

// ---------- Cubo mágico 3D ----------
const avatar = createCube(document.querySelector(".webgl"), { reduceMotion });

ScrollTrigger.create({
  trigger: ".hero",
  start: "top top",
  end: "bottom top",
  scrub: true,
  onUpdate: (self) => (avatar.state.scroll = self.progress),
});

gsap.to(".hero__title, .hero__bottom", {
  yPercent: -30,
  opacity: 0.2,
  ease: "none",
  scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
});

// ---------- Cursor ----------
const cursor = document.querySelector(".cursor");
const label = cursor.querySelector(".cursor__label");
const xTo = gsap.quickTo(cursor, "x", { duration: 0.15, ease: "power3" });
const yTo = gsap.quickTo(cursor, "y", { duration: 0.15, ease: "power3" });
const trail = initCursorTrail(cursor, document.querySelector(".cursor-trail"), { reduceMotion });

window.addEventListener("pointermove", (e) => {
  xTo(e.clientX);
  yTo(e.clientY);
  const labeled = e.target.closest("[data-cursor]");
  const interactive = !labeled && e.target.closest("a, button");
  const overAvatar = !labeled && !interactive && avatar.hitTest(e);
  let text = "";
  if (labeled) text = (getLang() === "en" && labeled.dataset.cursorEn) || labeled.dataset.cursor;
  else if (overAvatar) text = t("cursor.avatar");
  cursor.classList.toggle("is-hover", !!interactive);
  cursor.classList.toggle("is-label", !!text);
  cursor.classList.toggle("is-dark", !!e.target.closest(".contact"));
  cursor.classList.toggle("is-on-btn", !!e.target.closest(".btn--dark"));
  if (text) label.textContent = text;
});

// Clicar no cubo: embaralha rápido
window.addEventListener("click", (e) => {
  if (e.target.closest("a, button, [data-cursor]") || !avatar.hitTest(e)) return;
  avatar.poke();
});

// ---------- Botões magnéticos ----------
document.querySelectorAll("[data-magnetic]").forEach((el) => {
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

// ---------- Sobre: texto acende palavra por palavra ----------
let wordsTween;
function splitWords() {
  wordsTween?.scrollTrigger?.kill();
  wordsTween?.kill();
  const el = document.querySelector(".js-words");
  el.innerHTML = el.textContent
    .trim()
    .split(/\s+/)
    .map((w) => `<span class="w">${w}</span>`)
    .join(" ");
  wordsTween = gsap.to(el.querySelectorAll(".w"), {
    opacity: 1,
    stagger: 0.1,
    ease: "none",
    scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true },
  });
}
splitWords();

// Fotos: revelam de baixo pra cima + parallax
gsap.utils.toArray(".photo").forEach((photo, i) => {
  gsap.to(photo.querySelector(".photo__inner"), {
    clipPath: "inset(0% 0 0 0)",
    duration: 1.4,
    delay: i * 0.15,
    ease: "power4.inOut",
    scrollTrigger: { trigger: photo, start: "top 85%" },
  });
  gsap.fromTo(
    photo.querySelector("img"),
    { yPercent: -12 },
    { yPercent: 0, ease: "none", scrollTrigger: { trigger: photo, start: "top bottom", end: "bottom top", scrub: true } },
  );
});
// Foto que vira: frente = foto, verso = cruz dourada sendo desenhada + versículo
const flip = document.querySelector(".flip");
const flipInner = flip.querySelector(".flip__inner");
let flipped = false;
function toggleFlip() {
  flipped = !flipped;
  flip.setAttribute("aria-pressed", String(flipped));
  flip.dataset.cursor = flipped ? "Desvirar" : "Vira a foto";
  flip.dataset.cursorEn = flipped ? "Flip back" : "Flip it";
  cursor.querySelector(".cursor__label").textContent = getLang() === "en" ? flip.dataset.cursorEn : flip.dataset.cursor;
  gsap.to(flipInner, { rotateY: flipped ? 180 : 0, duration: reduceMotion ? 0.01 : 1.1, ease: "power3.inOut" });
  gsap.fromTo(flipInner, { scale: 1 }, { scale: 0.93, duration: 0.55, yoyo: true, repeat: 1, ease: "power2.inOut" });
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
    flip.querySelectorAll(".cross path"),
    { strokeDashoffset: 1 },
    { strokeDashoffset: 0, duration: 0.9, stagger: 0.35, delay: 0.55, ease: "power2.inOut" },
  );
  gsap.fromTo(
    flip.querySelectorAll(".verse, .flip__faith"),
    { opacity: 0, y: 14 },
    { opacity: 1, y: 0, duration: 0.8, delay: 1.2, stagger: 0.12, ease: "power3.out" },
  );
  gsap.delayedCall(0.6, () => {
    const r = flip.getBoundingClientRect();
    trail.burst(r.left + r.width / 2, r.top + r.height * 0.38);
  });
}
flip.addEventListener("click", toggleFlip);
flip.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    toggleFlip();
  }
});
// inclina de leve seguindo o mouse
flip.addEventListener("pointermove", (e) => {
  const r = flip.getBoundingClientRect();
  gsap.to(flip, {
    rotateY: ((e.clientX - r.left) / r.width - 0.5) * 10,
    rotateX: -((e.clientY - r.top) / r.height - 0.5) * 10,
    transformPerspective: 1200,
    duration: 0.6,
    ease: "power3.out",
  });
});
flip.addEventListener("pointerleave", () => gsap.to(flip, { rotateX: 0, rotateY: 0, duration: 1, ease: "elastic.out(1, 0.5)" }));

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

// ---------- Títulos grandes: linhas sobem ----------
gsap.utils.toArray(".work__title, .contact__title").forEach((title) =>
  gsap.from(title.querySelectorAll(".line > span"), {
    yPercent: 110,
    duration: 1.2,
    stagger: 0.1,
    ease: "power4.out",
    scrollTrigger: { trigger: title, start: "top 85%" },
  }),
);

// ---------- Projetos: pastas ----------
gsap.from(".folder", {
  y: 120,
  rotateX: -25,
  opacity: 0,
  duration: 1.3,
  stagger: 0.12,
  ease: "power4.out",
  scrollTrigger: { trigger: ".folders", start: "top 85%" },
});

// cada pasta inclina seguindo o mouse
document.querySelectorAll(".folder").forEach((folder) => {
  folder.addEventListener("pointermove", (e) => {
    const r = folder.getBoundingClientRect();
    gsap.to(folder, {
      rotateY: ((e.clientX - r.left) / r.width - 0.5) * 12,
      rotateX: -((e.clientY - r.top) / r.height - 0.5) * 12,
      transformPerspective: 1000,
      duration: 0.5,
      ease: "power3.out",
    });
  });
  folder.addEventListener("pointerleave", () =>
    gsap.to(folder, { rotateX: 0, rotateY: 0, duration: 1, ease: "elastic.out(1, 0.5)" }),
  );
});

// ---------- Marquees: aceleram com a velocidade do scroll ----------
const marquees = [];
function buildMarquees() {
  marquees.forEach((m) => m.kill());
  marquees.length = 0;
  document.querySelectorAll(".strip__track, .stack__track").forEach((track) => {
    const rev = !!track.closest(".stack__row--rev");
    const tween = gsap.fromTo(
      track,
      { xPercent: rev ? -50 : 0 },
      { xPercent: rev ? 0 : -50, duration: track.classList.contains("strip__track") ? 30 : 40, ease: "none", repeat: -1 },
    );
    if (reduceMotion) tween.pause();
    marquees.push(tween);
  });
}
buildMarquees();
if (!reduceMotion) {
  let boost = 1;
  lenis.on("scroll", ({ velocity }) => {
    boost = 1 + Math.min(Math.abs(velocity) * 0.15, 5);
  });
  gsap.ticker.add(() => {
    boost += (1 - boost) * 0.05;
    marquees.forEach((m) => m.timeScale(boost));
  });
}

// ---------- Contato ----------
const mail = document.querySelector(".contact__mail");
const toast = document.querySelector(".contact__toast");
mail.addEventListener("click", () => {
  navigator.clipboard?.writeText(mail.dataset.copy).then(() => {
    toast.classList.add("is-on");
    setTimeout(() => toast.classList.remove("is-on"), 2000);
  });
});

document.querySelector(".js-year").textContent = new Date().getFullYear();
const timeEl = document.querySelector(".js-time");
const updateTime = () =>
  (timeEl.textContent = new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  }));
updateTime();
setInterval(updateTime, 30000);

// ---------- Idioma ----------
document.querySelector(".lang").addEventListener("click", () => {
  const next = getLang() === "pt" ? "en" : "pt";
  const targets = "main [data-i18n]:not(.contact__toast), main [data-i18n-html], .nav__links";
  gsap.to(targets, {
    opacity: 0,
    duration: 0.25,
    onComplete: () => {
      applyLang(next);
      splitWords();
      buildMarquees();
      ScrollTrigger.refresh();
      gsap.to(targets, { opacity: 1, duration: 0.5, clearProps: "opacity" });
    },
  });
});

// ---------- Loader + intro ----------
const count = { v: 0 };
const countEl = document.querySelector(".js-count");
const intro = gsap.timeline({ delay: 0.2 });

intro
  .to(count, {
    v: 100,
    duration: reduceMotion ? 0.3 : 1.8,
    ease: "power2.inOut",
    onUpdate: () => (countEl.textContent = Math.round(count.v)),
  })
  .to(".loader__bar span", { scaleX: 1, duration: reduceMotion ? 0.3 : 1.8, ease: "power2.inOut" }, "<")
  .to(".loader", { yPercent: -100, duration: 1, ease: "power4.inOut" })
  .add(() => {
    document.body.classList.remove("is-loading");
    lenis.start();
  })
  .to(avatar.state, { intro: 1, duration: 1.8, ease: "power4.out" }, "-=0.6")
  .from(".hero__title .line > span", { yPercent: 110, duration: 1.2, stagger: 0.1, ease: "power4.out" }, "<0.1")
  .from(".nav > *, .hero__meta, .hero__bottom > *", { opacity: 0, y: 20, duration: 0.8, stagger: 0.06 }, "<0.3");

// fontes/imagens mudam alturas → recalcula os gatilhos
window.addEventListener("load", () => {
  if (document.body.classList.contains("is-loading")) lenis.scrollTo(0, { immediate: true, force: true });
  ScrollTrigger.refresh();
});
