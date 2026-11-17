/** @type {import('next').NextConfig} */
const config = {
  // The parent build embeds this app without sharing its styles or dependencies.
  basePath: process.env.HUGSYY_BASE_PATH || "",
  output: "export",
  images: { unoptimized: true },
  poweredByHeader: false,
  devIndicators: false,
  experimental: { cpus: 2 },
};
export default config;
