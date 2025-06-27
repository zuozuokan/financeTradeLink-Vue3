<template>
  <div id="content">
    <UserManageSideBar />
    
    <!-- 主欢迎区域 -->
    <div class="main-welcome">
      <div class="welcome-content">
        <div class="platform-name">
          <h1>融销通</h1>
          <div class="platform-subtitle">一体化智慧农业平台</div>
        </div>
        
        <div class="welcome-message">
          <div class="message-card">
            <h2 class="animate-text">欢迎使用用户后台管理系统</h2>
            <p>汇聚农业大数据 · 赋能全产业链 · 服务新型农业生态</p>
            
            <div class="stats-container">
              <div class="stat-card">
                <div class="stat-value" ref="farmersCount">0</div>
                <div class="stat-label">合作农场</div>
              </div>
              <div class="stat-card">
                <div class="stat-value" ref="ordersCount">0</div>
                <div class="stat-label">今日订单</div>
              </div>
              <div class="stat-card">
                <div class="stat-value" ref="growthRate">0</div>
                <div class="stat-label">年增长率</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="feature-highlights">
          <div class="feature-card">
            <div class="feature-icon">🌱</div>
            <h3>智慧生产</h3>
            <p>基于IoT的智能种植监测与指导系统</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🚚</div>
            <h3>高效流通</h3>
            <p>农产品全链路数字化追踪与管理</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>数据分析</h3>
            <p>农业大数据分析与市场预测模型</p>
          </div>
        </div>
      </div>
      
      <!-- 装饰元素 -->
      <div class="decoration">
        <div class="leaf leaf-1"></div>
        <div class="leaf leaf-2"></div>
        <div class="leaf leaf-3"></div>
        <div class="agri-pattern"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import UserManageSideBar from "@/components/UserManageSideBar.vue";

// 动画计数器
const farmersCount = ref(null);
const ordersCount = ref(null);
const growthRate = ref(null);

onMounted(() => {
  // 启动动画计数器
  animateValue(farmersCount.value, 0, 8560, 2000);
  animateValue(ordersCount.value, 0, 1242, 1500);
  animateValue(growthRate.value, 0, 42, 1800);
});

function animateValue(element, start, end, duration) {
  if (!element) return;
  
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    
    if (element === growthRate.value) {
      element.textContent = `${value}%`;
    } else {
      element.textContent = value.toLocaleString();
    }
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}
</script>

<style scoped lang="scss">
#content {
  display: flex;
  height: 100vh;
  background: #f8f9fa;
}

.main-welcome {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9f5f0 100%);
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.welcome-content {
  max-width: 1200px;
  width: 100%;
  z-index: 2;
}

.platform-name {
  text-align: center;
  margin-bottom: 3rem;
  animation: fadeIn 1.5s ease-out;
  
  h1 {
    font-size: 5rem;
    font-weight: 800;
    background: linear-gradient(to right, #2c7744, #5bbd7a);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    letter-spacing: 2px;
    margin-bottom: 0.5rem;
    text-shadow: 0 5px 15px rgba(92, 189, 122, 0.15);
  }
  
  .platform-subtitle {
    font-size: 1.8rem;
    color: #4a6f59;
    font-weight: 500;
    letter-spacing: 1px;
  }
}

.welcome-message {
  display: flex;
  justify-content: center;
}

.message-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2.5rem;
  width: 80%;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  text-align: center;
  
  h2 {
    font-size: 2.5rem;
    color: #2c7744;
    margin-bottom: 1.5rem;
    font-weight: 600;
  }
  
  p {
    font-size: 1.2rem;
    color: #5a6c72;
    max-width: 600px;
    margin: 0 auto 2.5rem;
    line-height: 1.7;
  }
}

.animate-text {
  background: linear-gradient(90deg, #2c7744, #5bbd7a, #2c7744);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: textShine 3s linear infinite;
}

.stats-container {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 2rem;
}

.stat-card {
  padding: 1.2rem 2rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  min-width: 140px;
  box-shadow: 0 10px 20px rgba(92, 189, 122, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(92, 189, 122, 0.15);
  }
  
  .stat-value {
    font-size: 2.5rem;
    font-weight: 700;
    background: linear-gradient(to right, #2c7744, #5bbd7a);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    margin-bottom: 0.5rem;
  }
  
  .stat-label {
    font-size: 1rem;
    color: #5a6c72;
    font-weight: 500;
  }
}

.feature-highlights {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 4rem;
  animation: slideUp 1s ease-out;
}

.feature-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 18px;
  padding: 2rem 1.5rem;
  text-align: center;
  width: 280px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border-top: 4px solid #5bbd7a;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 35px rgba(92, 189, 122, 0.2);
  }
  
  .feature-icon {
    font-size: 3rem;
    margin-bottom: 1.2rem;
  }
  
  h3 {
    color: #2c7744;
    margin-bottom: 1rem;
    font-weight: 600;
    font-size: 1.5rem;
  }
  
  p {
    color: #5a6c72;
    line-height: 1.6;
    font-size: 1rem;
  }
}

/* 装饰元素样式 */
.decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
}

.leaf {
  position: absolute;
  background: linear-gradient(45deg, rgba(92, 189, 122, 0.2), rgba(44, 119, 68, 0.15));
  border-radius: 100% 0;
  opacity: 0.5;
  
  &.leaf-1 {
    width: 300px;
    height: 300px;
    top: -100px;
    right: -80px;
    transform: rotate(15deg);
  }
  
  &.leaf-2 {
    width: 200px;
    height: 200px;
    bottom: 40px;
    left: -50px;
    transform: rotate(-25deg);
  }
  
  &.leaf-3 {
    width: 150px;
    height: 150px;
    bottom: 100px;
    right: 150px;
    transform: rotate(45deg);
  }
}

.agri-pattern {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(92, 189, 122, 0.05) 0px, transparent 1px),
    radial-gradient(circle at 30% 50%, rgba(44, 119, 68, 0.05) 0px, transparent 1px),
    radial-gradient(circle at 70% 90%, rgba(92, 189, 122, 0.05) 0px, transparent 1px);
  background-size: 80px 80px;
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes textShine {
  0% {
    background-position: 0 50%;
  }
  100% {
    background-position: 200% 50%;
  }
}

/* 响应式设计 */
@media (max-width: 992px) {
  .platform-name h1 {
    font-size: 4rem;
  }
  
  .feature-highlights {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 768px) {
  .platform-name h1 {
    font-size: 3rem;
  }
  
  .stats-container {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }
  
  .message-card {
    width: 95%;
  }
  
  .platform-subtitle {
    font-size: 1.5rem;
  }
}
</style>