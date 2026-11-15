// Compares every language with Galician, the source language, so a broken translation stops the
// build. A string missing in another language only warns: the site falls back to Galician.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const localesDir = join(root, "src/i18n/locales");
const source = "gl";

function flatten(messages, prefix = "", into = new Map()) {
  for (const [key, value] of Object.entries(messages)) {
    if (typeof value === "string") into.set(prefix + key, value);
    else flatten(value, `${prefix}${key}.`, into);
  }
  return into;
}

const read = (lang, file) => flatten(JSON.parse(readFileSync(join(localesDir, lang, file), "utf8")));
const placeholders = (text) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(",");

const errors = [];
const warnings = [];
const sourceFiles = readdirSync(join(localesDir, source));

for (const lang of readdirSync(localesDir).filter((name) => name !== source)) {
  for (const file of readdirSync(join(localesDir, lang))) {
    if (!sourceFiles.includes(file)) errors.push(`${lang}/${file}: no ${source}/${file} to translate from`);
  }
  for (const file of sourceFiles) {
    const original = read(source, file);
    let translated;
    try {
      translated = read(lang, file);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      warnings.push(`${lang}/${file}: missing, ${original.size} strings shown in ${source}`);
      continue;
    }
    for (const [key, text] of translated) {
      if (!original.has(key)) errors.push(`${lang}/${file}: "${key}" does not exist in ${source}`);
      else if (placeholders(text) !== placeholders(original.get(key)))
        errors.push(`${lang}/${file}: "${key}" must use the placeholders {${placeholders(original.get(key))}}`);
    }
    for (const key of original.keys()) {
      if (!translated.has(key) || translated.get(key) === "") warnings.push(`${lang}/${file}: "${key}" not translated`);
    }
  }
}

for (const warning of warnings) console.warn(`warning: ${warning}`);
if (errors.length) {
  for (const error of errors) console.error(`error: ${error}`);
  process.exit(1);
}
console.log(`Translations checked${warnings.length ? `, ${warnings.length} warnings` : ""}.`);
