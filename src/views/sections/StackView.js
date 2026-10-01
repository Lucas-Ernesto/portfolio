import { SectionHead } from "../components/SectionHead.js";
import { MarqueeTrack } from "../components/Marquee.js";

// Faixas gigantes com as ferramentas; as linhas ímpares correm ao contrário e vazadas
export const StackView = ({ t, rows }) => `
  <section class="stack" id="stack">
    ${SectionHead({ t, num: "03", key: "stack.label" })}
    <div class="stack__rows">
      ${rows
        .map((items, i) => {
          const reverse = i % 2 === 1;
          return `
          <div class="stack__row${reverse ? " stack__row--rev" : ""}">
            ${MarqueeTrack({ className: "stack__track", items, separator: "/", speed: 40, reverse })}
          </div>`;
        })
        .join("")}
    </div>
  </section>`;
