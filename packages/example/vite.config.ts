import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import { qwikSolid } from "@mechairoi/qwik-solid/vite";
import solid from "vite-plugin-solid";

import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig((config) => {
  return {
    plugins: [
      solid({ include: "./src/integrations/solid/**", ssr: true }),
      qwikCity(),
      qwikVite({
        entryStrategy:
          config.command === "build" || config.command === "serve"
            ? { type: config.isSsrBuild ? "hoist" : "hook" }
            : undefined,
      }),
      tsconfigPaths(),
      qwikSolid(),
    ],
    dev: {
      headers: {
        "Cache-Control": "public, max-age=0",
      },
    },
    preview: {
      headers: {
        "Cache-Control": "public, max-age=600",
      },
    },
  };
});
