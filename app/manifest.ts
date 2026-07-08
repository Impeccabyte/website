import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Impeccabyte — merchant services",
    short_name: "Impeccabyte",
    description:
      "Impeccably convenient payments for the next generation of business owners.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF6EF",
    theme_color: "#FAF6EF",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
