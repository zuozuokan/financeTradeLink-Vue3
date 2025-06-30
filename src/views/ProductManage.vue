<template>
  <div id="content">
    <UserManageSideBar />
    <el-card class="manager-card">
      <template #header>
        <div class="card-header">
          <span>农产品管理</span>
          <el-select
            v-model="filterCategory"
            placeholder="按分类筛选"
            @change="filterProducts"
            clearable
          >
            <el-option label="水果" value="水果" />
            <el-option label="蔬菜" value="蔬菜" />
            <el-option label="粮食" value="粮食" />
          </el-select>
        </div>
      </template>

      <el-table :data="products" style="width: 100%" stripe>
        <el-table-column prop="productImageUrl" label="图片" width="120">
          <template #default="{ row }">
            <el-image
              :src="row.productImageUrl"
              style="width: 80px; height: 80px"
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="名称" />
        <el-table-column prop="productCategory" label="分类" />
        <el-table-column prop="productPrice" label="单价" />
        <el-table-column prop="productStock" label="库存" />
        <el-table-column prop="productStatus" label="状态" />
        <el-table-column prop="productCreatedTime" label="创建时间" />
        <el-table-column prop="productUpdatedTime" label="修改时间" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="large" type="primary" @click="editProduct(row)"
              >编辑</el-button
            >
            <el-button size="large" type="danger" @click="deleteProduct(row.productUuid)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="editDialogVisible" title="编辑农产品" width="500px">
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="商品名称">
          <el-input v-model="editForm.productName" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="editForm.productCategory" placeholder="请选择分类">
            <el-option label="水果" value="水果" />
            <el-option label="蔬菜" value="蔬菜" />
            <el-option label="粮食" value="粮食" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="editForm.productDescription" type="textarea" />
        </el-form-item>
        <el-form-item label="单价">
          <el-input-number v-model="editForm.productPrice" :min="0" :step="0.1" />
        </el-form-item>
        <el-form-item label="库存">
          <el-input-number v-model="editForm.productStock" :min="0" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEditForm">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import UserManageSideBar from "@/components/UserManageSideBar.vue";
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { jwtDecode } from "jwt-decode";
import {
  getProductListAPI,
  getProductBycategoryAPI,
  deleteProductAPI,
  updateProductAPI,
  getProductListByuuidAPI,
  getProductByUuidAndCategoryAPI
} from "@/api/product";

const token = localStorage.getItem("token");
const payload = jwtDecode(token);
const uuid = payload.uuid;

const products = ref([]);
const filterCategory = ref("");

const loadProducts = async () => {
  const reply = await getProductListByuuidAPI(uuid);
  products.value = Array.isArray(reply.results) ? reply.results : [];
};

const filterProducts = async () => {
  if (!filterCategory.value) return loadProducts();
  const category = filterCategory.value
  const reply = await getProductByUuidAndCategoryAPI(uuid,category);
  products.value = Array.isArray(reply.results) ? reply.results : [];
};

const deleteProduct = async (uuid) => {
  try {
    await ElMessageBox.confirm("确认删除该商品？", "提示", { type: "warning" });
    const reply = await deleteProductAPI(uuid);
    if (reply.code !== 200) {
      ElMessage.error("删除失败，请稍后再试");
      return;
    }
    ElMessage.success("删除成功");
    loadProducts();
  } catch (e) {
    // 用户取消或异常
  }
};

// 编辑弹窗控制与数据
const editDialogVisible = ref(false);
const editForm = ref({
  productUuid: "",
  productName: "",
  productCategory: "",
  productDescription: "",
  productPrice: 0,
  productStock: 0,
});

// 打开编辑弹窗并填充数据
const editProduct = (row) => {
  editForm.value = {
    ...row,
  };
  editDialogVisible.value = true;
};

// 提交更新
const submitEditForm = async () => {
  const updated = {
    ...editForm.value,
    productUserUuid: uuid,
  };

  const reply = await updateProductAPI(updated);
  if (reply.code !== 200) {
    ElMessage.error("更新失败，请稍后再试");
    return;
  }

  ElMessage.success("更新成功");
  editDialogVisible.value = false;
  loadProducts();
};

onMounted(() => {
  loadProducts();
});
</script>

<style scoped>
#content {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4efe9 100%);
}

.manager-card {
  margin: 20px;
  padding: 24px;
  flex: 1;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: none;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.manager-card:hover {
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  margin-bottom: 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.card-header span {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  letter-spacing: 0.5px;
}

:deep(.el-table) {
  --el-table-border-color: rgba(0, 0, 0, 0.03);
  --el-table-header-bg-color: #f8fafc;
  --el-table-row-hover-bg-color: rgba(46, 204, 113, 0.05);
}

:deep(.el-table th.el-table__cell) {
  background-color: var(--el-table-header-bg-color);
  font-weight: 600;
  color: #34495e;
}

:deep(.el-table .el-table__row) {
  transition: all 0.2s ease;
}

:deep(.el-table .el-table__row:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

:deep(.el-image) {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

:deep(.el-image:hover) {
  transform: scale(1.05);
}

:deep(.el-button) {
  border-radius: 8px;
  font-weight: 500;
  letter-spacing: 0.3px;
  transition: all 0.2s ease;
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
  border: none;
}

:deep(.el-button--danger) {
  background: linear-gradient(135deg, #e74c3c 0%, #ff6b6b 100%);
  border: none;
}

:deep(.el-button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

:deep(.el-dialog) {
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

:deep(.el-dialog__header) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: 20px 24px;
}

:deep(.el-dialog__title) {
  font-weight: 600;
  color: #2c3e50;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #34495e;
}

:deep(.el-input__inner), 
:deep(.el-textarea__inner),
:deep(.el-select) {
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

:deep(.el-input__inner:hover),
:deep(.el-textarea__inner:hover),
:deep(.el-select:hover .el-input__inner) {
  border-color: #2ecc71;
  box-shadow: 0 0 0 1px rgba(46, 204, 113, 0.2);
}

:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-select-dropdown) {
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

:deep(.el-select-dropdown__item.hover),
:deep(.el-select-dropdown__item:hover) {
  background-color: rgba(46, 204, 113, 0.1);
}

@media (max-width: 768px) {
  #content {
    flex-direction: column;
  }
  
  .manager-card {
    margin: 10px;
    padding: 16px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>