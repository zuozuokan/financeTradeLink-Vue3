import axios from "axios";

const request = axios.create({
    // 网关路径
    baseURL: "/project-user/api/user/consult",
    //非网关多端口转发
    // baseURL:"http://localhost:30000/api/user/consult",
    // baseURL: '/api/user/consult',
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