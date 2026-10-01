// Cabeçalho pequeno das seções: "(01) SOBRE MIM"
export const SectionHead = ({ t, num, key, light = false }) => `
  <div class="section-head${light ? " section-head--light" : ""}">
    <span class="section-head__num">(${num})</span>
    <span data-i18n="${key}">${t(key)}</span>
  </div>`;
