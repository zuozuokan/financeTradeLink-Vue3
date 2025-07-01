import axios from "axios";

const knowledgeRequest = axios.create({
  baseURL: '/api/knowledge',
  timeout: 5000,
});

// 请求拦截器
knowledgeRequest.interceptors.request.use(
  (config) => {
    if (localStorage.getItem("token")) {
      config.headers = {
        ...config.headers,
        token: localStorage.getItem("token"),
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
knowledgeRequest.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(new Error("failed"));
  }
);

export default knowledgeRequest; 