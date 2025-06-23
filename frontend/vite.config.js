// import path from "path";
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: "0.0.0.0",
//     port: 5174,
//   },
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, './src'),
//       '@public': path.resolve(__dirname, './public'),
//     },
//   }
// });

// import path from "path";
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import Inspect from "vite-plugin-inspect";

// export default defineConfig({
//   plugins: [
//     react(),
//     Inspect(), // Added plugin to know unused js 
//   ],
//   server: {
//     host: "0.0.0.0",
//     port: 5174,
//   },
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, './src'),
//       '@public': path.resolve(__dirname, './public'),
//     },
//   },
//   build: {
//     target: 'es2015',
//     outDir: 'dist',
//     sourcemap: false, // You can set this to `true` later for production analysis
//     minify: 'esbuild',
//     cssCodeSplit: true,
//     assetsInlineLimit: 4096,
//     rollupOptions: {
//       output: {
//         manualChunks: {
//           react: ['react', 'react-dom'],
//         },
//       },
//     },
//   },
//   optimizeDeps: {
//     include: ['react', 'react-dom'],
//   },
// });


import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import Inspect from "vite-plugin-inspect";

export default defineConfig({
  plugins: [
    react(),
    Inspect(), // Debug plugin to inspect dependency graph
  ],
  server: {
    host: "0.0.0.0",
    port: 5174,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@public': path.resolve(__dirname, './public'),
    },
  },
  build: {
    target: 'es2015',
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild', // Fast and good for modern builds
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks: {
          // 🔹 More aggressive chunk splitting for better caching
          react: ['react', 'react-dom'],
          vendor: ['react-router-dom', 'axios'],
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
      'three',
      'three-globe'
    ],
  },
});
