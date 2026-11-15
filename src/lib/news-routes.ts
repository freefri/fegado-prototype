import { NEWS_PER_PAGE, getSortedNews, newsSlug, newsYear, newsYears, type NewsEntry } from "./news";

export type NewsRouteProps =
  | { kind: "list"; entries: NewsEntry[]; page: number; totalPages: number; years: number[]; year?: number }
  | { kind: "item"; entry: NewsEntry };

/**
 * Every news URL under one catch-all route: the list and its pages (`2/`), a year and its pages
 * (`2026/`, `2026/2/`) and each item (`2026-04-16-slug/`). Item slugs start with a full date, so
 * they never collide with a page number or a year.
 */
export async function newsStaticPaths() {
  const news = await getSortedNews();
  const years = newsYears(news);
  const paths: { params: { path: string | undefined }; props: NewsRouteProps }[] = [];

  const addList = (entries: NewsEntry[], prefix: string | undefined, year?: number) => {
    const totalPages = Math.max(1, Math.ceil(entries.length / NEWS_PER_PAGE));
    for (let page = 1; page <= totalPages; page++) {
      const path = [prefix, page > 1 ? page : undefined].filter((part) => part !== undefined).join("/");
      paths.push({
        params: { path: path || undefined },
        props: {
          kind: "list",
          entries: entries.slice((page - 1) * NEWS_PER_PAGE, page * NEWS_PER_PAGE),
          page,
          totalPages,
          years,
          year,
        },
      });
    }
  };

  addList(news, undefined);
  for (const year of years) {
    addList(news.filter((entry) => newsYear(entry) === year), String(year), year);
  }
  for (const entry of news) {
    paths.push({ params: { path: newsSlug(entry) }, props: { kind: "item", entry } });
  }
  return paths;
}
