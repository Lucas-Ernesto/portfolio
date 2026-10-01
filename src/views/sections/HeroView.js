import { LinesTitle } from "../components/LinesTitle.js";

// Primeira dobra: cubo 3D (canvas) atrás + título gigante
export const HeroView = ({ t }) => `
  <section class="hero">
    <canvas class="webgl" aria-hidden="true"></canvas>

    <div class="hero__meta">
      <span class="dot"></span>
      <span data-i18n="hero.status">${t("hero.status")}</span>
    </div>

    ${LinesTitle({
      t,
      tag: "h1",
      className: "hero__title",
      reveal: false,
      lines: [{ key: "hero.l1" }, { key: "hero.l2", html: true }],
    })}

    <div class="hero__bottom">
      <p class="hero__lead" data-i18n="hero.lead">${t("hero.lead")}</p>
      <div class="hero__scroll">
        <span data-i18n="hero.scroll">${t("hero.scroll")}</span>
        <span class="hero__scroll-line"></span>
      </div>
    </div>
  </section>`;
