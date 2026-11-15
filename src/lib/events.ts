import { getCollection, type CollectionEntry } from "astro:content";
import { routes } from "@/i18n/routes";
import type { Lang } from "@/i18n/ui";
import { localizePath } from "@/i18n/utils";

export type EventEntry = CollectionEntry<"events">;

/**
 * Seconds until registration closes. Demo events count from page load; real ones from their
 * deadline, so the value at build time is only the first frame until the page script corrects it.
 */
export function secondsLeft(event: EventEntry, now = Date.now()): number {
  if (event.data.demoSecondsLeft) return event.data.demoSecondsLeft;
  if (event.data.registrationDeadline) {
    return Math.max(0, Math.floor((event.data.registrationDeadline.getTime() - now) / 1000));
  }
  return 0;
}

/** All events by date, earliest first. */
export async function getSortedEvents(): Promise<EventEntry[]> {
  const events = await getCollection("events");
  return events.sort((a, b) => a.data.date.getTime() - b.data.date.getTime() || a.data.title.localeCompare(b.data.title));
}

/** The start page carousel shows the events that have a photo for it, closing soonest first. */
export async function getHeroEvents(): Promise<EventEntry[]> {
  const events = (await getCollection("events")).filter((event) => event.data.heroImage);
  return events.sort((a, b) => secondsLeft(a) - secondsLeft(b));
}

/**
 * The next events from `now`; when fewer than `count` are left in the season, the latest past
 * ones fill the row, so the start page never shows an empty list.
 */
export async function getUpcomingEvents(count = 6, now = Date.now()): Promise<EventEntry[]> {
  const events = await getSortedEvents();
  const upcoming = events.filter((event) => event.data.date.getTime() >= now);
  const past = events.filter((event) => event.data.date.getTime() < now).reverse();
  return [...upcoming, ...past].slice(0, count);
}

/** File name without folder, e.g. "2026-04-18-2-lgr-objetivo-fene-gallaecia-raid". */
export function eventSlug(event: EventEntry): string {
  return event.id.split("/").pop() ?? event.id;
}

export function eventPath(lang: Lang, event: EventEntry): string {
  return localizePath(`${routes.events[lang]}/${eventSlug(event)}/`, lang);
}

/** Events closest in discipline and date to `event`, for the "Eventos relacionados" row. */
export function relatedEvents(event: EventEntry, events: EventEntry[], count = 3): EventEntry[] {
  const time = event.data.date.getTime();
  return events
    .filter((other) => other.id !== event.id)
    .sort(
      (a, b) =>
        Number(b.data.discipline === event.data.discipline) - Number(a.data.discipline === event.data.discipline) ||
        Math.abs(a.data.date.getTime() - time) - Math.abs(b.data.date.getTime() - time),
    )
    .slice(0, count);
}
