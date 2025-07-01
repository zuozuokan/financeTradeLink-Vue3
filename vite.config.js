import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 45555, // 启动端口
    open: true, // 启动时自动打开浏览器

    // // 若启用网关，则用以下配置
    // proxy: {
    //   "/project": {
    //     target: "http://localhost:9999", //
    //     changeOrigin: true, // 是否改变源
    //   },
    // },
 //   若不启用网关，则使用以下配置
    proxy: {
      '/api/bank': { //拦截以/api/load开头的请求，并将其转发到target指定的地址
        target: 'http://localhost:30020', // xxxxx为后端微服务的端口，target意为转发
        changeOrigin: true, // 是否改变源
      },
      '/api/product':{
        target: 'http://localhost:30000', // xxxxx为后端微服务的端口，target意为转发
        changeOrigin: true, // 是否改变源
      },
      '/api/order': { //拦截以/api/order开头的请求，并将其转发到target指定的地址
        target: 'http://localhost:30000', // xxxxx为后端微服务的端口，target意为转发
        changeOrigin: true, // 是否改变源
      },
      '/api': { //拦截以/api开头的请求，并将其转发到target指定的地址
        target: 'http://localhost:30011', // xxxxx为后端微服务的端口，target意为转发
        changeOrigin: true,
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      vue: "vue/dist/vue.esm-bundler.js", // 使用完整版的 Vue
    },
  },
});
