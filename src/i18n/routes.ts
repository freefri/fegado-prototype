import type { Lang } from "./ui";

/**
 * Path of every section and page per language, without the language prefix. The language switch
 * translates a URL by finding its longest matching route here, so a page only has to be added once.
 */
export const routes = {
  news: { gl: "novas", es: "noticias" },
  about: { gl: "sobre-fegado", es: "sobre-fegado" },
  "who-we-are": { gl: "sobre-fegado/quen-somos", es: "sobre-fegado/quienes-somos" },
  disciplines: { gl: "sobre-fegado/modalidades", es: "sobre-fegado/modalidades" },
  join: { gl: "sobre-fegado/federate", es: "sobre-fegado/federate" },
  clubs: { gl: "clubs", es: "clubes" },
  contact: { gl: "contacto", es: "contacto" },
  faq: { gl: "preguntas-frecuentes", es: "preguntas-frecuentes" },
} as const satisfies Record<string, Record<Lang, string>>;

export type RouteKey = keyof typeof routes;

/** Pages under Sobre FEGADO, in menu order. */
export const aboutPages = ["who-we-are", "disciplines", "join"] as const satisfies RouteKey[];
