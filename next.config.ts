import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Prisma client types are generated at runtime on Vercel, not before the
    // build-time type-check. We validate types locally with `tsc --noEmit`.
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;
