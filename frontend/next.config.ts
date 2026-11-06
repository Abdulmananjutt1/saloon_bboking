import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  // Server components can import from @/server/* (runs server-side only)
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "pg", "web-push", "resend"],
};

export default nextConfig;
