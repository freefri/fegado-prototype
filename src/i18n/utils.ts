import { defaultLang, languages, ui, type Lang, type UiKey } from "./ui";

export function isLang(value: string | undefined): value is Lang {
  return value !== undefined && value in languages;
}

export function getLangFromUrl(url: URL): Lang {
  const segments = url.pathname.slice(import.meta.env.BASE_URL.length).split("/").filter(Boolean);
  return isLang(segments[0]) ? segments[0] : defaultLang;
}

export function useTranslations(lang: Lang) {
  return (key: UiKey): string => ui[lang][key] ?? ui[defaultLang][key];
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
  return localizePath(rest, target);
}
