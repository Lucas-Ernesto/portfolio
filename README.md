# Lucas Ernesto — Portfólio

Site pessoal com cubo mágico 3D interativo, cursor-estrela com rastro, foto que vira e cards de projeto em formato de pasta. Bilíngue (PT/EN).

**Stack:** Vite · Three.js · GSAP (ScrollTrigger) · Lenis

## Rodando

```bash
npm install
npm run dev      # desenvolvimento em http://localhost:5173
npm run build    # gera a versão final em dist/
```

## Arquitetura (MVC)

```
src/
├── main.js              ponto de entrada (só cria o App)
├── app/App.js           liga Model → View → Controller
├── models/              DADOS
│   ├── content/pt.js    textos em português
│   ├── content/en.js    textos em inglês
│   ├── i18n.model.js    idioma atual, t(), troca de idioma
│   ├── profile.model.js nome, e-mail, redes, fotos
│   ├── projects.model.js projetos (cards de pasta)
│   └── stack.model.js   ferramentas
├── views/               O QUE APARECE (funções que devolvem HTML)
│   ├── components/      peças reutilizáveis: logo, pasta, faixa…
│   ├── layout/          loader, cursor, menu
│   ├── sections/        hero, sobre, projetos, stack, contato
│   ├── webgl/           cubo 3D e rastro do cursor (canvas)
│   └── i18n.view.js     atualiza os textos quando o idioma muda
├── controllers/         COMPORTAMENTO (um por responsabilidade)
│   ├── IntroController     loader → cortina → hero
│   ├── ScrollController    scroll suave + links internos
│   ├── NavController       menu some/volta, modo escuro
│   ├── HeroController      mouse/clique/scroll → cubo
│   ├── CursorController    estrela, etiquetas, faíscas
│   ├── AboutController     palavras acendendo, foto que vira
│   ├── WorkController      entrada e inclinação das pastas
│   ├── RevealController    títulos subindo linha a linha
│   ├── MarqueeController   faixas que correm
│   ├── ContactController   copiar e-mail, relógio
│   ├── LanguageController  botão PT/EN
│   └── MagneticController  botões "magnéticos"
├── styles/              CSS por camada
│   ├── base/            tokens (cores/fontes), reset, utilitários
│   ├── components/      loader, cursor, nav, botão…
│   └── sections/        um arquivo por seção
└── utils/               atalhos de DOM e configuração do GSAP
```

## Tarefas comuns

**Adicionar um projeto:** inclua um objeto em `src/models/projects.model.js` (com textos PT e EN). O card de pasta é gerado sozinho.

**Mudar um texto:** edite `src/models/content/pt.js` e `en.js`.

**Mudar e-mail ou redes:** `src/models/profile.model.js`.

**Mudar as ferramentas da stack:** `src/models/stack.model.js`.

**Mudar cores ou fontes:** `src/styles/base/tokens.css`.
