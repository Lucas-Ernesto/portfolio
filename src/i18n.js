export const dict = {
  pt: {
    "nav.about": "Sobre",
    "nav.work": "Projetos",
    "nav.stack": "Stack",
    "nav.cta": "Vamos conversar",
    "hero.status": "Disponível para novos projetos",
    "hero.l1": "Sites que fazem",
    "hero.l2": "<em>negócios</em> crescerem.",
    "hero.lead":
      "Oi, eu sou o Lucas. Crio landing pages e sites rápidos, bonitos e pensados pra transformar visitante em cliente.",
    "hero.scroll": "Role para explorar",
    "cursor.avatar": "Embaralha!",

    "about.label": "Sobre mim",
    "about.big":
      "Sou o Lucas Ernesto, desenvolvedor web no começo de uma jornada com um foco bem claro: criar sites que resolvem problemas reais de negócios.",
    "about.small":
      "Cuido de tudo, do design ao código no ar. Cada projeto nasce pensando em velocidade, em funcionar bem no celular e em fazer o cliente chamar no WhatsApp ou mandar mensagem. Nada de template genérico.",
    "about.f1k": "Base",
    "about.f1v": "Brasil · remoto",
    "about.f2k": "Foco",
    "about.f2v": "Sites para negócios",
    "about.f3k": "Status",
    "about.f3v": "Aberto a projetos",
    "about.sticker": "curte um bom fone",
    "about.verse": "“Tudo quanto fizerdes, fazei-o de todo o coração, como ao Senhor.”",
    "about.faith": "Fé que move o trabalho",
    "about.verseRef": "Colossenses 3:23",

    "work.label": "Projetos selecionados",
    "work.t1": "Trabalho",
    "work.t2": "<em>recente</em>",
    "work.live": "No ar",
    "work.p1": "Site para assistência técnica de notebooks, PCs e celulares. Hero 3D e tudo levando pro WhatsApp.",
    "work.youName": "Seu negócio?",
    "work.p3": "Esse espaço pode ser do seu projeto. Vamos tirar sua ideia do papel.",
    "work.open": "Vaga aberta",
    "work.dev": "Desenvolvimento",
    "work.seo": "SEO local",
    "work.soonLabel": "Em desenvolvimento",
    "work.soonBig": "Próximo <em>projeto</em>",
    "work.soonName": "Em breve",
    "work.wip": "Em andamento",
    "work.p2": "Um novo site tá saindo do forno. Volta aqui daqui a pouco.",

    "stack.label": "Ferramentas que eu uso",

    "contact.label": "Contato",
    "contact.t1": "Tem um projeto",
    "contact.t2": "em <em>mente?</em>",
    "contact.copied": "E-mail copiado!",
    "footer.time": "Horário local",
    "footer.top": "Voltar ao topo ↑",

    strip: ["Landing pages", "Sites institucionais", "Design responsivo", "Animações", "SEO", "Performance"],
  },
  en: {
    "nav.about": "About",
    "nav.work": "Work",
    "nav.stack": "Stack",
    "nav.cta": "Let's talk",
    "hero.status": "Available for new projects",
    "hero.l1": "Websites that help",
    "hero.l2": "<em>businesses</em> grow.",
    "hero.lead":
      "Hi, I'm Lucas. I build fast, beautiful landing pages and websites designed to turn visitors into customers.",
    "hero.scroll": "Scroll to explore",
    "cursor.avatar": "Scramble it!",

    "about.label": "About me",
    "about.big":
      "I'm Lucas Ernesto, a web developer early in my journey with one clear focus: building websites that solve real business problems.",
    "about.small":
      "I handle everything from design to shipping the code. Every project is built for speed, works great on mobile, and is made to get customers to reach out. No generic templates.",
    "about.f1k": "Based in",
    "about.f1v": "Brazil · remote",
    "about.f2k": "Focus",
    "about.f2v": "Websites for businesses",
    "about.f3k": "Status",
    "about.f3v": "Open to projects",
    "about.sticker": "loves good headphones",
    "about.verse": "“Whatever ye do, do it heartily, as to the Lord.”",
    "about.faith": "Faith that drives the work",
    "about.verseRef": "Colossians 3:23",

    "work.label": "Selected work",
    "work.t1": "Recent",
    "work.t2": "<em>work</em>",
    "work.live": "Live",
    "work.p1": "Website for a laptop, PC and phone repair shop. 3D hero, all driving customers to WhatsApp.",
    "work.youName": "Your business?",
    "work.p3": "This spot could be your project. Let's bring your idea to life.",
    "work.open": "Spot open",
    "work.dev": "Development",
    "work.seo": "Local SEO",
    "work.soonLabel": "In progress",
    "work.soonBig": "Next <em>project</em>",
    "work.soonName": "Coming soon",
    "work.wip": "In progress",
    "work.p2": "A new website is almost out of the oven. Check back soon.",

    "stack.label": "Tools I use",

    "contact.label": "Contact",
    "contact.t1": "Got a project",
    "contact.t2": "in <em>mind?</em>",
    "contact.copied": "Email copied!",
    "footer.time": "Local time",
    "footer.top": "Back to top ↑",

    strip: ["Landing pages", "Business websites", "Responsive design", "Animations", "SEO", "Performance"],
  },
};

// Stack não traduz
const STACK = {
  stack1: ["HTML", "CSS", "JavaScript", "Tailwind", "React", "Figma"],
  stack2: ["Three.js", "GSAP", "Git", "Vercel", "Vite", "SEO"],
};

let current = "pt";
try {
  const saved = localStorage.getItem("lang");
  if (saved === "en" || saved === "pt") current = saved;
  else if (navigator.language && !navigator.language.startsWith("pt")) current = "en";
} catch {}

export const t = (key) => dict[current][key] ?? key;
export const getLang = () => current;

function fillMarquee(el) {
  const key = el.dataset.marquee;
  const items = STACK[key] ?? dict[current][key];
  const sep = key === "strip" ? "<i>✦</i>" : "<i>/</i>";
  const once = items.map((w) => `<span>${w}</span>${sep}`).join("");
  // duas cópias pra animação em loop sem emenda
  el.innerHTML = once.repeat(2);
}

export function applyLang(lang = current) {
  current = lang;
  document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
  document.querySelectorAll("[data-i18n-html]").forEach((el) => (el.innerHTML = t(el.dataset.i18nHtml)));
  document.querySelectorAll("[data-marquee]").forEach(fillMarquee);
  document.querySelectorAll("[data-lang]").forEach((el) => el.classList.toggle("is-active", el.dataset.lang === lang));
  try {
    localStorage.setItem("lang", lang);
  } catch {}
  document.dispatchEvent(new CustomEvent("langchange"));
}
