import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@t1pilot/types", "@t1pilot/utils"],
};

export default nextConfig;
