<template>
  <div class="homepage-container">
    <!-- Hero Banner -->
    <section class="hero-banner">
      <div class="hero-text">
        <h1>融销通—连接农户与投资者的智慧农业平台</h1>
        <p>助力农产品高效流通，解决融资难题，促进农业现代化发展</p>
      </div>
    </section>

    <!-- 平台公告区域 -->
    <section class="announcement-section">
      <h2>平台公告</h2>
      <ul>
        <li v-for="notice in notices" :key="notice.id">{{ notice.title }}</li>
      </ul>
    </section>

    <!-- 推荐产品区域 -->
    <section class="recommend-section">
      <h2>推荐农产品</h2>
      <el-row :gutter="20">
        <el-col v-for="item in recommendedProducts" :key="item.id" :span="6">
          <el-card shadow="hover" class="product-card">
            <img :src="item.image" class="product-img" />
            <div class="product-info">
              <h3>{{ item.name }}</h3>
              <p>{{ item.description }}</p>
              <el-button type="primary" @click="goToDetail(item.id)">查看详情</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { jwtDecode } from "jwt-decode";
import { userGetCurrentInfoAPI } from "@/api/user";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

const notices = ref([]);
const recommendedProducts = ref([]);
const router = useRouter();
const currentUserInfo = ref("");

// 获取本地 token
const token = localStorage.getItem("token");

if (token) {
  try {
    const payload = jwtDecode(token);
    const uuid = payload.uuid;
    const role = payload.role;

    onMounted(async () => {
      try {
        const res = await userGetCurrentInfoAPI(uuid);
        currentUserInfo.value = res.results;
        await fetchNotices();
        await fetchRecommendedProducts();
      } catch (err) {
        ElMessage.error("用户信息获取失败");
        console.error(err);
      }
    });
  } catch (err) {
    ElMessage.error("Token 解码失败");
    router.push("/");
  }
} else {
  ElMessage.error("服务器错误，请稍后再试");
  router.push("/");
}

const fetchNotices = async () => {
  try {
    const res = await request.get("/notices");
    notices.value = res.data;
  } catch (err) {
    console.error("公告获取失败", err);
  }
};

const fetchRecommendedProducts = async () => {
  try {
    const res = await request.get("/products/recommend");
    recommendedProducts.value = res.data;
  } catch (err) {
    console.error("推荐产品获取失败", err);
  }
};

const goToDetail = (productId) => {
  router.push(`/product/${productId}`);
};
</script>


<style scoped>
.homepage-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  padding: 0 40px;
}

.hero-banner {
  background: linear-gradient(135deg, #4CAF50 0%, #81C784 100%);
  color: white;
  padding: 80px 40px;
  text-align: center;
  border-radius: 16px;
  margin-bottom: 40px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.hero-text h1 {
  font-size: 40px;
  font-weight: bold;
  margin-bottom: 20px;
}
.hero-text p {
  font-size: 18px;
}

.announcement-section,
.recommend-section {
  margin-bottom: 40px;
}

.announcement-section h2,
.recommend-section h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

.announcement-section ul {
  list-style: none;
  padding-left: 0;
}
.announcement-section li {
  background: #f6f6f6;
  padding: 10px 16px;
  border-radius: 8px;
  margin-bottom: 10px;
  transition: background 0.3s ease;
}
.announcement-section li:hover {
  background: #e0f2f1;
}

.product-card {
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s ease;
}
.product-card:hover {
  transform: translateY(-5px);
}
.product-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-bottom: 1px solid #ddd;
}
.product-info {
  padding: 16px;
  text-align: center;
}
.product-info h3 {
  margin: 10px 0;
  font-size: 20px;
  font-weight: 600;
}
.product-info p {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}
</style>