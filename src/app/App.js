// App: junta Model → View → Controller
//   1. Models  = dados (textos, projetos, stack, perfil, idioma)
//   2. Views   = funções que transformam dados em HTML
//   3. Controllers = comportamento (scroll, cursor, animações, cliques)
import { reduceMotion } from "../utils/motion.js";

// Models
import { t, getLang, toggleLang, onLangChange } from "../models/i18n.model.js";
import { profile } from "../models/profile.model.js";
import { projects } from "../models/projects.model.js";
import { stackRows } from "../models/stack.model.js";

// Views
import { applyTranslations } from "../views/i18n.view.js";
import { LoaderView } from "../views/layout/LoaderView.js";
import { CursorView } from "../views/layout/CursorView.js";
import { NavView } from "../views/layout/NavView.js";
import { HeroView } from "../views/sections/HeroView.js";
import { StripView } from "../views/sections/StripView.js";
import { AboutView } from "../views/sections/AboutView.js";
import { WorkView } from "../views/sections/WorkView.js";
import { StackView } from "../views/sections/StackView.js";
import { ContactView } from "../views/sections/ContactView.js";

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

  render() {
    const lang = getLang();
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
    this.root.innerHTML = `
      ${LoaderView({ profile })}
      ${CursorView()}
      ${NavView({ t, lang, profile })}
      <main id="top">
        ${HeroView({ t })}
        ${StripView({ t })}
        ${AboutView({ t, profile })}
        ${WorkView({ t, projects })}
        ${StackView({ t, rows: stackRows })}
        ${ContactView({ t, profile })}
      </main>`;
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
    new AboutController({ cursor, onLangChange, reduceMotion });
    new RevealController();
    new WorkController();
    new MarqueeController({ scroll, t, onLangChange, reduceMotion });
    new ContactController({ profile });
    new LanguageController({ toggleLang });

    new IntroController({ scroll, hero, reduceMotion }).play();
  }
}
