import type { APIRoute } from "astro";
import { eventSlug, getSortedEvents } from "@/lib/events";
import { localDate } from "@/lib/format";

/**
 * The season as an iCalendar feed, so "Sincronizar eventos" adds every event to the reader's own
 * calendar. Events are all-day entries: the live site gives a start time but no end.
 */
export const GET: APIRoute = async ({ site }) => {
  const events = await getSortedEvents();
  const base = new URL(import.meta.env.BASE_URL.replace(/\/?$/, "/"), site);
  const escape = (text: string) => text.replace(/[\;,]/g, (c) => `\\${c}`).replace(/\n/g, "\\n");
  // The day as it is in Galicia, so an early-morning start is not filed under the day before.
  const day = (date: Date) => {
    const { year, month, day } = localDate(date);
    return `${year}${String(month).padStart(2, "0")}${String(day).padStart(2, "0")}`;
  };
  const nextDay = (date: Date) => day(new Date(date.getTime() + 86_400_000));
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//FEGADO//Prototipo//GL",
    "CALSCALE:GREGORIAN",
    "X-WR-CALNAME:FEGADO",
    ...events.flatMap((event) => [
      "BEGIN:VEVENT",
      `UID:${eventSlug(event)}@fegado-prototype`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${day(event.data.date)}`,
      `DTEND;VALUE=DATE:${nextDay(event.data.date)}`,
      `SUMMARY:${escape(event.data.title)}`,
      `DESCRIPTION:${escape(event.data.club)}`,
      `URL:${new URL(`eventos/${eventSlug(event)}/`, base).href}`,
      "END:VEVENT",
    ]),
    "END:VCALENDAR",
  ];
  return new Response(lines.join("\r\n"), { headers: { "Content-Type": "text/calendar; charset=utf-8" } });
};
