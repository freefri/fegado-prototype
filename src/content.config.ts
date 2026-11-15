import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";
import { documentCategoryKeys } from "@/data/documents";
import { clubLogos, images, type ImageId } from "@/data/images";

const imageId = z
  .string()
  .refine((id): id is ImageId => id in images, { message: "Not in the image registry (src/data/images.ts)" })
  .transform((id) => id as ImageId);

const lang = z.enum(["gl", "es"]);

const news = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/news" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    author: z.string(),
    /** Language the item was written in; news is not translated. */
    lang,
    legacyId: z.string().optional(),
    legacyUrl: z.url().optional(),
    attachments: z.array(z.object({ title: z.string(), url: z.url() })).default([]),
    image: imageId.optional(),
    imagePosition: z.string().optional(),
    categories: z.array(z.string()).default([]),
  }),
});

export const disciplines = ["o-pe", "escolar", "mtbo", "raid", "trail-o", "rogaine"] as const;

const events = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/events" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    club: z.string(),
    discipline: z.enum(disciplines),
    official: z.boolean(),
    poster: imageId,
    heroImage: imageId,
    href: z.url().default("https://fegado.es/events/"),
    registrationDeadline: z.coerce.date().optional(),
    /** Prototype only: the design's events are past, so their countdown runs from page load. */
    demoSecondsLeft: z.number().int().positive().optional(),
  }),
});

/** Pages written as content, one file per language: `pages/<lang>/<route key>.mdx`. */
const pages = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    intro: z.string(),
    image: imageId.optional(),
    /** Full-width layout, for pages built around a grid of cards. */
    wide: z.boolean().default(false),
  }),
});

const clubs = defineCollection({
  loader: file("./src/content/clubs.yaml"),
  schema: z.object({
    name: z.string(),
    province: z.string(),
    web: z.url().optional(),
    logo: z
      .string()
      .refine((name) => name in clubLogos, { message: "No such file in src/assets/images/clubs/" })
      .optional(),
  }),
});

/** Public documents of the federation; the files themselves stay on fegado.es. */
const documents = defineCollection({
  loader: file("./src/content/documents.json"),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.enum(documentCategoryKeys),
    url: z.url(),
  }),
});

const localized = z.object({ gl: z.string(), es: z.string() });

const board = defineCollection({
  loader: file("./src/content/board.yaml"),
  schema: z.object({
    name: z.string(),
    role: localized,
    club: z.string(),
    email: z.email(),
    photo: imageId.optional(),
    bio: z.object({ gl: z.array(z.string()), es: z.array(z.string()) }).optional(),
  }),
});

export const collections = { news, events, pages, clubs, documents, board };
