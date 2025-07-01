<template>
  <div class="product-list" style="position: relative;">
      <!-- 新增商品按钮（右上角） -->
      <el-button
      type="success"
      @click="handleOpenAddDialog"
      v-if="role === 'USER' || role === 'ADMIN'"       
      size="medium"
      style="position: absolute; top: 24px; right: 24px;" 
    >
      新增商品
    </el-button>
    <!-- 分类按钮 -->
    <div class="category-filter">
      <el-button
        v-for="category in categories"
        :key="category"
        @click="filterByCategory(category)"
        :type="selectedCategory === category ? 'primary' : 'default'"
      >
        {{ category }}
      </el-button>
    </div>
    <div>
      <el-row gutter="20">
        <el-col :span="6" v-for="product in products" :key="product.productUuid">
          <!-- 动态绑定卡片样式：根据商品分类 -->
          <el-card
            shadow="hover"
            :style="getCardStyle(product.productCategory)"
            class="product-card"
            @click="goToDetail(product.productUuid)"
          >
            <img
              :src="decodeImage(product.productImageUrl)"
              alt="Product Image"
              class="product-image"
            />
            <div class="product-info">
              <h3>{{ product.productName }}</h3>
              <p>价格: ¥{{ product.productPrice }}</p>
              <p>描述: {{ product.productDescription }}</p>
              <p>库存：{{ product.productStock }}</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <el-dialog
  v-model="isAddDialogVisible"
  title="新增商品"
  width="600px"
  :before-close="handleCloseAddDialog"
>
  <el-form
    :model="addForm"
     :rules="rules"
    label-width="100px"
    class="add-form"
  >
    <el-form-item label="商品名称">
      <el-input v-model="addForm.productName" placeholder="请输入商品名称"  />
    </el-form-item>

    <el-form-item label="商品价格">
      <el-input-number
        v-model="addForm.productPrice"
        :min="0"
        precision="2"
        placeholder="请输入价格"
      />
    </el-form-item>

    <el-form-item label="商品描述">
      <el-input
        v-model="addForm.productDescription"
        type="textarea"
        rows="3"
        placeholder="请输入商品描述"
      />
    </el-form-item>

    <el-form-item label="库存">
      <el-input-number
        v-model="addForm.productStock"
        :min="0"
        placeholder="请输入库存数量"
      />
    </el-form-item>

    <el-form-item label="分类">
      <el-select
        v-model="addForm.productCategory"
        placeholder="请选择分类"
      >
        <el-option label="蔬菜" value="蔬菜" />
        <el-option label="水果" value="水果" />
        <el-option label="家居" value="家居" />
        <el-option label="衣物" value="衣物" />
      </el-select>
    </el-form-item>
    
    <el-form-item label="图片 URL">
      <el-input
        v-model="addForm.productImageUrl"
        placeholder="请输入图片 URL（可选）"
      />
    </el-form-item>


    <!-- 新增图片上传区域 -->
    <el-form-item label="商品图片">
      <!-- 上传组件 -->
      <el-upload
        class="image-uploader"
        :http-request="handleImageUpload"  
        :file-list="fileList"             
        accept="image/*"                         
        :on-remove="handleImageRemove"     
        :disabled="isAdding"              
      >
        <el-button type="primary" :loading="isUploading">
          {{ isUploading ? '上传中...' : '点击上传图片' }}
        </el-button>
      </el-upload>

      <!-- 自定义名称输入框（与后端 customName 对应） -->
      <el-input
        v-model="customName"
        placeholder="输入图片自定义名称（如商品名称）"
        style="margin-top: 8px;"
        :disabled="isAdding"
      />

      <!-- 图片预览 -->
      <div class="image-preview" v-if="addForm.productImageUrl">
        <img :src="addForm.productImageUrl" alt="预览" />
      </div>
    </el-form-item>
  </el-form>

  <template #footer>
    <el-button @click="handleCloseAddDialog">取消</el-button>
    <el-button type="primary" @click="handleSaveAdd">立即新增</el-button>
  </template>
</el-dialog>
</div>

</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getProductListAPI,addProductPictureAPI } from "../api/product"; 
import request from "../util/userRequest"; 
import { jwtDecode } from 'jwt-decode';
import { ElMessageBox, ElMessage } from 'element-plus';
import { addProductAPI } from "../api/product";
const router = useRouter();
    // 从 token 获取用户信息
    const token = localStorage.getItem('token');
  const payload = jwtDecode(token);
  const userUuid = payload.uuid;
  const role = payload.role;
// 上传相关响应式数据
const fileList = ref([]);       // 管理已上传图片
const customName = ref('');     // 图片自定义名称（对应后端 customName）
const isUploading = ref(false); // 上传loading状态
// 分类-颜色映射（可自定义）
const categoryColors = {
  蔬菜: "#81c784",  // 绿色
  水果: "#ffb74d",  // 橙色
  家居: "#4db6ac",  // 青蓝色
  衣物: "#ba68c8",  // 紫色
  全部: "#4dd0e1"   // 主青色（仅按钮用，卡片不用）
};

const allProducts = ref([]); 
const products = ref([]);   
const categories = ref(["蔬菜", "水果", "家居", "衣物", "全部"]); 
const selectedCategory = ref("全部");

const isAddDialogVisible = ref(false);
const isAdding = ref(false);

// 筛选产品逻辑
const filterByCategory = (category) => {
  selectedCategory.value = category;
  if (category === "全部") {
    products.value = allProducts.value;
  } else {
    products.value = allProducts.value.filter(
      (item) => item.productCategory === category
    );
  }
};

// 获取商品列表逻辑
const fetchProductList = async () => {
  try {
    const response = await getProductListAPI(request);
    if (response.data.code === 200) {
      const resultList = response.data.results;
      allProducts.value = resultList; 
      products.value = resultList;
    } else {
      console.error("获取商品列表失败:", response.data.message);
    }
  } catch (error) {
    console.error("请求商品列表出错:", error);
  }
};

onMounted(() => {
  fetchProductList();
});

// 动态设置卡片样式（根据商品分类）
const getCardStyle = (category) => {
  return {
    border: `2px solid ${categoryColors[category] || "#4dd0e1"}`,
    borderRadius: "12px"
  };
};

// 图片解码
const decodeImage = (imageUrl) => {
  return imageUrl;
};

// 跳转详情
const goToDetail = (productUuid) => {
  router.push(`/product/${productUuid}`);
};
const addForm = ref({
  productName: "",
  productPrice: 0,
  productDescription: "",
  productStock: 0,
  productCategory: "蔬菜", // 默认分类
  productImageUrl: "" // 图片 URL（可选）
});


// 打开新增弹窗
const handleOpenAddDialog = () => {
  // 初始化空表单
  addForm.value = {
    productName: "",
    productPrice: 0,
    productDescription: "",
    productStock: 0,
    productCategory: "蔬菜",
    productImageUrl: ""
  };
  isAddDialogVisible.value = true;
};

// 关闭弹窗（带确认逻辑）
const handleCloseAddDialog = () => {
  if (isAdding.value) {
    isAdding.value = false;
    isAddDialogVisible.value = false;
    return;
  }

  // 检查表单是否有未保存内容
  const hasInput = Object.values(addForm.value).some(val => val !== "");
  if (hasInput) {
    ElMessageBox.confirm(
      "表单内容尚未保存，是否确认退出？",
      "提示",
      {
        confirmButtonText: "放弃新增",
        cancelButtonText: "继续编辑",
        type: "warning"
      }
    ).then(() => isAddDialogVisible.value = false);
  } else {
    isAddDialogVisible.value = false;
  }
};

// 保存新增商品
const handleSaveAdd = async () => {
  isAdding.value = true;

  try {
    // 构建请求参数（包含 userUuid 和 product 数据）
    const res = await addProductAPI(userUuid, addForm.value);
    if (res.data.code === 200) {
      ElMessage.success("商品新增成功！");
      isAddDialogVisible.value = false;
      // 刷新商品列表F
      await fetchProductList();
    } else {
      ElMessage.error(`新增失败: ${res.data.message}`);
    }
  } catch (error) {
    console.error("新增商品失败:", error);
    ElMessage.error("新增时发生错误，请稍后重试");
  } finally {
    isAdding.value = false;
  }
};




// 自定义图片上传逻辑
// 上传图片到后端（核心逻辑）
const handleImageUpload = async (uploadReq) => {
  isUploading.value = true;
  console.log('📦 开始上传图片:', uploadReq);
  const file = uploadReq.file; // 获取用户选择的文件
  console.log('📦 准备上传的文件:', file);
  // 校验：必须选择文件和填写自定义名称
  if (!file) {
    ElMessage.warning('请选择要上传的图片');
    isUploading.value = false;

  }
  if (!customName.value.trim()) {
    ElMessage.warning('请输入图片自定义名称');
    isUploading.value = false;
 
  }

  try {
    // 构造 FormData（与后端接口参数对应）
    const formData = new FormData();
    formData.append('file', file);           // 图片文件
    formData.append('customName', customName.value); // 自定义名称
    console.log('📦 待传的文件: file',file);
    console.log('📦 待传的自定义名称: customName',customName.value);
    // 调用后端上传接口（路径与你的 API 保持一致）
    const res = await addProductPictureAPI(file,customName.value); 

    // 处理响应（根据后端返回格式：{ code: 200, results: "图片URL" }）
    if (res.data.code === 200) {
      const imageUrl = res.data.results; 
      addForm.value.productImageUrl = imageUrl; // 回填到表单
      fileList.value = [{ url: imageUrl }];     // 显示预览
      ElMessage.success('图片上传成功！');
    } else {
      ElMessage.error(`上传失败: ${res.data.msg || '未知错误'}`);
    }
  } catch (error) {
    ElMessage.error('上传时发生错误，请检查网络或文件大小');
    console.error('图片上传失败：', error);
  } finally {
    isUploading.value = false;
  }
};

// 移除图片时清空表单
const handleImageRemove = () => {
  addForm.value.productImageUrl = "";
  fileList.value = [];
  customName.value = "";
};
</script>

<style scoped>
/* 浅青色主背景 */
.product-list {
  padding: 24px;
  background: #e3f8f5; 
  border-radius: 16px;
}

/* 分类按钮栏 */
.category-filter {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 24px;
  padding: 10px 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 分类按钮样式 */
.category-filter .el-button {
  width: 100px;
  height: 38px;
  font-weight: 500;
  border-radius: 20px;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0; 
  color: #666;
}

/* 选中按钮样式 */
.category-filter .el-button--primary {
  background: #4dd0e1; 
  color: #fff;
  border-color: #4dd0e1;
  box-shadow: 0 2px 4px rgba(77, 208, 225, 0.2);
}

/* 商品卡片本体 */
.product-card {
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  transition: transform 0.3s ease;
}

/* 卡片悬停效果 */
.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
}

/* 商品图片 */
.product-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 10px 10px 0 0;
}

/* 商品信息区 */
.product-info {
  padding: 14px;
  text-align: center;
  border-top: 1px solid #f0f8f5; 
}

/* 响应式适配 */
@media (max-width: 992px) {
  .el-col {
    padding: 8px;
  }
  .product-image {
    height: 140px;
  }
}
.add-form {
  padding: 20px;
}

.el-form-item {
  margin-bottom: 15px;
}
/* 上传组件样式 */
.image-uploader .el-upload {
  margin-bottom: 12px;
}

/* 图片预览样式 */
.image-preview {
  margin-top: 8px;
}
.image-preview img {
  width: 150px;
  height: auto;
  border: 1px solid #eee;
  border-radius: 8px;
  object-fit: cover;
}
</style>
