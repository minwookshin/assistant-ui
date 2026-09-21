import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import path from "node:path";

const root = fileURLToPath(new URL("../../", import.meta.url));
const registryRequire = createRequire(
  path.join(root, "apps/registry/package.json"),
);
const tailwindcss = registryRequire("@tailwindcss/postcss");

export default {
  root: fileURLToPath(new URL(".", import.meta.url)),
  esbuild: { jsx: "automatic" },
  resolve: {
    alias: {
      "@/components/ui": path.join(
        root,
        "packages/ui/src/components/react/ui/base",
      ),
      "@": path.join(root, "packages/ui/src"),
      react: path.join(root, "packages/ui/node_modules/react"),
      "react-dom": path.join(root, "packages/ui/node_modules/react-dom"),
    },
  },
  css: { postcss: { plugins: [tailwindcss()] } },
  server: {
    host: "127.0.0.1",
    port: 5175,
    strictPort: true,
    fs: { allow: [root] },
  },
};
