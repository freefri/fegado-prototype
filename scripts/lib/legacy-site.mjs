// Helpers shared by the importers that read the current fegado.es (news, events).
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import TurndownService from "turndown";

export const SITE = "https://fegado.es";
export const root = new URL("../..", import.meta.url).pathname;
const cacheDir = join(root, ".cache/import");
const PAUSE_MS = 400;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** A page of the live site, from .cache/import/ when it was downloaded before. */
export async function fetchPage(path) {
  const cacheFile = join(cacheDir, `${path.replace(/[^a-z0-9]+/gi, "_")}.html`);
  if (existsSync(cacheFile)) return readFileSync(cacheFile, "utf8");
  await sleep(PAUSE_MS);
  const response = await fetch(SITE + path, { headers: { "User-Agent": "fegado-prototype importer" } });
  if (!response.ok) throw new Error(`${response.status} ${SITE}${path}`);
  const html = await response.text();
  mkdirSync(cacheDir, { recursive: true });
  writeFileSync(cacheFile, html);
  return html;
}

export const decode = (text) =>
  text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));

export const clean = (text) => decode(text.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();

/** Inner HTML of the element opened at `start`, following nested divs to its own closing tag. */
export function divContents(html, start) {
  const open = html.indexOf(">", start) + 1;
  const tags = /<div\b|<\/div>/g;
  tags.lastIndex = open;
  let depth = 1;
  for (let match; (match = tags.exec(html)); ) {
    depth += match[0] === "</div>" ? -1 : 1;
    if (depth === 0) return html.slice(open, match.index);
  }
  return html.slice(open);
}

const turndown = new TurndownService({ headingStyle: "atx", bulletListMarker: "-", emDelimiter: "*" });
turndown.addRule("absoluteLinks", {
  filter: (node) => node.nodeName === "A" && node.getAttribute("href")?.startsWith("/"),
  replacement: (content, node) => `[${content}](${SITE}${node.getAttribute("href")})`,
});

export function toMarkdown(html) {
  return turndown
    .turndown(html)
    .replace(/ /g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function slugify(text) {
  const slug = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ñ/g, "n")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 70)
    .replace(/-[^-]*$/, (tail) => (tail.length > 1 ? tail : ""))
    .replace(/-$/, "");
  return /^\d*$/.test(slug) ? `nova-${slug}` : slug;
}

export const yaml = (value) => JSON.stringify(value);

/**
 * Lines of the frontmatter of `file` whose key is one of `fields`, with their indented
 * continuation lines, so a re-import can keep what was set by hand.
 */
export function keptLines(file, fields) {
  const frontmatter = readFileSync(file, "utf8").split(/^---$/m)[1] ?? "";
  return frontmatter.split("\n").filter((line, i, all) => {
    const key = line.match(/^(\w+):/)?.[1];
    if (key) return fields.includes(key);
    // Indented continuation lines belong to the last top-level key above them.
    const owner = all.slice(0, i).reverse().find((l) => /^\w+:/.test(l))?.match(/^(\w+):/)?.[1];
    return owner !== undefined && fields.includes(owner) && line.trim() !== "";
  });
}

/** Files under `dir`/<year>/ by the legacyId in their frontmatter. */
export function filesByLegacyId(dir) {
  const ids = new Map();
  if (!existsSync(dir)) return ids;
  for (const year of readdirSync(dir).filter((name) => statSync(join(dir, name)).isDirectory())) {
    for (const file of readdirSync(join(dir, year))) {
      const id = readFileSync(join(dir, year, file), "utf8").match(/^legacyId: "([^"]+)"/m)?.[1];
      if (id) ids.set(id, join(dir, year, file));
    }
  }
  return ids;
}

