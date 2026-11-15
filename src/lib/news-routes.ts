import { newsTopics, type NewsTopic } from "@/data/taxonomy";
import { NEWS_PER_PAGE, TOPIC_SEGMENT, getSortedNews, newsSlug, relatedNews, type NewsEntry } from "./news";

export type NewsRouteProps =
  | { kind: "list"; entries: NewsEntry[]; page: number; totalPages: number; topic?: NewsTopic }
  | { kind: "item"; entry: NewsEntry; related: NewsEntry[] };

/**
 * Every news URL under one catch-all route: the list and its pages (`2/`), a topic and its pages
 * (`categoria/resultados/`, `categoria/resultados/2/`) and each item (`2026-04-16-slug/`). Item
 * slugs start with a full date, so they never collide with a page number or the topic segment.
 */
export async function newsStaticPaths() {
  const news = await getSortedNews();
  const paths: { params: { path: string | undefined }; props: NewsRouteProps }[] = [];

  const addList = (entries: NewsEntry[], prefix: string | undefined, topic?: NewsTopic) => {
    const totalPages = Math.max(1, Math.ceil(entries.length / NEWS_PER_PAGE));
    for (let page = 1; page <= totalPages; page++) {
      const path = [prefix, page > 1 ? page : undefined].filter((part) => part !== undefined).join("/");
      paths.push({
        params: { path: path || undefined },
        props: { kind: "list", entries: entries.slice((page - 1) * NEWS_PER_PAGE, page * NEWS_PER_PAGE), page, totalPages, topic },
      });
    }
  };

  addList(news, undefined);
  for (const topic of newsTopics) {
    addList(news.filter((entry) => entry.data.categories.includes(topic)), `${TOPIC_SEGMENT}/${topic}`, topic);
  }
  for (const entry of news) {
    paths.push({ params: { path: newsSlug(entry) }, props: { kind: "item", entry, related: relatedNews(entry, news) } });
  }
  return paths;
}
