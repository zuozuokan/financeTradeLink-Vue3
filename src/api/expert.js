import request from "../util/expertRequest";

/**
 * 专家管理相关API
 */
// 删除专家信息
export const deleteExpertAPI = (userUuid, expertUuid) =>
    request.post("/expert-info/delete", null, {
        params: {
            UserUuid: userUuid,
            expertUuid: expertUuid
        }
    });

// 获取专家详情
export const getExpertInfoAPI = (expertUserUuid) =>
    request.get("/expert-info/info", {
        params: {
            expertUserUuid: expertUserUuid
        }
    });

// 更新专家资质证书
export const updateExpertCertificateAPI = (expertUuid, certificateFile) => {
    const formData = new FormData();
    formData.append('certificateFile', certificateFile);

    return request.post("/expert-info/update/certificate", formData, {
        params: {
            expertUuid: expertUuid
        },
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

// 更新专家头像
export const updateExpertHeadshotAPI = (expertUuid, headshotFile) => {
    const formData = new FormData();
    formData.append('headshotFile', headshotFile);

    return request.post("/expert-info/update/headshot", formData, {
        params: {
            expertUuid: expertUuid
        },
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

// 更新专家信息
export const updateExpertInfoAPI = (expertUuid, expertData) =>
    request.post("/expert-info/update/info", expertData, {
        params: {
            expertUuid: expertUuid
        }
    });

// 添加专家信息
export const addExpertAPI = (userUuid, headshotFile, certificateFile, expertData) => {
    const formData = new FormData();
    formData.append('headshotFile', headshotFile);
    formData.append('certificateFile', certificateFile);
    formData.append('data', JSON.stringify(expertData));

    return request.post("/expert-info/upload", formData, {
        params: {
            UserUuid: userUuid
        },
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

/**
 * 咨询预约管理相关API
 */
// 获取单个咨询预约详情
export const getConsultDetailAPI = (consultUuid) =>
    request.get("/consult/detail", {
        params: {
            consultUuid: consultUuid
        }
    });

// 更新咨询预约状态
export const updateConsultStatusAPI = (consultUuid, status) =>
    request.post("/consult/update/status", null, {
        params: {
            consultUuid: consultUuid,
            status: status
        }
    });

// 获取用户的咨询预约列表
export const getUserConsultListAPI = (userUuid) =>
    request.get("/consult/user-list", {
        params: {
            userUuid: userUuid
        }
    });