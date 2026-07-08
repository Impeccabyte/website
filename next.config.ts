import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Don't advertise the framework in response headers.
  poweredByHeader: false,
  // Gzip responses from the Node server (Passenger passes them through).
  compress: true,
};

export default nextConfig;
