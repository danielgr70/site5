type PublishRuntimeEnv = {
  PUBLISH_API_TOKEN?: string;
  CLOUDFLARE_DEPLOY_HOOK_URL?: string;
};

function runtimeEnv(locals: App.Locals | undefined): PublishRuntimeEnv {
  return (locals?.runtime as { env?: PublishRuntimeEnv } | undefined)?.env ?? {};
}

export function getPublishToken(locals?: App.Locals): string {
  const env = runtimeEnv(locals);
  return (
    env.PUBLISH_API_TOKEN ??
    import.meta.env.PUBLISH_API_TOKEN ??
    (import.meta.env.DEV ? "dev-local-publish" : "")
  );
}

export function getDeployHookUrl(locals?: App.Locals): string | undefined {
  const env = runtimeEnv(locals);
  return env.CLOUDFLARE_DEPLOY_HOOK_URL ?? import.meta.env.CLOUDFLARE_DEPLOY_HOOK_URL;
}
