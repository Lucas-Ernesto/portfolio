import { SectionHead } from "../components/SectionHead.js";
import { LinesTitle } from "../components/LinesTitle.js";
import { Folder } from "../components/Folder.js";

// Projetos: um card de pasta pra cada item de projects.model.js
export const WorkView = ({ t, projects }) => `
  <section class="work" id="projetos">
    ${SectionHead({ t, num: "02", key: "work.label" })}
    ${LinesTitle({ t, className: "work__title", lines: [{ key: "work.t1" }, { key: "work.t2", html: true }] })}
    <div class="folders">
      ${projects.map((project, index) => Folder({ t, project, index })).join("")}
    </div>
  </section>`;
