import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import ViteAutoImport from 'unplugin-auto-import/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    ViteAutoImport({
      imports: ['vue', 'vue-router'],
    }),
  ],
  resolve: {
    alias: {
      // 关键代码
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    open: true,
    cors: true,
  },
  // server: {
  //   port: '5173',
  //   open: true, //自动打开
  //   proxy: {
  //     '/app-api': {
  //       target: 'https://lhhcrm.asrobot.cn/',
  //       secure: true,
  //       changeOrigin: false, // 由于server接口 不以/api开头
  //       rewrite: (path) => path.replace(/^\/app-api/, ''),
  //       headers: {
  //         'Access-Control-Allow-Origin': '*',
  //       },
  //     },
  //   },
  // },
});
