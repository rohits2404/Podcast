import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    typescript: {
        ignoreBuildErrors: true,
    },

    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lovely-flamingo-139.convex.cloud",
            },
            {
                protocol: "https",
                hostname: "img.clerk.com",
            },
            {
                protocol: "https",
                hostname: "brazen-mallard-518.convex.cloud",
            },
        ],
    },
};

export default nextConfig;
