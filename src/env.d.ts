/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly KEYSTATIC_STORAGE?: string;
  readonly KEYSTATIC_GITHUB_REPO?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}