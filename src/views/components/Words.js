// Quebra um texto em <span class="w"> por palavra (pra acender uma a uma no scroll)
export const wordsHTML = (text) =>
  text
    .trim()
    .split(/\s+/)
    .map((w) => `<span class="w">${w}</span>`)
    .join(" ");
