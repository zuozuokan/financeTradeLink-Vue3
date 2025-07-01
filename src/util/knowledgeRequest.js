import axios from "axios";

const request = axios.create({
  // 网关路径
  // baseURL: "/project-base/api/knowledge",
  // "project-base" 是网关路径,可以在后端代码gateway的bootstrap.yml中查看

  // 非网关路径（其他微服务，同理）
  baseURL: '/api/knowledge',
  timeout: 5000,
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    if (localStorage.getItem("token")) {
      config.headers = {
        ...config.headers,
        // 添加 token 到请求头
        token: localStorage.getItem("token"),
      };
    }
    return config;
  },
  (error) => {
    // 请求错误逻辑
    Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response.data;
  },
  (error) => {
    // 对响应错误做点什么
    return Promise.reject(new Error("failed"));
  }
);

// 对外暴露
export default request;
