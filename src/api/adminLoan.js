import request from "../util/userRequest";

// 获取所有融资申请
export const getFinacingApplications = () =>
  request.get("/admin/finacing/applications");

// 审核融资项目
export const reviewFinacingApplication = (id, status) =>
  request.post("/admin/finacing/review", null, {
    params: {
      id,
      status,
    },
  }); 