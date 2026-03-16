import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for optimized Docker production builds
  // This creates a minimal production bundle in .next/standalone
  images: {
    remotePatterns: [{
      protocol: "https",
      hostname: "res.cloudinary.com",
      port: "",
      pathname: "/**"
    }] 
  },

};

export default nextConfig;
