import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    eslint: {
        ignoreDuringBuilds: true,
    },

    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns: [
            {
                hostname: 'arch-lms.t3.storageapi.dev',
                port: '',
                protocol: 'https',
            },
        ],
    },
};

export default nextConfig;
