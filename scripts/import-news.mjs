// Imports news from the current fegado.es into src/content/news/<year>/ as Markdown.
//
//   node scripts/import-news.mjs --since 2026        news published from 2026 on
//   node scripts/import-news.mjs --all               the whole archive
//   node scripts/import-news.mjs --since 2026 --force  rewrite files that already exist
//   node scripts/import-news.mjs --categorize        guess categories for files without them
//
// Downloaded pages are cached in .cache/import/, so re-running only fetches what is new. The live
// site is the source until a database export is available; only `fetchPage` would change then.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import TurndownService from "turndown";

const SITE = "https://fegado.es";
const root = new URL("..", import.meta.url).pathname;
const cacheDir = join(root, ".cache/import");
const outDir = join(root, "src/content/news");
const PAUSE_MS = 400;

const args = process.argv.slice(2);
const all = args.includes("--all");
const force = args.includes("--force");
const categorize = args.includes("--categorize");
const since = all ? 0 : Number(args[args.indexOf("--since") + 1]);
if (!all && !since && !categorize) {
  console.error("Usage: node scripts/import-news.mjs (--since <year> | --all) [--force] | --categorize");
  process.exit(1);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchPage(path) {
  const cacheFile = join(cacheDir, `${path.replace(/[^a-z0-9]+/gi, "_")}.html`);
  if (existsSync(cacheFile)) return readFileSync(cacheFile, "utf8");
  await sleep(PAUSE_MS);
  const response = await fetch(SITE + path, { headers: { "User-Agent": "fegado-prototype news importer" } });
  if (!response.ok) throw new Error(`${response.status} ${SITE}${path}`);
  const html = await response.text();
  mkdirSync(cacheDir, { recursive: true });
  writeFileSync(cacheFile, html);
  return html;
}

const decode = (text) =>
  text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));

const clean = (text) => decode(text.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();

/** List rows: id, title, date and author. The list page is newest first. */
function parseList(html) {
  // The sidebar repeats the latest news on every page, so only the main column is read.
  const main = html.slice(0, html.indexOf('<div class="col-lg-3 col-sm-12 sidebar">'));
  const rows = main.split('<div class="list-row">').slice(1);
  return rows
    .map((row) => ({
      id: row.match(/href="\/news\/view\/([a-z0-9]+)\/"/)?.[1],
      title: clean(row.match(/<h2><a[^>]*>([\s\S]*?)<\/a><\/h2>/)?.[1] ?? ""),
      date: row.match(/<time datetime="([^"]+)"/)?.[1],
      author: clean(row.match(/icon-group[^>]*><\/i>([\s\S]*?)<\/li>/)?.[1] ?? ""),
    }))
    .filter((item) => item.id && item.date);
}

/** Inner HTML of the element opened at `start`, following nested divs to its own closing tag. */
function divContents(html, start) {
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

function parseDetail(html) {
  const body = divContents(html, html.indexOf('<div class="text">')).replace(/<!--[\s\S]*?-->/g, "");
  const attachmentsBlock = html.match(/<div class="attachments">([\s\S]*?)<\/ul>/)?.[1] ?? "";
  const attachments = [...attachmentsBlock.matchAll(/<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map(([, url, title]) => ({
    title: clean(title),
    url: decode(url).trim(),
  }));
  // A few attachments on the live site have the title typed where the link should be.
  const broken = attachments.filter((a) => !/^https?:\/\//.test(a.url));
  for (const a of broken) console.warn(`\n  skipped attachment without a link: "${a.title}" (${a.url})`);
  return { body, attachments: attachments.filter((a) => !broken.includes(a)) };
}

const turndown = new TurndownService({ headingStyle: "atx", bulletListMarker: "-", emDelimiter: "*" });
turndown.addRule("absoluteLinks", {
  filter: (node) => node.nodeName === "A" && node.getAttribute("href")?.startsWith("/"),
  replacement: (content, node) => `[${content}](${SITE}${node.getAttribute("href")})`,
});

function toMarkdown(html) {
  return turndown
    .turndown(html)
    .replace(/ /g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// Galician and Spanish share most words; these are frequent ones that differ.
const GALICIAN = /\b(o|os|unha|ao|aos|coa|polo|pola|nas|nos|dos|das|tamén|xa|non|está|haberá|será|proba|xornada)\b/gi;
const SPANISH = /\b(el|los|una|al|del|con la|por el|por la|en las|en los|también|ya|no|habrá|será|prueba|jornada|y)\b/gi;

function guessLang(text) {
  const gl = text.match(GALICIAN)?.length ?? 0;
  const es = text.match(SPANISH)?.length ?? 0;
  return es > gl ? "es" : "gl";
}

// The live site has no categories, so a first guess comes from the words of the title and the
// opening of the text. Keys match src/data/taxonomy.ts; the first topic that matches wins.
const TOPICS = [
  ["comunicacion", /\b(asemblea|asamblea|contas|cuentas|dietas|eleccion|elecci|presidenta?\b|xunta directiva|junta directiva|circular|convocatoria|licenz|licenc|incidencia|aviso)/],
  ["resultados", /\b(resultad|clasificac|podio|medalla|campio[an]s?\b.*\b(acad|logr|conqu)|gaña|gana)/],
  ["formacion", /\b(curso|formaci|tecnificac|clinic|adestramento|entrenamiento|concentraci|xuices|jueces|cartograf)/],
  ["eventos", /\b(proba|prueba|liga|campionato|campeonato|inscrici|inscripci|inscrit|inscript|horas de saida|horarios|salidas|evento|trofeo|road ?book)/],
  ["promocion", /\b(promoci|escola|colexio|colegio|iniciaci|divulga|xogade|bautismo)/],
];
const DISCIPLINES = [
  ["mtbo", /(mtb-?o|\bbici)/],
  ["trail-o", /\btrail-?o\b/],
  ["rogaine", /\brogain/],
  ["raid", /\braid/],
  ["escolar", /\b(escolar|universitari|xogade)/],
  ["o-pe", /\b(o-?p[eé]|o-?pie|sprint)\b/],
];

// The title says what a news item is about; the body is only read when the title matches nothing.
function guessCategories(title, body) {
  const texts = [title, body.slice(0, 800)].map((text) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
  const find = (rules) => texts.map((text) => rules.find(([, pattern]) => pattern.test(text))?.[0]).find(Boolean);
  const topic = find(TOPICS) ?? "comunicacion";
  const discipline = find(DISCIPLINES);
  return discipline ? [topic, discipline] : [topic];
}

/** Adds guessed categories to news files that have none, without downloading anything. */
function categorizeExisting() {
  let changed = 0;
  for (const file of existingIds().values()) {
    const content = readFileSync(file, "utf8");
    const [, frontmatter, body] = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/) ?? [];
    if (frontmatter === undefined || /^categories:/m.test(frontmatter)) continue;
    const title = frontmatter.match(/^title: (.*)$/m)?.[1] ?? "";
    const categories = guessCategories(title, body);
    writeFileSync(file, `---\n${frontmatter}\ncategories: ${yaml(categories)}\n---\n${body}`);
    changed++;
  }
  console.log(`${changed} news categorized`);
}

function slugify(text) {
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

const yaml = (value) => JSON.stringify(value);

// Fields the live site does not have and that are set by hand; a re-import keeps them, and keeps a
// corrected `lang` instead of guessing again.
const EDITED_FIELDS = ["image", "imagePosition", "categories"];

function editedFields(file) {
  const frontmatter = readFileSync(file, "utf8").split(/^---$/m)[1] ?? "";
  const lines = frontmatter
    .split("\n")
    .filter((line, i, all) => {
      const key = line.match(/^(\w+):/)?.[1];
      if (key) return EDITED_FIELDS.includes(key);
      // Indented continuation lines belong to the last top-level key above them.
      const owner = all.slice(0, i).reverse().find((l) => /^\w+:/.test(l))?.match(/^(\w+):/)?.[1];
      return owner !== undefined && EDITED_FIELDS.includes(owner) && line.trim() !== "";
    });
  return { lang: frontmatter.match(/^lang: (\w+)$/m)?.[1], lines };
}

function existingIds() {
  if (!existsSync(outDir)) return new Map();
  const ids = new Map();
  for (const year of readdirSync(outDir)) {
    for (const file of readdirSync(join(outDir, year))) {
      const id = readFileSync(join(outDir, year, file), "utf8").match(/^legacyId: "([^"]+)"/m)?.[1];
      if (id) ids.set(id, join(outDir, year, file));
    }
  }
  return ids;
}

async function main() {
  const known = existingIds();
  const items = [];
  for (let page = 1; ; page++) {
    const rows = parseList(await fetchPage(page === 1 ? "/news/" : `/news/?page=${page}`));
    if (!rows.length) break;
    const kept = rows.filter((row) => Number(row.date.slice(0, 4)) >= since);
    items.push(...kept);
    process.stdout.write(`\rlist page ${page}: ${items.length} news`);
    if (kept.length < rows.length) break;
  }
  console.log();

  const usedPaths = new Set();
  let written = 0;
  for (const [index, item] of items.entries()) {
    const year = item.date.slice(0, 4);
    const day = item.date.slice(0, 10);
    let file = join(outDir, year, `${day}-${slugify(item.title) || item.id}.md`);
    if (usedPaths.has(file)) file = file.replace(/\.md$/, `-${item.id}.md`);
    usedPaths.add(file);

    const previous = known.get(item.id);
    if (previous && !force) continue;

    const { body, attachments } = parseDetail(await fetchPage(`/news/view/${item.id}/`));
    const markdown = toMarkdown(body);
    const edited = previous ? editedFields(previous) : { lang: undefined, lines: [] };
    const frontmatter = [
      "---",
      `title: ${yaml(item.title)}`,
      `date: ${item.date}`,
      `author: ${yaml(item.author)}`,
      `lang: ${edited.lang ?? guessLang(`${item.title} ${markdown}`)}`,
      `legacyId: ${yaml(item.id)}`,
      `legacyUrl: ${yaml(`${SITE}/news/view/${item.id}/`)}`,
      ...(attachments.length
        ? ["attachments:", ...attachments.map((a) => `  - title: ${yaml(a.title)}\n    url: ${yaml(a.url)}`)]
        : []),
      ...(edited.lines.some((line) => line.startsWith("categories:"))
        ? []
        : [`categories: ${yaml(guessCategories(item.title, markdown))}`]),
      ...edited.lines,
      "---",
    ].join("\n");

    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(previous ?? file, `${frontmatter}\n\n${markdown}\n`);
    written++;
    process.stdout.write(`\rdetail ${index + 1}/${items.length}`);
  }
  console.log(`\n${written} news written to src/content/news/`);
}

(categorize ? Promise.resolve(categorizeExisting()) : main()).catch((error) => {
  console.error(error);
  process.exit(1);
});
