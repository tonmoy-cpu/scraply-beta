/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'www.freepik.com',
      },
      { protocol: 'https', 
        hostname: 'stock.adobe.com' 
      },
      { protocol: 'https', 
        hostname: 'imgs.search.brave.com' 
      },
      { protocol: 'https', 
        hostname: 'img.freepik.com' 
      },
    ],
  },
};

const withVideos = require('next-videos');
module.exports = withVideos(nextConfig);
