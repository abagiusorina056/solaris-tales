/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    overlay: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: `/${process.env.CLOUDINARY_CLOUD_NAME}/**`,
      },
    ],
  },
  serverExternalPackages: ["mongoose"],
};

export default nextConfig;
