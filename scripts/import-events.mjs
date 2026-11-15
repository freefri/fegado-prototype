// Imports the events of the current fegado.es into src/content/events/<year>/ as Markdown.
//
//   node scripts/import-events.mjs --since 2026           seasons from 2026 on
//   node scripts/import-events.mjs --since 2026 --force   rewrite files that already exist
//
// Posters are downloaded once and stored at 900 px in src/assets/images/events/, so the build does
// not depend on the intranet being reachable.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import sharp from "sharp";
import { SITE, clean, decode, divContents, fetchPage, filesByLegacyId, keptLines, root, slugify, toMarkdown, yaml } from "./lib/legacy-site.mjs";

const outDir = join(root, "src/content/events");
const posterDir = join(root, "src/assets/images/events");

const args = process.argv.slice(2);
const force = args.includes("--force");
const since = Number(args[args.indexOf("--since") + 1]);
if (!since) {
  console.error("Usage: node scripts/import-events.mjs --since <year> [--force]");
  process.exit(1);
}

// Event types on the live site, mapped to the disciplines of src/data/taxonomy.ts.
const DISCIPLINES = {
  "O-Pe": "o-pe",
  "Sprint": "sprint",
  "MTBO": "mtbo",
  "Raid": "raid",
  "Trail-O": "trail-o",
  "Trail-O_Reducido": "trail-o",
  "Rogaine": "rogaine",
  "Escolar e Universitario": "escolar",
  "Iniciación": "iniciacion",
  "Duatlón-O": "duatlon-o",
};

// Fields set by hand for the start page (photos and the demo countdown); a re-import keeps them.
const EDITED_FIELDS = ["poster", "heroImage", "demoSecondsLeft"];

/** Rows of a season page: id, title, date, type, club and whether the event is official. */
function parseSeason(html) {
  return html
    .split('<td class="column-picture">')
    .slice(1)
    .map((row) => ({
      id: row.match(/href="\/events\/view\/([a-z0-9]+)\/"/)?.[1],
      title: clean(row.match(/<h4><a[^>]*>([\s\S]*?)<\/a>/)?.[1] ?? ""),
      date: row.match(/<time datetime="([^"]+)"/)?.[1],
      type: clean(row.match(/class="column-type">([\s\S]*?)<\/td>/)?.[1] ?? ""),
      club: clean(row.match(/class="column-club">([\s\S]*?)<\/td>/)?.[1] ?? ""),
      official: /alt="Evento Oficial"/.test(row),
    }))
    .filter((row) => row.id && row.date);
}

const IMAGE = /\.(jpe?g|png|webp|gif)$/i;

function parseDetail(html) {
  const textStart = html.indexOf('<div class="text');
  const body = textStart === -1 ? "" : divContents(html, textStart).replace(/<!--[\s\S]*?-->/g, "");
  const attachmentsBlock = html.match(/<div class="attachments">([\s\S]*?)<\/ul>/)?.[1] ?? "";
  const attachments = [...attachmentsBlock.matchAll(/<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)]
    .map(([, url, title]) => ({ title: clean(title), url: decode(url).trim() }))
    .filter((a) => /^https?:\/\//.test(a.url));
  const registration = html.match(/O prazo para a inscrición[^<]*<time datetime="([^"]+)"[\s\S]*?<a href="([^"]+)"/);
  return {
    body,
    attachments,
    // The poster is the first image among the attachments, usually titled "Cartel".
    posterUrl: attachments.find((a) => IMAGE.test(a.url))?.url,
    registrationDeadline: registration?.[1],
    registrationUrl: registration?.[2],
  };
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// The intranet drops connections when asked for many large files in a row.
async function fetchWithRetry(url, attempts = 4) {
  for (let attempt = 1; ; attempt++) {
    await sleep(400 * attempt);
    try {
      const response = await fetch(url, { headers: { "User-Agent": "fegado-prototype importer" } });
      if (response.ok) return response;
      throw new Error(`${response.status} ${url}`);
    } catch (error) {
      if (attempt === attempts) throw error;
    }
  }
}

/** Saves the poster as a 900 px JPEG named after the event, unless it is there already. */
async function savePoster(url, name) {
  const file = join(posterDir, `${name}.jpg`);
  if (!existsSync(file)) {
    const response = await fetchWithRetry(url);
    mkdirSync(posterDir, { recursive: true });
    await sharp(Buffer.from(await response.arrayBuffer()))
      .resize({ width: 900, withoutEnlargement: true })
      .flatten({ background: "#ffffff" })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(file);
  }
  return `${name}.jpg`;
}

async function main() {
  const known = filesByLegacyId(outDir);
  const lastSeason = new Date().getFullYear() + 1;
  const items = [];
  for (let year = since; year <= lastSeason; year++) {
    const rows = parseSeason(await fetchPage(`/events/${year}/?type=all`));
    items.push(...rows.filter((row) => row.date.startsWith(String(year))));
    process.stdout.write(`\rseason ${year}: ${items.length} events`);
  }
  console.log();

  const unknownTypes = new Set();
  const usedPaths = new Set();
  let written = 0;
  for (const [index, item] of items.entries()) {
    const year = item.date.slice(0, 4);
    let file = join(outDir, year, `${item.date.slice(0, 10)}-${slugify(item.title) || item.id}.md`);
    if (usedPaths.has(file)) file = file.replace(/\.md$/, `-${item.id}.md`);
    usedPaths.add(file);

    const previous = known.get(item.id);
    if (previous && !force) continue;

    const discipline = DISCIPLINES[item.type];
    if (!discipline) unknownTypes.add(item.type);
    const detail = parseDetail(await fetchPage(`/events/view/${item.id}/`));
    const frontmatter = [
      "---",
      `title: ${yaml(item.title)}`,
      `date: ${item.date}`,
      `club: ${yaml(item.club)}`,
      `discipline: ${discipline ?? "o-pe"}`,
      `official: ${item.official}`,
      `legacyId: ${yaml(item.id)}`,
      `legacyUrl: ${yaml(`${SITE}/events/view/${item.id}/`)}`,
      ...(detail.posterUrl
        ? [`posterUrl: ${yaml(detail.posterUrl)}`, `posterFile: ${await savePoster(detail.posterUrl, file.split("/").pop().replace(/\.md$/, ""))}`]
        : []),
      ...(detail.registrationDeadline ? [`registrationDeadline: ${detail.registrationDeadline}`] : []),
      ...(detail.registrationUrl ? [`registrationUrl: ${yaml(detail.registrationUrl)}`] : []),
      ...(detail.attachments.length
        ? ["attachments:", ...detail.attachments.map((a) => `  - title: ${yaml(a.title)}\n    url: ${yaml(a.url)}`)]
        : []),
      ...(previous ? keptLines(previous, EDITED_FIELDS) : []),
      "---",
    ].join("\n");

    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(previous ?? file, `${frontmatter}\n\n${toMarkdown(detail.body)}\n`);
    written++;
    process.stdout.write(`\rdetail ${index + 1}/${items.length}`);
  }
  if (unknownTypes.size) console.warn(`\nTypes without a discipline, filed as o-pe: ${[...unknownTypes].join(", ")}`);
  console.log(`\n${written} events written to src/content/events/`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
