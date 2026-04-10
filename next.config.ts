import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    "preview-chat-d6bf1847-eca7-48d7-b7cc-99e117ae31de.space.z.ai",
    "*.space.z.ai",
  ],
};

export default nextConfig;
