<template>
  <div class="order-list">
    <!-- 订单分类按钮 -->
    <div class="status-filter">
      <el-button
        v-for="status in statuses"
        :key="status"
        @click="filterByStatus(status)"
        :type="selectedStatus === status ? 'primary' : 'default'"
      >
        {{ status }}
      </el-button>
    </div>
    <el-row gutter="20">
      <el-col :span="6" v-for="order in orders" :key="order.orderUuid">
        <el-card 
          shadow="hover" 
          class="order-card"
          :style="{ 
            background: `linear-gradient(135deg, ${getGradientColor(order.orderStatus)})`,
            border: `2px solid ${getStatusBorderColor(order.orderStatus)}`
          }"
          @click="handleViewDetail(order.orderUuid)"
        >
          <div class="order-info">
            <h3>订单编号：{{ order.orderUuid }}</h3>
            <p>数量：{{ order.orderQuantity }}</p>
            <p>状态：{{ order.orderStatus }}</p>
            <p>下单时间：{{ formatProductTime(order.orderCreatedTime) }}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 订单详情抽屉 -->
    <el-drawer 
      title="订单详情" 
      v-model="detailVisible"  
      @close="detailVisible = false"
      direction="rtl"
      size="50%"
    >
    <!-- <h1>jkjkjkjkjk</h1> -->
      <div v-if="orderDetail">
        <p>订单 ID：{{ orderDetail.orderId }}</p>
        <p>订单 UUID：{{ orderDetail.orderUuid }}</p>
        <p>用户 UUID：{{ orderDetail.orderUserUuid }}</p>
        <p>商品 UUID：{{ orderDetail.orderProductUuid }}</p>
        <p>购买数量：{{ orderDetail.orderQuantity }}</p>
        <p>总价格：¥{{ orderDetail.orderTotalPrice }}</p>
        <p>状态：{{ orderDetail.orderStatus }}</p>
        <p>创建时间：{{ formatProductTime(orderDetail.orderCreatedTime) }}</p>
        <p>更新时间：{{ formatProductTime(orderDetail.orderUpdatedTime) }}</p>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getOrderListByUserUuidAPI, getOrderDetailAPI } from "../api/order"; // 引入详情 API
import { jwtDecode } from "jwt-decode";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'; 
import { ElMessage } from 'element-plus';
dayjs.extend(utc); 

// 新增状态对应的颜色映射
const statusColorMap = {
  "全部": "#e0e0e0",
  "待支付": "#ffcccc",
  "已支付": "#ccffcc",
  "已发货": "#cce0ff",
  "已完成": "#e0ccff",
  "pending": "#ffffcc"
};

// 生成渐变背景色（根据状态生成双色渐变）
const getGradientColor = (status) => {
  const baseColor = statusColorMap[status] || "#f0f0f0";
  const lightColor = lightenColor(baseColor, 0.3); // 亮色版本
  return `to right, ${lightColor}, ${baseColor}`;
};

// 生成边框颜色（比背景色深20%）
const getStatusBorderColor = (status) => {
  const baseColor = statusColorMap[status] || "#d0d0d0";
  return darkenColor(baseColor, 0.2); // 暗色版本
};

// 颜色亮度调整函数
const lightenColor = (hex, factor) => {
  factor = Math.pow(factor, 2); // 二次方调整让过渡更自然
  return `#${hex.replace(/^#/, '').replace(/../g, color => 
    ('0' + Math.floor(parseInt(color, 16) * (1 - factor) + 255 * factor).toString(16)).substr(-2)
  )}`;
};

const darkenColor = (hex, factor) => {
  factor = Math.pow(factor, 2); // 二次方调整让过渡更自然
  return `#${hex.replace(/^#/, '').replace(/../g, color => 
    ('0' + Math.floor(parseInt(color, 16) * (1 - factor)).toString(16)).substr(-2)
  )}`;
};

const formatProductTime = (time) => {
  if (!time) return "未提供";
  return dayjs.utc(time).local().format('YYYY-MM-DD HH:mm:ss');
};

const filterByStatus = (status) => {
  selectedStatus.value = status;
  if (status === "全部") {
    orders.value = allOrders.value;
  } else {
    orders.value = allOrders.value.filter((cc) => cc.orderStatus === status);
  }
};

const token = localStorage.getItem("token");  
const payload = jwtDecode(token);
const userUuid = payload.uuid;
const role = payload.role;
const allOrders = ref([]);
const orders = ref([]);
const statuses = ref(["全部", "待支付", "已支付", "已发货", "已完成", "pending"]);
const selectedStatus = ref("全部");

// 订单详情相关变量
const detailVisible = ref(false); 
const orderDetail = ref({}); 

// 获取订单详情
const handleViewDetail = async (orderUuid) => {
  try {
    const res = await getOrderDetailAPI(orderUuid);
    if (res.data.code === 200) {
   //   console.log('订单详情：', res.data.results); // 调试输出
      orderDetail.value = res.data.results;
      console.log('赋值后 orderDetail：', orderDetail.value); // 验证数据是否赋值成功
      detailVisible.value = true; 
      console.log(detailVisible.value);
    } else {
      ElMessage.error('获取订单详情失败');
    }
  } catch (error) {
    console.error('请求订单详情出错：', error);
    ElMessage.error('网络异常，获取订单详情失败');
  }
};

onMounted(async () => {
  try {
    const response = await getOrderListByUserUuidAPI(userUuid);
    if (response.data.code === 200) {
      const list = response.data.results;
      allOrders.value = list;
      orders.value = list;
    } else {
      console.error("获取订单失败：", response.data.message);
    }
  } catch (err) {
    console.error("请求订单出错：", err);
  }
});
</script>

<style scoped>
/* 订单列表整体容器 */
.order-list {
  background: #f9f9f9; /* 浅灰色背景覆盖整个列表区域 */
  padding: 24px; /* 增大内边距，让边缘空白更协调 */
  border-radius: 16px; /* 给整个列表加圆角，视觉更柔和 */
}

/* 订单分类按钮栏 */
.status-filter {
  background: #fff; /* 按钮栏白色背景，突出按钮区域 */
  padding: 12px 20px; /* 上下内边距+左右留白，填充按钮两侧空白 */
  border-radius: 8px; /* 圆角让按钮栏更精致 */
  margin-bottom: 20px; /* 与下方卡片保持间距 */
  display: flex;
  gap: 10px;
  justify-content: center;
}

/* 按钮样式优化 */
.status-filter .el-button {
  width: 100px;
  font-weight: 500; /* 加粗文字，突出按钮 */
  border-radius: 20px; /* 按钮圆角，与整体风格统一 */
}

/* 卡片列容器（el-col） */
.el-col {
  background: #fff; /* 列背景色，填充卡片之间的空白 */
  border-radius: 12px; /* 列圆角，和卡片呼应 */
  padding: 10px; /* 列内边距，让卡片与列边框有呼吸感 */
  transition: all 0.3s ease; /* 过渡动画，增强交互 */
}

/* 鼠标悬浮列，轻微上浮（可选交互优化） */
.el-col:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

/* 订单卡片本体 */
.order-card {
  cursor: pointer; /* 鼠标手型，提示可点击 */
  margin: 0; /* 去掉默认 margin，用列的 padding 控制间距 */
  background: transparent !important; /* 卡片透明，继承列的背景 */
  box-shadow: none; /* 去掉默认阴影，统一用列的交互阴影 */
  transition: transform 0.3s ease; /* 点击反馈过渡 */
}

.order-card:hover {
  transform: scale(1.02); /* 悬浮轻微放大，增强交互感 */
}

/* 卡片内容区域 */
.order-info {
  padding: 10px;
  color: #333; /* 文字深色，更清晰 */
  background: rgba(255,255,255,0.9); /* 半透明背景，突出内容 */
  border-radius: 8px; /* 内容区圆角 */
}

/* 响应式优化：小屏幕下列间距调整 */
@media (max-width: 992px) {
  .el-col {
    padding: 8px;
  }
  .status-filter {
    padding: 10px;
    gap: 8px;
  }
}
</style>