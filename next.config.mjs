/** @type {import('next').NextConfig} */

const nextConfig = {
  trailingSlash: true,
  experimental: {
    ppr: "incremental",
  },
};

export default nextConfig;
