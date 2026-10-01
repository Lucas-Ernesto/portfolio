import { qsa } from "../utils/dom.js";

// Atualiza na tela todo texto marcado com data-i18n, sem recriar os elementos
// (assim as animações ligadas a eles continuam funcionando)
//   data-i18n="chave"            → texto
//   data-i18n-html="chave"       → texto com HTML (ex.: <em>)
//   data-i18n-attr="alt:chave"   → atributos (vários separados por ;)
export function applyTranslations(t, lang) {
  document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  qsa("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
  qsa("[data-i18n-html]").forEach((el) => (el.innerHTML = t(el.dataset.i18nHtml)));
  qsa("[data-i18n-attr]").forEach((el) =>
    el.dataset.i18nAttr.split(";").forEach((pair) => {
      const [attr, key] = pair.split(":");
      el.setAttribute(attr, t(key));
    }),
  );
  qsa("[data-lang]").forEach((el) => el.classList.toggle("is-active", el.dataset.lang === lang));
}
