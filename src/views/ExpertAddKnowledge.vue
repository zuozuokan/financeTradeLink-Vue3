<template>
    <div id="content" class="agri-knowledge-layout">
      <ExpertSideBar />
      <el-card class="publish-knowledge agri-knowledge-card">
        <template #header>
          <div class="card-header agri-card-header">
            <div class="card-header agri-card-header">
              <div class="header-content">
                <h2><i class="icon-book"></i> 发布知识</h2>
                <div class="agri-icon-group">
                  <div class="icon-plant"></div>
                  <div class="icon-tractor"></div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div class="form-container">
          <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
            <el-form-item label="标题" prop="knowledgeTitle">
              <el-input v-model="form.knowledgeTitle" placeholder="请输入标题" />
            </el-form-item>
            <el-form-item label="分类" prop="knowledgeCategory">
              <el-input v-model="form.knowledgeCategory" placeholder="请输入分类" />
            </el-form-item>
            <el-form-item label="来源" prop="knowledgeSource">
              <el-input v-model="form.knowledgeSource" placeholder="请输入来源" />
            </el-form-item>
            <el-form-item label="封面图路径" prop="knowledgeCoverImg">
              <el-input v-model="form.knowledgeCoverImg" placeholder="请输入封面图 URL" />
            </el-form-item>
            <el-form-item label="是否置顶" prop="knowledgeIsTop">
              <el-select v-model="form.knowledgeIsTop" placeholder="请选择">
                <el-option label="是" value="true" />
                <el-option label="否" value="false" />
              </el-select>
            </el-form-item>
            <el-form-item label="内容" prop="knowledgeContent">
              <el-input
                type="textarea"
                :rows="6"
                v-model="form.knowledgeContent"
                placeholder="请输入知识内容"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="agri-btn-submit" @click="submitForm">
                提交
              </el-button>
              <el-button class="agri-btn-reset" @click="resetForm"> 重置 </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import ExpertSideBar from "@/components/ExpertSideBar.vue";
  import { ref } from "vue";
  import { ElMessage } from "element-plus";
  import { addKnowledge } from "@/api/knowledge";
  import { jwtDecode } from "jwt-decode";
  
  const token = localStorage.getItem("token");
  const payload = jwtDecode(token);
  const userUuid = payload.uuid;
  
  const formRef = ref();
  
  const form = ref({
    knowledgeTitle: "",
    knowledgeCategory: "",
    knowledgeSource: "",
    knowledgeCoverImg: "",
    knowledgeIsTop: "false",
    knowledgeContent: "",
  });
  
  const rules = {
    knowledgeTitle: [{ required: true, message: "请输入标题", trigger: "blur" }],
    knowledgeContent: [{ required: true, message: "请输入内容", trigger: "blur" }],
  };
  
  const submitForm = () => {
    formRef.value.validate(async (valid) => {
      if (!valid) return;
      const payload = {
        ...form.value,
        knowledgeAuthorUuid: userUuid,
        knowledgeViews: 0,
        knowledgeLikes: 0,
        knowledgeStatus: "published",
      };
      const res = await addKnowledge(payload);
      if (res.code === 200) {
        ElMessage.success("发布成功");
        resetForm();
      } else {
        ElMessage.error("发布失败");
      }
    });
  };
  
  const resetForm = () => {
    formRef.value.resetFields();
  };
  </script>
  
  <style scoped>
  /* 整体布局 */
  .agri-knowledge-layout {
    display: flex;
    width: 100%;
    min-height: 100vh;
    background: linear-gradient(135deg, #f8faf7 0%, #e8f5e9 100%);
  }
  
  /* 卡片样式 */
  .agri-knowledge-card {
    width: 100%;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(94, 141, 94, 0.12);
    border: none;
    background: rgba(255, 255, 255, 0.96);
    overflow: hidden;
    transition: all 0.3s ease;
  }
  
  .agri-knowledge-card:hover {
    box-shadow: 0 10px 40px rgba(94, 141, 94, 0.18);
  }
  
  .agri-card-header {
    background: linear-gradient(90deg, #388e3c 0%, #8bc34a 100%);
    color: white;
    padding: 20px 28px;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
  }
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .agri-card-header h2 {
    margin: 0;
    font-size: 22px;
    font-weight: 600;
    display: flex;
    align-items: center;
  }
  
  .icon-book {
    display: inline-block;
    width: 24px;
    height: 24px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z'%3E%3C/path%3E%3C/svg%3E");
    background-repeat: no-repeat;
    margin-right: 12px;
  }
  
  .agri-icon-group {
    display: flex;
    gap: 12px;
  }
  
  .icon-plant,
  .icon-tractor {
    width: 28px;
    height: 28px;
    background-size: contain;
    background-repeat: no-repeat;
  }
  
  .icon-plant {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M17.8 2.8C16 2.09 13.86 2 12 2s-4 .09-5.8.8C3.53 3.84 2 6.05 2 8.86V22h20V8.86c0-2.81-1.53-5.02-4.2-6.06zM9.17 20l1.5-1.5h2.66l1.5 1.5H9.17zm-2.16-6V9h10v5h-10zm9.49 2c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1zm-6 0c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1z'%3E%3C/path%3E%3C/svg%3E");
  }
  
  .icon-tractor {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M5 15v-2c1.1 0 2-.9 2-2V7h3c.55 0 1-.45 1-1s-.45-1-1-1H5v-.18C6.99 3.66 9.29 3 12 3s5 .66 7 1.82V17c0 2.21-1.79 4-4 4h-2.88c-1.57-1.72-3.95-2.83-6.62-3.03V15H5zm13 2c1.1 0 2-.9 2-2V5h-2v12h2z'%3E%3C/path%3E%3C/svg%3E");
  }
  
  /* 表单容器 */
  .form-container {
    padding: 24px 32px;
  }
  
  /* 表单样式 */
  .agri-knowledge-form {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .form-item {
    margin-bottom: 24px;
  }
  
  /* 输入框样式 */
  :deep(.agri-input .el-input__wrapper) {
    border-radius: 8px;
    box-shadow: 0 0 0 1px #c8e6c9 inset;
    background-color: #f8fffa;
    transition: all 0.3s ease;
  }
  
  :deep(.agri-input .el-input__wrapper:hover) {
    box-shadow: 0 0 0 1px #81c784 inset;
  }
  
  :deep(.agri-input .el-input__wrapper.is-focus) {
    box-shadow: 0 0 0 1px #4caf50 inset !important;
  }
  
  /* 下拉选择框 */
  :deep(.agri-select .el-input__wrapper) {
    border-radius: 8px;
    box-shadow: 0 0 0 1px #c8e6c9 inset;
    background-color: #f8fffa;
  }
  
  :deep(.agri-select .el-input__wrapper:hover) {
    box-shadow: 0 0 0 1px #81c784 inset;
  }
  
  /* 文本域样式 */
  :deep(.agri-textarea .el-textarea__inner) {
    border-radius: 8px;
    border: 1px solid #c8e6c9;
    background-color: #f8fffa;
    transition: all 0.3s ease;
    box-shadow: none;
    padding: 12px;
  }
  
  :deep(.agri-textarea .el-textarea__inner:hover) {
    border-color: #81c784;
  }
  
  :deep(.agri-textarea .el-textarea__inner:focus) {
    border-color: #4caf50;
    box-shadow: 0 0 0 1px #4caf50 inset;
  }
  
  /* 按钮样式 */
  .form-actions {
    margin-top: 32px;
    display: flex;
    justify-content: center;
    gap: 20px;
  }
  
  .agri-btn {
    border-radius: 8px !important;
    font-weight: 500 !important;
    letter-spacing: 1px;
    padding: 12px 24px !important;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.12) !important;
    border: none !important;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 120px;
  }
  
  .agri-btn i {
    margin-right: 8px;
    font-size: 16px;
  }
  
  .agri-btn-submit {
    width: 70px;
    height: 40px;
    background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%) !important;
    color: white !important;
  }
  
  .agri-btn-submit:hover:not(.is-disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(76, 175, 80, 0.25) !important;
  }
  
  .agri-btn-reset {
    width: 70px;
    height: 40px;
    background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%) !important;
    color: #616161 !important;
  }
  
  .agri-btn-reset:hover:not(.is-disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1) !important;
  }
  
  .icon-send {
    display: inline-block;
    width: 16px;
    height: 16px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M2.01 21L23 12 2.01 3 2 10l15 2-15 2z'%3E%3C/path%3E%3C/svg%3E");
    background-repeat: no-repeat;
  }
  
  .icon-reset {
    display: inline-block;
    width: 16px;
    height: 16px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23616161'%3E%3Cpath d='M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z'%3E%3C/path%3E%3C/svg%3E");
    background-repeat: no-repeat;
  }
  
  /* 响应式调整 */
  @media (max-width: 768px) {
    .agri-knowledge-layout {
      flex-direction: column;
    }
  
    .sidebar {
      margin-right: 0;
      margin-bottom: 20px;
      width: 100%;
    }
  
    .form-container {
      padding: 16px;
    }
  
    :deep(.el-form-item__label) {
      text-align: left !important;
    }
  
    .form-actions {
      flex-direction: column;
      gap: 12px;
    }
  
    .agri-btn {
      width: 100%;
    }
  }
  
  .agri-btn-submit {
    background-color: #4caf50;
    border-color: #45a049;
    color: white;
    font-weight: 500;
    transition: all 0.3s;
  }
  
  .agri-btn-submit:hover {
    background-color: #45a049;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .agri-btn-submit:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .agri-btn-reset {
    background-color: #f8f9fa;
    border-color: #ddd;
    color: #555;
    font-weight: 500;
    transition: all 0.3s;
  }
  
  .agri-btn-reset:hover {
    background-color: #e9ecef;
    border-color: #ccc;
    color: #333;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .agri-btn-reset:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  </style>
  