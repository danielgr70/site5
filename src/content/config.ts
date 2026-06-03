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

export const collections = {
  reviews,
};
