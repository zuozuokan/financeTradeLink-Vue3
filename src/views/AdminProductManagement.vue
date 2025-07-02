<template>
  <div>
    <h2>商品管理</h2>
    <el-table :data="products" style="width: 100%; margin-top: 20px;">
      <el-table-column prop="productName" label="商品名称" width="180" />
      <el-table-column prop="productCategory" label="分类" width="120" />
      <el-table-column prop="productDescription" label="描述" />
      <el-table-column prop="productPrice" label="价格" width="100" />
      <el-table-column prop="productStock" label="库存" width="100" />
      <el-table-column prop="productImageUrl" label="图片" width="120">
        <template #default="scope">
          <el-image :src="scope.row.productImageUrl" style="width: 60px; height: 60px; object-fit: cover;" />
        </template>
      </el-table-column>
      <el-table-column prop="productUserUuid" label="发布者ID" width="180" />
      <el-table-column prop="productStatus" label="状态" width="100">
        <template #default="scope">
          <el-tag>{{ scope.row.productStatus }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button size="small" type="primary"
            v-if="scope.row.productStatus === 'disabled'"
            @click="toggleStatus(scope.row)">上架</el-button>
          <el-button size="small" type="warning"
            v-else
            @click="toggleStatus(scope.row)">下架</el-button>
          <el-button size="small" @click="openEditDialog(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="editDialogVisible" title="编辑商品">
      <el-form :model="editProduct" label-width="80px">
        <el-form-item label="商品名称">
          <el-input v-model="editProduct.productName" />
        </el-form-item>
        <el-form-item label="分类">
          <el-input v-model="editProduct.productCategory" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="editProduct.productDescription" />
        </el-form-item>
        <el-form-item label="价格">
          <el-input-number v-model="editProduct.productPrice" :min="0" />
        </el-form-item>
        <el-form-item label="库存">
          <el-input-number v-model="editProduct.productStock" :min="0" />
        </el-form-item>
        <el-form-item label="图片">
          <el-input v-model="editProduct.productImageUrl" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="editProduct.productStatus">
            <el-option label="上架" value="ON_SALE" />
            <el-option label="下架" value="disabled" />
            <el-option label="热销" value="Best-selling" />
            <el-option label="限时折扣" value="限时折扣" />
            <el-option label="手慢无" value="手慢无" />
            <el-option label="pending" value="pending" />
            <el-option label="enabled" value="enabled" />
            <el-option label="disabled" value="disabled" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEdit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getProducts, updateProductStatus, updateProduct } from '@/api/admin/adminProduct'

const products = ref([])
const editDialogVisible = ref(false)
const editProduct = ref({})

async function fetchProducts() {
  const res = await getProducts()
  products.value = res.results || []
}

async function toggleStatus(row) {
  if (row.productStatus === 'disabled') {
    await updateProductStatus(row.productUuid, 'ON_SALE')
  } else {
    await updateProductStatus(row.productUuid, 'disabled')
  }
  fetchProducts()
}

function openEditDialog(row) {
  editProduct.value = { ...row }
  editDialogVisible.value = true
}

async function submitEdit() {
  await updateProduct(editProduct.value)
  editDialogVisible.value = false
  fetchProducts()
}

onMounted(fetchProducts)
</script>

<style scoped>
.el-table {
  margin-top: 20px;
}
</style>
