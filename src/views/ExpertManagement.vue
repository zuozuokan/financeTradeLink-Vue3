<template>
    <div class="expert-profile-container">
      <ExpertSideBar />
      
      <div class="profile-content">
        <div class="profile-header">
          <h2 class="profile-title">专家信息管理</h2>
          <div class="profile-subtitle">管理您的专家资料和资质信息</div>
        </div>
  
        <el-card class="profile-card" shadow="hover">
          <!-- 无专家信息时的强制填写提示 -->
          <div v-if="!hasExpertInfo" class="no-info-warning">
            <el-alert
              title="请完善专家信息"
              type="warning"
              description="您尚未填写专家信息，请完善以下信息以启用全部功能。"
              :closable="false"
              show-icon
            />
          </div>
  
          <el-tabs v-model="activeTab" class="profile-tabs">
            <!-- 基本信息 -->
            <el-tab-pane label="专家信息" name="expertInfo">
              <div class="form-section">
                <h3 class="form-section-title">专家资料</h3>
                
                <!-- 紧凑布局容器 -->
                <div class="compact-form-container">
                  <el-form
                    :model="expertForm"
                    :rules="expertRules"
                    ref="expertFormRef"
                    label-position="top"
                    class="profile-form compact-form"
                    :disabled="!isEditMode"
                  >
                    <!-- 基本信息分组 -->
                    <div class="form-group-wrapper">
                      <!-- 头像和基本字段组合 -->
                      <div class="avatar-fields-group">
                        <!-- 头像上传 -->
                        <el-form-item label="专家头像" prop="expertHeadshot" class="compact-form-item">
                          <el-upload
                            class="avatar-uploader"
                            :auto-upload="false"
                            :show-file-list="false"
                            :on-change="handleHeadshotChange"
                            :disabled="!isEditMode"
                          >
                            <img
                              v-if="expertForm.expertHeadshot"
                              :src="expertForm.expertHeadshot"
                              class="avatar"
                            />
                            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                          </el-upload>
                        </el-form-item>
                        
                        <!-- 职称和擅长领域组合 -->
                        <div class="basic-fields">
                          <!-- 职称 -->
                          <el-form-item label="专家职称" prop="expertTitle" class="compact-form-item">
                            <el-input
                              v-model="expertForm.expertTitle"
                              placeholder="请输入专家职称"
                              class="custom-input"
                            />
                          </el-form-item>
                          
                          <!-- 擅长领域 -->
                          <el-form-item label="擅长领域" prop="expertSpecialty" class="compact-form-item">
                            <el-input
                              v-model="expertForm.expertSpecialty"
                              placeholder="如：人工智能,数据分析"
                              class="custom-input"
                            />
                          </el-form-item>
                        </div>
                      </div>
                      
                      <!-- 简介 - 保持独立但更紧凑 -->
                      <el-form-item label="专家简介" prop="expertIntroduction" class="compact-form-item introduction-item">
                        <el-input
                          v-model="expertForm.expertIntroduction"
                          type="textarea"
                          :rows="4"
                          placeholder="请输入专家简介"
                          class="custom-input introduction-textarea"
                        />
                      </el-form-item>
                      
                      <!-- 资质证书 -->
                      <el-form-item label="资质证书" prop="expertCertificate" class="compact-form-item certificate-item">
                        <el-upload
                          class="certificate-uploader"
                          :auto-upload="false"
                          :show-file-list="false"
                          :on-change="handleCertificateChange"
                          :disabled="!isEditMode"
                        >
                          <img
                            v-if="expertForm.expertCertificate"
                            :src="expertForm.expertCertificate"
                            class="certificate"
                          />
                          <el-icon v-else class="certificate-uploader-icon"><Plus /></el-icon>
                        </el-upload>
                      </el-form-item>
                    </div>
                  </el-form>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
  
          <!-- 操作按钮 -->
          <div class="form-actions">
            <el-button
              v-if="!isEditMode"
              type="primary"
              @click="enableEditMode"
              class="edit-button"
            >
              <span class="button-icon">✏️</span>
              编辑信息
            </el-button>
            <el-button
              v-if="isEditMode"
              type="primary"
              @click="submitExpertInfo"
              class="save-button"
            >
              <span class="button-icon">💾</span>
              保存修改
            </el-button>
            <el-button
              v-if="isEditMode"
              @click="cancelEdit"
              class="cancel-button"
            >
              取消
            </el-button>
          </div>
        </el-card>
      </div>
    </div>
  </template>
  
  <script setup>
  // 脚本部分保持不变，仅布局优化
  import { ref, onMounted } from "vue";
  import { ElMessage, ElIcon } from "element-plus";
  import { Plus } from "@element-plus/icons-vue";
  import ExpertSideBar from "@/components/ExpertSideBar.vue";
  import { jwtDecode } from "jwt-decode";
  import {
    getExpertInfoAPI,
    addExpertAPI,
    updateExpertInfoAPI,
    updateExpertHeadshotAPI,
    updateExpertCertificateAPI,
  } from "@/api/expert";
  
  // 解析 token 获取用户 UUID 和角色
  const token = localStorage.getItem("token");
  const payload = jwtDecode(token);
  const uuid = payload.uuid;
  const role = payload.role;
  
  // 状态管理
  const activeTab = ref("expertInfo");
  const hasExpertInfo = ref(false);
  const isEditMode = ref(false);
  const expertFormRef = ref(null);
  
  // 表单数据
  const expertForm = ref({
    expertUuid: "",
    expertTitle: "",
    expertSpecialty: "",
    expertIntroduction: "",
    expertHeadshot: "",
    expertCertificate: "",
  });
  
  // 临时存储上传的文件
  const headshotFile = ref(null);
  const certificateFile = ref(null);
  
  // 表单验证规则
  const expertRules = ref({
    expertTitle: [
      { required: true, message: "专家职称不能为空", trigger: "blur" },
    ],
    expertSpecialty: [
      { required: true, message: "擅长领域不能为空", trigger: "blur" },
    ],
    expertIntroduction: [
      { required: true, message: "专家简介不能为空", trigger: "blur" },
    ],
  });
  
  // 获取专家信息
  const fetchExpertInfo = async () => {
    try {
      const reply = await getExpertInfoAPI(uuid);
      if (reply.code === 200 && reply.results) {
        hasExpertInfo.value = true;
        expertForm.value = {
          expertUuid: reply.results.expertUuid,
          expertTitle: reply.results.expertTitle,
          expertSpecialty: reply.results.expertSpecialty,
          expertIntroduction: reply.results.expertIntroduction,
          expertHeadshot: reply.results.expertHeadshot,
          expertCertificate: reply.results.expertCertificate,
        };
      } else {
        hasExpertInfo.value = false;
        isEditMode.value = true; // 无信息时强制进入编辑模式
        ElMessage.warning("请完善您的专家信息");
      }
    } catch (error) {
      ElMessage.error("获取专家信息失败");
    }
  };
  
  // 启用编辑模式
  const enableEditMode = () => {
    isEditMode.value = true;
  };
  
  // 取消编辑
  const cancelEdit = () => {
    isEditMode.value = false;
    fetchExpertInfo(); // 恢复原始数据
  };
  
  // 处理头像上传
  const handleHeadshotChange = (file) => {
    headshotFile.value = file.raw;
    expertForm.value.expertHeadshot = URL.createObjectURL(file.raw);
  };
  
  // 处理证书上传
  const handleCertificateChange = (file) => {
    certificateFile.value = file.raw;
    expertForm.value.expertCertificate = URL.createObjectURL(file.raw);
  };
  
  // 提交专家信息
  const submitExpertInfo = async () => {
    await expertFormRef.value.validate(async (valid) => {
      if (!valid) {
        ElMessage.error("请填写所有必填字段");
        return;
      }
  
      try {
        if (hasExpertInfo.value) {
          // 更新逻辑
          // 1. 更新基本信息
          const expertData = {
            expertTitle: expertForm.value.expertTitle,
            expertSpecialty: expertForm.value.expertSpecialty,
            expertIntroduction: expertForm.value.expertIntroduction,
          };
          const updateReply = await updateExpertInfoAPI(expertForm.value.expertUuid, expertData);
          if (updateReply.code !== 200) {
            ElMessage.error("更新专家信息失败: " + updateReply.results);
            return;
          }
  
          // 2. 单独更新头像（如果有新上传）
          if (headshotFile.value) {
            const headshotReply = await updateExpertHeadshotAPI(
              expertForm.value.expertUuid,
              headshotFile.value
            );
            if (headshotReply.code === 200) {
              expertForm.value.expertHeadshot = headshotReply.results.url;
              ElMessage.success("头像更新成功");
            } else {
              ElMessage.error("头像更新失败: " + headshotReply.results);
              return;
            }
          }
  
          // 3. 单独更新证书（如果有新上传）
          if (certificateFile.value) {
            const certificateReply = await updateExpertCertificateAPI(
              expertForm.value.expertUuid,
              certificateFile.value
            );
            if (certificateReply.code === 200) {
              expertForm.value.expertCertificate = certificateReply.results.url;
              ElMessage.success("证书更新成功");
            } else {
              ElMessage.error("证书更新失败: " + certificateReply.results);
              return;
            }
          }
  
          ElMessage.success("专家信息更新成功");
        } else {
          // 新增逻辑
          const expertData = {
            expertTitle: expertForm.value.expertTitle,
            expertSpecialty: expertForm.value.expertSpecialty,
            expertIntroduction: expertForm.value.expertIntroduction,
          };
  
          const addReply = await addExpertAPI(
            uuid,
            headshotFile.value || null, // 允许空文件，后端处理
            certificateFile.value || null, // 允许空文件，后端处理
            expertData
          );
  
          if (addReply.code === 200) {
            ElMessage.success("专家信息添加成功");
            hasExpertInfo.value = true;
            expertForm.value.expertUuid = addReply.results.expertUuid; // 假设后端返回新创建的 expertUuid
            expertForm.value.expertHeadshot = addReply.results.expertHeadshot || "";
            expertForm.value.expertCertificate = addReply.results.expertCertificate || "";
          } else {
            ElMessage.error("添加专家信息失败: " + addReply.results);
            return;
          }
        }
  
        isEditMode.value = false;
        headshotFile.value = null; // 清空临时文件
        certificateFile.value = null;
        fetchExpertInfo(); // 刷新数据
      } catch (error) {
        ElMessage.error(hasExpertInfo.value ? "更新专家信息失败" : "添加专家信息失败");
      }
    });
  };
  
  // 组件挂载时获取专家信息
  onMounted(() => {
    if (role === "EXPERT") {
      fetchExpertInfo();
    } else {
      ElMessage.error("无权限访问专家信息管理");
    }
  });
  </script>
  
  <style scoped lang="scss">
  .expert-profile-container {
    display: flex;
    min-height: 100vh;
    background-color: #f5f7fa;
  }
  
  .profile-content {
    flex: 1;
    padding: 2rem;
    max-width: 900px;
    margin: 0 auto;
  }
  
  .profile-header {
    margin-bottom: 2rem;
    text-align: center;
  }
  
  .profile-title {
    font-size: 2rem;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 0.5rem;
    background: linear-gradient(90deg, #409eff, #67c23a);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  
  .profile-subtitle {
    font-size: 1rem;
    color: #7a8ba9;
  }
  
  .profile-card {
    border-radius: 12px;
    border: none;
    overflow: hidden;
    transition: all 0.3s ease;
  
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }
  }
  
  .no-info-warning {
    margin: 1rem 2rem;
  }
  
  .profile-tabs {
    :deep(.el-tabs__nav-wrap) {
      padding: 0 2rem;
    }
  
    :deep(.el-tabs__item) {
      font-weight: 500;
      padding: 0 1.5rem;
      height: 50px;
      color: #7a8ba9;
  
      &.is-active {
        color: #409eff;
      }
    }
  
    :deep(.el-tabs__active-bar) {
      height: 3px;
      background: linear-gradient(90deg, #409eff, #67c23a);
    }
  }
  
  .form-section {
    padding: 1.5rem 2rem;
  }
  
  .form-section-title {
    font-size: 1.2rem;
    font-weight: 500;
    color: #2c3e50;
    margin-bottom: 1.5rem;
    position: relative;
    padding-left: 1rem;
  
    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      height: 60%;
      width: 4px;
      background: linear-gradient(to bottom, #409eff, #67c23a);
      border-radius: 2px;
    }
  }
  
  /* 紧凑布局样式 */
  .compact-form-container {
    .compact-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem; /* 控制整体间距 */
    }
    
    .form-group-wrapper {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .avatar-fields-group {
      display: flex;
      gap: 1.5rem;
      align-items: flex-start;
      
      @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;
      }
    }
    
    .basic-fields {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .compact-form-item {
      margin-bottom: 0; /* 移除默认的底部间距 */
    }
    
    .introduction-item {
      margin-top: 0.5rem;
      
      .introduction-textarea {
        min-height: 120px;
        resize: vertical;
      }
    }
    
    .certificate-item {
      margin-top: 0.5rem;
    }
    
    :deep(.el-form-item__label) {
      font-weight: 500;
      font-size: 0.9rem;
      margin-bottom: 6px;
      color: #5a6c87;
    }
  }
  
  .avatar-uploader .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #f0f2f5;
  }
  
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    border: 1px dashed #d9d9d9;
    border-radius: 50%;
    transition: border-color 0.3s;
    
    &:hover {
      border-color: #409eff;
    }
  }
  
  .certificate-uploader .certificate {
    max-width: 200px;
    height: 120px;
    object-fit: contain;
    border: 1px solid #f0f2f5;
    border-radius: 6px;
  }
  
  .certificate-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 200px;
    height: 120px;
    line-height: 120px;
    text-align: center;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    transition: border-color 0.3s;
    
    &:hover {
      border-color: #409eff;
    }
  }
  
  .custom-input {
    :deep(.el-input__inner),
    :deep(.el-textarea__inner) {
      border-radius: 8px;
      height: 44px;
      transition: all 0.3s;
      padding: 0 12px;
  
      &:focus {
        border-color: #409eff;
        box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
      }
    }
    
    :deep(.el-textarea__inner) {
      height: auto;
      min-height: 120px;
      padding: 12px;
      line-height: 1.5;
    }
  }
  
  .form-actions {
    display: flex;
    justify-content: center;
    padding: 1.5rem 0;
    border-top: 1px solid #f0f2f5;
    gap: 1rem;
  }
  
  .edit-button,
  .save-button,
  .cancel-button {
    padding: 0.8rem 2rem;
    font-size: 1rem;
    font-weight: 500;
    border-radius: 8px;
    transition: all 0.3s;
  
    &.edit-button,
    &.save-button {
      background: linear-gradient(90deg, #409eff, #67c23a);
      border: none;
      color: white;
  
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(64, 158, 255, 0.3);
      }
    }
  
    &.cancel-button {
      border-color: #dcdcdc;
      color: #5a6c87;
  
      &:hover {
        border-color: #409eff;
        color: #409eff;
      }
    }
  
    .button-icon {
      margin-right: 0.5rem;
    }
  }
  </style>