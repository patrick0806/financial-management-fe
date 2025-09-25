import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites(){
    if (process.env.NODE_ENV !== "production") {
      return [
        {
          source: "/v1/:path*", 
          destination: "http://okg8oc4wc80k8o84c0swc8gg.31.97.165.242.sslip.io/v1/:path*",
        },
      ];
    }

    return [];
  }
};

export default nextConfig;
