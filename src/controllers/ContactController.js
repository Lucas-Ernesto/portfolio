import { qs } from "../utils/dom.js";

// Contato: copiar o e-mail no clique + relógio com o horário local
export class ContactController {
  constructor({ profile }) {
    const mail = qs(".contact__mail");
    const toast = qs(".contact__toast");
    mail.addEventListener("click", () => {
      navigator.clipboard?.writeText(mail.dataset.copy).then(() => {
        toast.classList.add("is-on");
        setTimeout(() => toast.classList.remove("is-on"), 2000);
      });
    });

    const clock = qs(".js-time");
    const tick = () =>
      (clock.textContent = new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: profile.timezone,
      }));
    tick();
    setInterval(tick, 30000);
  }
}
