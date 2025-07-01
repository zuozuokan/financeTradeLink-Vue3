import request from "../util/userRequest";



// 获取所有银行用户
export const getAllBanksAPI = () => request.get('/find-all-banks');

// 获取所有专家用户
export const getAllExpertsAPI = () => request.get('/find-all-experts');

// 获取所有普通用户
export const getAllUsersAPI = () => request.get('/find-all-users');

// 操作用户状态（启用/禁用）
export const operationUserAPI = (userUuid, status) =>
    request.post('/operation-user', new URLSearchParams({ userUuid, status }));

// 注册银行账号
export const registerBankAPI = (username, password) =>
    request.post('/register-bank', new URLSearchParams({ username, password }));

// 注册专家账号
export const registerExpertAPI = (username, password) =>
    request.post('/register-expert', new URLSearchParams({ username, password }));
