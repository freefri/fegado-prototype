import type { Lang } from "@/i18n/ui";

// Fixed three-letter months as the design writes them ("09 MAI 2026"); Intl gives "maio" in
// Galician and "sept" in Spanish.
const months: Record<Lang, string[]> = {
  gl: ["XAN", "FEB", "MAR", "ABR", "MAI", "XUÑ", "XUL", "AGO", "SET", "OUT", "NOV", "DEC"],
  es: ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"],
};

function parts(iso: string, lang: Lang) {
  const [year, month, day] = iso.split("-").map(Number);
  return { day: String(day).padStart(2, "0"), month: months[lang][month - 1], year };
}

/** "18 ABR 2026", as on event posters. */
export function posterDate(iso: string, lang: Lang): string {
  const { day, month, year } = parts(iso, lang);
  return `${day} ${month} ${year}`;
}

/** "17 ABR. 2026", as in news metadata. */
export function metaDate(iso: string, lang: Lang): string {
  const { day, month, year } = parts(iso, lang);
  return `${day} ${month}. ${year}`;
}
