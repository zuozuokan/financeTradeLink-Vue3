<template>
    <div id="content" class="agri-platform">
      <ExpertSideBar />
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
          <el-table-column prop="consultTitle" label="预约标题" width="200">
            <template #default="{ row }">
              <span class="agri-text">{{ row.consultTitle }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="consultType" label="预约类型" width="150">
            <template #default="{ row }">
              <span class="agri-text">{{ translateConsultType(row.consultType) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="consultStatus" label="预约状态" width="150">
            <template #default="{ row }">
              <el-select
                v-if="row.isEditing"
                v-model="row.consultStatus"
                placeholder="请选择状态"
                class="agri-select"
                @change="saveStatus(row)"
              >
                <el-option label="待处理" value="pending" />
                <el-option label="已接受" value="accepted" />
                <el-option label="已拒绝" value="rejected" />
                <el-option label="已完成" value="completed" />
               
              </el-select>
              <span v-else class="agri-text">{{ translateConsultStatus(row.consultStatus) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="userName" label="预约姓名" width="150">
            <template #default="{ row }">
              <span class="agri-text">{{ row.userName || '加载中...' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="consultDate" label="预约日期" width="180">
            <template #default="{ row }">
              <span class="agri-text">{{ formatDate(row.consultAppointTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="consultCreatedTime" label="发起时间" width="180">
            <template #default="{ row }">
              <span class="agri-text">{{ formatDate(row.consultCreatedTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template #default="{ row }">
              <el-button
                size="large"
                @click="enableEdit(row)"
                class="agri-btn agri-btn-edit"
                v-if="!row.isEditing"
              >
                <i class="icon-edit"></i>编辑
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
            <el-descriptions-item label="预约姓名">{{ currentConsult.userName || '未知' }}</el-descriptions-item>
            <el-descriptions-item label="预约日期">{{ formatDate(currentConsult.consultAppointTime) }}</el-descriptions-item>
            <el-descriptions-item label="发起时间">{{ formatDate(currentConsult.consultCreatedTime) }}</el-descriptions-item>
            <el-descriptions-item label="更新时间">{{ formatDate(currentConsult.consultUpdatedTime) }}</el-descriptions-item>
            <el-descriptions-item label="详细描述" :span="2">
              <div class="description-content">{{ currentConsult.consultDescription || '无详细描述' }}</div>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
        <template #footer>
          <el-button @click="dialogVisible = false">关闭</el-button>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  import ExpertSideBar from "@/components/ExpertSideBar.vue";
  import { ref, onMounted } from "vue";
  import { ElMessage, ElMessageBox } from "element-plus";
  import {
    getUserConsultListAPI,
    updateConsultStatusAPI,
    getConsultDetailAPI,
  } from "@/api/expert.js";
  import { userGetCurrentInfoAPI } from "@/api/user";
  import { jwtDecode } from "jwt-decode";
  
  // 获取当前用户信息
  const token = localStorage.getItem("token");
  const payload = jwtDecode(token);
  const userUuid = payload.uuid;
  
  const consultList = ref([]);
  const originalMap = ref({});
  const dialogVisible = ref(false);
  const currentConsult = ref({});
  
  // 翻译预约类型（后端英文 -> 前端中文）
  const translateConsultType = (type) => {
    const typeMap = {
      online: "线上咨询",
      offline: "线下咨询",
    };
    return typeMap[type] || type;
  };
  
  // 翻译预约状态（后端英文 -> 前端中文）
  const translateConsultStatus = (status) => {
    const statusMap = {
      pending: "待处理",
      accepted: "已接受",
      rejected: "已拒绝",
      completed: "已完成",
      cancelled :"已取消",
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
  

  const fetchConsultList = async () => {
  try {
    const res = await getUserConsultListAPI(userUuid);
    console.log("接口响应:", res); 
    
    if (res.code === 200) {
   
      const records = res.results || []; 
    
      consultList.value = await Promise.all(
        records.map(async (consult) => {
        //   const userRes = await userGetCurrentInfoAPI(consult.consultUserUuid);
          return {
            ...consult,
              isEditing: false,
              userName: "未知",
            // userName: userRes.code === 200 ? userRes.results.Username : "未知",
          };
        })
      );
      
      originalMap.value = Object.fromEntries(
        records.map((c) => [c.consultUuid, { ...c }])
      );
      
    } else {
      ElMessage.info(res.results);
    }
  } catch (error) {
    ElMessage.info(res.results);
  }
};
  // 启用编辑模式
  const enableEdit = (row) => {
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
  

  
  // 显示预约详情
  const showDetail = async (row) => {
    try {
      const res = await getConsultDetailAPI(row.consultUuid);
      if (res.code === 200) {
        currentConsult.value = {
          ...res.results,
          userName: row.userName,
        };
        dialogVisible.value = true;
      } else {
        ElMessage.error("获取预约详情失败");
      }
    } catch (error) {
      ElMessage.error("除获取预约详情失败：" + error.message);
    }
  };
  
  // 关闭弹窗
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
    width: 100;
    border-radius: 8px;
    overflow: hidden;
  
    .agri-table-header th {
      background-color: rgba($primary-green, 0.1);
      color: $dark-green;
      font-weight: 600;
      padding: 12px 0;
      border-bottom: 1px solid rgba($primary-green, 0.2);
    }
  
    .agri-table-row {
      transition: all 0.3s ease;
  
      &:hover {
        background-color: rgba($light-green, 0.05);
      }
  
      td {
        padding: 12px 0;
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
    font-weight: 500;
    padding: 8px 12px;
    transition: all 0.2s ease;
  
    i {
      margin-right: 4px;
      font-size: 14px;
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
    &:hover {
      opacity: 0.9;
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
  
  /* 详情卡片样式 */
  .detail-card {
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
    white-space: pre-wrap; /* 保留换行符，自动换行 */
    word-break: break-all; /* 长单词自动换行 */
    padding: 8px 0;
    color: #333;
    line-height: 1.6;
    
    /* 可选：为长文本添加边框和内边距，增强可读性 */
    border: 1px solid rgba(76, 175, 80, 0.15);
    border-radius: 4px;
    background-color: rgba(76, 175, 80, 0.03);
    padding: 12px;
    margin-top: 8px;
  }
  
  /* 图标字体 */
  .icon-edit:before { content: "\270E"; }
  .icon-delete:before { content: "\1F5D1"; }
  .icon-detail:before { content: "\1F50D"; }
  </style>