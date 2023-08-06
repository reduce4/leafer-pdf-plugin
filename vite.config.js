import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";


export default defineConfig({
  plugins: [react()
  ],
  rollupOptions: {
    input: 'src/create.js',
    output: {
      format: 'esm',
      dir: 'dist',
    },
    plugins: [
      {
        name: "custom-wasm-loader",
        resolveId(source, importer) {
          if (source === 'libmupdf.wasm') {
            return { id: new URL('assets/wasm/libmupdf.wasm', importer).href, external: true };
          }
          return null;
        }
      }
    ]
  },
});