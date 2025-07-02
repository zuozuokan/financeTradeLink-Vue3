// util/request.js
import axios from "axios";

const request = axios.create({
    // 网关路径
    // baseURL: "/project-user/api/expert",
    //非网关多端口转发
    // baseURL:"http://localhost:9392/api/expert",
    baseURL: "/api/expert",
    timeout: 10000,
});

// 请求拦截器
request.interceptors.request.use(
    (config) => {
        // 在发送请求之前做些什么
        const token = localStorage.getItem("token");
        if (token) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${token}`
            };
        }
        return config;
    },
    (error) => {
        // 处理请求错误
        return Promise.reject(error);
    }
);

// 响应拦截器
request.interceptors.response.use(
    (response) => {
        // 对响应数据做处理
        const res = response.data;

        // 这里可以根据后端返回的code做统一处理
        if (res.code !== 200) {
            // 错误处理，如token过期、权限不足等
            if (res.code === 401) {
                // 未授权，可能需要重新登录
                localStorage.removeItem("token");
                // 跳转到登录页
                // window.location.href = "/login";
            }
            return Promise.reject(new Error(res.msg || "请求失败"));
        } else {
            return res;
        }
    },
    (error) => {
        // 处理响应错误
        let message = error.message;
        if (error.response && error.response.data) {
            message = error.response.msg || message;
        }
        // 可以在这里添加全局错误提示
        console.error("请求错误:", message);
        return Promise.reject(new Error(message));
    }
);

export default request;