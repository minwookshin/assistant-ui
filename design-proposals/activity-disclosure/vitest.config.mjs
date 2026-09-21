import path from "node:path";
import { fileURLToPath } from "node:url";

const ui = fileURLToPath(new URL("../../packages/ui/", import.meta.url));

export default {
  test: {
    projects: ["base", "radix"].map((variant) => ({
      resolve: {
        alias: {
          "@/components/ui": path.join(ui, "src/components/react/ui", variant),
          "@": path.join(ui, "src"),
        },
      },
      test: {
        name: variant,
        environment: "jsdom",
        globals: true,
        pool: "threads",
        include: [
          path.join(
            ui,
            "src/components/react/assistant-ui/elements/activity-disclosure.test.tsx",
          ),
        ],
      },
    })),
  },
};
