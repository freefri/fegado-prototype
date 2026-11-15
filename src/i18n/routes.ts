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
  transparency: { gl: "transparencia", es: "transparencia" },
  board: { gl: "transparencia/xunta-directiva", es: "transparencia/junta-directiva" },
  documents: { gl: "transparencia/documentacion", es: "transparencia/documentacion" },
  identity: { gl: "transparencia/identidade-corporativa", es: "transparencia/identidad-corporativa" },
  clubs: { gl: "clubs", es: "clubes" },
  contact: { gl: "contacto", es: "contacto" },
  faq: { gl: "preguntas-frecuentes", es: "preguntas-frecuentes" },
} as const satisfies Record<string, Record<Lang, string>>;

export type RouteKey = keyof typeof routes;

/** Pages under Sobre FEGADO, in menu order. */
export const aboutPages = ["who-we-are", "disciplines", "join"] as const satisfies RouteKey[];

/** Pages under Transparencia, in menu order. */
export const transparencyPages = ["board", "documents", "identity"] as const satisfies RouteKey[];
