import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import { resolve } from 'path';
// https://vitejs.dev/config/
export default defineConfig({
   build: {
    rollupOptions: {
      input: resolve(__dirname, 'renderer.html')
    }
  },
  plugins: [
    react({
      babel: {
        plugins: [
          ['@babel/plugin-proposal-decorators',{ "legacy": true }],
          ['@babel/plugin-proposal-class-properties', { loose: true }],
        ],
      }
    }),
  ],
  resolve: {
    // 配置路径别名。--->src下的代码
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  }
})
