import request from "../../util/loanRequest";

// 获取所有融资申请
export const getLoanApplications = () =>
  request.get("/all-list");

// 审核融资项目
export const review = (id, status) =>
  request.post("/admin/financing/review", null, {
    params: {
      id,
      status,
    },
  });

// 更新贷款申请状态
export const reviewLoanApplication = (loanApplicationUuid, loanApplicationNewstatus) =>
  request.post("/review", null, {
    params: {
      loanApplicationUuid,
      loanApplicationNewstatus
    }
  });
