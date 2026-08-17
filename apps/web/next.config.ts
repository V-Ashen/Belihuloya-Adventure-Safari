import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  transpilePackages: ["@belihuloya/core"],
  async redirects() {
    return [
      {
        source: '/admin',
        destination: 'https://belihuloya-adventure-safari-admin.vercel.app/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
