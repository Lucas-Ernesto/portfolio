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

## Performance

- **Pré-renderização** (`vite.config.js`): no build, as views geram o HTML do site e ele já vai pronto no `index.html`. O conteúdo aparece antes do JavaScript carregar (e o Google lê tudo).
- **CSS dentro do HTML** e **fontes no próprio site** (`@fontsource`), sem depender do Google Fonts.
- **Three.js carregado à parte**: o cubo vem num arquivo separado, baixado depois que a página aparece.
- **Cubo adaptativo**: modo leve no celular (sem sombras, 30 fps) e modo mínimo automático em aparelhos sem placa de vídeo.
- **Celular**: cursor-estrela, rastro, ímã e inclinação nem são criados (não existe mouse).
- Imagens em WebP no tamanho em que aparecem.

## Tarefas comuns

**Adicionar um projeto:** inclua um objeto em `src/models/projects.model.js` (com textos PT e EN). O card de pasta é gerado sozinho.

**Mudar um texto:** edite `src/models/content/pt.js` e `en.js`.

**Mudar e-mail ou redes:** `src/models/profile.model.js`.

**Mudar as ferramentas da stack:** `src/models/stack.model.js`.

**Mudar cores ou fontes:** `src/styles/base/tokens.css`.
