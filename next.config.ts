import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["via.placeholder.com", "images.unsplash.com"],
  },
  redirects: async () => {
    return [
      {
        source: "/old-blog",
        destination: "/new-blog",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
