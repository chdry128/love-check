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
  ],
  async redirects() {
    return [
      { source: "/relationship-risk-radar", destination: "/relationship-risk-test", permanent: true },
      { source: "/attachment-style-lens", destination: "/attachment-style-quiz", permanent: true },
      { source: "/communication-pattern-check", destination: "/communication-style-test", permanent: true },
      { source: "/texting-energy-match", destination: "/texting-compatibility-test", permanent: true },
      { source: "/love-bombing-detector", destination: "/love-bombing-checker", permanent: true },
      { source: "/future-alignment-checker", destination: "/future-compatibility-test", permanent: true },
      { source: "/flirty-reply-coach", destination: "/flirty-reply-generator", permanent: true },
      { source: "/compatibility-compass", destination: "/relationship-compatibility-test", permanent: true },
      { source: "/red-flag-scanner", destination: "/red-flag-checker", permanent: true },
      { source: "/compatability-checker", destination: "/relationship-compatibility-test", permanent: true },
      { source: "/love-boombing-detector", destination: "/love-bombing-checker", permanent: true },
      { source: "/texting-enery-match", destination: "/texting-compatibility-test", permanent: true },
      { source: "/flirty-reply-couch", destination: "/flirty-reply-generator", permanent: true },
    ];
  },
};

export default nextConfig;
