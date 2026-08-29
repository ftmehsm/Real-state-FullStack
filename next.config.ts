import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "1749j5pg1x.ufs.sh",
      },
    ],
  },
};

export default nextConfig;

