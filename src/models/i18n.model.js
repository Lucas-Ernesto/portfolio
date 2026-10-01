// Model de idioma: guarda o idioma atual, traduz chaves e avisa quem quiser saber quando muda
import pt from "./content/pt.js";
import en from "./content/en.js";
import { projectTexts } from "./projects.model.js";

const dictionaries = {
  pt: { ...pt, ...projectTexts("pt") },
  en: { ...en, ...projectTexts("en") },
};
const listeners = new Set();

function detectLang() {
  try {
    const saved = localStorage.getItem("lang");
    if (saved in dictionaries) return saved;
  } catch {}
  return navigator.language?.startsWith("pt") === false ? "en" : "pt";
}

let current = detectLang();

export const getLang = () => current;

export const t = (key) => dictionaries[current][key] ?? dictionaries.pt[key] ?? key;

export function setLang(lang) {
  if (!(lang in dictionaries) || lang === current) return;
  current = lang;
  try {
    localStorage.setItem("lang", lang);
  } catch {}
  listeners.forEach((fn) => fn(lang));
}

export const toggleLang = () => setLang(current === "pt" ? "en" : "pt");

// retorna uma função pra cancelar a inscrição
export function onLangChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
