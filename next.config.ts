import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the libSQL native driver out of the bundler; load it at runtime.
  serverExternalPackages: ["@libsql/client", "libsql"],
};

export default nextConfig;
