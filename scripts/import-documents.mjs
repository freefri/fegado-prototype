// Imports the document list of fegado.es (Transparencia > Descargas) into src/content/documents.json.
//
//   node scripts/import-documents.mjs
//
// Only the list is imported: titles, dates, categories and links. The files stay on fegado.es.
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const SITE = "https://fegado.es";
const root = new URL("..", import.meta.url).pathname;
const outFile = join(root, "src/content/documents.json");

// Category names on the live site, mapped to the keys of src/data/documents.ts.
const CATEGORIES = {
  "Actas": "actas",
  "AUDITORIA": "auditoria",
  "AXUDAS DGAN": "axudas-dxan",
  "Calendarios": "calendarios",
  "Cartografía": "cartografia",
  "Clubs e Orientadores": "clubs-orientadores",
  "Colaboradores FEGADO": "colaboradores",
  "Contabilidade": "contabilidade",
  "Convenios": "convenios",
  "Covid-19": "covid-19",
  "Deportistas de Alto Nivel": "alto-nivel",
  "Eleccións 2026": "eleccions-2026",
  "Estatutos + Normas autonómicas": "estatutos",
  "FORMACIÓN": "formacion",
  "Identidade": "identidade",
  "LICENZAS": "licenzas",
  "MEMORIA ACTIVIDADES": "memoria",
  "Normativa": "normativa",
  "Organigrama": "organigrama",
  "Práctica Deportiva Clubs": "practica-deportiva",
  "Procesos electorais": "procesos-electorais",
  "PROTECCIÓN DE DATOS": "proteccion-datos",
  "Proxecto Deportivo": "proxecto-deportivo",
  "Rankings": "rankings",
  "Recursos Didácticos": "recursos-didacticos",
  "Seguro": "seguro",
  "Seleccións Galegas": "seleccions",
  "TRAZADORES/AS": "trazadores",
  "Uniformidad": "uniformidade",
  "XOGADE": "xogade",
  "Xuíces/as Controladores": "xuices-controladores",
  "Xuíces/as Cronometradores/as": "xuices-cronometradores",
  "": "outros",
};

const decode = (text) =>
  text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));

const response = await fetch(`${SITE}/federation/downloads/`, { headers: { "User-Agent": "fegado-prototype documents importer" } });
if (!response.ok) throw new Error(`${response.status} ${SITE}/federation/downloads/`);
const html = await response.text();

// The page repeats every document in one tab per category; the "all" tab has each one once.
const start = html.indexOf('id="panel-all"');
const all = html.slice(start, html.indexOf('class="tab-pane', start + 1));
const item = /<a href="([^"]+)" class="list-group-item"[^>]*>\s*<span class="badge"><time datetime="([^"]+)"[^>]*>[^<]*<\/time><\/span>\s*<span class="badge">([^<]*)<\/span>\s*([\s\S]*?)\s*<\/a>/g;

const unknown = new Set();
const documents = [];
for (const [, href, date, category, rawTitle] of all.matchAll(item)) {
  const title = decode(rawTitle).replace(/\s+/g, " ").trim();
  const url = new URL(decode(href).trim(), SITE).href;
  // A few entries on the live site were saved without their file and link to the uploads folder.
  if (url.endsWith("/uploads/")) {
    console.warn(`skipped document without a file: "${title}"`);
    continue;
  }
  const key = CATEGORIES[decode(category).trim()];
  if (!key) unknown.add(category);
  documents.push({ id: url.split("/").slice(-2).join("/"), title, date, category: key ?? "outros", url });
}

if (unknown.size) console.warn(`Categories without a key, filed under "outros": ${[...unknown].join(", ")}`);
writeFileSync(outFile, `${JSON.stringify(documents, null, 1)}\n`);
console.log(`${documents.length} documents written to src/content/documents.json`);
