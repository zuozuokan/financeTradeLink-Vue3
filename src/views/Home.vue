<template>
  <div class="homepage-container">
    <!-- Hero Banner -->
    <section class="hero-banner">
      <div class="hero-text">
        <h1>融销通—连接农户与投资者的智慧农业平台</h1>
        <p>助力农产品高效流通，解决融资难题，促进农业现代化发展</p>
      </div>
    </section>
  </div>
  <!-- 下面写首页的静态 -->
  <div class="frontend-container">

    <!-- 平台特点 -->
    <div class="features-section">
      <div class="section-header">
        <h2>平台核心优势</h2>
        <p>集生产、流通、销售、服务一体化智慧农业解决方案</p>
      </div>

      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon" style="background: rgba(92, 189, 122, 0.2)">📊</div>
          <h3>智能生产</h3>
          <p>物联网传感器实时监测作物生长环境，智能分析种植方案</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon" style="background: rgba(255, 159, 28, 0.2)">🚛</div>
          <h3>高效流通</h3>
          <p>数字化供应链管理，区块链溯源技术保障食品安全</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon" style="background: rgba(64, 158, 255, 0.2)">📱</div>
          <h3>精准营销</h3>
          <p>大数据分析消费者偏好，精准匹配农产品供需关系</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon" style="background: rgba(103, 194, 58, 0.2)">💰</div>
          <h3>金融服务</h3>
          <p>农业供应链金融服务，解决资金流转痛点</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { jwtDecode } from "jwt-decode";
import { userGetCurrentInfoAPI } from "@/api/user";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
const router = useRouter();

const goToLogin = () => {
  router.push("/user-login");
};

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
        // ElMessage.error("用户信息获取失败");
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
</script>

<style scoped lang="scss">
.homepage-container {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  padding: 0 40px;
}

.hero-banner {
  background: linear-gradient(135deg, #4caf50 0%, #81c784 100%);
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

.frontend-container {
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  color: #333;
  background-color: #fff;
}

/* 顶部导航栏 */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 5%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  z-index: 1000;

  .logo {
    display: flex;
    align-items: center;
    gap: 0.8rem;

    .agri-icon {
      font-size: 2.2rem;
      background: linear-gradient(135deg, #2c7744, #5bbd7a);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    h1 {
      font-size: 1.6rem;
      font-weight: 700;
      background: linear-gradient(135deg, #2c7744, #5bbd7a);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      margin: 0;
    }
  }

  .nav-links {
    display: flex;
    gap: 2.5rem;

    a {
      text-decoration: none;
      color: #5a6c72;
      font-size: 1.1rem;
      font-weight: 500;
      transition: all 0.3s;
      position: relative;

      &:hover {
        color: #2c7744;
      }

      &::after {
        content: "";
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 0;
        height: 2px;
        background: linear-gradient(90deg, #2c7744, #5bbd7a);
        transition: width 0.3s;
      }

      &:hover::after {
        width: 100%;
      }

      &.router-link-exact-active {
        color: #2c7744;
        font-weight: 600;

        &::after {
          width: 100%;
        }
      }
    }
  }

  .login-btn {
    background: linear-gradient(90deg, #2c7744, #5bbd7a);
    border: none;
    border-radius: 30px;
    padding: 0.7rem 1.5rem;
    font-weight: 500;
    transition: all 0.3s;
    box-shadow: 0 4px 12px rgba(92, 189, 122, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(92, 189, 122, 0.4);
    }
  }
}

/* 主横幅区域 */
.hero-banner {
  display: flex;
  height: 10vh;
  position: relative;
  overflow: hidden;

  .banner-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 0 0 8%;
    z-index: 2;

    h1 {
      font-size: 3.5rem;
      font-weight: 800;
      line-height: 1.2;
      margin-bottom: 1.5rem;
      background: linear-gradient(90deg, #2c7744, #0a4b1e);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    p {
      font-size: 1.5rem;
      color: #5a6c72;
      max-width: 600px;
      margin-bottom: 2.5rem;
    }

    .banner-actions {
      display: flex;
      gap: 1.5rem;
      margin-top: 2rem;

      .el-button {
        font-size: 1.1rem;
        padding: 1rem 2rem;
        border-radius: 30px;
        font-weight: 500;

        &:first-child {
          background: linear-gradient(90deg, #2c7744, #5bbd7a);
          border: none;
          box-shadow: 0 4px 12px rgba(92, 189, 122, 0.3);

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(92, 189, 122, 0.4);
          }
        }
      }
    }
  }

  .banner-image {
    flex: 1;
    background: linear-gradient(45deg, rgba(92, 189, 122, 0.1), rgba(44, 119, 68, 0.1)),
      url("https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80&w=1740")
        center/cover;
    position: relative;
    overflow: hidden;
    border-radius: 30px 0 0 30px;
    margin: 3rem 3rem 3rem 0;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  }
}

/* 功能区样式 */
.section-header {
  text-align: center;
  max-width: 800px;
  margin: 0 auto 4rem;

  h2 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    background: linear-gradient(90deg, #2c7744, #5bbd7a);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  p {
    font-size: 1.2rem;
    color: #5a6c72;
    line-height: 1.7;
  }
}

.features-section {
  padding: 6rem 5%;
  background: #f8f9fa;

  .features-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2.5rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  .feature-card {
    background: white;
    border-radius: 20px;
    padding: 2.5rem 2rem;
    text-align: center;
    transition: all 0.4s ease;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);

    &:hover {
      transform: translateY(-10px);
      box-shadow: 0 15px 35px rgba(92, 189, 122, 0.15);
    }

    .feature-icon {
      font-size: 3rem;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
    }

    h3 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: #2c3e50;
    }

    p {
      color: #5a6c72;
      line-height: 1.7;
    }
  }
}

.products-section {
  padding: 6rem 5%;

  .products-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2.5rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  .product-card {
    background: white;
    border-radius: 20px;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);

    &:hover {
      transform: translateY(-10px);
      box-shadow: 0 15px 35px rgba(92, 189, 122, 0.15);
    }

    .product-image {
      height: 240px;
      background-size: cover;
      background-position: center;

      &.img-1 {
        background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)),
          url("@/assets/images/高原蓝莓.jpg") center/cover;
      }

      &.img-2 {
        background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)),
          url("@/assets/images/沙漠蜜瓜.jpg") center/cover;
      }

      &.img-3 {
        background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)),
          url("@/assets/images/生态草莓.jpg") center/cover;
      }
    }

    .product-info {
      padding: 1.8rem;

      .product-tag {
        display: inline-block;
        background: linear-gradient(90deg, #5bbd7a, #2c7744);
        color: white;
        padding: 0.3rem 1rem;
        border-radius: 20px;
        font-size: 0.9rem;
        margin-bottom: 1rem;
      }

      h3 {
        font-size: 1.5rem;
        margin-bottom: 0.8rem;
        color: #2c3e50;
      }

      p {
        color: #5a6c72;
        margin-bottom: 1.5rem;
        min-height: 60px;
      }

      .product-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .price {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2c7744;

          span {
            font-size: 0.9rem;
            color: #777;
          }
        }

        .farm-source {
          font-size: 0.9rem;
          color: #777;
        }
      }
    }
  }
}

.stats-section {
  position: relative;
  padding: 6rem 5%;
  margin: 4rem 0;
  text-align: center;

  .stats-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, rgba(44, 119, 68, 0.9), rgba(92, 189, 122, 0.9)),
      url("https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&q=80&w=1740")
        center/cover;
    z-index: 1;
  }

  .stats-content {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: center;
    gap: 4rem;
    max-width: 1400px;
    margin: 0 auto;

    .stat-item {
      color: white;

      .stat-value {
        font-size: 3rem;
        font-weight: 800;
        margin-bottom: 0.5rem;
      }

      .stat-label {
        font-size: 1.2rem;
      }
    }
  }
}

.farms-section {
  padding: 6rem 5%;

  .farms-carousel {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 3rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  .farm-card {
    background: white;
    border-radius: 20px;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);

    &:hover {
      transform: translateY(-10px);
      box-shadow: 0 15px 35px rgba(92, 189, 122, 0.15);
    }

    .farm-image {
      height: 280px;

      &.farm-1 {
        background: linear-gradient(rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05)),
          url("@/assets/images/阳光生态农场.jpg") center/cover;
      }

      &.farm-2 {
        background: linear-gradient(rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05)),
          url("@/assets/images/青山绿水农场.jpg") center/cover;
      }
    }

    .farm-info {
      padding: 1.8rem;

      h3 {
        font-size: 1.6rem;
        margin-bottom: 1rem;
        color: #2c7744;
      }

      .farm-tags {
        display: flex;
        gap: 0.7rem;
        margin-bottom: 1rem;
        flex-wrap: wrap;

        span {
          background: rgba(92, 189, 122, 0.15);
          color: #2c7744;
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.9rem;
        }
      }

      p {
        color: #5a6c72;
        margin-bottom: 1.5rem;
      }

      .visit-btn {
        width: 100%;
        background: rgba(92, 189, 122, 0.1);
        color: #2c7744;
        border: 1px solid rgba(92, 189, 122, 0.3);
        font-weight: 500;
        transition: all 0.3s;

        &:hover {
          background: rgba(92, 189, 122, 0.2);
          transform: translateY(-2px);
        }
      }
    }
  }
}

.cta-section {
  padding: 6rem 5%;
  background: #f8f9fa;

  .cta-content {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;

    h2 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      background: linear-gradient(90deg, #2c7744, #5bbd7a);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    p {
      font-size: 1.2rem;
      color: #5a6c72;
      margin-bottom: 3rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .cta-buttons {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      flex-wrap: wrap;

      .el-button {
        padding: 1rem 2.5rem;
        font-size: 1.1rem;
        border-radius: 30px;
        font-weight: 500;

        &:first-child {
          background: linear-gradient(90deg, #2c7744, #5bbd7a);
          border: none;
          box-shadow: 0 4px 12px rgba(92, 189, 122, 0.3);

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(92, 189, 122, 0.4);
          }
        }

        &.login-btn {
          background: white;
          border: 1px solid #5bbd7a;
          color: #2c7744;

          &:hover {
            background: rgba(92, 189, 122, 0.1);
          }
        }
      }
    }
  }
}

.footer {
  background: #1a2e2e;
  color: white;
  padding-top: 5rem;

  .footer-content {
    display: flex;
    justify-content: space-between;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 5% 4rem;
  }

  .footer-about {
    max-width: 400px;

    .footer-logo {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      margin-bottom: 1.5rem;

      .agri-icon {
        font-size: 2rem;
      }

      h3 {
        font-size: 1.5rem;
        margin: 0;
        font-weight: 600;
        color: #5bbd7a;
      }
    }

    p {
      color: #9ab;
      line-height: 1.7;
    }
  }

  .footer-links {
    display: flex;
    gap: 4rem;

    .link-column {
      h4 {
        font-size: 1.3rem;
        margin-bottom: 1.5rem;
        color: #fff;
      }

      p {
        color: #9ab;
        margin-bottom: 0.8rem;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          color: #5bbd7a;
        }
      }
    }
  }

  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 5%;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    max-width: 1400px;
    margin: 0 auto;

    .copyright {
      color: #9ab;
      font-size: 0.9rem;
    }

    .social-links {
      display: flex;
      gap: 0.7rem;

      .el-button {
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        transition: all 0.3s;

        &:hover {
          background: rgba(92, 189, 122, 0.2);
          border-color: rgba(92, 189, 122, 0.5);
          transform: translateY(-3px);
        }

        i {
          font-size: 1.2rem;
        }
      }
    }
  }
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .hero-banner {
    .banner-content {
      padding: 0 0 0 5%;

      h1 {
        font-size: 3rem;
      }
    }
  }

  .features-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}

@media (max-width: 992px) {
  .hero-banner {
    flex-direction: column;
    height: auto;
    padding: 4rem 0;

    .banner-content {
      padding: 0 5%;
      text-align: center;

      .banner-actions {
        justify-content: center;
      }
    }

    .banner-image {
      margin: 3rem 5% 0;
      border-radius: 30px;
      height: 400px;
    }
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }

  .farms-carousel {
    grid-template-columns: 1fr !important;
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 1rem 5%;
    flex-wrap: wrap;

    .logo {
      flex: 1;
      min-width: 100%;
      margin-bottom: 1rem;
      justify-content: center;
    }

    .nav-links {
      order: 3;
      flex: 1;
      justify-content: center;
      margin-top: 1rem;
      gap: 1.5rem;

      a {
        font-size: 0.95rem;
      }
    }

    .nav-actions {
      order: 2;
    }
  }

  .section-header h2 {
    font-size: 2rem !important;
  }

  .features-grid {
    grid-template-columns: 1fr !important;
  }

  .products-grid {
    grid-template-columns: 1fr !important;
  }

  .stats-content {
    flex-wrap: wrap;
  }

  .footer-content {
    flex-direction: column;
    gap: 3rem;
  }
}

@media (max-width: 576px) {
  .hero-banner .banner-content h1 {
    font-size: 2.5rem;
  }

  .nav-links {
    gap: 1rem !important;
    flex-wrap: wrap;
  }

  .stats-content {
    flex-direction: column;
    gap: 2rem;
  }

  .cta-buttons {
    flex-direction: column;
  }
}
</style>
