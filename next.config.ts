import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          destination: "/homepage",
        },
      ],
    };
  },
};

export default nextConfig;
