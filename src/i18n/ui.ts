export const languages = { gl: "Galego", es: "Castellano" } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = "gl";

/**
 * Texts that belong to the site itself, one JSON file per area in `locales/<lang>/`, nested by key
 * so Weblate can manage them. Content such as news stays in its original language.
 */
const files = import.meta.glob<Record<string, Messages>>("./locales/*/*.json", { eager: true, import: "default" });

interface Messages {
  [key: string]: string | Messages;
}

/** Dotted paths of the strings in `T`, e.g. `"nav.about"`. */
type Paths<T, Prefix extends string = ""> = {
  [K in keyof T & string]: T[K] extends string ? `${Prefix}${K}` : Paths<T[K], `${Prefix}${K}.`>;
}[keyof T & string];

// Galician is the source language: its files define which keys exist.
type Source = typeof import("./locales/gl/common.json") &
  typeof import("./locales/gl/home.json") &
  typeof import("./locales/gl/news.json") &
  typeof import("./locales/gl/events.json") &
  typeof import("./locales/gl/clubs.json") &
  typeof import("./locales/gl/contact.json") &
  typeof import("./locales/gl/documents.json") &
  typeof import("./locales/gl/account.json");
export type UiKey = Paths<Source>;

function flatten(messages: Messages, prefix = "", into: Record<string, string> = {}): Record<string, string> {
  for (const [key, value] of Object.entries(messages)) {
    if (typeof value === "string") into[prefix + key] = value;
    else flatten(value, `${prefix}${key}.`, into);
  }
  return into;
}

function load(lang: Lang): Partial<Record<UiKey, string>> {
  const strings: Record<string, string> = {};
  for (const [path, messages] of Object.entries(files)) {
    if (!path.startsWith(`./locales/${lang}/`)) continue;
    for (const [key, value] of Object.entries(flatten(messages))) {
      // Areas share one key space, so two files must not define the same key.
      if (key in strings) throw new Error(`Translation key "${key}" is defined twice for ${lang} (${path})`);
      strings[key] = value;
    }
  }
  return strings;
}

export const ui: Record<Lang, Partial<Record<UiKey, string>>> = { gl: load("gl"), es: load("es") };

/** The source language has every key, so it is the fallback for strings not yet translated. */
export const fallback = ui[defaultLang] as Record<UiKey, string>;
