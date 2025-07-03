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
      // 咨询服务代理
      '/api/user/consult': {
        target: 'http://localhost:30000',
        changeOrigin: true,

      },

      // 专家服务代理
      '/api/expert': {
        target: 'http://localhost:9392',
        changeOrigin: true,

      },

      // 注册登录服务代理
      '/api/register-login': {
        target: 'http://localhost:30011',
        changeOrigin: true,

      },

      // 用户服务代理
      '/api/user': {
        target: 'http://localhost:30000',
        changeOrigin: true,
        rewrite: (path) => {
          console.log('代理路径:', path); // 输出原始路径
          return path;
        }
      },

      // 公共服务知识模块代理
      '/api/knowledge': {
        target: 'http://localhost:30011',
        changeOrigin: true,
        rewrite: (path) => {
          console.log('代理路径:', path); // 输出原始路径
          return path;
        }
      },

      // 用户服务融资模块代理
      '/api/application': {
        target: 'http://localhost:30000',
        changeOrigin: true,
      },

      // 用户服务产品模块代理
      '/api/product': {
        target: 'http://localhost:30000',
        changeOrigin: true,
      },
      '/api/order':{
        target:'http://localhost:30000',
        changeOrigin:true
      },
      '/api/bank':{
        target:'http://localhost:30020',
        changeOrigin:true
      },

      // 管理员服务代理
      '/api/admin': {
        target: 'http://localhost:30012',
        changeOrigin: true,
        rewrite: (path) => {
          console.log('代理路径:', path); // 输出原始路径
          return path;
        }
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
