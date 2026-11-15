import { ArrowUpRight, Calendar } from "lucide-react";
import { badgeVariants } from "@/components/ui/badge";
import { metaDate } from "@/lib/format";
import type { Lang } from "@/i18n/ui";

export interface DocumentItem {
  id: string;
  title: string;
  /** ISO date, so the list can travel to the browser as plain JSON. */
  date: string;
  url: string;
  group?: string;
  category?: string;
}

/** One downloadable document: its group and category, title, date and a link to the file. */
export function DocumentCard({ item, lang }: { item: DocumentItem; lang: Lang }) {
  return (
    <li className="relative flex items-center gap-4 rounded-[14px] font-normal border border-chip-ink/70 bg-white px-[15px] py-[13px] focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-blue-border hover:bg-chip/40">
      <div className="min-w-0 flex-1">
        {(item.group || item.category) && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {item.group && <span className={badgeVariants()}>{item.group}</span>}
            {item.category && item.category !== item.group && <span className={badgeVariants({ variant: "outline" })}>{item.category}</span>}
          </div>
        )}
        <a href={item.url} target="_blank" rel="noopener" className="block text-lg leading-snug break-words text-chip-ink no-underline outline-none after:absolute after:inset-0">
          {item.title}
        </a>
        <p className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-chip-ink">
          <Calendar className="size-3" aria-hidden="true" />
          <time dateTime={item.date}>{metaDate(new Date(item.date), lang)}</time>
        </p>
      </div>
      <span className="grid size-[30px] shrink-0 place-items-center rounded-full border border-chip-ink text-chip-ink" aria-hidden="true">
        <ArrowUpRight className="size-3.5" />
      </span>
    </li>
  );
}
