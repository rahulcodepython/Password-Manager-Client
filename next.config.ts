import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    env: {
        API_URL: 'http://backend:8000/api/v2/',
    },
};

export default nextConfig;
