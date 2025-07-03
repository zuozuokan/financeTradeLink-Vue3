<template>
    <div id="content" class="agri-platform">
      <UserManageSideBar />
      <el-card class="consult-management">
        <template #header>
          <div class="card-header">
            <span class="title-text">我的预约管理</span>
            <div class="header-decoration">
              <div class="leaf-decoration"></div>
            </div>
          </div>
        </template>
        <el-table
          :data="consultList"
          border
          style="width: 100%"
          class="agri-table"
          header-row-class-name="agri-table-header"
          row-class-name="agri-table-row"
        >
          <el-table-column label="序号" type="index" width="80" align="center" />
          <el-table-column prop="consultTitle" label="预约标题" width="150" align="center">
            <template #default="{ row }">
              <span class="agri-text">{{ row.consultTitle }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="consultType" label="预约类型" width="150" align="center">
            <template #default="{ row }">
              <span class="agri-text">{{ translateConsultType(row.consultType) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="consultStatus" label="预约状态" width="150" align="center">
            <template #default="{ row }">
              <el-select
                v-if="row.isEditing"
                v-model="row.consultStatus"
                placeholder="请选择状态"
                class="agri-select"
                @change="saveStatus(row)"
              >
                <el-option label="待处理" value="pending" />
                <el-option label="取消" value="cancelled" />
              </el-select>
              <span v-else class="agri-text">{{ translateConsultStatus(row.consultStatus) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="consultExpertName" label="专家姓名" width="100" align="center">
            <template #default="{ row }">
              <span
                class="agri-text expert-name"
                @click="showExpertDetail(row.consultExpertUserUuid)"
              >
                {{ row.consultExpertName || '加载中...' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="consultAppointTime" label="预约日期" width="180" align="center">
            <template #default="{ row }">
              <span class="agri-text">{{ formatDate(row.consultAppointTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="consultCreateTime" label="发起时间" width="180" align="center">
            <template #default="{ row }">
              <span class="agri-text">{{ formatDate(row.consultCreateTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300" align="center" >
            <template #default="{ row }">
              <el-button
                v-if="row.consultStatus === 'pending'"
                size="large"
                @click="enableEdit(row)"
                class="agri-btn agri-btn-edit"
              >
                <i class="icon-edit"></i>编辑
              </el-button>
              <el-button
                v-if="row.consultStatus === 'cancelled'"
                size="large"
                @click="deleteConsult(row)"
                class="agri-btn agri-btn-delete"
              >
                <i class="icon-delete"></i>删除
              </el-button>
              <el-button
                size="large"
                type="primary"
                @click="showDetail(row)"
                class="agri-btn agri-btn-detail"
              >
                <i class="icon-detail"></i>详细
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
  
      <!-- 预约详情弹窗 -->
      <el-dialog
        v-model="dialogVisible"
        title="预约详情"
        width="60%"
        :before-close="handleCloseDialog"
      >
        <el-card class="detail-card">
          <template #header>
            <div class="card-header">
              <span class="title-text">预约详细信息</span>
            </div>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="预约标题">{{ currentConsult.consultTitle }}</el-descriptions-item>
            <el-descriptions-item label="预约类型">{{ translateConsultType(currentConsult.consultType) }}</el-descriptions-item>
            <el-descriptions-item label="预约状态">{{ translateConsultStatus(currentConsult.consultStatus) }}</el-descriptions-item>
            <el-descriptions-item label="专家姓名">{{ currentConsult.consultExpertName || '未知' }}</el-descriptions-item>
            <el-descriptions-item label="预约日期">{{ formatDate(currentConsult.consultAppointTime) }}</el-descriptions-item>
            <el-descriptions-item label="发起时间">{{ formatDate(currentConsult.consultCreateTime) }}</el-descriptions-item>
            <el-descriptions-item label="更新时间">{{ formatDate(currentConsult.consultUpdateTime) }}</el-descriptions-item>
            <el-descriptions-item label="详细描述" :span="2">
              <div class="description-content">{{ currentConsult.consultDescription || '无详细描述' }}</div>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
        <template #footer>
          <el-button @click="dialogVisible = false">关闭</el-button>
        </template>
      </el-dialog>
  
      <!-- 专家信息弹窗 -->
      <el-dialog
        v-model="expertDialogVisible"
        title="专家信息"
        width="50%"
        :before-close="handleCloseExpertDialog"
      >
        <el-card class="expert-card">
          <template #header>
            <div class="card-header">
              <span class="title-text">专家详细信息</span>
            </div>
          </template>
          <div class="expert-avatar">
            <img
              :src="currentExpert.expertHeadshotUrl || 'https://via.placeholder.com/150'"
              alt="专家头像"
              class="avatar-img"
            />
          </div>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="专家姓名">{{ currentExpert.expertName || '未知' }}</el-descriptions-item>
            <el-descriptions-item label="职称">{{ currentExpert.expertTitle || '无' }}</el-descriptions-item>
            <el-descriptions-item label="擅长领域">{{ currentExpert.expertSpecialty || '无' }}</el-descriptions-item>
            <el-descriptions-item label="简介">
              <div class="description-content">{{ currentExpert.expertIntroduction || '无简介' }}</div>
            </el-descriptions-item>
            <el-descriptions-item label="资质证书">
              <a
                :href="currentExpert.expertCertificateUrl"
                target="_blank"
                class="certificate-link"
              >
                查看资质证书
              </a>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
        <template #footer>
          <el-button @click="expertDialogVisible = false">关闭</el-button>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  import UserManageSideBar from "@/components/UserManageSideBar.vue";
  import { ref, onMounted } from "vue";
  import { ElMessage, ElMessageBox } from "element-plus";
  import {
    getUserConsultListAPI,
    updateConsultStatusAPI,
    getConsultDetailAPI,
    deleteConsultAPI,
} from "@/api/consult.js";
import {
    getExpertInfoAPI,
} from "@/api/expert.js";
import {
    userGetCurrentInfoAPI,
}from "@/api/user.js"
  import { jwtDecode } from "jwt-decode";
  
  // 获取当前用户信息
  const token = localStorage.getItem("token");
  const payload = jwtDecode(token);
  const userUuid = payload.uuid;
  
  const consultList = ref([]);
  const originalMap = ref({});
  const dialogVisible = ref(false);
  const expertDialogVisible = ref(false);
  const currentConsult = ref({});
  const currentExpert = ref({});
  
  // 翻译预约类型
  const translateConsultType = (type) => {
    const typeMap = {
      online: "线上咨询",
      offline: "线下咨询",
      
    };
    return typeMap[type] || type;
  };
  
  // 翻译预约状态
  const translateConsultStatus = (status) => {
    const statusMap = {
      pending: "待处理",
        cancelled: "取消",
        rejected: "已拒绝",
        accepted: "已同意",
        completed:"已完成",
    };
    return statusMap[status] || status;
  };
  
  // 格式化日期
  const formatDate = (date) => {
    if (!date) return "未知";
    return new Date(date).toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };
  
  // 获取咨询预约列表
  const fetchConsultList = async () => {
    try {
      const res = await getUserConsultListAPI(userUuid);
      if (res.code === 200) {
        consultList.value = res.results.map((consult) => ({
          ...consult,
          isEditing: false,
        }));
        originalMap.value = Object.fromEntries(
          res.results.map((c) => [c.consultUuid, { ...c }])
        );
      } else {
        ElMessage.warning(res.results);
      }

    } catch (error) {
      ElMessage.error("加载预约列表失败：" + error.message);
    }
  };
  
  // 启用编辑模式
const enableEdit = (row) => {
    if (row.consultStatus === 'cancelled') {
        ElMessage.warning("已取消的预约不可编辑");
        return;
    }
    if (row.consultStatus !== "pending") {
      ElMessage.warning("仅待处理状态可编辑");
      return;
    }
    row.isEditing = true;
  };
  
  // 保存状态变更
  const saveStatus = async (row) => {
    try {
      const res = await updateConsultStatusAPI(row.consultUuid, row.consultStatus);
      if (res.code === 200) {
        ElMessage.success("状态更新成功");
        row.isEditing = false;
        originalMap.value[row.consultUuid] = { ...row };
      } else {
        ElMessage.error("状态更新失败");
        row.consultStatus = originalMap.value[row.consultUuid].consultStatus;
        row.isEditing = false;
      }
    } catch (error) {
      ElMessage.error("状态更新失败：" + error.message);
      row.consultStatus = originalMap.value[row.consultUuid].consultStatus;
      row.isEditing = false;
    }
  };
  
  // 删除咨询预约
  const deleteConsult = async (row) => {
    if (row.consultStatus !== "cancelled") {
      ElMessage.warning("仅取消状态可删除");
      return;
    }
    try {
      await ElMessageBox.confirm("确定删除此预约？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      });
      const res = await deleteConsultAPI(userUuid, row.consultUuid);
      if (res.code === 200) {
        ElMessage.success("删除成功");
        consultList.value = consultList.value.filter(
          (item) => item.consultUuid !== row.consultUuid
        );
      } else {
        ElMessage.error("删除失败"+res.data.results);
      }
    } catch (error) {
      ElMessage.error("删除失败：" + error.message);
    }
  };
  
  // 显示预约详情
  const showDetail = async (row) => {
    try {
      const res = await getConsultDetailAPI(row.consultUuid);
      if (res.code === 200) {
        currentConsult.value = res.results;
        dialogVisible.value = true;
      } else {
        ElMessage.warning("获取预约详情失败"+res.data.results);
      }
    } catch (error) {
      ElMessage.error("获取预约详情失败：" + error.message);
    }
  };
  
  const showExpertDetail = async (expertUserUuid) => {
  try {
    const res = await getExpertInfoAPI(expertUserUuid);
    if (res.code === 200) {
      const user = await userGetCurrentInfoAPI(res.results.expertUserUuid);
      
      // 创建新的对象包含所有需要的数据
      currentExpert.value = {
        ...res.results,  // 展开所有原有属性
        expertName: user.results.userName,  // 添加用户名
        expertHeadshotUrl: res.results.expertHeadshot,  // 添加URL映射
        expertCertificateUrl: res.results.expertCertificate  // 添加URL映射
      };
      
      expertDialogVisible.value = true;
    } else {
      ElMessage.error("获取专家信息失败"+res.data.results);
    }
  } catch (error) {
    ElMessage.error("获取专家信息失败：" + error.message);
  }
};
  
  // 关闭预约详情弹窗
  const handleCloseDialog = (done) => {
    ElMessageBox.confirm("确定关闭详情窗口？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        done();
      })
      .catch(() => {});
  };
  
  // 关闭专家详情弹窗
  const handleCloseExpertDialog = (done) => {
    ElMessageBox.confirm("确定关闭专家信息窗口？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        done();
      })
      .catch(() => {});
  };
  
  // 页面加载时获取数据
  onMounted(() => {
    fetchConsultList();
  });
  </script>
  
  <style scoped lang="scss">
  /* 复用农业主题配色 */
  $primary-green: #4CAF50;
  $light-green: #8BC34A;
  $dark-green: #388E3C;
  $earth-brown: #795548;
  $wheat-yellow: #FFD54F;
  $background: #f5f7f0;
  
  /* 基础布局 */
  #content.agri-platform {
    display: flex;
    min-height: 100vh;
    background-color: $background;
  }
  
  .consult-management {
    flex: 1;
    padding: 20px;
    margin: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: none;
    background-color: white;
  
    &:deep(.el-card__header) {
      border-bottom: 1px solid rgba($primary-green, 0.2);
      padding: 16px 20px;
      background: linear-gradient(to right, rgba($light-green, 0.1), white);
    }
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  
    .title-text {
      font-size: 20px;
      font-weight: 600;
      color: $dark-green;
      position: relative;
      padding-left: 12px;
  
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        height: 70%;
        width: 4px;
        background-color: $primary-green;
        border-radius: 2px;
      }
    }
  
    .header-decoration {
      position: relative;
  
      .leaf-decoration {
        width: 24px;
        height: 24px;
        background-color: $light-green;
        mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66c.51-1.53 1.2-2.98 2.04-4.57C8.14 17.05 9 16.2 10 15.36c3.14-2.3 4.73-3.91 6.54-6.63C17.25 7.22 17 8 17 8M12 6c0-1.78.78-3.37 2-4.45 1.39 1.15 2.24 2.97 2.45 5 .03.34.05.68.05 1 0 1.9-.54 3.64-1.44 5.14-.9 1.5-2.16 2.7-3.63 3.5-1.48.8-3.16 1.19-4.88 1.19-1.15 0-2.3-.18-3.39-.5a9.98 9.98 0 0 0 2.39-3.28C9.04 11.68 12 6 12 6m9 11v2h-8v-2h8z'/%3E%3C/svg%3E");
        mask-repeat: no-repeat;
        mask-position: center;
      }
    }
  }
  
  /* 表格样式 */
  :deep(.agri-table) {
    width: 90%;
    border-radius: 8px;
    overflow: hidden;
  
    .agri-table-header th {
      background-color: rgba($primary-green, 0.1);
      color: $dark-green;
     
      font-weight: 300;
      padding: 8px 0;
      border-bottom: 1px solid rgba($primary-green, 0.2);
    }
  
    .agri-table-row {
      transition: all 0.3s ease;
  
      &:hover {
        background-color: rgba($light-green, 0.05);
      }
  
      td {
        padding: 8px 0;
        border-color: rgba($primary-green, 0.1);
      }
    }
  }
  
  /* 下拉框样式 */
  .agri-select {
    &:deep(.el-select .el-input__wrapper) {
      border-radius: 6px;
      box-shadow: 0 0 0 1px rgba($primary-green, 0.3);
  
      &:hover {
        box-shadow: 0 0 0 1px $primary-green;
      }
  
      &.is-focus {
        box-shadow: 0 0 0 1px $primary-green;
      }
    }
  }
  
  /* 按钮样式 */
  .agri-btn {
    border-radius: 6px;
    font-weight: 300;
    padding: 6px 9px;
    transition: all 0.2s ease;
  
    i {
      margin-right: 4px;
      font-size: 12px;
    }
  }
  
  .agri-btn-edit {
    background-color: rgba($wheat-yellow, 0.1);
    border-color: rgba($wheat-yellow, 0.5);
    color: darken($wheat-yellow, 30%);
  
    &:hover {
      background-color: rgba($wheat-yellow, 0.2);
      border-color: $wheat-yellow;
    }
  }
  
  .agri-btn-delete {
    background-color: rgba($earth-brown, 0.1);
    border-color: rgba($earth-brown, 0.5);
    color: darken($earth-brown, 20%);
  
    &:hover {
      background-color: rgba($earth-brown, 0.2);
      border-color: $earth-brown;
    }
  }
  
  .agri-btn-detail {
    background-color: rgba($primary-green, 0.1);
    border-color: rgba($primary-green, 0.5);
    color: $dark-green;
  
    &:hover {
      background-color: rgba($primary-green, 0.2);
      border-color: $primary-green;
    }
  }
  
  /* 文本样式 */
  .agri-text {
    color: #424242;
    font-size: 14px;
  }
  
  .expert-name {
    cursor: pointer;
    color: $primary-green;
    text-decoration: underline;
  
    &:hover {
      color: darken($primary-green, 10%);
    }
  }
  
  /* 详情卡片样式 */
  .detail-card,
  .expert-card {
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  
    &:deep(.el-descriptions__cell) {
      padding: 12px;
      font-size: 14px;
      color: #424242;
    }
  
    &:deep(.el-descriptions__label) {
      background-color: rgba($primary-green, 0.05);
      color: $dark-green;
      font-weight: 500;
    }
  }
  
  .description-content {
    white-space: pre-wrap;
    word-break: break-all;
    padding: 8px 0;
    color: #333;
    line-height: 1.6;
    border: 1px solid rgba(76, 175, 80, 0.15);
    border-radius: 4px;
    background-color: rgba(76, 175, 80, 0.03);
    padding: 12px;
    margin-top: 8px;
  }
  
  .expert-avatar {
    text-align: center;
    margin-top: 20px;
  
    .avatar-img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid $primary-green;
    }
  }
  
  .certificate-link {
    color: $primary-green;
    text-decoration: none;
    padding: 8px 12px;
    background-color: rgba($primary-green, 0.1);
    border-radius: 4px;
  
    &:hover {
      background-color: rgba($primary-green, 0.2);
      color: darken($primary-green, 10%);
    }
  }
  
  /* 图标字体 */
  .icon-edit:before {
    content: "\270E";
  }
  .icon-delete:before {
    content: "\1F5D1";
  }
  .icon-detail:before {
    content: "\1F50D";
  }
  </style>
