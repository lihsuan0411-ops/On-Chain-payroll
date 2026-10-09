import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // 忽略 TypeScript 檢查
  },
  // A stray lockfile in the home directory otherwise makes Turbopack pick the wrong root.
  turbopack: {
    root: process.cwd(),
    resolveAlias: {
      "isomorphic-ws": { browser: "./lib/shims/isomorphic-ws.js" },
    },
  },
  transpilePackages: ["@payroll/midnight-contract"],
};

export default nextConfig;
