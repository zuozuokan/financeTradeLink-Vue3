
import request from "../util/bankRequest";

export const getLoanListByUserUuidAPI = async (userUuid) => {
  try {
    return request.get('/loan-application-list', {
      params: { userUuid: userUuid }
    })
  } catch (error) {
    console.error('Error fetching load data:', error);
    throw error;
  }
}

export const loadAdviceAPI = async (loanUuid,bankAdvice) => {
    try{
       return  request.post('/checkLoan', null, {
            params: { loanUuid, bankAdvice }
        });
    }
    catch (error) {
        console.error('Error submitting loan advice:', error);
        throw error;
    }
  
}


/**
 * 获取单个融资申请详情
 * @param {string} loanApplicationUuid - 融资申请唯一标识
 * @returns {Promise} - 包含申请详情的 Promise
 */
export const getLoanDetailAPIByLoadUuis = (loanApplicationUuid) => 
  request.get("information", {
      params: { loanApplicationUuid }
    });
  
  /**
   * 提交银行对融资申请的审核建议
   * @param {string} loanUuid - 贷款唯一标识
   * @param {string} bankAdvice - 银行审核建议
   * @returns {Promise} - 包含审核结果的 Promise
   */
  export const submitLoanAdviceAPI = (loanUuid, bankAdvice) => 
    request.post("/bank/checkLoan", null, {
      params: { loanUuid, bankAdvice }
    });
  
  /**
   * 验证用户角色权限
   * @param {string} userUuid - 用户唯一标识
   * @returns {Promise<boolean>} - 是否具有银行工作人员权限
   */
  export const checkBankRoleAPI = (userUuid) => 
    request.get("/user/role", {
      params: { userUuid }
    }).then(loadRequest => loadRequest.role === "BANK");