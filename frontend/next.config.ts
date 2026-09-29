import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ["**.manuspre.computer", "*.sg2.manus.computer"],
};

export default nextConfig;
