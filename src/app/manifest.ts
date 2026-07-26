import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LångKompass",
    short_name: "LångKompass",
    description: "Dein ruhiger, selbst gehosteter Gesundheitskompass",
    start_url: "/anmeldung",
    scope: "/",
    display: "standalone",
    background_color: "#f4f1ea",
    theme_color: "#07372e",
    lang: "de",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
