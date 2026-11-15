import { getCollection, type CollectionEntry } from "astro:content";

export type EventEntry = CollectionEntry<"events">;

/**
 * Seconds until registration closes. Demo events count from page load; real ones from their
 * deadline, so the value at build time is only the first frame until the page script corrects it.
 */
export function secondsLeft(event: EventEntry, now = Date.now()): number {
  if (event.data.registrationDeadline) {
    return Math.max(0, Math.floor((event.data.registrationDeadline.getTime() - now) / 1000));
  }
  return event.data.demoSecondsLeft ?? 0;
}

/** The hero shows the events whose registration closes soonest. */
export async function getHeroEvents(): Promise<EventEntry[]> {
  const events = await getCollection("events");
  return events.sort((a, b) => secondsLeft(a) - secondsLeft(b));
}

export async function getUpcomingEvents(): Promise<EventEntry[]> {
  const events = await getCollection("events");
  return events.sort((a, b) => a.data.date.getTime() - b.data.date.getTime() || a.data.title.localeCompare(b.data.title));
}
