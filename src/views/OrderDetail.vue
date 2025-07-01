<template>
  <div>
    <el-card v-if="order">
      <h2>订单详情</h2>
      <el-descriptions :column="2" border style="margin-bottom: 20px;">
        <el-descriptions-item label="订单号">{{ order.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ order.status }}</el-descriptions-item>
        <el-descriptions-item label="下单时间">{{ order.createdTime }}</el-descriptions-item>
        <el-descriptions-item label="总价">￥{{ order.total }}</el-descriptions-item>
      </el-descriptions>
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
        <el-descriptions-item label="物流公司">{{ order.logistics.company }}</el-descriptions-item>
        <el-descriptions-item label="物流单号">{{ order.logistics.trackingNo }}</el-descriptions-item>
        <el-descriptions-item label="物流状态">{{ order.logistics.status }}</el-descriptions-item>
        <el-descriptions-item label="最新进度">{{ order.logistics.progress }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
    <el-empty v-else description="未找到该订单" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const order = ref(null)

async function fetchOrderDetail() {
  const id = route.params.id
  // 模拟数据，后续可用API替换
  const all = [
    {
      id: 1,
      orderNo: '20240601001',
      status: '待支付',
      total: 120,
      createdTime: '2024-06-01 10:00',
      items: [
        { name: '生态草莓', price: 20, quantity: 2 },
        { name: '高原蓝莓', price: 30, quantity: 2 }
      ],
      logistics: {
        company: '顺丰快递',
        trackingNo: 'SF123456789',
        status: '运输中',
        progress: '包裹已到达中转站'
      }
    },
    {
      id: 2,
      orderNo: '20240601002',
      status: '已完成',
      total: 80,
      createdTime: '2024-06-01 11:00',
      items: [
        { name: '生态草莓', price: 20, quantity: 2 }
      ],
      logistics: {
        company: '京东物流',
        trackingNo: 'JD987654321',
        status: '已签收',
        progress: '包裹已签收，感谢使用'
      }
    }
  ]
  order.value = all.find(o => String(o.id) === String(id)) || null
}

onMounted(fetchOrderDetail)
</script>

<style scoped>
</style> 