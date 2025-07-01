<template>
  <div id="content" class="agri-finance-layout">
    <UserManageSideBar class="sidebar" />
    <el-card class="loan-management agri-finance-card">
      <template #header>
        <div class="card-header agri-card-header">
          <div class="header-content">
            <h2>融资管理</h2>
            <div class="agri-icon">
              <div class="icon-leaf"></div>
              <div class="icon-wheat"></div>
            </div>
          </div>
        </div>
      </template>
      <div class="table-container">
        <el-table :data="applications" border style="width: 100%">
          <el-table-column prop="loanApplicationAmount" label="金额（元）" width="140">
            <template #default="{ row }">
              <el-input-number
                v-if="row.isEditing"
                v-model="row.loanApplicationAmount"
                :min="1000"
                :step="1000"
              />
              <span v-else>{{ row.loanApplicationAmount }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="loanApplicationPurpose" label="用途">
            <template #default="{ row }">
              <el-input v-if="row.isEditing" v-model="row.loanApplicationPurpose" />
              <span v-else>{{ row.loanApplicationPurpose }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="loanApplicationRepayPlan" label="还款计划">
            <template #default="{ row }">
              <el-input v-if="row.isEditing" v-model="row.loanApplicationRepayPlan" />
              <span v-else>{{ row.loanApplicationRepayPlan }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="loanApplicationStatus" label="状态" width="130" />
          <el-table-column
            prop="loanApplicationCreatedTime"
            label="创建时间"
            width="280"
          />

          <el-table-column label="操作" width="350">
            <template #default="{ row }">
              <template v-if="row.isEditing">
                <el-button
                  size="large"
                  class="agri-btn agri-btn-save"
                  @click="saveEdit(row)"
                >
                  <span class="btn-icon">✓</span> 保存
                </el-button>
                <el-button
                  size="large"
                  class="agri-btn agri-btn-cancel"
                  @click="cancelEdit(row)"
                >
                  <span class="btn-icon">×</span> 取消
                </el-button>
              </template>
              <template v-else>
                <el-button
                  size="large"
                  class="agri-btn agri-btn-edit"
                  @click="enableEdit(row)"
                >
                  <span class="btn-icon">✎</span> 编辑
                </el-button>
                <el-button
                  size="large"
                  class="agri-btn agri-btn-warning"
                  @click="cancelApplication(row)"
                  :disabled="row.loanApplicationStatus === 'cancelled'"
                >
                  <span class="btn-icon">⊘</span> 取消
                </el-button>
                <el-button
                  size="large"
                  class="agri-btn agri-btn-danger"
                  @click="deleteApplication(row)"
                >
                  <span class="btn-icon">🗑</span> 删除
                </el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import UserManageSideBar from "@/components/UserManageSideBar.vue";
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getUserLoanApplications,
  updateLoanAmount,
  updateLoanPurpose,
  updateLoanRepayPlan,
  updateLoanStatus,
  deleteLoanApplication,
} from "@/api/loan";
import { jwtDecode } from "jwt-decode";

const token = localStorage.getItem("token");
const payload = jwtDecode(token);
const userUuid = payload.uuid;

const applications = ref([]);
const originalDataMap = ref({});

const fetchApplications = async () => {
  const res = await getUserLoanApplications(userUuid);
  if (res.code === 200) {
    applications.value = res.results.map((app) => ({ ...app, isEditing: false }));
    originalDataMap.value = Object.fromEntries(
      res.results.map((app) => [app.loanApplicationUuid, { ...app }])
    );
  } else {
    ElMessage.error("获取融资列表失败");
  }
};

onMounted(() => {
  fetchApplications();
});

const enableEdit = (row) => {
  row.isEditing = true;
};

const cancelEdit = (row) => {
  const original = originalDataMap.value[row.loanApplicationUuid];
  Object.assign(row, { ...original, isEditing: false });
};

const saveEdit = async (row) => {
  const tasks = [
    updateLoanAmount(row.loanApplicationUuid, row.loanApplicationAmount),
    updateLoanPurpose(row.loanApplicationUuid, row.loanApplicationPurpose),
    updateLoanRepayPlan(row.loanApplicationUuid, row.loanApplicationRepayPlan),
  ];
  const results = await Promise.all(tasks);
  const hasError = results.some((res) => res.code !== 200);
  if (hasError) {
    ElMessage.error("部分更新失败");
  } else {
    ElMessage.success("更新成功");
    row.isEditing = false;
    originalDataMap.value[row.loanApplicationUuid] = { ...row };
  }
};

const cancelApplication = async (row) => {
  try {
    await ElMessageBox.confirm("确定要取消该融资申请吗？", "提示", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    });
    const res = await updateLoanStatus(row.loanApplicationUuid, "cancelled");
    if (res.code === 200) {
      ElMessage.success("已取消");
      fetchApplications();
    } else {
      ElMessage.error("取消失败");
    }
  } catch {}
};

const deleteApplication = async (row) => {
  try {
    await ElMessageBox.confirm("此操作将永久删除该申请，是否继续？", "警告", {
      confirmButtonText: "删除",
      cancelButtonText: "取消",
      type: "warning",
    });
    const res = await deleteLoanApplication(userUuid, row.loanApplicationUuid);
    if (res.code === 200) {
      ElMessage.success("删除成功");
      fetchApplications();
    } else {
      ElMessage.error("删除失败");
    }
  } catch {}
};
</script>

<style scoped>
/* 整体布局 */
.agri-finance-layout {
  width: 100%;
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4efe9 100%);

}

/* 卡片样式 */
.agri-finance-card {
  width: 95%;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(94, 141, 94, 0.15);
  border: none;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(4px);
  overflow: hidden;
  padding: 15px;
}

.agri-card-header {
  background: linear-gradient(90deg, #2c7744 0%, #5b8c5a 100%);
  color: white;
  padding: 18px 24px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.agri-icon {
  display: flex;
  gap: 8px;
}

.icon-leaf,
.icon-wheat {
  width: 28px;
  height: 28px;
  background-size: contain;
  background-repeat: no-repeat;
}

.icon-leaf {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17 1.02.26 1.59.26 5.62 0 10-3.95 10-8C18 9.32 17.67 8.72 17 8M12 20c-3.21 0-5.2-2.39-6.75-5.45 1.83-3.66 3.64-5.09 6.75-5.09 1.83 0 3.25.5 4.5 1.28-.46 3.11-2.75 5.53-5.71 6.1-.92.18-1.85.27-2.8.27m-.07-12.53L8.71 6.8l-2.43.93a9.844 9.844 0 0 1 3.16-2.53L11 4.42l1.14 1.93c1.46.5 2.63 1.4 3.57 2.59-1.17-.73-2.57-1.21-4.21-1.39z'%3E%3C/path%3E%3C/svg%3E");
}

.icon-wheat {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M22.59 7.59 24 6l-3-3-1.41 1.41L20.17 6H19c-2.76 0-5 2.24-5 5v.36l-9 9.65L3 19.34l1.41-1.41 1.59 1.59.71.71 8.71-9.35V11c0 1.66 1.34 3 3 3h1.17l-1.58 1.59L21 18l3-3-1.41-1.41z'%3E%3C/path%3E%3C/svg%3E");
}

/* 表格样式 */
.table-container {
  border-radius: 0 0 12px 12px;
  overflow: hidden;
}

.agri-table {
  --el-table-border-color: #dde9dc;
  --el-table-border: 1px solid #dde9dc;
  --el-table-row-hover-bg-color: #f5fff5;
  --el-table-header-bg-color: #f0f8f0;
}

:deep(.agri-table .el-table__header th) {
  background-color: #f0f8f0;
  color: #2c7744;
  font-weight: 600;
  letter-spacing: 0.5px;
}

:deep(.agri-table .el-table__row) {
  transition: all 0.3s ease;
}

:deep(.agri-table .el-table__row--striped) {
  background-color: #f9fffa;
}

:deep(.agri-table .el-input__wrapper) {
  box-shadow: 0 0 0 1px #c4e0c5 inset;
  background-color: #f9fffa;
}

/* 按钮样式优化 */
:deep(.el-button) {
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease;
  padding: 7px 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

:deep(.el-button--small) {
  padding: 6px 11px;
}

:deep(.el-button:not(.is-disabled)) {
  transform: translateY(0);
}

:deep(.el-button:not(.is-disabled):hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
}

:deep(.el-button--success) {
  background-color: #38b000;
  border-color: #38b000;
}

:deep(.el-button--warning) {
  background-color: #ffaa00;
  border-color: #ffaa00;
}

:deep(.el-button--danger) {
  background-color: #ff4d6d;
  border-color: #ff4d6d;
}

/* 输入框悬停效果 */
:deep(.el-input:hover .el-input__wrapper) {
  box-shadow: 0 0 0 1px #38b000 inset;
}

.agri-btn {
  border-radius: 8px !important;
  font-weight: 500 !important;
  letter-spacing: 0.5px;
  padding: 0 16px !important;
  height: 36px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
  border: none !important;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.agri-btn .btn-icon {
  margin-right: 6px;
  font-size: 14px;
}

/* 编辑按钮 - 自然绿色 */
.agri-btn-edit {
  background: linear-gradient(135deg, #38b000 0%, #5b8c5a 100%) !important;
  color: white !important;
}

.agri-btn-edit:hover:not(.is-disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(56, 176, 0, 0.2) !important;
}

/* 保存按钮 - 深绿色 */
.agri-btn-save {
  background: linear-gradient(135deg, #2c7744 0%, #38b000 100%) !important;
  color: white !important;
}

.agri-btn-save:hover:not(.is-disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(44, 119, 68, 0.3) !important;
}

/* 取消按钮 - 橙色渐变 */
.agri-btn-warning {
  background: linear-gradient(135deg, #ff9500 0%, #ffaa00 100%) !important;
  color: white !important;
}

.agri-btn-warning:hover:not(.is-disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(255, 149, 0, 0.3) !important;
}

.agri-btn-warning.is-disabled {
  opacity: 0.6;
}

/* 删除按钮 - 红色渐变 */
.agri-btn-danger {
  background: linear-gradient(135deg, #ff4d6d 0%, #ff758f 100%) !important;
  color: white !important;
}

.agri-btn-danger:hover:not(.is-disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(255, 77, 109, 0.3) !important;
}

/* 取消编辑按钮 - 浅灰色 */
.agri-btn-cancel {
  background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%) !important;
  color: #666 !important;
}

.agri-btn-cancel:hover:not(.is-disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
}

/* 按钮悬停动画 */
:deep(.agri-btn:not(.is-disabled)) {
  transform: translateY(0);
}

:deep(.agri-btn:not(.is-disabled):hover) {
  transform: translateY(-2px);
  filter: brightness(1.05);
}

/* 按钮间距调整 */
.el-table__cell .el-button + .el-button {
  margin-left: 8px;
}
</style>
