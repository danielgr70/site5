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

export const collections = {
  reviews,
  services,
};
