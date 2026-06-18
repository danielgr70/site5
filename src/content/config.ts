import { defineCollection, z } from "astro:content";

const reviews = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    date: z.string().optional().default(""),
    rating: z.number().min(1).max(5).default(5),
    photoUrl: z.string().optional().default(""),
    order: z.number().int().default(0),
  }),
});

const customerVideos = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    imageUrl: z.string(),
    imageAlt: z.string(),
    youtubeUrl: z.string(),
    order: z.number().int().default(0),
  }),
});

const podcast = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    imageUrl: z.string(),
    imageAlt: z.string(),
    youtubeUrl: z.string(),
    order: z.number().int().default(0),
  }),
});

const services = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    iconUrl: z.string(),
    iconAlt: z.string(),
    iconClass: z.string().optional().default(""),
    iconWidth: z.number().int().positive().default(72),
    iconHeight: z.number().int().positive().default(72),
    order: z.number().int().default(0),
    animateDelay: z.string().optional().default(""),
  }),
});

const products = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    kicker: z.string(),
    imageUrl: z.string(),
    order: z.number().int().default(0),
    animateDelay: z.string().optional().default(""),
    ctaText: z.string(),
    ctaHref: z.string(),
    ctaNewTab: z.boolean().default(false),
    ctaGaEvent: z.string().optional().default(""),
    ctaGaPlacement: z.string().optional().default(""),
  }),
});

const events = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    dateLabel: z.string(),
    imageUrl: z.string(),
    imageAlt: z.string(),
    imageWidth: z.number().int().positive().default(640),
    imageHeight: z.number().int().positive().default(360),
    order: z.number().int().default(0),
    animateDelay: z.string().optional().default(""),
    ctaText: z.string(),
    ctaHref: z.string(),
    ctaNewTab: z.boolean().default(true),
    ctaGaEvent: z.string().optional().default(""),
    ctaGaPlacement: z.string().optional().default(""),
    ctaGaEventId: z.string().optional().default(""),
  }),
});

export const collections = {
  reviews,
  "customer-videos": customerVideos,
  podcast,
  services,
  products,
  events,
};
