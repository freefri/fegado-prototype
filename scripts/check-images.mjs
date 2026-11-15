// Fails when the image registry (src/data/images.ts) and the image files drift apart, so the
// record of where every image comes from cannot silently go stale.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const registryPath = join(root, "src/data/images.ts");
const registry = readFileSync(registryPath, "utf8");
const IMAGE = /\.(avif|gif|jpe?g|png|svg|webp|ico)$/i;

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const problems = [];

// Folders registered as a whole: every file must be named by an entry of the data file that uses it.
const folders = [{ dir: "clubs", glob: "../assets/images/clubs/*", usedIn: "src/content/clubs.yaml" }];

for (const file of walk(join(root, "src/assets/images")).filter((f) => IMAGE.test(f))) {
  const path = relative(join(root, "src/assets/images"), file);
  const folder = folders.find((f) => path.startsWith(`${f.dir}/`));
  if (folder) {
    if (!registry.includes(`"${folder.glob}"`)) problems.push(`folder not registered: src/assets/images/${folder.dir}/`);
    const name = path.slice(folder.dir.length + 1);
    if (!new RegExp(`:\\s*${name.replace(/[.]/g, "\\.")}\\s*$`, "m").test(readFileSync(join(root, folder.usedIn), "utf8")))
      problems.push(`registered but unused: src/assets/images/${path} (not in ${folder.usedIn})`);
  } else if (!registry.includes(`"@/assets/images/${path}"`)) {
    problems.push(`not registered: src/assets/images/${path}`);
  }
}

for (const file of readdirSync(join(root, "public")).filter((f) => IMAGE.test(f))) {
  if (!registry.includes(`"${file}":`)) problems.push(`not registered in publicImages: public/${file}`);
}

const sources = walk(join(root, "src"))
  .filter((f) => /\.(astro|tsx?|mdx?|json|ya?ml)$/.test(f) && f !== registryPath)
  .map((f) => readFileSync(f, "utf8"))
  .join("\n");

const imagesBlock = registry.slice(registry.indexOf("export const images"), registry.indexOf("export type ImageId"));
for (const [, id] of imagesBlock.matchAll(/^ {2}(\w+): \{$/gm)) {
  if (!new RegExp(`\\b${id}\\b`).test(sources)) problems.push(`registered but unused: images.${id}`);
}

const publicBlock = registry.slice(registry.indexOf("export const publicImages"));
for (const [, file] of publicBlock.matchAll(/^ {2}"([^"]+)":/gm)) {
  if (!sources.includes(file)) problems.push(`registered but unused: public/${file}`);
}

if (problems.length) {
  console.error(`Image registry out of date (src/data/images.ts):\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
console.log("Image registry matches the image files.");
