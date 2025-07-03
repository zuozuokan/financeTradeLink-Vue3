<template>
  <div id="content">
    <UserManageSideBar />
    <el-card class="loan-application-form">
      <template #header>
        <div class="card-header">
          <span>发起融资申请</span>
        </div>
      </template>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="150px">
        <el-form-item label="融资金额" prop="loanApplicationAmount">
          <el-input-number
            v-model="form.loanApplicationAmount"
            :min="1000"
            :step="1000"
            placeholder="请输入融资金额（元）"
          />
          <span class="require">不少于1e3，不多于1e16</span>
        </el-form-item>

        <el-form-item label="融资用途" prop="loanApplicationPurpose">
          <el-input
            v-model="form.loanApplicationPurpose"
            type="textarea"
            rows="3"
            placeholder="请输入融资用途"
          />
        </el-form-item>

        <el-form-item label="还款计划" prop="loanApplicationRepayPlan">
          <el-input
            v-model="form.loanApplicationRepayPlan"
            placeholder="请输入还款计划（如每季度还款）"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">提交申请</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import UserManageSideBar from "@/components/UserManageSideBar.vue";
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { addLoanApplication } from "@/api/loan";
import { jwtDecode } from "jwt-decode";
const token = localStorage.getItem("token");
const payload = jwtDecode(token);
const userUuid = payload.uuid;

const formRef = ref();
const form = ref({
  loanApplicationAmount: null,
  loanApplicationPurpose: "",
  loanApplicationRepayPlan: "",
});

const rules = {
  loanApplicationAmount: [
    { required: true, message: "请输入融资金额", trigger: "blur" },
    { type: "number", min: 1000, message: "融资金额至少为1000元", trigger: "blur" },
  ],
  loanApplicationPurpose: [
    { required: true, message: "请输入融资用途", trigger: "blur" },
  ],
  loanApplicationRepayPlan: [
    { required: true, message: "请输入还款计划", trigger: "blur" },
  ],
};

const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      const loanApplication = {
        loanApplicationAmount: form.value.loanApplicationAmount,
        loanApplicationPurpose: form.value.loanApplicationPurpose,
        loanApplicationRepayPlan: form.value.loanApplicationRepayPlan,
        loanApplicationStatus: "pending",
      };
      const res = await addLoanApplication(userUuid, loanApplication);
      if (res.code === 200) {
        ElMessage.success("融资申请提交成功");
        resetForm();
      } else {
        ElMessage.error(res.msg || "申请失败");
      }
    } catch (error) {
      ElMessage.error("服务器异常，提交失败");
    }
  });
};

const resetForm = () => {
  formRef.value.resetFields();
};
</script>

<style scoped>
#content {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #75d194 100%);
  
}

.loan-application-form {
  width: 75%;
  margin: 30px auto;
  padding: 32px;
  border-radius: 18px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(8px);
  border: none;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  background: linear-gradient(135deg, #c7d5d9 0%, #e8e667 100%);
}

.loan-application-form:hover {
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.12);
}

.card-header {
  margin-bottom: 28px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.card-header span {
  font-size: 22px;
  font-weight: 600;
  color: #2c3e50;
  letter-spacing: 0.5px;
  position: relative;
}

.card-header span::after {
  content: "";
  position: absolute;
  bottom: -16px;
  left: 0;
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, #27ae60 0%, #2ecc71 100%);
  border-radius: 3px;
}

:deep(.el-form) {
  padding: 0 20px;
}

:deep(.el-form-item) {
  margin-bottom: 28px;
}

:deep(.el-form-item__label) {
  font-size: 15px;
  font-weight: 500;
  color: #4a5568;
  letter-spacing: 0.3px;
}

:deep(.el-input-number),
:deep(.el-input),
:deep(.el-textarea) {
  width: 100%;
}

:deep(.el-input__inner),
:deep(.el-textarea__inner) {
    height: 40px;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 14px;
  transition: all 0.3s ease;

}

:deep(.el-input__inner:hover),
:deep(.el-textarea__inner:hover) {
  border-color: #2ecc71;
  
}

:deep(.el-input__inner:focus),
:deep(.el-textarea__inner:focus) {
  border-color: #2ecc71;
  
}

:deep(.el-input-number .el-input__inner) {
  padding-left: 40px;
}

.require {
  display: inline-block;
  margin-left: 12px;
  font-size: 12px;
  color: #718096;
  letter-spacing: 0.2px;
}

:deep(.el-button) {
  padding: 12px 28px;
  border-radius: 10px;
  font-weight: 500;
  letter-spacing: 0.3px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(39, 174, 96, 0.2);
}

:deep(.el-button--primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(39, 174, 96, 0.3);
}

:deep(.el-button--default) {
  background: #fff;
  border: 1px solid #e2e8f0;
  color: #4a5568;
}

:deep(.el-button--default:hover) {
  border-color: #cbd5e0;
  color: #2d3748;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

@media (max-width: 768px) {
  .loan-application-form {
    width: 90%;
    padding: 24px 16px;
  }

  :deep(.el-form-item__label) {
    margin-bottom: 8px;
  }

  :deep(.el-form-item) {
    margin-bottom: 22px;
  }

  .card-header span {
    font-size: 20px;
  }
}
</style>
