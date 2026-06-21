import { config, collection, singleton, fields } from "@keystatic/core";
import { ctaFields, hebrewMarkdoc, hebrewName, hebrewTitle, siteImage } from "./keystatic/fields";

const githubRepo =
  import.meta.env.KEYSTATIC_GITHUB_REPO ?? "danielgr70/site5";

export default config({
  locale: "he-IL",
  storage:
    import.meta.env.KEYSTATIC_STORAGE === "github"
      ? {
          kind: "github",
          repo: githubRepo as `${string}/${string}`,
        }
      : { kind: "local" },
  ui: {
    brand: { name: "אורית גרושטיין — ניהול תוכן" },
  },
  singletons: {
    heroEvent: singleton({
      label: "אירוע בראש הדף (Hero)",
      path: "src/content/hero-event/event",
      format: { contentField: "body" },
      schema: {
        showEvent: fields.checkbox({
          label: "הצג אירוע בראש הדף",
          defaultValue: true,
        }),
        kicker: fields.text({ label: "כותרת עליונה (אדום)" }),
        title: fields.text({ label: "כותרת הכנס" }),
        location: fields.text({ label: "מיקום" }),
        dayLabel: fields.text({ label: "יום / שעה" }),
        dateLabel: fields.text({ label: "תאריך" }),
        showDiscount: fields.checkbox({
          label: "הצג הנחה מוקדמת",
          defaultValue: true,
        }),
        discountDeadline: fields.text({ label: "טקסט מועד הנחה" }),
        discountText: fields.text({ label: "טקסט ההנחה" }),
        countdownLabel: fields.text({
          label: "כותרת ספירה לאחור",
          defaultValue: "הכנס בעוד:",
        }),
        countdownTarget: fields.text({
          label: "תאריך ושעת הכנס",
          description: "פורמט: yyyy-MM-ddTHH:mm:ss",
        }),
        countdownEndedMessage: fields.text({
          label: "הודעה כשהספירה נגמרת",
          defaultValue: "המחזור כבר התחיל - ניתן להירשם למחזור הבא",
        }),
        ...ctaFields,
        body: hebrewMarkdoc("תיאור"),
      },
    }),
    heroPopup: singleton({
      label: "חלון קופץ (Popup)",
      path: "src/content/hero-popup/popup",
      format: { contentField: "body" },
      schema: {
        showPopup: fields.checkbox({
          label: "הצג חלון קופץ",
          defaultValue: true,
        }),
        badge: fields.text({ label: "תג עליון (ורוד)" }),
        title: hebrewTitle("כותרת"),
        imageUrl: siteImage("תמונת איור"),
        imageAlt: fields.text({ label: "טקסט חלופי לתמונה" }),
        footnote: fields.text({ label: "טקסט מתחת לאיור" }),
        ...ctaFields,
        body: hebrewMarkdoc("תיאור"),
      },
    }),
  },
  collections: {
    services: collection({
      label: "שירותים",
      slugField: "title",
      path: "src/content/services/*",
      format: { contentField: "body" },
      columns: ["order"],
      schema: {
        title: hebrewTitle("כותרת"),
        iconUrl: siteImage("אייקון"),
        iconAlt: fields.text({ label: "טקסט חלופי לאייקון" }),
        iconClass: fields.text({ label: "מחלקת CSS לאייקון (אופציונלי)" }),
        iconWidth: fields.integer({
          label: "רוחב אייקון (px)",
          defaultValue: 72,
          validation: { min: 1 },
        }),
        iconHeight: fields.integer({
          label: "גובה אייקון (px)",
          defaultValue: 72,
          validation: { min: 1 },
        }),
        order: fields.integer({
          label: "סדר תצוגה",
          defaultValue: 0,
        }),
        animateDelay: fields.text({ label: "עיכוב אנימציה (אופציונלי)" }),
        body: hebrewMarkdoc("תיאור"),
      },
    }),
    products: collection({
      label: "מוצרים",
      slugField: "title",
      path: "src/content/products/*",
      format: { contentField: "body" },
      columns: ["order", "kicker"],
      schema: {
        title: hebrewTitle("כותרת"),
        kicker: fields.text({ label: "תווית עליונה" }),
        imageUrl: siteImage("תמונה"),
        order: fields.integer({ label: "סדר תצוגה", defaultValue: 0 }),
        animateDelay: fields.text({ label: "עיכוב אנימציה (אופציונלי)" }),
        ctaText: fields.text({ label: "טקסט כפתור" }),
        ctaHref: fields.text({ label: "קישור כפתור" }),
        ctaNewTab: fields.checkbox({
          label: "פתיחה בטאב חדש",
          defaultValue: false,
        }),
        ctaGaEvent: fields.text({ label: "אירוע Analytics (אופציונלי)" }),
        ctaGaPlacement: fields.text({ label: "מיקום Analytics (אופציונלי)" }),
        body: hebrewMarkdoc("תיאור"),
      },
    }),
    events: collection({
      label: "אירועים",
      slugField: "title",
      path: "src/content/events/*",
      format: { contentField: "body" },
      columns: ["order", "dateLabel"],
      schema: {
        title: hebrewTitle("כותרת"),
        dateLabel: fields.text({ label: "תאריך / מיקום (שורה עליונה)" }),
        imageUrl: siteImage("תמונה"),
        imageAlt: fields.text({ label: "טקסט חלופי לתמונה" }),
        imageWidth: fields.integer({
          label: "רוחב תמונה (px)",
          defaultValue: 640,
        }),
        imageHeight: fields.integer({
          label: "גובה תמונה (px)",
          defaultValue: 360,
        }),
        order: fields.integer({ label: "סדר תצוגה", defaultValue: 0 }),
        animateDelay: fields.text({ label: "עיכוב אנימציה (אופציונלי)" }),
        ctaText: fields.text({ label: "טקסט כפתור" }),
        ctaHref: fields.text({ label: "קישור כפתור" }),
        ctaNewTab: fields.checkbox({
          label: "פתיחה בטאב חדש",
          defaultValue: true,
        }),
        ctaGaEvent: fields.text({ label: "אירוע Analytics (אופציונלי)" }),
        ctaGaPlacement: fields.text({
          label: "מיקום Analytics (אופציונלי)",
          defaultValue: "events_grid",
        }),
        ctaGaEventId: fields.text({
          label: "מזהה אירוע Analytics (אופציונלי)",
        }),
        body: hebrewMarkdoc("תיאור"),
      },
    }),
    reviews: collection({
      label: "המלצות",
      slugField: "name",
      path: "src/content/reviews/*",
      format: { contentField: "body" },
      columns: ["order", "rating"],
      schema: {
        name: hebrewName("שם"),
        date: fields.text({ label: "תאריך (אופציונלי)", defaultValue: "" }),
        rating: fields.integer({
          label: "דירוג (1–5)",
          defaultValue: 5,
          validation: { min: 1, max: 5 },
        }),
        photoUrl: fields.text({
          label: "תמונת פרופיל (URL או ריק)",
          description: "ריק = ראשי תיבות",
        }),
        order: fields.integer({ label: "סדר תצוגה", defaultValue: 0 }),
        body: hebrewMarkdoc("טקסט ההמלצה"),
      },
    }),
    customerVideos: collection({
      label: "לקוחות מספרים",
      slugField: "name",
      path: "src/content/customer-videos/*",
      format: { contentField: "body" },
      columns: ["order"],
      schema: {
        name: hebrewName("שם"),
        imageUrl: siteImage("תמונת כיסוי"),
        imageAlt: fields.text({ label: "טקסט חלופי לתמונה" }),
        youtubeUrl: fields.text({ label: "קישור לסרטון YouTube" }),
        order: fields.integer({ label: "סדר תצוגה", defaultValue: 0 }),
        body: hebrewMarkdoc("הערות (אופציונלי)"),
      },
    }),
    podcast: collection({
      label: "פודקאסט",
      slugField: "title",
      path: "src/content/podcast/*",
      format: { contentField: "body" },
      columns: ["order"],
      schema: {
        title: hebrewTitle("כותרת הפרק"),
        imageUrl: siteImage("תמונת כיסוי"),
        imageAlt: fields.text({ label: "טקסט חלופי לתמונה" }),
        youtubeUrl: fields.text({ label: "קישור לסרטון YouTube" }),
        order: fields.integer({ label: "סדר תצוגה", defaultValue: 0 }),
        body: hebrewMarkdoc("הערות (אופציונלי)"),
      },
    }),
  },
});
