import { STAR_PATH } from "../components/Logo.js";

// Estrela que segue o mouse + canvas do rastro dourado
export const CursorView = () => `
  <canvas class="cursor-trail" aria-hidden="true"></canvas>
  <div class="cursor" aria-hidden="true">
    <span class="cursor__star">
      <svg viewBox="0 0 24 24"><path fill="currentColor" d="${STAR_PATH}" /></svg>
    </span>
    <span class="cursor__label"></span>
  </div>`;
