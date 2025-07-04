<template>
  <div>
    <el-card>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <div style="font-size: 20px; font-weight: bold;">购物车</div>
        <div>
          <el-button type="primary" @click="handleRefreshCache" style="margin-right: 10px;">刷新商品缓存</el-button>
          <el-button type="danger" :disabled="!selected.length" @click="batchDelete">批量删除</el-button>
        </div>
      </div>
      <el-table :data="cartList" @selection-change="handleSelectionChange" style="width: 100%" ref="cartTable">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="productImageUrl" label="图片" width="80">
          <template #default="{ row }">
            <el-image :src="row.productImageUrl" style="width: 60px; height: 60px" fit="cover" />
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="商品名称" />
        <el-table-column prop="productPrice" label="单价" width="100" />
        <el-table-column label="数量" width="150">
          <template #default="scope">
            <el-input-number v-model="scope.row.cartQuantity" :min="1" @change="updateQuantity(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="小计" width="120">
          <template #default="scope">
            ￥{{ (scope.row.productPrice * scope.row.cartQuantity).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button type="danger" size="small" @click="removeItem(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px; display: flex; justify-content: space-between; align-items: center;">
        <div>已选 {{ selected.length }} 件商品</div>
        <div style="font-size: 18px; font-weight: bold;">总价：￥{{ selectedTotalPrice }}</div>
        <el-button type="primary" :disabled="!selected.length" @click="batchBuy">批量购买</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCartListAPI } from '@/api/cart'
import { getProductDetailAPI } from '@/api/product'
import { jwtDecode } from "jwt-decode";
import { refreshCartCacheAPI } from '@/api/cart'
import { ElMessage } from 'element-plus'
import { purchaseProductAPI } from '@/api/order'
import { batchRemoveCartItemsAPI } from '@/api/cart'
import { removeCartItemAPI } from '@/api/cart'

const router = useRouter()

// 购物车数据（模拟，后续可用API替换）
const token = localStorage.getItem("token");
const payload = jwtDecode(token);
const userUuid = payload.uuid;
const cartList = ref([]);
const selected = ref([])

// 获取购物车列表
const fetchCartList = async () => {
  const res = await getCartListAPI(userUuid);
  if (res.code === 200 && Array.isArray(res.results)) {
    // 并发获取所有商品详情
    const cartItems = await Promise.all(res.results.map(async cartItem => {
      const productRes = await getProductDetailAPI(cartItem.cartProductUuid)
      const product = productRes.results
      return {
        ...cartItem,
        productName: product.productName,
        productPrice: product.productPrice,
        productImageUrl: product.productImageUrl
      }
    }))
    cartList.value = cartItems
  } else {
    cartList.value = []
  }
}

// 登录校验
onMounted(async () => {
  if (!localStorage.getItem('token')) {
    router.push('/login')
  }
  await fetchCartList()
})

function handleSelectionChange(val) {
  selected.value = val
}

function updateQuantity(row) {
  // 可调用API同步数量
}

async function removeItem(row) {
  try {
    const res = await removeCartItemAPI(row.cartUuid)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      await fetchCartList()
    } else {
      ElMessage.error(res.msg || '删除失败')
    }
  } catch (e) {
    console.log(e);
    ElMessage.error('删除失败，请稍后再试')
  }
}

async function batchDelete() {
  try {
    const cartUuids = selected.value.map(item => item.cartUuid)
    const res = await batchRemoveCartItemsAPI(cartUuids)
    if (res.code === 200) {
      ElMessage.success('批量删除成功')
      await fetchCartList()
      selected.value = []
    } else {
      ElMessage.error(res.msg || '批量删除失败')
    }
  } catch (e) {
    console.log(e);
    ElMessage.error('批量删除失败，请稍后再试')
  }
}

const totalPrice = computed(() => {
  return selected.value.reduce((sum, item) => sum + item.productPrice * item.cartQuantity, 0).toFixed(2)
})

// 计算选中商品总价
const selectedTotalPrice = computed(() => {
  return selected.value.reduce((sum, item) => sum + (item.productPrice * item.cartQuantity), 0).toFixed(2)
})

async function batchBuy() {
  const cartItems = selected.value
  if (!cartItems.length) {
    ElMessage.warning('请选择要购买的商品')
    return
  }
  // 先删除购物车项
  const cartUuids = cartItems.map(item => item.cartUuid)
  const delRes = await batchRemoveCartItemsAPI(cartUuids)
  if (delRes.code !== 200) {
    ElMessage.error(delRes.msg || '购物车删除失败')
    return
  }
  // 逐个下单
  let allSuccess = true
  for (const item of cartItems) {
    console.log(item);
    const res = await purchaseProductAPI(item.cartProductUuid, item.cartQuantity, userUuid)
    if (res.code !== 200) {
      allSuccess = false
      ElMessage.error(`商品 ${item.productUuid} 下单失败`)
    }
  }
  if (allSuccess) {
    ElMessage.success('全部商品下单成功')
    router.push('/order-checkout')
  }
}

// 刷新商品缓存
const handleRefreshCache = async () => {
  try {
    const res = await refreshCartCacheAPI(cartList.value)
    if (res.code === 200) {
      ElMessage.success('商品缓存已刷新')
    } else {
      ElMessage.error(res.msg || '刷新失败')
    }
  } catch (e) {
    ElMessage.error('刷新失败，请稍后再试')
  }
}
</script>

<style scoped>
</style>
