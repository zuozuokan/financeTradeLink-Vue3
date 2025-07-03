<template>
  <div>
    <el-card>
      <el-tabs v-model="activeTab" @tab-click="onTabChange">
        <el-tab-pane label="待支付" name="pending" />
        <el-tab-pane label="已完成" name="completed" />
        <el-tab-pane label="配送中" name="delivering" />
        <el-tab-pane label="已取消" name="cancelled" />
      </el-tabs>
      <div style="margin: 15px 0; display: flex; justify-content: flex-end;">
        <el-button type="danger" :disabled="!selected.length" @click="batchDelete">批量删除</el-button>
        <el-button v-if="activeTab==='pending'" type="primary" :disabled="!selected.length" @click="batchPay">批量支付</el-button>
      </div>
      <el-table :data="orderList" @selection-change="handleSelectionChange" style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="orderProductName" label="商品名称" width="180" />
        <el-table-column prop="orderQuantity" label="数量" width="80" />
        <el-table-column prop="orderUuid" label="订单号" width="180" />
        <el-table-column prop="orderStatus" label="状态" width="100">
          <template #default="scope">
            <el-tag
              :type="scope.row.orderStatus === 'pending' ? 'warning' : (scope.row.orderStatus === 'completed' ? 'success' : (scope.row.orderStatus === 'delivering' ? 'primary' : (scope.row.orderStatus === 'cancelled' ? 'info' : '')) )"
            >
              {{
                scope.row.orderStatus === 'pending'
                  ? '待支付'
                  : scope.row.orderStatus === 'completed'
                    ? '已完成'
                    : scope.row.orderStatus === 'delivering'
                      ? '配送中'
                      : scope.row.orderStatus === 'cancelled'
                        ? '已取消'
                        : scope.row.orderStatus
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="orderTotalPrice" label="总价" width="100" />
        <el-table-column prop="orderCreatedTime" label="下单时间" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.orderCreatedTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240">
          <template #default="scope">
            <el-button type="primary" size="small" style="border-radius: 8px; margin-right: 8px;" @click="goDetail(scope.row)">详情</el-button>
            <el-button
              v-if="scope.row.orderStatus === 'delivering'"
              type="success"
              size="small"
              style="border-radius: 8px; font-weight: 500; box-shadow: 0 2px 8px rgba(46,204,113,0.08);"
              @click="() => confirmReceive(scope.row)"
            >确认收货</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getOrderListByUserUuidAPI, updateOrderStatusAPI } from '@/api/order'
import { getProductDetailAPI } from '@/api/product'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'

const router = useRouter()
const activeTab = ref('pending')
const orderList = ref([])
const selected = ref([])

function handleSelectionChange(val) {
  selected.value = val
}

async function fetchOrders() {
  const res = await getOrderListByUserUuidAPI()
  let orders = []
  if (res.code === 200) {
    if (Array.isArray(res.results)) {
      orders = res.results
    } else if (res.results && typeof res.results === 'object') {
      orders = Object.values(res.results)
    }
    // 并发查商品名
    orders = await Promise.all(orders.map(async order => {
      let productName = ''
      try {
        const productRes = await getProductDetailAPI(order.orderProductUuid)
        productName = productRes.results?.productName || ''
      } catch {}
      return { ...order, orderProductName: productName }
    }))
    orderList.value = orders.filter(o => o.orderStatus === activeTab.value)
  } else {
    orderList.value = []
  }
  selected.value = []
}

async function batchDelete() {
  await Promise.all(selected.value.map(sel =>
    updateOrderStatusAPI(sel.orderUuid, { orderStatus: 'cancelled' })
  ))
  await fetchOrders()
  selected.value = []
}

async function batchPay() {
  await Promise.all(selected.value.map(sel =>
    updateOrderStatusAPI(sel.orderUuid, { orderStatus: 'delivering' })
  ))
  await fetchOrders()
  selected.value = []
}

function goDetail(row) {
  router.push(`/order-detail/${row.orderUuid}`)
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return dayjs(dateStr).format('YYYY-MM-DD HH:mm:ss')
}

function onTabChange() {
  fetchOrders()
}

async function confirmReceive(row) {
  await updateOrderStatusAPI(row.orderUuid, { orderStatus: 'completed' })
  ElMessage.success('已确认收货，订单已完成')
  await fetchOrders()
}

onMounted(fetchOrders)
</script>


<style scoped>
</style>
