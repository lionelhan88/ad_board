// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [vue()], 
// })

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path"; // 编辑器提示 path 模块找不到，可以cnpm i @types/node --dev 即可

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()], // 默认配置

  resolve: {
    alias: {
      "@": resolve(__dirname, "src"), // 配置别名；将 @ 指向'src'目录
    },
  },
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
      },
    },
  },
  server: {
    port: 8080, // 设置服务启动的端口号；如果端口已经被使用，Vite 会自动尝试下一个可用的端口
    open: true, // 服务启动后自动打开浏览器
    proxy: {
      // 代理
      // "/api": {
      //   target: "真实接口服务地址",
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, ""), // 注意代理地址的重写
      // },
      // 可配置多个...
    },
  },
});
2;

