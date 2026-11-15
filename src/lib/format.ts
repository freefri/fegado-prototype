import type { Lang } from "@/i18n/ui";

// Fixed three-letter months as the design writes them ("09 MAI 2026"); Intl gives "maio" in
// Galician and "sept" in Spanish.
const months: Record<Lang, string[]> = {
  gl: ["XAN", "FEB", "MAR", "ABR", "MAI", "XUÑ", "XUL", "AGO", "SET", "OUT", "NOV", "DEC"],
  es: ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"],
};

// Dates are read in Galicia's time zone, so a news item posted late at night keeps its day even
// when the site is built on a server running in UTC.
const madrid = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Madrid",
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

export function localDate(date: Date) {
  const get = (type: string) => Number(madrid.formatToParts(date).find((part) => part.type === type)?.value);
  return { year: get("year"), month: get("month"), day: get("day") };
}

function parts(date: Date, lang: Lang) {
  const { year, month, day } = localDate(date);
  return { day: String(day).padStart(2, "0"), month: months[lang][month - 1], year };
}

/** "18 ABR 2026", as on event posters. */
export function posterDate(date: Date, lang: Lang): string {
  const { day, month, year } = parts(date, lang);
  return `${day} ${month} ${year}`;
}

/** "17 ABR. 2026", as in news metadata. */
export function metaDate(date: Date, lang: Lang): string {
  const { day, month, year } = parts(date, lang);
  return `${day} ${month}. ${year}`;
}
