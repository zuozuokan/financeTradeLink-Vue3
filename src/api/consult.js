import request from "../util/consultRequest";

// 更新咨询预约信息
export const updateConsultAPI = (userUuid, consult) =>
    request.post("/update", consult, {
        params: {
            userUuid,
        },
    });

// 更新咨询预约状态
export const updateConsultStatusAPI = (consultUuid, status) =>
    request.post("/update/status", null, {
        params: {
            consultUuid,
            status,
        },
    });

// 删除咨询预约
export const deleteConsultAPI = (userUuid, consultUuid) =>
    request.post("/delete", null, {
        params: {
            userUuid,
            consultUuid,
        },
    });

// 添加咨询预约
export const addConsultAPI = (userUuid, consult) =>
    request.post("/add", consult, {
        params: {
            userUuid,
        },
    });

// 获取用户的咨询预约列表
export const getUserConsultListAPI = (userUuid) =>
    request.get("/user-list", {
        params: {
            userUuid,
        },
    });

// 获取专家信息列表
export const getExpertListAPI = (userUuid) =>
    request.get("/expert-list", {
        params: {
            userUuid,
        },
    });
// 获取专家详情
export const getExpertInfoAPI = (expertUserUuid) =>
    request.get("/expert-info", {
        params: {
            expertUserUuid: expertUserUuid
        }
    });
// 获取单个咨询预约详情
export const getConsultDetailAPI = (consultUuid) =>
    request.get("/detail", {
        params: {
            consultUuid,
        },
    });