import { defaultLang, languages, sections, ui, type Lang, type UiKey } from "./ui";

export function isLang(value: string | undefined): value is Lang {
  return value !== undefined && value in languages;
}

export function getLangFromUrl(url: URL): Lang {
  const segments = url.pathname.slice(import.meta.env.BASE_URL.length).split("/").filter(Boolean);
  return isLang(segments[0]) ? segments[0] : defaultLang;
}

/** `t("newsList.page", { page: 2, total: 9 })` fills the `{page}` and `{total}` placeholders. */
export function useTranslations(lang: Lang) {
  return (key: UiKey, values: Record<string, string | number> = {}): string =>
    (ui[lang][key] ?? ui[defaultLang][key]).replace(/\{(\w+)\}/g, (match, name) => String(values[name] ?? match));
}

/** Builds a site link for `lang`, adding the language prefix and the deploy base path. */
export function localizePath(path: string, lang: Lang): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const clean = path.replace(/^\//, "");
  const prefix = lang === defaultLang ? "" : `/${lang}`;
  return `${base}${prefix}/${clean}`;
}

/** The same page in another language, for the language switch. */
export function translatePath(url: URL, target: Lang): string {
  const current = getLangFromUrl(url);
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  let rest = url.pathname.slice(base.length);
  if (current !== defaultLang) rest = rest.replace(new RegExp(`^/${current}`), "");
  const [, first = "", ...others] = rest.split("/");
  const section = Object.values(sections).find((names) => names[current] === first);
  if (section) rest = ["", section[target], ...others].join("/");
  return localizePath(rest, target);
}
