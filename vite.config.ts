import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import { viteExternalsPlugin } from 'vite-plugin-externals'
// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        // iframe通过script注入渲染的renderer渲染器所以需要打包份
        renderer: path.resolve(__dirname, 'src/core/react-simulator-renderer/renderer.ts'),
      }
    }
  },
  plugins: [
    react({
      babel: {
        presets: [
          [
            '@babel/preset-react',
            {
              runtime: 'classic', // 使用经典的 JSX 转换方式
            },
          ],
        ],
        plugins: [
          ['@babel/plugin-proposal-decorators', { "legacy": true }],
          ['@babel/plugin-proposal-class-properties', { loose: true }],
        ],
      }
    }),
    viteExternalsPlugin({
      'react': 'React',
      'react-dom': 'ReactDOM',
      'react/jsx-dev-runtime': 'React'
    }),
  ],
  resolve: {
    // 配置路径别名。--->src下的代码
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  }
})
