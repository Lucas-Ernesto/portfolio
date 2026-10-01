import { LogoMark, LogoName } from "../components/Logo.js";

// Tela preta de abertura: monograma se desenhando + contador
export const LoaderView = ({ profile }) => `
  <div class="loader" aria-hidden="true">
    ${LogoMark({ className: "loader__mark", dot: 0 })}
    ${LogoName({ className: "loader__name", name: profile.name })}
    <div class="loader__count"><span class="js-count">0</span>%</div>
    <div class="loader__bar"><span></span></div>
  </div>`;
