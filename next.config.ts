import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Don't advertise the framework in response headers.
  poweredByHeader: false,
  // Gzip responses from the Node server.
  compress: true,
  // Merchant-statement PDF uploads travel through the quote server action;
  // the default 1MB body cap is too small. Raise to 10MB (matches MAX_STATEMENT_BYTES).
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
