import { SectionHead } from "../components/SectionHead.js";
import { wordsHTML } from "../components/Words.js";

const facts = [
  ["about.f1k", "about.f1v"],
  ["about.f2k", "about.f2v"],
  ["about.f3k", "about.f3v"],
];

// Verso da foto principal: cruz dourada + versículo
const FlipBack = (t) => `
  <div class="flip__face flip__back" aria-hidden="true">
    <svg class="cross" viewBox="0 0 100 140" fill="none">
      <path d="M50 8 V132" pathLength="1" />
      <path d="M18 44 H82" pathLength="1" />
    </svg>
    <blockquote class="verse">
      <p data-i18n="about.verse">${t("about.verse")}</p>
      <cite data-i18n="about.verseRef">${t("about.verseRef")}</cite>
    </blockquote>
    <span class="flip__faith" data-i18n="about.faith">${t("about.faith")}</span>
  </div>`;

export const AboutView = ({ t, profile }) => {
  const { main, secondary } = profile.photos;
  return `
  <section class="about" id="sobre">
    ${SectionHead({ t, num: "01", key: "about.label" })}

    <div class="about__grid">
      <div class="about__text">
        <p class="about__big js-words" data-i18n="about.big">${wordsHTML(t("about.big"))}</p>
        <p class="about__small" data-i18n="about.small">${t("about.small")}</p>
        <ul class="about__facts">
          ${facts
            .map(([k, v]) => `<li><span data-i18n="${k}">${t(k)}</span><strong data-i18n="${v}">${t(v)}</strong></li>`)
            .join("")}
        </ul>
      </div>

      <div class="about__photos">
        <figure class="flip" data-cursor="cursor.flip" role="button" tabindex="0" aria-pressed="false"
          data-i18n-attr="aria-label:about.flipLabel" aria-label="${t("about.flipLabel")}">
          <div class="flip__inner">
            <div class="flip__face flip__front photo">
              <div class="photo__inner">
                <img src="${main.src}" width="${main.width}" height="${main.height}" data-i18n-attr="alt:${main.altKey}" alt="${t(main.altKey)}" loading="lazy" decoding="async" />
              </div>
            </div>
            ${FlipBack(t)}
          </div>
        </figure>
        <figure class="photo photo--small">
          <div class="photo__inner">
            <img src="${secondary.src}" width="${secondary.width}" height="${secondary.height}" data-i18n-attr="alt:${secondary.altKey}" alt="${t(secondary.altKey)}" loading="lazy" decoding="async" />
          </div>
        </figure>
        <span class="about__sticker">✦ <span data-i18n="about.sticker">${t("about.sticker")}</span></span>
      </div>
    </div>
  </section>`;
};
