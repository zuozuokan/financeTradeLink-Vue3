import request from "../util/userRequest";

// 获取所有融资申请
export const getFinancingApplications = () =>
  request.get("/admin/financing/applications");

// 审核融资项目
export const reviewFinancingApplication = (id, status) =>
  request.post("/admin/financing/review", null, {
    params: {
      id,
      status,
    },
  });
