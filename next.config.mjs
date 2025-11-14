import withSerwist from "@serwist/next";

const serwistConfig = withSerwist({
  disable: process.env.NODE_ENV === "development",
  swSrc: "src/sw.js",
  swDest: "public/sw.js",
});

const nextConfig = {
  reactStrictMode: true,
};

export default serwistConfig(nextConfig);
