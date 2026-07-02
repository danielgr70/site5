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

function normalizeReviewPhotoPath(val: string): string {
  if (!val) return "";
  if (val.startsWith("http") || val.startsWith("/")) return val;
  return `/assets/img/${val.replace(/^\//, "")}`;
}

function resolveReviewPhotoUrl(photo: unknown, legacyUrl?: string): string {
  const legacy = legacyUrl?.trim();
  if (legacy) return legacy;
  if (!photo || typeof photo !== "object") return "";

  const { discriminant, value } = photo as {
    discriminant?: string;
    value?: string | { photoUrl?: string };
  };
  if (!discriminant || discriminant === "none") return "";
  if (discriminant === "url") {
    return typeof value === "string" ? value.trim() : "";
  }
  if (discriminant === "upload") {
    const path =
      typeof value === "string"
        ? value
        : value && typeof value === "object"
          ? (value.photoUrl ?? "")
          : "";
    return normalizeReviewPhotoPath(path);
  }
  return "";
}

const reviews = defineCollection({
  type: "data",
  schema: z
    .object({
      name: hebrewString(),
      date: z.string().optional().default(""),
      rating: z.number().min(1).max(5).default(5),
      photo: z.any().optional(),
      photoUrl: z.string().optional().default(""),
      order: z.number().int().default(0),
      text: z.string().default(""),
    })
    .transform((data) => {
      const { photo, photoUrl: legacy, ...rest } = data;
      return {
        ...rest,
        photoUrl: resolveReviewPhotoUrl(photo, legacy),
      };
    }),
});

const customerVideos = defineCollection({
  type: "content",
  schema: z.object({
    name: hebrewString(),
    imageUrl: assetPath(),
    imageAlt: z.string().default(""),
    youtubeUrl: z.string().default(""),
    order: z.number().int().default(0),
  }),
});

const podcast = defineCollection({
  type: "content",
  schema: z.object({
    title: hebrewString(),
    imageUrl: assetPath(),
    imageAlt: z.string().default(""),
    youtubeUrl: z.string().default(""),
    order: z.number().int().default(0),
  }),
});

const services = defineCollection({
  type: "data",
  schema: z.object({
    title: hebrewString(),
    iconUrl: assetPath(),
    iconAlt: z.string().default(""),
    description: z.string().default(""),
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
  type: "data",
  schema: z.object({
    title: hebrewString(),
    dateLabel: z.string().default(""),
    imageUrl: assetPath(),
    imageAlt: z.string().default(""),
    order: z.number().int().default(0),
    animateDelay: z.string().optional().default(""),
    ctaText: z.string().default(""),
    ctaHref: z.string().default(""),
    ctaNewTab: z.boolean().default(true),
    ctaGaEvent: z.string().optional().default(""),
    ctaGaPlacement: z.string().optional().default(""),
    ctaGaEventId: z.string().optional().default(""),
    description: z.string().default(""),
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
