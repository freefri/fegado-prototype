import { getCollection, type CollectionEntry } from "astro:content";
import { routes } from "@/i18n/routes";
import type { Lang } from "@/i18n/ui";
import { localizePath, type useTranslations } from "@/i18n/utils";
import { isNewsTopic as isTopic, type NewsCategory, type NewsTopic } from "@/data/taxonomy";

export type NewsEntry = CollectionEntry<"news">;

export const NEWS_PER_PAGE = 12;

export async function getSortedNews(): Promise<NewsEntry[]> {
  const news = await getCollection("news");
  return news.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** File name without folder, e.g. "2026-04-16-gallaecia-raid-objetivo-fene". */
export function newsSlug(entry: NewsEntry): string {
  return entry.id.split("/").pop() ?? entry.id;
}

/** Label of a topic ("Resultados") or discipline ("MTB-O") in the reader's language. */
export function categoryLabel(category: NewsCategory, t: ReturnType<typeof useTranslations>): string {
  return t(isTopic(category) ? `newsTopic.${category}` : `discipline.${category}`);
}

/** Segment before a topic in list URLs, e.g. /novas/categoria/resultados/. */
export const TOPIC_SEGMENT = "categoria";

export function newsListPath(lang: Lang, options: { topic?: NewsTopic; page?: number } = {}): string {
  const parts = [routes.news[lang], options.topic && `${TOPIC_SEGMENT}/${options.topic}`, options.page && options.page > 1 ? options.page : undefined];
  return localizePath(`${parts.filter(Boolean).join("/")}/`, lang);
}

export function newsItemPath(lang: Lang, entry: NewsEntry): string {
  return localizePath(`${routes.news[lang]}/${newsSlug(entry)}/`, lang);
}

/** Plain-text opening of the body, for cards and meta descriptions. */
export function excerpt(entry: NewsEntry, length = 240): string {
  const text = (entry.body ?? "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^\s*(?:[-*+]|\d+\.|#+|>)\s+/gm, "")
    .replace(/[*_`|]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > length ? `${text.slice(0, length).replace(/\s+\S*$/, "")}…` : text;
}

/**
 * News that share most categories with `entry`, newest first among equals. A topic weighs less than
 * a discipline, since "Eventos" alone says little about what two news items have in common.
 */
export function relatedNews(entry: NewsEntry, news: NewsEntry[], count = 3): NewsEntry[] {
  const own = new Set(entry.data.categories);
  const score = (other: NewsEntry) =>
    other.data.categories.reduce((sum, category) => sum + (own.has(category) ? (isTopic(category) ? 1 : 2) : 0), 0);
  return news
    .filter((other) => other.id !== entry.id)
    .map((other) => ({ other, score: score(other) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.other.data.date.getTime() - a.other.data.date.getTime())
    .slice(0, count)
    .map(({ other }) => other);
}
