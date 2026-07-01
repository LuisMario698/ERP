import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@erp/ui", "@erp/types", "@erp/validations", "@erp/database", "@erp/auth", "@erp/utils"],
};

export default nextConfig;
