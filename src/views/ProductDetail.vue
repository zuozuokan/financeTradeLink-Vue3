<template>
    <div class="product-page">
      <!-- 卡片容器：居中 + 最大宽度控制 -->
      <el-card class="product-card">
        <!-- 图片区域：单独容器实现居中 -->
        <div class="image-wrap">
          <el-image
            :src="product.productImageUrl"
            alt="Product Image"
            fit="contain"
            :preview-src-list="[product.productImageUrl]"
            class="product-img"
          />
        </div>
  
        <!-- 信息区域：和图片区域一起居中 -->
        <div class="info-wrap">
          <h2 class="product-title">{{ product.productName || "产品名称未提供" }}</h2>
          <div class="product-info">
            <p>价格: ¥{{ product.productPrice || "未提供" }}</p>
            <p>描述: {{ product.productDescription || "未提供" }}</p>
            <p>库存: {{ product.productStock || "未提供" }}</p>
            <p>产品状态: {{ product.productStatus || "未提供" }}</p>
            <p>发布时间: {{ formatTime(product.productCreatedTime) }}</p>
          </div>
  
          <!-- 增强版数量选择器 -->
          <div class="quantity-box">
            <el-input-number
              v-model="amount"
              :min="1"
              :max="product.productStock || 1"
              :precision="1" 
              controls-position="right"
              size="large"
              class="custom-number"
              placeholder="请输入数量"
            />
            <div class="price-total">
              总价: 
              <span class="total-price">¥{{ (product.productPrice * amount).toFixed(2) }}</span>
            </div>
            <el-button
              type="primary"
              @click="handlePurchase"
              size="large"
              :disabled="!product.productStock || product.productStock <= 0"
            >
              立即购买
            </el-button>
            <el-button
                type="info"
                @click="deleteProduct(product.productUuid)"
                v-if="role === 'USER' || role === 'ADMIN'"
                size="large"
                >
                下架商品
            </el-button>
            <el-button
            type="info"
            @click="handleOpenEditDialog(product)"
            v-if="role === 'USER' || 'ADMIN'"
            size="large"
          >
            修改商品
          </el-button>
          </div>
        </div>
      </el-card>


          <!-- 修改商品弹窗 -->
    <el-dialog
      v-model="isEditDialogVisible"
      title="修改商品信息"
      width="600px"
      :before-close="handleCloseEditDialog"
    >
      <el-form
        :model="editForm"
        label-width="100px"
        class="edit-form"
      >
        <el-form-item label="商品名称">
          <el-input v-model="editForm.productName" placeholder="请输入商品名称" />
        </el-form-item>

        <el-form-item label="商品价格">
          <el-input-number
            v-model="editForm.productPrice"
            :min="0"
            precision="2"
            placeholder="请输入价格"
          />
        </el-form-item>

        <el-form-item label="商品描述">
          <el-input
            v-model="editForm.productDescription"
            type="textarea"
            rows="3"
            placeholder="请输入商品描述"
          />
        </el-form-item>

        <el-form-item label="库存">
          <el-input-number
            v-model="editForm.productStock"
            :min="0"
            placeholder="请输入库存数量"
          />
        </el-form-item>

        <el-form-item label="商品状态">
          <el-select v-model="editForm.productStatus" placeholder="请选择状态">
            <el-option label="在售" value="ON_SALE" />
            <el-option label="下架" value="OFF_SALE" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="handleCloseEditDialog">取消</el-button>
        <el-button type="primary" @click="handleSaveEdit">确认修改</el-button>
      </template>
    </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from "vue";
  import { useRoute } from "vue-router";
  import { getProductDetailAPI, purchaseProductAPI,deleteProductAPI, updateProductAPI } from "../api/product";
  import { ElMessage, ElImage, ElInputNumber, ElButton , ElDialog, ElForm, ElFormItem, ElInput, ElSelect, ElOption,  ElMessageBox } from "element-plus";
 
  import dayjs from "dayjs";
  import utc from "dayjs/plugin/utc";
  import { jwtDecode } from 'jwt-decode';
  dayjs.extend(utc);
  
  // 响应式数据
  const product = ref({});
  const amount = ref(1);
  
  // 路由参数
  const route = useRoute();
    // 从 token 获取用户信息
    const token = localStorage.getItem('token');
  const payload = jwtDecode(token);
  const userUuid = payload.uuid;
  const role = payload.role;


  // 时间格式化
  const formatTime = (time) => {
    if (!time) return "未提供";
    return dayjs.utc(time).local().format("YYYY-MM-DD HH:mm:ss");
  };
  const isSaving = ref(false);
  //修改使用
  // 控制修改弹窗显示
const isEditDialogVisible = ref(false);
// 表单数据（基于原有 product 结构初始化）
const editForm = ref({
  productUuid: route.params.productUuid, // 假设有 UUID 字段
  productName: "",
  productPrice: 0,
  productDescription: "",
  productStock: 0,
  productStatus: "" // 假设状态为枚举值（如 'ON_SALE'/'OFF_SALE'）
});


// 打开修改弹窗
const handleOpenEditDialog = (item) => {
  // 直接复制当前商品的所有属性到表单（包括图片、价格、库存等）
  editForm.value = { 
    productUuid: item.productUuid, // 确保有 UUID 字段
    productName: item.productName,
    productPrice: item.productPrice,
    productDescription: item.productDescription,
    productStock: item.productStock,
    productStatus: item.productStatus,
    // 如有其他字段（如图片 URL）也需复制
    productImageUrl: item.productImageUrl 
  };
  isEditDialogVisible.value = true;
};

// 关闭修改弹窗（带确认逻辑）
const handleCloseEditDialog = () => {
  if (isSaving.value) {
    isSaving.value = false;
    isEditDialogVisible.value = false;
    return;
  }

  // 检查表单是否有修改（简化版比较，实际项目建议用深比较）
  const hasChanges = Object.keys(editForm.value).some(key => {
    return editForm.value[key] !== product.value[key];
  });

  if (hasChanges) {
    ElMessageBox.confirm(
      "修改尚未保存，是否确认退出？",
      "提示",
      {
        confirmButtonText: "确认保存并修改",
        cancelButtonText: "放弃修改",
        type: "warning"
      }
    )
      .then(() => handleSaveEdit())
      .catch(() => isEditDialogVisible.value = false);
  } else {
    isEditDialogVisible.value = false;
  }
};

// 保存修改
const handleSaveEdit = async () => {
  isSaving.value = true;
  
  try {
    console.log("提交的修改数据：", editForm.value); // 调试输出
    const res = await updateProductAPI(editForm.value);
    
    if (res.data.code === 200) {
      ElMessage.success("修改成功！");
      isEditDialogVisible.value = false;
      // 刷新商品详情
      await getProductDetailAPI();
    } else {
      ElMessage.error(`修改失败: ${res.data.results}`);
    }
  } catch (error) {
    console.error("修改失败:", error);
    ElMessage.error("修改时发生错误，请稍后重试");
  } finally {
    isSaving.value = false;
  }
};

  // 购买逻辑
  const handlePurchase = async () => {
    try {
      const res = await purchaseProductAPI(
        product.value.productUuid,
        amount.value,
        // 假设从 localStorage 取用户信息，根据实际情况调整
        userUuid
      );
      if (res.data.code === 200) {
        ElMessage.success("购买成功！");
      } else {
        ElMessage.error(`购买失败: ${res.data.results}`);
      }
    } catch (error) {
      console.error("购买失败:", error);
      ElMessage.error("购买时发生错误，请稍后重试");
    }
  };
  
  // 监听数量变化自动更新总价（可选，Element Plus 已自动绑定）
  watch(amount, (val) => {
    // 实时计算总价，这里可根据需求扩展
  });


  // 删除产品逻辑
  const deleteProduct = async (productUuid) => {
    try {
      const res = await deleteProductAPI(productUuid);
      if (res.data.code === 200) {
        product.value = res.data.results;
        ElMessage.success("商品下架成功");
      } else {
        ElMessage.error("商品下架失败，请稍后重试");
      }
    } catch (error) {
      console.error("下架商品失败:", error);
      ElMessage.error("下架商品时发生错误，请稍后重试");
    }
  };
  
  // 初始化产品详情
  onMounted(async () => {
    const productUuid = route.params.productUuid;
    try {
      const res = await getProductDetailAPI(productUuid);
      if (res.data.code === 200) {
        product.value = res.data.results;
      } else {
        ElMessage.error("无法获取产品详情，请稍后重试");
      }
    } catch (error) {
      console.error("获取产品详情失败:", error);
      ElMessage.error("加载产品详情时发生错误，请稍后重试");
    }
  });



  </script>
  
  <style scoped>
  /* 页面基础布局：让卡片居中 */
  .product-page {
    display: flex;
    justify-content: center;
    padding: 40px 20px;
    background-color: #f9fafb;
  }
  
  /* 卡片样式：限制宽度 + 阴影优化 */
  .product-card {
    width: 100%;
    max-width: 1200px;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center; /* 让内部内容居中 */
  }
  
  /* 图片容器：强制居中 + 背景优化 */
  .image-wrap {
    width: 100%;
    background-color: #fff;
    display: flex;
    justify-content: center;
    padding: 20px 0;
  }
  
  /* 图片样式：自适应 + 最大高度 */
  .product-img {
    max-width: 90%; 
    max-height: 500px;
    border-radius: 8px;
  }
  
  /* 信息容器：居中 + 内边距 */
  .info-wrap {
    width: 100%;
    max-width: 800px;
    padding: 30px;
    text-align: center; /* 文字内容居中 */
  }
  
  /* 标题样式 */
  .product-title {
    font-size: 28px;
    font-weight: 700;
    color: #333;
    margin-bottom: 20px;
  }
  
  /* 产品信息样式 */
  .product-info {
    margin-bottom: 30px;
    line-height: 1.8;
    color: #666;
  }
  
  /* 数量选择器 + 按钮区域 */
  .quantity-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 20px;
  }
  
  /* 增强版数字输入框 */
  .custom-number {
    width: 200px;
  }
  
  /* 总价样式 */
  .price-total {
    font-size: 16px;
    color: #e60012;
    font-weight: 600;
  }
  
  /* 按钮样式优化 */
  .el-button {
    padding: 12px 32px;
    font-size: 16px;
    border-radius: 8px;
  }
  
  /* 响应式适配 */
  @media (max-width: 768px) {
    .product-card {
      flex-direction: column;
    }
    .image-wrap, .info-wrap {
      width: 100%;
    }
  }
  </style>