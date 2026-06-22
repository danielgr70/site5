/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly PUBLICKEYSTATIC_STORAGE?: string;
  readonly PUBLIC_KEYSTATIC_GITHUB_REPO?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}