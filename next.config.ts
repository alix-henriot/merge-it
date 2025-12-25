import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [process.env.BASE_URL!],
};

export default nextConfig;
