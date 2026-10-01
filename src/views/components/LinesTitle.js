// Título grande em linhas; cada linha sobe de dentro de uma "máscara"
// lines = [{ key, html }] → html: true quando o texto tem <em>
// reveal: true anima ao rolar (classe js-lines); o hero anima na intro, então usa false
export const LinesTitle = ({ t, tag = "h2", className, lines, reveal = true }) => `
  <${tag} class="${className}${reveal ? " js-lines" : ""}">
    ${lines
      .map(
        ({ key, html }) =>
          `<span class="line"><span ${html ? "data-i18n-html" : "data-i18n"}="${key}">${t(key)}</span></span>`,
      )
      .join("")}
  </${tag}>`;
