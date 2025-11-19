/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Allow all hosts for StackBlitz/CodeSandbox/browser-based dev environments
    host: "0.0.0.0",
    port: 5173,
    strictPort: false,
    // Allow any origin in development
    cors: true,
    hmr: {
      clientPort: 443,
    },
    // @ts-ignore - CodeSandbox specific option (not standard Vite)
    allowedHosts: ["all", ".csb.app", "kpzzj2-5173.csb.app"],
  },
  preview: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: false,
    cors: true,
  },
  optimizeDeps: {
    // Exclude problematic packages from optimization in StackBlitz
    exclude: ["@rollup/rollup-linux-x64-musl"],
  },
  build: {
    // Use esbuild for minification instead of terser (avoids native rollup plugins)
    minify: "esbuild",
    // Reduce chunk size warnings
    chunkSizeWarningLimit: 1000,
  },
});
