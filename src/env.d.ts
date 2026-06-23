/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly PUBLIC_KEYSTATIC_STORAGE?: string;
  readonly PUBLIC_KEYSTATIC_GITHUB_REPO?: string;
  readonly KEYSTATIC_GITHUB_CLIENT_ID?: string;
  readonly KEYSTATIC_GITHUB_CLIENT_SECRET?: string;
  readonly KEYSTATIC_SECRET?: string;
  readonly PUBLISH_API_TOKEN?: string;
  readonly CLOUDFLARE_DEPLOY_HOOK_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
