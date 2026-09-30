import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    define: {
      "process.env.API_BASE_URL": JSON.stringify(env.API_BASE_URL),
    },
    plugins: [tailwindcss(), reactRouter()],
    resolve: {
      tsconfigPaths: true,
    },
  };
});
