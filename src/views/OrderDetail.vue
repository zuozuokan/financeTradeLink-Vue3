<template>
  <div>
    <el-card v-if="order">
      <h2>订单详情</h2>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单号">{{ order.orderUuid }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag
            :type="order.orderStatus === 'pending' ? 'warning' : (order.orderStatus === 'completed' ? 'success' : (order.orderStatus === 'delivering' ? 'primary' : (order.orderStatus === 'cancelled' ? 'info' : '')) )"
          >
            {{
              order.orderStatus === 'pending'
                ? '待支付'
                : order.orderStatus === 'completed'
                  ? '已完成'
                  : order.orderStatus === 'delivering'
                    ? '配送中'
                    : order.orderStatus === 'cancelled'
                      ? '已取消'
                      : order.orderStatus
            }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="下单时间">{{ formatDate(order.orderCreatedTime) }}</el-descriptions-item>
        <el-descriptions-item label="总价">￥{{ order.orderTotalPrice }}</el-descriptions-item>
        <el-descriptions-item label="商品名称">{{ productName }}</el-descriptions-item>
        <el-descriptions-item label="数量">{{ order.orderQuantity }}</el-descriptions-item>
      </el-descriptions>
      <el-card v-if="product" style="margin-top: 24px;">
        <h3>商品信息</h3>
        <el-row>
          <el-col :span="6">
            <el-image :src="product.productImageUrl" style="width: 120px; height: 120px; object-fit: cover;" />
          </el-col>
          <el-col :span="18">
            <div style="font-size: 18px; font-weight: bold;">{{ product.productName }}</div>
            <div style="color: #888; margin: 8px 0;">{{ product.productDescription }}</div>
            <div>单价：￥{{ product.productPrice }}</div>
            <div>分类：{{ product.productCategory }}</div>
            <div>库存：{{ product.productStock }}</div>
          </el-col>
        </el-row>
      </el-card>
      <h3>商品明细</h3>
      <el-table :data="order.items" style="width: 100%; margin-bottom: 20px;">
        <el-table-column prop="name" label="商品名称" />
        <el-table-column prop="price" label="单价" width="100" />
        <el-table-column prop="quantity" label="数量" width="80" />
        <el-table-column label="小计" width="100">
          <template #default="scope">
            ￥{{ (scope.row.price * scope.row.quantity).toFixed(2) }}
          </template>
        </el-table-column>
      </el-table>
      <h3>物流信息</h3>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="物流公司">{{ order.logistics?.company || '-' }}</el-descriptions-item>
        <el-descriptions-item label="物流单号">{{ order.logistics?.trackingNo || '-' }}</el-descriptions-item>
        <el-descriptions-item label="物流状态">{{ order.logistics?.status || '-' }}</el-descriptions-item>
        <el-descriptions-item label="最新进度">{{ order.logistics?.progress || '-' }}</el-descriptions-item>
      </el-descriptions>
      <div v-if="order.status === '配送中' || order.status === 'delivering'" style="margin-top: 24px; text-align: right;">
        <el-button type="success" @click="confirmReceive">确认收货</el-button>
      </div>
    </el-card>
    <el-empty v-else description="未找到该订单" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { updateOrderStatusAPI, getOrderDetailAPI } from '@/api/order'
import { ElMessage } from 'element-plus'
import { getProductDetailAPI } from '@/api/product'
import dayjs from 'dayjs'

const route = useRoute()
const order = ref(null)
const product = ref(null)
const productName = ref('')

function formatDate(dateStr) {
  if (!dateStr) return ''
  return dayjs(dateStr).format('YYYY-MM-DD HH:mm:ss')
}

async function fetchOrderDetail() {
  const orderUuid = route.params.id
  const res = await getOrderDetailAPI(orderUuid)
  if (res.code === 200) {
    order.value = res.results
    if (!order.value.logistics) order.value.logistics = {}
    // 获取商品详情
    if (order.value && order.value.orderProductUuid) {
      try {
        const productRes = await getProductDetailAPI(order.value.orderProductUuid)
        product.value = productRes.results || null
        // 构造商品明细
        order.value.items = [{
          name: product.value.productName,
          price: product.value.productPrice,
          quantity: order.value.orderQuantity
        }]
      } catch {
        product.value = null
        order.value.items = []
      }
    }
  }
}

async function confirmReceive() {
  // 真实项目应用真实orderUuid
  const orderUuid = order.value.orderUuid || order.value.id
  const res = await updateOrderStatusAPI(orderUuid, { orderStatus: 'completed' })
  if (res.code === 200) {
    ElMessage.success('已确认收货，订单已完成')
    // 刷新详情
    fetchOrderDetail()
  } else {
    ElMessage.error(res.msg || '操作失败')
  }
}

onMounted(fetchOrderDetail)
</script>

<style scoped>
</style> 