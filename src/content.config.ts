import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { images, type ImageId } from "@/data/images";

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

export const collections = { news, events };
