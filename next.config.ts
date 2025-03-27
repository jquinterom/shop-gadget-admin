import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tevptihntarvikyejtju.supabase.co",
      },
      {
        protocol: "http",
        hostname: "192.168.101.74",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "gadget-shop-omega.vercel.app",
      },
    ],
  },
};

export default nextConfig;
