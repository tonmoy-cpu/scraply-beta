/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "www.freepik.com",
      "stock.adobe.com",
      "imgs.search.brave.com",
      "img.freepik.com",
      "png.pngtree.com",
      "encrypted-tbn0.gstatic.com",
      "www.pngall.com",
    ],
  },
};

const withVideos = require("next-videos");
module.exports = withVideos(nextConfig);
