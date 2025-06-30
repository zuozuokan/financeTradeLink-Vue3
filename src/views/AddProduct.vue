<template>
  <div id="content" class="farm-theme">
    <UserManageSideBar />
    <el-card class="publish-card">
      <template #header>
        <div class="card-header">
          <svg-icon icon-class="wheat" class="header-icon" />
          <span class="header-title">发布农产品</span>
          <div class="header-divider"></div>
        </div>
      </template>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px" class="nature-form">
        <!-- 上传图片区域 -->
        <div class="upload-container">
          <div class="upload-label">上传商品展示图</div>
          <div class="upload-area">
            <el-upload
              :auto-upload="true"
              :show-file-list="false"
              :http-request="uploadPicture"
              accept="image/*"
              @change="handleFileChange"
            >
              <el-button type="primary" :loading="isUploading" class="upload-btn">
                <svg-icon icon-class="upload" v-if="!isUploading" />
                {{ isUploading ? '上传中...' : '选择图片' }}
              </el-button>
            </el-upload>
            <div v-if="isUploading" class="upload-tip">图片上传中，请稍候...</div>
            <div class="preview-box">
              <el-image
                v-if="previewImageUrl"
                :src="previewImageUrl"
                class="preview-image"
                :preview-src-list="[previewImageUrl]"
              />
              <div class="upload-placeholder" v-else>
                <svg-icon icon-class="image" class="placeholder-icon" />
                <span>预览图</span>
              </div>
              <div v-if="form.productImageUrl" class="upload-success">✓ 图片已上传</div>
            </div>
          </div>
        </div>

        <div class="form-grid">
          <el-form-item label="商品名称" prop="productName" class="highlight-item">
            <el-input 
              v-model="form.productName" 
              placeholder="如：有机红富士苹果" 
              class="nature-input"
            />
            <svg-icon icon-class="apple" class="input-icon" />
          </el-form-item>

          <el-form-item label="分类" prop="productCategory">
            <el-select 
              v-model="form.productCategory" 
              placeholder="请选择分类"
              class="nature-select"
            >
              <el-option label="水果" value="水果" class="nature-option">
                <svg-icon icon-class="fruit" />
                <span>水果</span>
              </el-option>
              <el-option label="蔬菜" value="蔬菜" class="nature-option">
                <svg-icon icon-class="vegetable" />
                <span>蔬菜</span>
              </el-option>
              <el-option label="粮食" value="粮食" class="nature-option">
                <svg-icon icon-class="grain" />
                <span>粮食</span>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="单价 (¥)" prop="productPrice" class="highlight-item">
            <el-input-number 
              v-model="form.productPrice" 
              :min="0" 
              :precision="2"
              class="price-input"
            />
          </el-form-item>

          <el-form-item label="库存 (件)" prop="productStock">
            <el-input-number 
              v-model="form.productStock" 
              :min="0" 
              class="stock-input"
            />
          </el-form-item>
        </div>

        <el-form-item label="商品描述" prop="productDescription">
          <el-input 
            v-model="form.productDescription" 
            type="textarea" 
            :autosize="{ minRows: 3, maxRows: 6 }"
            placeholder="请详细描述产品特点、产地信息等..."
            class="nature-textarea"
          />
        </el-form-item>

        <el-form-item class="form-buttons">
          <el-button 
            type="success" 
            @click="submitProduct"
            class="publish-btn"
          >
            <svg-icon icon-class="publish" />
            <span>发布商品</span>
          </el-button>
          <el-button 
            @click="resetForm"
            class="reset-btn"
          >
            <svg-icon icon-class="reset" />
            <span>重置表单</span>
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>


<script setup>
import UserManageSideBar from "@/components/UserManageSideBar.vue";
import { ref, reactive } from "vue";
import { ElMessage, ElImageViewer } from "element-plus";
import { jwtDecode } from "jwt-decode";
import { addProductAPI, addProductPictureAPI } from "@/api/product";

const token = localStorage.getItem("token");  
const payload = jwtDecode(token);
const userUuid = payload.uuid;

const formRef = ref();
const form = reactive({
  productName: "",
  productCategory: "",
  productPrice: 0,
  productStock: 0,
  productDescription: "",
  productImageUrl: "",
  productUserUuid: userUuid,
});

// 图片上传相关状态
const previewImageUrl = ref("");
const isUploading = ref(false);

const rules = {
  productName: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
  productCategory: [{ required: true, message: "请选择分类", trigger: "change" }],
  productPrice: [{ required: true, message: "请输入价格", trigger: "blur" }],
  productStock: [{ required: true, message: "请输入库存", trigger: "blur" }],
  productDescription: [{ required: true, message: "请输入描述", trigger: "blur" }],
};

// 图片上传方法
const uploadPicture = async ({ file }) => {
  isUploading.value = true;
  try {
    // 原始文件名（带扩展名）
    const originalFileName = file.name; 
    // 去除扩展名后的文件名（保留最后一个点之前的部分）
    const fileNameWithoutExt = originalFileName.split('.').slice(0, -1).join('.') + generateRandomString(); // 添加随机字符串
    const reply = await addProductPictureAPI(file,fileNameWithoutExt);
    console.log("图片上传回复：", reply);
    if (reply.code === 200) {
      form.productImageUrl = reply.results;
      ElMessage.success("图片上传成功！");
    } else {
      ElMessage.error(reply.results || "图片上传失败");
    }
  } catch (error) {
    ElMessage.error("图片上传异常：" + error.message);
  } finally {
    isUploading.value = false;
  }
};


// 提交产品表单
const submitProduct = async () => {
  try {
    console.log("提交的表单数据：", form);
    const reply = await addProductAPI(userUuid, form);
    if (reply.code === 200) {
      ElMessage.success("商品发布成功！");
      resetForm();
    } else {
      ElMessage.error(reply.message || "发布失败，请稍后重试");
    }
  } catch (error) {
    console.error("表单验证失败", error);
  }
};

// 重置表单
const resetForm = () => {
  formRef.value.resetFields();
  form.productImageUrl = "";
  previewImageUrl.value = "";
  isUploading.value = false;
};

// 生成五位随机字符串
function generateRandomString() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

</script>

<style scoped>
.upload-tip {
  color: #e6a23c;
  font-size: 12px;
  margin-top: 5px;
}
.upload-success {
  color: #67c23a;
  font-size: 12px;
  margin-top: 5px;
}

#content {
  display: flex;
}

/* 整体主题 */
.farm-theme {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7f0 0%, #e8f5e9 100%);
}

/* 卡片样式 */
.publish-card {
  width: 95%;
  max-width: 800px;
  margin: 20px auto;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(94, 138, 94, 0.15);
  border: none;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
}

/* 卡片头部 */
.card-header {
  display: flex;
  align-items: center;
  padding: 0 0 12px;
  position: relative;
}

.header-icon {
  color: #5E8A5E;
  font-size: 24px;
  margin-right: 12px;
}

.header-title {
  font-size: 22px;
  font-weight: 600;
  color: #3c763d;
  letter-spacing: 0.5px;
}

.header-divider {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, rgba(139,195,74,0.3) 0%, rgba(76,175,80,0.6) 50%, rgba(139,195,74,0.3) 100%);
}

/* 表单整体样式 */
.nature-form {
  padding: 25px 30px 15px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin: 20px 0;
}

/* 上传区域样式 */
.upload-container {
  margin-bottom: 25px;
  padding: 20px;
  background: rgba(240, 248, 236, 0.5);
  border-radius: 12px;
  border: 1px dashed #c8e6c9;
}

.upload-label {
  font-size: 14px;
  color: #5E8A5E;
  margin-bottom: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.upload-area {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.upload-btn {
  background: linear-gradient(to right, #5E8A5E, #81C784);
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  transition: all 0.3s;
  box-shadow: 0 3px 10px rgba(94, 138, 94, 0.2);
}

.upload-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(94, 138, 94, 0.3);
}

.upload-tip {
  color: #e6a23c;
  font-size: 13px;
  margin-top: 8px;
}

.preview-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 180px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid #e8f5e9;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #a5d6a7;
  font-size: 14px;
}

.placeholder-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.preview-image {
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}

.preview-image:hover {
  transform: scale(1.02);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.upload-success {
  color: #5E8A5E;
  font-size: 13px;
  font-weight: 500;
  margin-top: 12px;
  background: rgba(129, 199, 132, 0.15);
  padding: 4px 12px;
  border-radius: 16px;
}

/* 输入字段样式 */
.nature-input, .nature-select, .nature-textarea {
  border-radius: 8px;
  transition: all 0.3s;
  border: 1px solid #e0f2e0;
}

.nature-input:hover, .nature-select:hover, .nature-textarea:hover {
  border-color: #a5d6a7;
  box-shadow: 0 0 0 2px rgba(129, 199, 132, 0.2);
}

.nature-input:focus, .nature-select:focus, .nature-textarea:focus {
  border-color: #66bb6a;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.25);
}

.highlight-item {
  position: relative;
}

.input-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #a5d6a7;
  font-size: 18px;
}

.price-input, .stock-input {
  width: 100%;
}

.price-input :deep(.el-input__inner) {
  text-align: center;
}

/* 按钮样式 */
.form-buttons {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.publish-btn, .reset-btn {
  padding: 12px 32px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
}

.publish-btn {
  background: linear-gradient(to right, #43a047, #2e7d32);
  box-shadow: 0 4px 12px rgba(67, 160, 71, 0.3);
}

.publish-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 7px 15px rgba(67, 160, 71, 0.4);
}

.reset-btn {
  background: linear-gradient(to right, #f5f5f5, #eeeeee);
  color: #757575;
}

.reset-btn:hover {
  background: linear-gradient(to right, #eeeeee, #e0e0e0);
  color: #616161;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .publish-card {
    margin: 10px;
    width: calc(100% - 20px);
  }
}

</style>