import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const expectedToken =
    import.meta.env.PUBLISH_API_TOKEN ??
    (import.meta.env.DEV ? "dev-local-publish" : "");
  if (!expectedToken) {
    return Response.json(
      { error: "Publish API is not configured (missing PUBLISH_API_TOKEN)." },
      { status: 503 },
    );
  }

  const token = request.headers.get("X-Publish-Token");
  if (token !== expectedToken) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const hookUrl = import.meta.env.CLOUDFLARE_DEPLOY_HOOK_URL;
  if (!hookUrl) {
    if (import.meta.env.DEV) {
      return Response.json({
        ok: true,
        dev: true,
        message: "Dev mode: publish accepted (CLOUDFLARE_DEPLOY_HOOK_URL not set).",
      });
    }
    return Response.json(
      { error: "Deploy hook is not configured (missing CLOUDFLARE_DEPLOY_HOOK_URL)." },
      { status: 503 },
    );
  }

  try {
    const deployResponse = await fetch(hookUrl, { method: "POST" });
    if (!deployResponse.ok) {
      const detail = await deployResponse.text().catch(() => "");
      return Response.json(
        { error: "Cloudflare deploy hook failed", detail: detail.slice(0, 200) },
        { status: 502 },
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: "Deploy request failed", detail: message }, { status: 502 });
  }

  return Response.json({ ok: true });
};
