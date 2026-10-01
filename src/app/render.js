// Monta o HTML do site inteiro a partir dos models.
// Não usa nada do navegador: roda tanto no build (pré-renderização, ver vite.config.js)
// quanto no navegador (quando a página chega sem o HTML pronto, ex.: em desenvolvimento).
import { profile } from "../models/profile.model.js";
import { projects } from "../models/projects.model.js";
import { stackRows } from "../models/stack.model.js";

import { LoaderView } from "../views/layout/LoaderView.js";
import { CursorView } from "../views/layout/CursorView.js";
import { NavView } from "../views/layout/NavView.js";
import { HeroView } from "../views/sections/HeroView.js";
import { StripView } from "../views/sections/StripView.js";
import { AboutView } from "../views/sections/AboutView.js";
import { WorkView } from "../views/sections/WorkView.js";
import { StackView } from "../views/sections/StackView.js";
import { ContactView } from "../views/sections/ContactView.js";

export const renderApp = ({ t, lang }) => `
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
