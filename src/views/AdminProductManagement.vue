<template>
  <div>
    <h2>商品管理</h2>
    <el-table :data="products" style="width: 100%; margin-top: 20px;">
      <el-table-column prop="name" label="商品名称" width="180" />
      <el-table-column prop="price" label="价格" width="100" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.status === '上架' ? 'success' : 'info'">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-button size="small" type="primary" @click="toggleStatus(scope.row)">
            {{ scope.row.status === '上架' ? '下架' : '上架' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// 你需要实现这些API
import { getProducts, updateProductStatus } from '@/api/adminProduct'

const products = ref([])

function fetchProducts() {
  // 示例数据，实际应调用API
  products.value = [
    { id: 1, name: '生态草莓', price: 20, status: '上架', description: '新鲜生态草莓', createTime: '2024-06-01 10:00' },
    { id: 2, name: '高原蓝莓', price: 30, status: '下架', description: '高原种植蓝莓', createTime: '2024-06-02 09:00' }
  ]
  // getProducts().then(res => { products.value = res.data })
}

function toggleStatus(row) {
  const newStatus = row.status === '上架' ? '下架' : '上架'
  // updateProductStatus(row.id, newStatus).then(fetchProducts)
  // 本地模拟：
  const idx = products.value.findIndex(p => p.id === row.id)
  if (idx !== -1) {
    products.value[idx].status = newStatus
  }
}

onMounted(fetchProducts)
</script>

<style scoped>
.el-table {
  margin-top: 20px;
}
</style> 