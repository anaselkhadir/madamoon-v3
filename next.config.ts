import type { NextConfig } from "next";

// Build GitHub Pages : DEPLOY_TARGET=pages npm run build
const isPages = process.env.DEPLOY_TARGET === "pages";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BASE_PATH: isPages ? "/madamoon-v3" : "",
  },
  ...(isPages
    ? {
        output: "export" as const,
        basePath: "/madamoon-v3",
        trailingSlash: true,
        images: {
          loader: "custom" as const,
          loaderFile: "./image-loader.ts",
        },
      }
    : {
        images: {
          formats: ["image/avif", "image/webp"],
        },
      }),
};

export default nextConfig;
