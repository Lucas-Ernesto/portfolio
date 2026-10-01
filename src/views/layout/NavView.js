import { LogoMark, LogoName } from "../components/Logo.js";

const links = [
  { href: "#sobre", key: "nav.about" },
  { href: "#projetos", key: "nav.work" },
  { href: "#stack", key: "nav.stack" },
];

export const NavView = ({ t, lang, profile }) => `
  <header class="nav">
    <a href="#top" class="nav__logo" data-magnetic aria-label="${profile.name.first} ${profile.name.last}">
      ${LogoMark({ className: "nav__mark" })}
      ${LogoName({ className: "nav__name", name: profile.name })}
    </a>
    <nav class="nav__links">
      ${links.map((l) => `<a href="${l.href}" data-i18n="${l.key}">${t(l.key)}</a>`).join("")}
    </nav>
    <div class="nav__right">
      <button class="lang" type="button" data-i18n-attr="aria-label:meta.langLabel" aria-label="${t("meta.langLabel")}">
        ${["pt", "en"]
          .map((l) => `<span data-lang="${l}" class="${l === lang ? "is-active" : ""}">${l.toUpperCase()}</span>`)
          .join('<span class="lang__sep">/</span>')}
      </button>
      <a href="#contato" class="btn btn--dark" data-magnetic data-i18n="nav.cta">${t("nav.cta")}</a>
    </div>
  </header>`;
