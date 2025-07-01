<template>
  <div>
    <el-card>
      <el-tabs v-model="activeTab" @tab-click="fetchOrders">
        <el-tab-pane label="待支付" name="pending" />
        <el-tab-pane label="已完成" name="completed" />
        <el-tab-pane label="已取消" name="cancelled" />
      </el-tabs>
      <div style="margin: 15px 0; display: flex; justify-content: flex-end;">
        <el-button type="danger" :disabled="!selected.length" @click="batchDelete">批量删除</el-button>
        <el-button v-if="activeTab==='pending'" type="primary" :disabled="!selected.length" @click="batchPay">批量支付</el-button>
      </div>
      <el-table :data="orderList" @selection-change="handleSelectionChange" style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="orderNo" label="订单号" width="180" />
        <el-table-column prop="status" label="状态" width="100" />
        <el-table-column prop="total" label="总价" width="100" />
        <el-table-column prop="createdTime" label="下单时间" width="180" />
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button type="text" @click="goDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref('pending')
const orderList = ref([])
const selected = ref([])

function handleSelectionChange(val) {
  selected.value = val
}

function fetchOrders() {
  // 模拟数据，后续可用API替换
  const all = [
    { id: 1, orderNo: '20240601001', status: '待支付', total: 120, createdTime: '2024-06-01 10:00' },
    { id: 2, orderNo: '20240601002', status: '已完成', total: 80, createdTime: '2024-06-01 11:00' },
    { id: 3, orderNo: '20240601003', status: '已取消', total: 50, createdTime: '2024-06-01 12:00' }
  ]
  orderList.value = all.filter(o => {
    if (activeTab.value === 'pending') return o.status === '待支付'
    if (activeTab.value === 'completed') return o.status === '已完成'
    if (activeTab.value === 'cancelled') return o.status === '已取消'
    return true
  })
  selected.value = []
}

function batchDelete() {
  orderList.value = orderList.value.filter(item => !selected.value.includes(item))
  selected.value = []
}

function batchPay() {
  // 可调用API批量支付
  alert('批量支付功能待接入API')
}

function goDetail(row) {
  router.push(`/order-detail/${row.id}`)
}

onMounted(fetchOrders)
</script>

<style scoped>
</style>
