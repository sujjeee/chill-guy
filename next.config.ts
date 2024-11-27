import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
      canvas: "commonjs canvas",
    })
    // config.infrastructureLogging = { debug: /PackFileCache/ };
    return config
  },
}

export default nextConfig
