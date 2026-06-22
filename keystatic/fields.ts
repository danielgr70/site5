import { fields } from "@keystatic/core";

const imageDir = "public/assets/img";
const imagePublicPath = "/assets/img/";

/**
 * Keystatic guarda y previsualiza imágenes en public/assets/img/{slug}/{campo}.ext.
 * El directorio raíz es compartido; cada entrada tiene su subcarpeta por slug.
 */
export function siteImage(label: string) {
  return fields.image({
    label,
    directory: imageDir,
    publicPath: imagePublicPath,
    description:
      "התמונה נשמרת ב-public/assets/img/{slug}/ — הנתיב מוצג מתחת לתצוגה המקדימה",
  });
}

export function hebrewMarkdoc(label: string) {
  return fields.markdoc({
    label,
    options: {
      image: {
        directory: imageDir,
        publicPath: imagePublicPath,
      },
    },
  });
}

export function hebrewTitle(label = "כותרת") {
  return fields.slug({
    name: { label },
    slug: {
      label: "מזהה קובץ",
      generate: (name) =>
        name
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9\u0590-\u05FF-]/g, "")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "") || "entry",
    },
  });
}

export function hebrewName(label = "שם") {
  return fields.slug({
    name: { label },
    slug: {
      label: "מזהה קובץ",
      generate: (name) =>
        name
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9\u0590-\u05FF-]/g, "")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "") || "entry",
    },
  });
}

export const ctaFields = {
  ctaText: fields.text({ label: "טקסט כפתור" }),
  ctaHref: fields.text({ label: "קישור כפתור" }),
  ctaNewTab: fields.checkbox({ label: "פתיחה בטאב חדש", defaultValue: true }),
  ctaGaEvent: fields.text({ label: "אירוע Analytics (אופציונלי)" }),
  ctaGaPlacement: fields.text({ label: "מיקום Analytics (אופציונלי)" }),
};

/** תמונת פרופיל להמלצות: URL (preview ב-admin) או העלאה (preview מובנה). */
export function reviewProfilePhoto() {
  return fields.conditional(
    fields.select({
      label: "תמונת פרופיל",
      description: "ללא תמונה, קישור חיצוני או העלאת קובץ",
      options: [
        { label: "ללא תמונה (ראשי תיבות)", value: "none" },
        { label: "קישור (URL)", value: "url" },
        { label: "העלאת תמונה", value: "upload" },
      ],
      defaultValue: "none",
    }),
    {
      none: fields.empty(),
      url: fields.url({
        label: "כתובת URL",
        description: "לדוגמה: קישור תמונה מגוגל",
      }),
      upload: fields.object({
        photoUrl: fields.image({
          label: "תמונה",
          directory: imageDir,
          publicPath: imagePublicPath,
          description: "נשמרת ב-public/assets/img/{slug}/photoUrl.*",
        }),
      }),
    }
  );
}
