import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Labwards",
    short_name: "Labwards",
    description: "Labwards rewards and offerwall platform",
    start_url: "/",
    display: "standalone",
    background_color: "#0D0F1E",
    theme_color: "#0D0F1E",
    icons: [
      {
        src: "/logo-labwards.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo-labwards.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
  };
}
