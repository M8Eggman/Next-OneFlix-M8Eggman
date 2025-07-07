import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, "src/styles/partials")],
    prependData: `
      @use "_variables" as *
      @use "_mixins" as *
    `,
  },
};

export default nextConfig;
