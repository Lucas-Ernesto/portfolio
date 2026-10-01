import { defineConfig } from "vite";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

// Pré-renderização: no build, roda as views (src/app/render.js) e escreve o HTML pronto
// dentro do <div id="app">. Assim o conteúdo aparece antes do JavaScript carregar.
function prerender() {
  return {
    name: "prerender",
    apply: "build",
    async transformIndexHtml(html) {
      const load = (file) => import(pathToFileURL(resolve(file)).href);
      const { renderApp } = await load("src/app/render.js");
      const { translator } = await load("src/models/i18n.model.js");
      const markup = renderApp({ t: translator("pt"), lang: "pt" });
      return html.replace('<div id="app"></div>', `<div id="app">${markup}</div>`);
    },
  };
}

// CSS dentro do HTML + pré-carregamento das fontes principais.
// Sem isso o navegador precisa baixar o .css antes de desenhar qualquer coisa.
function inlineCss() {
  const PRELOAD_FONTS = [/manrope-latin-500-normal.*\.woff2$/, /manrope-latin-400-normal.*\.woff2$/];
  return {
    name: "inline-css",
    apply: "build",
    enforce: "post",
    generateBundle(_, bundle) {
      const html = Object.values(bundle).find((f) => f.fileName === "index.html");
      if (!html) return;
      let source = String(html.source);

      for (const file of Object.values(bundle)) {
        if (!file.fileName.endsWith(".css")) continue;
        const tag = new RegExp(`<link rel="stylesheet"[^>]*href="/${file.fileName}"[^>]*>`);
        if (!tag.test(source)) continue;
        source = source.replace(tag, () => `<style>${file.source}</style>`);
        delete bundle[file.fileName];
      }

      const preloads = Object.values(bundle)
        .filter((f) => PRELOAD_FONTS.some((re) => re.test(f.fileName)))
        .map((f) => `<link rel="preload" href="/${f.fileName}" as="font" type="font/woff2" crossorigin>`)
        .join("");
      html.source = source.replace("</title>", `</title>${preloads}`);
    },
  };
}

export default defineConfig({
  plugins: [prerender(), inlineCss()],
});
