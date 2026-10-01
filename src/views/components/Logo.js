// Monograma LE: L e E num traço só + ponto dourado
// dot = raio inicial do ponto (o loader começa em 0 e anima até 4)
export const LogoMark = ({ className, dot = 4 }) => `
  <svg class="${className}" viewBox="0 0 52 52" aria-hidden="true">
    <path d="M10 6 V46 H42" pathLength="1" />
    <path d="M22 6 V26" pathLength="1" />
    <path d="M22 6 H42 M22 26 H36" pathLength="1" />
    <circle cx="44" cy="26" r="${dot}" />
  </svg>`;

// "Lucas Ernesto" com o sobrenome em itálico dourado
export const LogoName = ({ className, name }) => `<span class="${className}">${name.first} <em>${name.last}</em></span>`;

// a mesma estrela do cursor, usada em vários lugares
export const STAR_PATH = "M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z";
