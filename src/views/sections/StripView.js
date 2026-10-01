import { MarqueeTrack, marqueeItems } from "../components/Marquee.js";
import { qs } from "../../utils/dom.js";

// Faixa de serviços logo abaixo do hero (traduz)
export const StripView = ({ t }) => `
  <section class="strip" aria-hidden="true">
    ${MarqueeTrack({ className: "strip__track", items: t("strip.items"), separator: "✦", speed: 30 })}
  </section>`;

// Chamado quando o idioma muda
export function updateStripView(t) {
  qs(".strip__track").innerHTML = marqueeItems(t("strip.items"), "✦");
}
