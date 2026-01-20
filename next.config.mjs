/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dfabjhngj4dg0.cloudfront.net", // your CDN domain
      },
      {
        protocol: "https",
        hostname: "s3-prac-gyan.s3.eu-north-1.amazonaws.com", // your s3 domain
      },
    ],
  },
};

export default nextConfig;
