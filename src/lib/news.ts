import { getCollection, type CollectionEntry } from "astro:content";
import { sections, type Lang } from "@/i18n/ui";
import { localizePath } from "@/i18n/utils";
import { localDate } from "./format";

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

export function newsListPath(lang: Lang, options: { year?: number; page?: number } = {}): string {
  const parts = [sections.news[lang], options.year, options.page && options.page > 1 ? options.page : undefined];
  return localizePath(`${parts.filter((part) => part !== undefined).join("/")}/`, lang);
}

export function newsItemPath(lang: Lang, entry: NewsEntry): string {
  return localizePath(`${sections.news[lang]}/${newsSlug(entry)}/`, lang);
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

export function newsYear(entry: NewsEntry): number {
  return localDate(entry.data.date).year;
}

export function newsYears(news: NewsEntry[]): number[] {
  return [...new Set(news.map(newsYear))].sort((a, b) => b - a);
}
