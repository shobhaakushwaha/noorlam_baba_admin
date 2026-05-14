// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tsconfigPaths from "vite-tsconfig-paths";

// export default defineConfig({
//   plugins: [react(), tsconfigPaths()],
//   define: {
//     global: "window",
//   },
//   resolve: {
//     extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
//   },
// });

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const pathName = env.VITE_BASE_PATH;

  return {
    base: pathName,
    plugins: [react(), tsconfigPaths()],
    define: {
      global: "window",
    },
  };
});
