/** Disciplines of orienteering, shared by events and as tags on news. Labels: `discipline.*` in ui.ts. */
export const disciplines = ["o-pe", "escolar", "mtbo", "raid", "trail-o", "rogaine"] as const;
export type Discipline = (typeof disciplines)[number];

/** The news filters of the design. Labels: `newsTopic.*` in ui.ts. */
export const newsTopics = ["eventos", "resultados", "comunicacion", "formacion", "promocion"] as const;
export type NewsTopic = (typeof newsTopics)[number];

/** A news category is a topic or a discipline; the importer guesses them, editors can correct them. */
export const newsCategories = [...newsTopics, ...disciplines] as const;
export type NewsCategory = (typeof newsCategories)[number];

export const isNewsTopic = (category: string): category is NewsTopic => (newsTopics as readonly string[]).includes(category);
