import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ListFilter, Search } from "lucide-react";
import { DocumentCard, type DocumentItem } from "./DocumentCard";
import type { Lang } from "@/i18n/ui";
import { cn } from "@/lib/utils";

export interface FilterGroup {
  key: string;
  label: string;
  categories: { key: string; label: string }[];
}

export interface DocumentListLabels {
  search: string;
  filters: string;
  clear: string;
  previous: string;
  next: string;
  pagination: string;
  results: string;
  noResults: string;
}

interface Props {
  items: (DocumentItem & { categoryKey: string })[];
  groups: FilterGroup[];
  lang: Lang;
  labels: DocumentListLabels;
}

const PER_PAGE = 10;

/** Lower case without accents, so "eleccions" finds "Eleccións". */
const fold = (text: string) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/**
 * The document list with search, category filters and pages. It runs in the browser because the
 * archive has about a thousand documents and filtering them is instant there; the first page is
 * rendered at build time, so the list is readable before the script loads.
 */
export default function DocumentList({ items, groups, lang, labels }: Props) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const listRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);

  const searchable = useMemo(() => items.map((item) => fold(`${item.title} ${item.group ?? ""} ${item.category ?? ""}`)), [items]);
  const filtered = useMemo(() => {
    const words = fold(query).split(/\s+/).filter(Boolean);
    return items.filter(
      (item, index) => (selected.size === 0 || selected.has(item.categoryKey)) && words.every((word) => searchable[index].includes(word)),
    );
  }, [items, searchable, query, selected]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const shown = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  useEffect(() => {
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent ? event.key === "Escape" : !filtersRef.current?.contains(event.target as Node)) setOpenGroup(null);
    };
    document.addEventListener("click", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", close);
    };
  }, []);

  const toggleCategory = (key: string) => {
    setSelected((previous) => {
      const next = new Set(previous);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
    setPage(1);
  };

  const goTo = (target: number) => {
    setPage(target);
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Around the current page plus first and last, so a hundred pages stay a short row.
  const pageNumbers = [...new Set([1, current - 1, current, current + 1, totalPages])].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);

  return (
    <div ref={listRef} className="scroll-mt-6">
      <div className="mb-4 flex items-center gap-2.5">
        <label className="relative w-full max-w-[320px]">
          <span className="sr-only">{labels.search}</span>
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-3.5 -translate-y-1/2 text-ink-soft" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder={labels.search}
            className="h-[34px] w-full rounded-full border border-chip-ink/70 bg-white pr-3 pl-9 text-[13px] placeholder:text-ink-soft"
          />
        </label>
        <button
          type="button"
          onClick={() => setShowFilters((value) => !value)}
          aria-expanded={showFilters}
          aria-controls="document-filters"
          aria-label={labels.filters}
          className={cn(
            "grid size-[34px] shrink-0 cursor-pointer place-items-center rounded-full border border-chip-ink",
            showFilters || selected.size ? "bg-chip-ink text-white" : "bg-white text-chip-ink",
          )}
        >
          <ListFilter className="size-4" aria-hidden="true" />
        </button>
      </div>

      <div id="document-filters" ref={filtersRef} hidden={!showFilters} className="mb-6">
        <div className="flex flex-wrap items-center gap-2">
          {groups.map((group) => {
            const chosen = group.categories.filter((category) => selected.has(category.key));
            const label = chosen.length ? `${group.label}: ${chosen[0].label}${chosen.length > 1 ? ` +${chosen.length - 1}` : ""}` : group.label;
            return (
              <div key={group.key} className="relative">
                <button
                  type="button"
                  aria-expanded={openGroup === group.key}
                  onClick={() => setOpenGroup(openGroup === group.key ? null : group.key)}
                  className={cn(
                    "flex h-[28px] cursor-pointer items-center gap-2 rounded-full border border-chip-ink px-3.5 text-[13px]",
                    chosen.length ? "bg-chip-ink text-white" : "bg-white text-chip-ink",
                  )}
                >
                  {label}
                  <ChevronDown className="size-3.5" aria-hidden="true" />
                </button>
                {openGroup === group.key && (
                  <ul className="absolute top-full left-0 z-10 mt-1 max-h-[320px] min-w-[240px] list-none overflow-y-auto rounded-md bg-white p-1.5 shadow-[0_8px_24px_rgb(19_68_130/0.16)]">
                    {group.categories.map((category) => (
                      <li key={category.key}>
                        <label className="flex cursor-pointer items-center gap-2.5 rounded px-2.5 py-2 text-sm hover:bg-chip">
                          <input type="checkbox" className="size-4 accent-blue-to" checked={selected.has(category.key)} onChange={() => toggleCategory(category.key)} />
                          {category.label}
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
          {selected.size > 0 && (
            <button
              type="button"
              onClick={() => {
                setSelected(new Set());
                setPage(1);
              }}
              className="cursor-pointer px-2 text-[13px] font-semibold text-chip-ink hover:underline"
            >
              {labels.clear}
            </button>
          )}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {labels.results.replace("{count}", String(filtered.length))}
      </p>

      {shown.length ? (
        <ul className="grid list-none gap-[15px] p-0">
          {shown.map((item) => (
            <DocumentCard key={item.id} item={item} lang={lang} />
          ))}
        </ul>
      ) : (
        <p className="rounded-md bg-chip px-4 py-3 text-sm text-chip-ink">{labels.noResults}</p>
      )}

      {totalPages > 1 && (
        <nav aria-label={labels.pagination} className="mt-6 flex flex-wrap items-center gap-1 text-[13px]">
          <button type="button" disabled={current === 1} onClick={() => goTo(current - 1)} className="flex cursor-pointer items-center gap-1 px-2 py-1.5 disabled:cursor-default disabled:opacity-40">
            <ChevronLeft className="size-3.5" aria-hidden="true" />
            {labels.previous}
          </button>
          {pageNumbers.map((number, index) => (
            <span key={number} className="flex items-center gap-1">
              {index > 0 && number - pageNumbers[index - 1] > 1 && <span className="px-1.5" aria-hidden="true">…</span>}
              <button
                type="button"
                onClick={() => goTo(number)}
                aria-current={number === current ? "page" : undefined}
                className={cn("grid size-[30px] cursor-pointer place-items-center rounded-full", number === current ? "border border-chip-border bg-white" : "hover:bg-chip")}
              >
                {number}
              </button>
            </span>
          ))}
          <button type="button" disabled={current === totalPages} onClick={() => goTo(current + 1)} className="flex cursor-pointer items-center gap-1 px-2 py-1.5 disabled:cursor-default disabled:opacity-40">
            {labels.next}
            <ChevronRight className="size-3.5" aria-hidden="true" />
          </button>
        </nav>
      )}
    </div>
  );
}
