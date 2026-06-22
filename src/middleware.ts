import { defineMiddleware } from "astro:middleware";
import slugHideCss from "./styles/keystatic-admin.css?raw";

const STYLE_TAG = `<style id="keystatic-hide-slug">${slugHideCss}</style>`;
const SCRIPT_TAG = `<script src="/keystatic-admin.js" defer></script>`;

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();

  if (!context.url.pathname.startsWith("/keystatic")) {
    return response;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html")) {
    return response;
  }

  const html = await response.text();
  if (html.includes('id="keystatic-hide-slug"')) {
    return new Response(html, { status: response.status, headers: response.headers });
  }

  let patched = html.includes("</head>")
    ? html.replace("</head>", `${STYLE_TAG}</head>`)
    : `${STYLE_TAG}${html}`;

  patched = patched.includes("</body>")
    ? patched.replace("</body>", `${SCRIPT_TAG}</body>`)
    : `${patched}${SCRIPT_TAG}`;

  return new Response(patched, {
    status: response.status,
    headers: response.headers,
  });
});
