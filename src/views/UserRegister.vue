<template>
  <div class="register-container">
    <!-- 新增装饰背景元素 -->
    <div class="decorative-bg">
      <div class="leaf leaf-1"></div>
      <div class="leaf leaf-2"></div>
      <div class="leaf leaf-3"></div>
      <div class="agri-pattern"></div>
    </div>

    <el-form
      :model="form"
      :rules="rules"
      ref="registerFormRef"
      label-position="top"
      class="register-form"
    >
      <div class="form-header">
        <div class="logo-container">
          <div class="agri-icon">🌱</div>
          <h2>融销通智慧农业</h2>
        </div>
        <div class="welcome-text">
          <h3>用户注册</h3>
          <p>加入智慧农业生态，开启高效产销之旅</p>
        </div>
      </div>

      <el-form-item label="用户名" prop="userUserName">
        <el-input 
          v-model="form.userUserName" 
          placeholder="请输入用户名"
          class="custom-input"
        >
          <template #prefix>
            <i class="el-icon-user custom-icon"></i>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label="密码" prop="userPassword">
        <el-input
          v-model="form.userPassword"
          type="password"
          placeholder="请输入密码"
          show-password
          class="custom-input"
        >
          <template #prefix>
            <i class="el-icon-lock custom-icon"></i>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label="姓名">
        <el-input 
          v-model="form.userName" 
          placeholder="请输入姓名（可选）" 
          class="custom-input"
        >
          <template #prefix>
            <i class="el-icon-user-solid custom-icon"></i>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label="手机号">
        <el-input
          v-model="form.userPhone"
          placeholder="请输入手机号（可选）"
          maxlength="11"
          class="custom-input"
        >
          <template #prefix>
            <i class="el-icon-mobile custom-icon"></i>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button 
          type="primary" 
          @click="handleRegister" 
          class="submit-btn"
        >
          注册新账号
        </el-button>
      </el-form-item>

      <div class="auth-footer">
        <div class="terms">
          <el-checkbox v-model="termsAgreed">我已阅读并同意</el-checkbox>
          <a>《用户协议》</a>和<a>《隐私政策》</a>
        </div>
        
        <div class="login-link">
          已有账号？
          <a @click.prevent="router.push('/user-login')">立即登录</a>
        </div>
      </div>
    </el-form>
    
    <!-- 新增功能卡片展示 -->
    <div class="benefits-card">
      <h3>加入智慧农业平台，享受以下优势</h3>
      <div class="benefits-list">
        <div class="benefit-item">
          <i class="el-icon-trophy"></i>
          <div>
            <h4>专属农场合作</h4>
            <p>优先对接优质农场资源</p>
          </div>
        </div>
        <div class="benefit-item">
          <i class="el-icon-discount"></i>
          <div>
            <h4>新人优惠</h4>
            <p>首次下单享9折优惠</p>
          </div>
        </div>
        <div class="benefit-item">
          <i class="el-icon-coin"></i>
          <div>
            <h4>会员积分</h4>
            <p>消费累计得专属权益</p>
          </div>
        </div>
        <div class="benefit-item">
          <i class="el-icon-s-order"></i>
          <div>
            <h4>订单追踪</h4>
            <p>农产品全程物流可视化</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { registerAPI } from "@/api/registerOrLogin.js";

const router = useRouter();

const form = ref({
  userUserName: "",
  userPassword: "",
  userName: "",
  userPhone: "",
  userRole: "USER",
});

const termsAgreed = ref(true);

const rules = {
  userUserName: [
    { required: true, message: "用户名不能为空", trigger: "blur" },
    { min: 3, message: "用户名至少3个字符", trigger: "blur" },
  ],
  userPassword: [
    { required: true, message: "密码不能为空", trigger: "blur" },
    { min: 5, message: "密码至少5位", trigger: "blur" },
  ],
};

const registerFormRef = ref();

const handleRegister = async () => {
  // 检查是否同意条款
  if (!termsAgreed.value) {
    ElMessage.warning("请先同意用户协议和隐私政策");
    return;
  }
  
  await registerFormRef.value.validate(async (valid) => {
    if (!valid) return;

    try {
      const response = await registerAPI(form.value);
      const reply = response.data;

      if (reply.code === 200) {
        ElMessage.success("注册成功，正在跳转登录页...");
        setTimeout(() => router.push("/user-login"), 1500);
      } else {
        ElMessage.error(reply.results || "注册失败");
      }
    } catch (err) {
      ElMessage.error("网络异常，请稍后再试");
    }
  });
};
</script>

<style scoped lang="scss">
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9f5f0 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.decorative-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  
  .leaf {
    position: absolute;
    background: linear-gradient(45deg, rgba(92, 189, 122, 0.1), rgba(44, 119, 68, 0.08));
    border-radius: 100% 0;
    opacity: 0.7;
    
    &.leaf-1 {
      width: 250px;
      height: 250px;
      top: -80px;
      right: 100px;
      transform: rotate(25deg);
    }
    
    &.leaf-2 {
      width: 180px;
      height: 180px;
      bottom: 80px;
      left: -40px;
      transform: rotate(-35deg);
    }
    
    &.leaf-3 {
      width: 150px;
      height: 150px;
      top: 50%;
      left: 10%;
      transform: rotate(10deg);
    }
  }
  
  .agri-pattern {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(circle at 20% 30%, rgba(92, 189, 122, 0.03) 0px, transparent 2px),
      radial-gradient(circle at 60% 70%, rgba(44, 119, 68, 0.03) 0px, transparent 2px),
      radial-gradient(circle at 80% 90%, rgba(92, 189, 122, 0.03) 0px, transparent 2px);
    background-size: 100px 100px;
  }
}

.register-form {
  width: 450px;
  padding: 40px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  box-shadow: 0 25px 50px rgba(92, 189, 122, 0.15), 0 10px 25px rgba(0, 0, 0, 0.05);
  transition: all 0.4s ease-in-out;
  z-index: 10;
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 30px 60px rgba(92, 189, 122, 0.2), 0 15px 35px rgba(0, 0, 0, 0.07);
  }
}

.form-header {
  margin-bottom: 30px;
  
  .logo-container {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 25px;
    
    .agri-icon {
      font-size: 2.5rem;
      background: linear-gradient(135deg, #2c7744, #5bbd7a);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    
    h2 {
      font-size: 1.8rem;
      font-weight: 700;
      margin: 0;
      background: linear-gradient(90deg, #2c7744, #5bbd7a);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      letter-spacing: 0.5px;
    }
  }
  
  .welcome-text {
    h3 {
      font-size: 1.8rem;
      font-weight: 600;
      color: #2c7744;
      margin-bottom: 8px;
    }
    
    p {
      color: #5a6c72;
      font-size: 1.1rem;
      margin: 0;
    }
  }
}

.custom-input {
  :deep(.el-input__inner) {
    height: 50px;
    border-radius: 10px;
    transition: all 0.3s;
    
    &:hover {
      border-color: #a1c9a7;
    }
    
    &:focus {
      border-color: #5bbd7a;
    }
  }
  
  .custom-icon {
    color: #5bbd7a;
    font-size: 18px;
    margin-left: 10px;
    z-index: 1;
  }
}

.submit-btn {
  width: 100%;
  height: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 10px;
  border: none;
  background: linear-gradient(90deg, #2c7744, #5bbd7a);
  box-shadow: 0 8px 20px rgba(92, 189, 122, 0.3);
  transition: all 0.4s;
  letter-spacing: 1px;
  
  &:hover {
    background: linear-gradient(90deg, #245d36, #4aa066);
    transform: translateY(-3px);
    box-shadow: 0 12px 25px rgba(92, 189, 122, 0.4);
  }
  
  &:active {
    transform: translateY(1px);
  }
}

.auth-footer {
  border-top: 1px solid #eef4ed;
  padding-top: 20px;
  margin-top: 15px;
  
  .terms {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 15px;
    
    :deep(.el-checkbox__label) {
      color: #5a6c72;
      font-size: 0.9rem;
    }
    
    a {
      color: #5bbd7a;
      text-decoration: none;
      transition: all 0.3s;
      
      &:hover {
        color: #2c7744;
        text-decoration: underline;
      }
    }
  }
  
  .login-link {
    text-align: center;
    font-size: 0.95rem;
    color: #5a6c72;
    
    a {
      color: #2c7744;
      font-weight: 600;
      text-decoration: none;
      margin-left: 8px;
      transition: all 0.3s;
      cursor: pointer;
      
      &:hover {
        color: #5bbd7a;
        text-decoration: underline;
      }
    }
  }
}

.benefits-card {
  margin-left: 40px;
  width: 380px;
  padding: 35px 30px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  box-shadow: 0 25px 50px rgba(92, 189, 122, 0.1), 0 10px 25px rgba(0, 0, 0, 0.05);
  z-index: 10;
  
  h3 {
    font-size: 1.4rem;
    color: #2c7744;
    font-weight: 600;
    margin-bottom: 25px;
    text-align: center;
    padding-bottom: 15px;
    border-bottom: 2px solid #eef4ed;
  }
  
  .benefits-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .benefit-item {
    display: flex;
    align-items: flex-start;
    gap: 15px;
    padding: 15px;
    border-radius: 12px;
    transition: all 0.3s;
    background: rgba(235, 247, 239, 0.5);
    
    &:hover {
      background: rgba(92, 189, 122, 0.1);
      transform: translateX(5px);
    }
    
    i {
      font-size: 1.8rem;
      color: #2c7744;
      margin-top: 4px;
    }
    
    h4 {
      color: #2c7744;
      font-weight: 600;
      margin-bottom: 5px;
    }
    
    p {
      color: #5a6c72;
      margin: 0;
      font-size: 0.95rem;
    }
  }
}

@media (max-width: 1100px) {
  .benefits-card {
    display: none;
  }
  
  .register-form {
    width: 450px;
    margin: 0 auto;
  }
}

@media (max-width: 550px) {
  .register-form {
    width: 90%;
    padding: 30px 25px;
  }
  
  .form-header .logo-container h2 {
    font-size: 1.5rem;
  }
  
  .welcome-text h3 {
    font-size: 1.5rem;
  }
  
  .submit-btn {
    height: 48px;
    font-size: 1rem;
  }
}
</style>