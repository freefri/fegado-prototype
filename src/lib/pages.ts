import { aboutPages, routes, type RouteKey } from "@/i18n/routes";
import type { Lang } from "@/i18n/ui";

/** Static paths of the Sobre FEGADO pages, whose last URL segment differs per language. */
export function aboutStaticPaths(lang: Lang) {
  return aboutPages.map((page) => ({
    params: { page: routes[page][lang].split("/").pop() },
    props: { page: page as RouteKey },
  }));
}
