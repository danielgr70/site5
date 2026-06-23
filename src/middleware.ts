import { defineMiddleware } from "astro:middleware";
import { getPublishToken } from "./lib/publish-env";
import slugHideCss from "./styles/keystatic-admin.css?raw";

const STYLE_TAG = `<style id="keystatic-hide-slug">${slugHideCss}</style>`;
const SCRIPT_TAG = `<script src="/keystatic-admin.js" defer></script>`;
const PUBLISH_BAR = `<div id="keystatic-publish-bar" class="keystatic-publish-bar">
  <button type="button" id="keystatic-publish-btn" class="keystatic-publish-btn">\u05E4\u05E8\u05E1\u05D5\u05DD \u05DC\u05D0\u05EA\u05E8</button>
  <p id="keystatic-publish-status" class="keystatic-publish-status" hidden role="status"></p>
</div>`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

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

  const publishToken = getPublishToken(context.locals);
  const publishMeta = publishToken
    ? `<meta name="keystatic-publish-token" content="${escapeHtml(publishToken)}">`
    : `<meta name="keystatic-publish-token" content="">`;

  const headInjection = `${publishMeta}${STYLE_TAG}`;
  let patched = html.includes("</head>")
    ? html.replace("</head>", `${headInjection}</head>`)
    : `${headInjection}${html}`;

  if (!patched.includes('id="keystatic-publish-bar"')) {
    patched = patched.includes("</body>")
      ? patched.replace("</body>", `${PUBLISH_BAR}${SCRIPT_TAG}</body>`)
      : `${patched}${PUBLISH_BAR}${SCRIPT_TAG}`;
  } else {
    patched = patched.includes("</body>")
      ? patched.replace("</body>", `${SCRIPT_TAG}</body>`)
      : `${patched}${SCRIPT_TAG}`;
  }

  return new Response(patched, {
    status: response.status,
    headers: response.headers,
  });
});
