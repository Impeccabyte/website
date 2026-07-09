import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Don't advertise the framework in response headers.
  poweredByHeader: false,
  // Gzip responses from the Node server.
  compress: true,
  // Merchant-statement PDF uploads travel through the quote server action.
  // The user-facing cap is MAX_STATEMENT_BYTES (10MB), enforced in the action so
  // oversize files get a friendly error. This transport limit must sit ABOVE that
  // so the whole multipart body (PDF + text fields + boundaries) for a ~10MB PDF
  // still reaches the action instead of being rejected opaquely by the framework.
  experimental: {
    serverActions: {
      bodySizeLimit: "12mb",
    },
  },
};

export default nextConfig;
