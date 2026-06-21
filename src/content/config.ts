import { defineCollection, z } from "astro:content";

/** Keystatic `fields.slug` se guarda como `{ name, slug }` en el frontmatter. */
function hebrewString(defaultValue?: string) {
  const base = defaultValue !== undefined ? z.string().default(defaultValue) : z.string();
  return z.preprocess((val) => {
    if (val && typeof val === "object" && val !== null && "name" in val) {
      return (val as { name: string }).name;
    }
    return val;
  }, base);
}

/** Normaliza rutas de fields.image de Keystatic para el front. */
function assetPath(required = true) {
  const base = required ? z.string() : z.string().optional().default("");
  return z.preprocess((val) => {
    if (!val) return "";
    if (typeof val !== "string") return val;
    if (val.startsWith("http") || val.startsWith("/")) return val;
    return `/assets/img/${val.replace(/^\//, "")}`;
  }, base);
}

const reviews = defineCollection({
  type: "content",
  schema: z.object({
    name: hebrewString(),
    date: z.string().optional().default(""),
    rating: z.number().min(1).max(5).default(5),
    photoUrl: z.string().optional().default(""),
    order: z.number().int().default(0),
  }),
});

const customerVideos = defineCollection({
  type: "content",
  schema: z.object({
    name: hebrewString(),
    imageUrl: assetPath(),
    imageAlt: z.string(),
    youtubeUrl: z.string(),
    order: z.number().int().default(0),
  }),
});

const podcast = defineCollection({
  type: "content",
  schema: z.object({
    title: hebrewString(),
    imageUrl: assetPath(),
    imageAlt: z.string(),
    youtubeUrl: z.string(),
    order: z.number().int().default(0),
  }),
});

const services = defineCollection({
  type: "content",
  schema: z.object({
    title: hebrewString(),
    iconUrl: assetPath(),
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
    title: hebrewString(),
    kicker: z.string().default(""),
    imageUrl: assetPath(),
    order: z.number().int().default(0),
    animateDelay: z.string().optional().default(""),
    ctaText: z.string().default(""),
    ctaHref: z.string().default(""),
    ctaNewTab: z.boolean().default(false),
    ctaGaEvent: z.string().optional().default(""),
    ctaGaPlacement: z.string().optional().default(""),
  }),
});

const events = defineCollection({
  type: "content",
  schema: z.object({
    title: hebrewString(),
    dateLabel: z.string(),
    imageUrl: assetPath(),
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

const heroEvent = defineCollection({
  type: "content",
  schema: z.object({
    showEvent: z.boolean().default(true),
    kicker: z.string(),
    title: hebrewString(),
    location: z.string(),
    dayLabel: z.string(),
    dateLabel: z.string(),
    showDiscount: z.boolean().default(true),
    discountDeadline: z.string().optional().default(""),
    discountText: z.string().optional().default(""),
    countdownLabel: z.string().default("הכנס בעוד:"),
    countdownTarget: z.preprocess((val) => {
      if (val === undefined || val === null || val === "") return "";
      if (val instanceof Date) {
        const pad = (n: number) => String(n).padStart(2, "0");
        return `${val.getFullYear()}-${pad(val.getMonth() + 1)}-${pad(val.getDate())}T${pad(val.getHours())}:${pad(val.getMinutes())}:00`;
      }
      return val;
    }, z.string()),
    countdownEndedMessage: z.string().default(
      "המחזור כבר התחיל - ניתן להירשם למחזור הבא"
    ),
    ctaText: z.string(),
    ctaHref: z.string(),
    ctaNewTab: z.boolean().default(true),
    ctaGaEvent: z.string().optional().default(""),
    ctaGaPlacement: z.string().optional().default(""),
  }),
});

const heroPopup = defineCollection({
  type: "content",
  schema: z.object({
    showPopup: z.boolean().default(true),
    badge: z.string(),
    title: hebrewString(),
    footnote: z.string().optional().default(""),
    imageUrl: assetPath(false),
    imageAlt: z.string().optional().default(""),
    ctaText: z.string(),
    ctaHref: z.string(),
    ctaNewTab: z.boolean().default(true),
    ctaGaEvent: z.string().optional().default(""),
    ctaGaPlacement: z.string().optional().default(""),
  }),
});

export const collections = {
  reviews,
  "customer-videos": customerVideos,
  podcast,
  services,
  products,
  events,
  "hero-event": heroEvent,
  "hero-popup": heroPopup,
};
