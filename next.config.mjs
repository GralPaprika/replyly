/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['localhost'],
    },
    compress: true,
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        return config;
    },
    experimental: {
        scrollRestoration: true,
    },
};

export default nextConfig;
