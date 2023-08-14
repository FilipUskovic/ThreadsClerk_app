/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        // ovo mora biti true da mozemo koristi mongodb mongoose
      serverActions: true,
      // ovako zna kako renderati moongose postavke
      serverComponentsExternalPackages: ["mongoose"],
    },
    // ovo ce nam omoguciti slike s clerk.com o vise...
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "img.clerk.com",
        },
        {
          protocol: "https",
          hostname: "images.clerk.dev",
        },
        {
          protocol: "https",
          hostname: "uploadthing.com",
        },
        {
          protocol: "https",
          hostname: "placehold.co",
        },
      ],
      typescript: {
        ignoreBuildErrors: true,
      },
    },
  };
  
  module.exports = nextConfig;