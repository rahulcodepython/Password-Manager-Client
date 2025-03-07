import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    output: "standalone",
    env: {
        API_URL: process.env.API_URL
    }
};

export default nextConfig;
