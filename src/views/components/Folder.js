import { STAR_PATH } from "./Logo.js";

// O que sobe de dentro da pasta no hover
const visuals = {
  image: (v) =>
    `<img class="folder__obj folder__obj--shot" src="${v.src}" width="${v.width}" height="${v.height}" alt="" loading="lazy" decoding="async" />`,
  star: () => `
    <svg class="folder__obj folder__obj--star" viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#f4e2b8" />
          <stop offset=".5" stop-color="#c9a46a" />
          <stop offset="1" stop-color="#7d5f33" />
        </linearGradient>
      </defs>
      <path fill="url(#goldGrad)" d="${STAR_PATH}" />
    </svg>`,
  plus: () => `<span class="folder__obj folder__obj--plus" aria-hidden="true">+</span>`,
};

// Card em formato de pasta: a frente desce no hover e revela o visual
export function Folder({ t, project, index }) {
  const key = (field) => `project.${project.id}.${field}`;
  const num = String(index + 1).padStart(2, "0");

  // com link vira <a>; sem link (ex.: "em breve") vira <div>
  const tag = project.href ? "a" : "div";
  const linkAttrs = project.href
    ? `href="${project.href}"${project.external ? ' target="_blank" rel="noopener"' : ""}`
    : "";

  return `
    <${tag} ${linkAttrs} class="folder folder--${project.theme}" data-cursor="${project.cursor}">
      <div class="folder__back">
        <span class="folder__iri"></span>
        ${visuals[project.visual.type](project.visual)}
      </div>
      <div class="folder__front">
        <span class="folder__tab"></span>
        <div class="folder__body">
          <div class="folder__top"><span class="folder__num">${num}</span><span class="folder__arrow">↗</span></div>
          <h3 class="folder__title" data-i18n="${key("title")}">${t(key("title"))}</h3>
          <p class="folder__desc" data-i18n="${key("desc")}">${t(key("desc"))}</p>
          <span class="folder__meta">
            ${project.live ? '<span class="dot"></span>' : ""}
            <span data-i18n="${key("status")}">${t(key("status"))}</span>
          </span>
        </div>
      </div>
    </${tag}>`;
}
