import type { NextConfig } from "next";

/**
 * GitHub project pages are served at https://<owner>.github.io/<repo>/.
 * Set NEXT_BASE_PATH to `/<repo>` in CI (see `.github/workflows/deploy-github-pages.yml`).
 * Omit for local dev, user/org sites (`*.github.io`), or a custom domain at the site root.
 */
const rawBase = process.env.NEXT_BASE_PATH?.trim() ?? "";
const basePath =
  rawBase && rawBase !== "/" ? rawBase.replace(/\/$/, "") : "";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
