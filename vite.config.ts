import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const proxyTarget = (env.VITE_API_BASE_URL || env.VITE_SOCKET_URL || '').replace(/\/api\/?$/, '');
  const proxy = proxyTarget
    ? {
        '/api': { target: proxyTarget, changeOrigin: true },
        '/socket.io': { target: proxyTarget, ws: true, changeOrigin: true },
      }
    : undefined;

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    server: {
      port: 3000,
      proxy,
    },
    preview: {
      port: 3000,
      proxy,
    },
  };
});
