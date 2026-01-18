import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "jesse-unshredded-ada.ngrok-free.dev",
    "local-origin.dev",
    "*.local-origin.dev",
  ],
};

export default nextConfig;
