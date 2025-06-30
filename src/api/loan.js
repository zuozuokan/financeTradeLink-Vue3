import request from "../util/loanRequest.js";

// 添加融资申请
export const addLoanApplication = (userUuid, loanApplication) => {
  return request.post("/", loanApplication, {
    params: {
      userUuid
    }
  });
};

// 获取用户融资申请列表
export const getUserLoanApplications = (userUuid) => {
  return request.get('/user-list', {
    params: { userUuid },
  })
}

// 获取单个融资申请详情
export const getLoanApplicationInfo = (loanApplicationUuid) => {
  return request.get('/information', {
    params: { loanApplicationUuid },
  })
}

// 更新融资金额
export const updateLoanAmount = (loanApplicationUuid, loanApplicationAmount) => {
  return request.post('/update/amount', null, {
    params: {
      loanApplicationUuid,
      loanApplicationAmount,
    },
  })
}

// 更新融资用途
export const updateLoanPurpose = (loanApplicationUuid, loanApplicationPurpose) => {
  return request.post('/update/purpose', null, {
    params: {
      loanApplicationUuid,
      loanApplicationPurpose,
    },
  })
}

// 更新还款计划
export const updateLoanRepayPlan = (loanApplicationUuid, loanApplicationRepayPlan) => {
  return request.post('/update/repay-plan', null, {
    params: {
      loanApplicationUuid,
      loanApplicationRepayPlan,
    },
  })
}

// 更新融资申请状态（仅支持取消）
export const updateLoanStatus = (loanApplicationUuid, loanApplicationNewstatus) => {
  return request.post('/update/status', null, {
    params: {
      loanApplicationUuid,
      loanApplicationNewstatus,
    },
  })
}

// 删除融资申请
export const deleteLoanApplication = (userUuid, loanApplicationUuid) => {
  return request.post('/detele', null, {
    params: {
      userUuid,
      loanApplicationUuid,
    },
  })
}
