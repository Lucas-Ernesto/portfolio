// App: junta Model → View → Controller
//   1. Models  = dados (textos, projetos, stack, perfil, idioma)
//   2. Views   = funções que transformam dados em HTML (montadas em app/render.js)
//   3. Controllers = comportamento (scroll, cursor, animações, cliques)
import { reduceMotion } from "../utils/motion.js";
import { renderApp } from "./render.js";

// Models
import { t, getLang, toggleLang, onLangChange } from "../models/i18n.model.js";
import { profile } from "../models/profile.model.js";

// Views que atualizam a tela quando o idioma muda
import { applyTranslations } from "../views/i18n.view.js";
import { updateStripView } from "../views/sections/StripView.js";

// Controllers
import { ScrollController } from "../controllers/ScrollController.js";
import { NavController } from "../controllers/NavController.js";
import { HeroController } from "../controllers/HeroController.js";
import { CursorController } from "../controllers/CursorController.js";
import { MagneticController } from "../controllers/MagneticController.js";
import { AboutController } from "../controllers/AboutController.js";
import { RevealController } from "../controllers/RevealController.js";
import { WorkController } from "../controllers/WorkController.js";
import { MarqueeController } from "../controllers/MarqueeController.js";
import { ContactController } from "../controllers/ContactController.js";
import { LanguageController } from "../controllers/LanguageController.js";
import { IntroController } from "../controllers/IntroController.js";

export class App {
  constructor(root) {
    this.root = root;
  }

  // No site publicado o HTML já vem pronto do build (mais rápido e melhor pro Google).
  // Aqui só montamos se ele não veio (desenvolvimento) ou traduzimos se o idioma não é PT.
  render() {
    const lang = getLang();
    if (!this.root.firstElementChild) {
      this.root.innerHTML = renderApp({ t, lang });
    } else if (lang !== "pt") {
      applyTranslations(t, lang);
      updateStripView(t);
    }
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  }

  start() {
    this.render();

    // quando o idioma muda, primeiro a view atualiza os textos (antes dos controllers reagirem)
    onLangChange((lang) => applyTranslations(t, lang));

    const scroll = new ScrollController();
    const hero = new HeroController({ reduceMotion });
    const cursor = new CursorController({ t, isOverCube: (e) => hero.isOverCube(e), reduceMotion });

    new NavController({ scroll });
    new MagneticController();
    new LanguageController({ toggleLang });
    new IntroController({ scroll, hero, reduceMotion }).play();

    // seções abaixo da dobra: prepara quando o navegador estiver livre (não atrasa a abertura)
    whenIdle(() => {
      new MarqueeController({ scroll, t, onLangChange, reduceMotion });
      new AboutController({ cursor, onLangChange, reduceMotion });
      new RevealController();
      new WorkController();
      new ContactController({ profile });
    });
  }
}

function whenIdle(fn) {
  if ("requestIdleCallback" in window) requestIdleCallback(fn, { timeout: 1500 });
  else setTimeout(fn, 200);
}
