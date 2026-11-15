import { routes, type RouteKey } from "./routes";
import { defaultLang, languages, ui, type Lang, type UiKey } from "./ui";

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

/** Link to a page of the site map in `routes`, e.g. `routePath("clubs", "es")` is `…/es/clubes/`. */
export function routePath(key: RouteKey, lang: Lang): string {
  return localizePath(`${routes[key][lang]}/`, lang);
}

/** Path of `url` inside the site, without the deploy base or the language prefix, e.g. `clubes/`. */
export function sitePath(url: URL): string {
  const lang = getLangFromUrl(url);
  const rest = url.pathname.slice(import.meta.env.BASE_URL.replace(/\/$/, "").length).replace(/^\//, "");
  return lang === defaultLang ? rest : rest.replace(new RegExp(`^${lang}/?`), "");
}

/** Whether `url` is the page `key` or one below it. */
export function isRouteActive(url: URL, key: RouteKey): boolean {
  const path = sitePath(url);
  const route = routes[key][getLangFromUrl(url)];
  return path === route || path.startsWith(`${route}/`);
}

/** The same page in another language, for the language switch. */
export function translatePath(url: URL, target: Lang): string {
  const current = getLangFromUrl(url);
  const path = sitePath(url);
  const match = (Object.values(routes) as Record<Lang, string>[])
    .filter((route) => path === route[current] || path.startsWith(`${route[current]}/`))
    .sort((a, b) => b[current].length - a[current].length)[0];
  return localizePath(match ? match[target] + path.slice(match[current].length) : path, target);
}
