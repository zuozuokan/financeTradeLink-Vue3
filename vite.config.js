import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 45555, // 启动端口
    open: true, // 启动时自动打开浏览器

    // 若启用网关，则用以下配置
    // proxy: {
    //   "/project": {
    //     target: "http://localhost:9999", //
    //     changeOrigin: true, // 是否改变源
    //   },
    // },
    // 若不启用网关，则使用以下配置
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:30011', // xxxxx为后端微服务的端口
    //     changeOrigin: true,
    //   }
    // },    
    //不启用网关，端口治理
    proxy: {
     
      '/api/user': {
        target: 'http://localhost:30000', // 用户相关请求
        changeOrigin: true,
      },
      '/api/product': {
        target: 'http://localhost:30000', // 商品相关请求
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:30011', // xxxxx为后端微服务的端口
        changeOrigin: true,
      },
    },
      
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      vue: "vue/dist/vue.esm-bundler.js", // 使用完整版的 Vue
    },
  },
 
});
