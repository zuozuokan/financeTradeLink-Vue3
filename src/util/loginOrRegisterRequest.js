import axios from "axios";

const request = axios.create({
    // 网关路径
    baseURL: '/project-base/api/register-login',
    // "project-base" 是网关路径,可以在后端代码gateway的bootstrap.yml中查看

    // 非网关路径（其他微服务，同理）
    // baseURL: '/api/register-login',
    timeout: 5000,
});

// 登录或注册不会被拦截，无需拦截器


// 对外暴露
export default request;






