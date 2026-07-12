/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/dapurembun",
  images: {
    unoptimized: true
  },
  trailingSlash: true
};
module.exports = nextConfig;
