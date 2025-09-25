import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites(){
    if (process.env.NODE_ENV !== "production") {
      return [
        {
          source: "/v1/:path*", 
          destination: "http://localhost:8080/v1/:path*",
        },
      ];
    }

    return [];
  }
};

export default nextConfig;
