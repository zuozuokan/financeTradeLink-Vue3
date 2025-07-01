<template>
  <div class="frontend-container">
    <!-- 顶部导航栏 -->
    <div class="navbar">
      <div class="logo">
        <div class="agri-icon">🌱</div>
        <h1>融销通智慧农业</h1>
      </div>
      
      <div class="nav-links">
        <router-link to="/">首页</router-link>
        <router-link to="/prodect">农产品中心</router-link>
        <router-link to="/agricultural-knowledge-base">智慧方案</router-link>
        <router-link to="/">关于我们</router-link>
      </div>
      
      <div class="nav-actions">
        <el-button 
          type="primary" 
          class="login-btn" 
          @click="goToLogin"
        >
          登录/注册
        </el-button>
      </div>
    </div>
    
    <!-- 主横幅 -->
    <div class="hero-banner">
      <div class="banner-content">
        <h1>连接田野与餐桌<br>构建智慧农业生态</h1>
        <p>一体化农产品产销平台，大数据赋能农业生产与流通</p>
        
        <div class="banner-actions">
          <el-button type="primary" size="large" round>
            了解平台 <i class="el-icon-right"></i>
          </el-button>
          <el-button size="large" round>
            查看农产品
          </el-button>
        </div>
      </div>
      
      <div class="banner-image"></div>
    </div>
    
    <!-- 平台特点 -->
    <!-- <div class="features-section">
      <div class="section-header">
        <h2>平台核心优势</h2>
        <p>集生产、流通、销售、服务一体化智慧农业解决方案</p>
      </div>
      
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon" style="background: rgba(92, 189, 122, 0.2);">
            📊
          </div>
          <h3>智能生产</h3>
          <p>物联网传感器实时监测作物生长环境，智能分析种植方案</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon" style="background: rgba(255, 159, 28, 0.2);">
            🚛
          </div>
          <h3>高效流通</h3>
          <p>数字化供应链管理，区块链溯源技术保障食品安全</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon" style="background: rgba(64, 158, 255, 0.2);">
            📱
          </div>
          <h3>精准营销</h3>
          <p>大数据分析消费者偏好，精准匹配农产品供需关系</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon" style="background: rgba(103, 194, 58, 0.2);">
            💰
          </div>
          <h3>金融服务</h3>
          <p>农业供应链金融服务，解决资金流转痛点</p>
        </div>
      </div>
    </div> -->
    
    <!-- 农产品展示 -->
    <div class="products-section">
      <div class="section-header">
        <h2>优质农产品推荐</h2>
        <p>来自绿色农场的优质农产品，源头直供新鲜送达</p>
      </div>
      
      <div class="products-grid">
        <div class="product-card">
          <div class="product-image img-1"></div>
          <div class="product-info">
            <div class="product-tag">有机认证</div>
            <h3>高原蓝莓</h3>
            <p>海拔2200米高原种植，自然成熟，果粉丰富</p>
            <div class="product-footer">
              <div class="price">¥36.8<span>/盒</span></div>
              <div class="farm-source">阳光农场直供</div>
            </div>
          </div>
        </div>
        
        <div class="product-card">
          <div class="product-image img-2"></div>
          <div class="product-info">
            <div class="product-tag">新鲜采摘</div>
            <h3>沙漠蜜瓜</h3>
            <p>沙漠地区种植，昼夜温差大，糖度达18+</p>
            <div class="product-footer">
              <div class="price">¥12.9<span>/斤</span></div>
              <div class="farm-source">绿洲基地直供</div>
            </div>
          </div>
        </div>
        
        <div class="product-card">
          <div class="product-image img-3"></div>
          <div class="product-info">
            <div class="product-tag">当季鲜果</div>
            <h3>生态草莓</h3>
            <p>无土栽培技术，全程有机种植，果肉饱满</p>
            <div class="product-footer">
              <div class="price">¥28.5<span>/盒</span></div>
              <div class="farm-source">田园农场直供</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 数据统计 -->
    <div class="stats-section">
      <div class="stats-overlay"></div>
      <div class="stats-content">
        <div class="stat-item">
          <div class="stat-value">8560+</div>
          <div class="stat-label">合作农场</div>
        </div>
        
        <div class="stat-item">
          <div class="stat-value">2,540,000+</div>
          <div class="stat-label">平台用户</div>
        </div>
        
        <div class="stat-item">
          <div class="stat-value">365天</div>
          <div class="stat-label">全年新鲜供给</div>
        </div>
        
        <div class="stat-item">
          <div class="stat-value">98.7%</div>
          <div class="stat-label">用户满意度</div>
        </div>
      </div>
    </div>
    
    <!-- 农场展示 -->
    <div class="farms-section">
      <div class="section-header">
        <h2>合作农场展示</h2>
        <p>精选优质农场基地，全程数字化管理生产</p>
      </div>
      
      <div class="farms-carousel">
        <div class="farm-card">
          <div class="farm-image farm-1"></div>
          <div class="farm-info">
            <h3>阳光生态农场</h3>
            <div class="farm-tags">
              <span>有机认证</span>
              <span>温室种植</span>
              <span>全年生产</span>
            </div>
            <p>占地面积: 2200亩 | 主营: 蔬菜水果</p>
            <el-button class="visit-btn">查看农场</el-button>
          </div>
        </div>
        
        <div class="farm-card">
          <div class="farm-image farm-2"></div>
          <div class="farm-info">
            <h3>青山绿水牧场</h3>
            <div class="farm-tags">
              <span>草饲畜牧</span>
              <span>自然放养</span>
              <span>生态循环</span>
            </div>
            <p>占地面积: 5800亩 | 主营: 肉蛋奶</p>
            <el-button class="visit-btn">查看农场</el-button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 底部CTA -->
    <div class="cta-section">
      <div class="cta-content">
        <h2>立即加入智慧农业生态</h2>
        <p>无论是农场主、经销商还是消费者，都能在这里找到价值</p>
        
        <div class="cta-buttons">
          <el-button type="primary" size="large">农场主入驻</el-button>
          <el-button size="large">经销商加盟</el-button>
          <el-button size="large" class="login-btn" @click="goToLogin">消费者登录</el-button>
        </div>
      </div>
    </div>
    
    <!-- 页脚 -->
    <div class="footer">
      <div class="footer-content">
        <div class="footer-about">
          <div class="footer-logo">
            <div class="agri-icon">🌱</div>
            <h3>融销通智慧农业平台</h3>
          </div>
          <p>连接田野与餐桌的农业产销一体化平台<br>致力于推动智慧农业发展</p>
        </div>
        
        <div class="footer-links">
          <div class="link-column">
            <h4>关于平台</h4>
            <p>平台介绍</p>
            <p>加入我们</p>
            <p>新闻动态</p>
          </div>
          
          <div class="link-column">
            <h4>农场合作</h4>
            <p>入驻申请</p>
            <p>智慧种植方案</p>
            <p>供应链服务</p>
          </div>
          
          <div class="link-column">
            <h4>消费者服务</h4>
            <p>农产品购买</p>
            <p>订单查询</p>
            <p>溯源系统</p>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="copyright">© 2025 融销通智慧农业平台. 版权所有</div>
        <div class="social-links">
          <el-button circle><i class="el-icon-message"></i></el-button>
          <el-button circle><i class="el-icon-weibo"></i></el-button>
          <el-button circle><i class="el-icon-camera"></i></el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goToLogin = () => {
  router.push('/user-login');
};
</script>

<style scoped lang="scss">
.frontend-container {
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  color: #333;
  background-color: #fff;
  min-height: 100vh;
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
        content: '';
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
  height: 85vh;
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
      url('https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80&w=1740') center/cover;
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
          url('@/assets/images/高原蓝莓.jpg') center/cover;
      }
      
      &.img-2 {
        background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), 
          url('@/assets/images/沙漠蜜瓜.jpg') center/cover;
      }
      
      &.img-3 {
        background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), 
          url('@/assets/images/生态草莓.jpg') center/cover;
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
      url('https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&q=80&w=1740') center/cover;
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
          url('@/assets/images/阳光生态农场.jpg') center/cover;
      }
      
      &.farm-2 {
        background: linear-gradient(rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05)), 
          url('@/assets/images/青山绿水农场.jpg') center/cover;
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