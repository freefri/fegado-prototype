import { routes, type RouteKey } from "@/i18n/routes";
import type { Lang } from "@/i18n/ui";

/** Static paths of the pages of one section, whose last URL segment differs per language. */
export function sectionStaticPaths(pages: readonly RouteKey[], lang: Lang) {
  return pages.map((page) => ({
    params: { page: routes[page][lang].split("/").pop() },
    props: { page },
  }));
}
