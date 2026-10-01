import { SectionHead } from "../components/SectionHead.js";
import { LinesTitle } from "../components/LinesTitle.js";

// Fechamento escuro: e-mail grande, redes e rodapé
export const ContactView = ({ t, profile }) => `
  <section class="contact" id="contato">
    ${SectionHead({ t, num: "04", key: "contact.label", light: true })}
    ${LinesTitle({ t, className: "contact__title", lines: [{ key: "contact.t1" }, { key: "contact.t2", html: true }] })}

    <a class="contact__mail" href="mailto:${profile.email}" data-cursor="cursor.copy" data-copy="${profile.email}">
      <span>${profile.email}</span>
      <span class="contact__arrow">↗</span>
    </a>
    <p class="contact__toast" data-i18n="contact.copied" aria-live="polite">${t("contact.copied")}</p>

    <div class="contact__socials">
      ${profile.socials
        .map((s) => `<a href="${s.href}" target="_blank" rel="noopener" class="social" data-magnetic>${s.label} <span>↗</span></a>`)
        .join("")}
    </div>

    <footer class="footer">
      <span>© <span class="js-year">${new Date().getFullYear()}</span> ${profile.name.first} ${profile.name.last}</span>
      <span><span data-i18n="footer.time">${t("footer.time")}</span> · <span class="js-time">--:--</span> BRT</span>
      <a href="#top" class="footer__top" data-i18n="footer.top">${t("footer.top")}</a>
    </footer>
  </section>`;
