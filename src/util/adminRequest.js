import axios from "axios";

const request = axios.create({
    // 网关路径
    // baseURL: "/project-admin/api/admin",
    baseURL: '/api/admin',
    timeout: 5000,
});

// 请求拦截器
request.interceptors.request.use(
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
request.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        return Promise.reject(new Error("failed"));
    }
);

export default request;