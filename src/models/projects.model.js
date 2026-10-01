// Projetos do portfólio. Pra adicionar um novo, é só adicionar um objeto nesta lista:
//   theme:  cor da pasta → "orange" | "gold" | "silver"
//   visual: o que sobe de dentro da pasta no hover → { type: "image", src, width, height } | { type: "star" } | { type: "plus" }
//   cursor: chave do texto que aparece no cursor (em content/pt.js e en.js)
//   live:   true mostra a bolinha verde de "no ar"
export const projects = [
  {
    id: "primetech",
    theme: "orange",
    href: "https://www.assistenciaprimetech.com.br/",
    external: true,
    live: true,
    visual: { type: "image", src: "/img/primetech.webp", width: 800, height: 500 },
    cursor: "cursor.visit",
    text: {
      pt: {
        title: "PrimeTech",
        desc: "Site para assistência técnica de notebooks, PCs e celulares. Hero 3D e tudo levando pro WhatsApp.",
        status: "No ar",
      },
      en: {
        title: "PrimeTech",
        desc: "Website for a laptop, PC and phone repair shop. 3D hero, all driving customers to WhatsApp.",
        status: "Live",
      },
    },
  },
  {
    id: "next",
    theme: "gold",
    href: null,
    visual: { type: "star" },
    cursor: "cursor.soon",
    text: {
      pt: { title: "Em breve", desc: "Um novo site tá saindo do forno. Volta aqui daqui a pouco.", status: "Em andamento" },
      en: { title: "Coming soon", desc: "A new website is almost out of the oven. Check back soon.", status: "In progress" },
    },
  },
  {
    id: "your-business",
    theme: "silver",
    href: "#contato",
    visual: { type: "plus" },
    cursor: "cursor.talk",
    text: {
      pt: { title: "Seu negócio?", desc: "Esse espaço pode ser do seu projeto. Vamos tirar sua ideia do papel.", status: "Vaga aberta" },
      en: { title: "Your business?", desc: "This spot could be your project. Let's bring your idea to life.", status: "Spot open" },
    },
  },
];

// Transforma os textos dos projetos em chaves de tradução: "project.primetech.title" etc.
export function projectTexts(lang) {
  return Object.fromEntries(
    projects.flatMap((p) => Object.entries(p.text[lang]).map(([field, value]) => [`project.${p.id}.${field}`, value])),
  );
}
