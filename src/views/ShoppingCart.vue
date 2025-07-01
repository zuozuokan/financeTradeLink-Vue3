<template>
  <div>
    <el-card>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <div style="font-size: 20px; font-weight: bold;">购物车</div>
        <el-button type="danger" :disabled="!selected.length" @click="batchDelete">批量删除</el-button>
      </div>
      <el-table :data="cartList" @selection-change="handleSelectionChange" style="width: 100%" ref="cartTable">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="商品名称" />
        <el-table-column prop="price" label="单价" width="100" />
        <el-table-column label="数量" width="150">
          <template #default="scope">
            <el-input-number v-model="scope.row.quantity" :min="1" @change="updateQuantity(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="小计" width="120">
          <template #default="scope">
            ￥{{ (scope.row.price * scope.row.quantity).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button type="text" @click="removeItem(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px; display: flex; justify-content: space-between; align-items: center;">
        <div>已选 {{ selected.length }} 件商品</div>
        <div style="font-size: 18px; font-weight: bold;">总价：￥{{ totalPrice }}</div>
        <el-button type="primary" :disabled="!selected.length" @click="batchBuy">批量购买</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 登录校验
onMounted(() => {
  if (!localStorage.getItem('token')) {
    router.push('/login')
  }
})

// 购物车数据（模拟，后续可用API替换）
const cartList = ref([
  { id: 1, name: '生态草莓', price: 20, quantity: 2 },
  { id: 2, name: '高原蓝莓', price: 30, quantity: 1 }
])

const selected = ref([])

function handleSelectionChange(val) {
  selected.value = val
}

function updateQuantity(row) {
  // 可调用API同步数量
}

function removeItem(row) {
  cartList.value = cartList.value.filter(item => item.id !== row.id)
}

function batchDelete() {
  cartList.value = cartList.value.filter(item => !selected.value.includes(item))
  selected.value = []
}

const totalPrice = computed(() => {
  return selected.value.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
})

function batchBuy() {
  // 可调用API批量下单
  alert('批量购买功能待接入API')
}
</script>

<style scoped>
</style>
