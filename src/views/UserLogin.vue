<template>
  <div class="login-container">
    <!-- 农业主题背景装饰元素 -->
    <div class="decorative-bg">
      <div class="leaf leaf-1"></div>
      <div class="leaf leaf-2"></div>
      <div class="leaf leaf-3"></div>
      <div class="agri-pattern"></div>
    </div>

    <form @submit.prevent="handleLogin" class="login-form">
      <div class="form-header">
        <div class="logo-container">
          <div class="agri-icon">🌱</div>
          <h2>融销通智慧农业</h2>
        </div>
        <div class="welcome-text">
          <h3>欢迎登录</h3>
          <p>连接农业生态，开启智慧产销之旅</p>
        </div>
      </div>

      <div class="form-group">
        <div class="input-with-icon">
          <i class="el-icon-user"></i>
          <input
            type="text"
            placeholder="请输入用户名"
            name="account"
            v-model="account"
            required
            class="custom-input"
          />
        </div>
      </div>

      <div class="form-group">
        <div class="input-with-icon">
          <i class="el-icon-lock"></i>
          <input
            type="password"
            placeholder="请输入密码"
            name="password"
            v-model="password"
            required
            class="custom-input"
          />
        </div>
      </div>

      <div class="form-group">
        <select name="role" v-model="role" required class="role-select">
          <option value="ADMIN">管理员</option>
          <option value="USER">普通用户</option>
          <option value="EXPERT">农业专家</option>
          <option value="BANK">金融机构</option>
        </select>
      </div>

      <div class="form-group">
        <div class="captcha-container">
          <Captcha v-model="realCaptcha" class="captcha-component" />
          <div class="input-with-icon">
            <i class="el-icon-key"></i>
            <input
              type="text"
              placeholder="请输入验证码"
              name="captcha"
              v-model="captcha"
              required
              class="custom-input"
            />
          </div>
        </div>
      </div>

      <button type="submit" class="login-btn">登 录</button>

      <div class="form-footer">
        <div class="register-link">
          还没有账号？
          <a @click.prevent="router.push('/user-register')">立即注册</a>
        </div>
      </div>

      <div class="error-message" v-if="message">
        {{ message }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Captcha from "@/components/Captcha.vue";
import { ElMessage } from "element-plus";
import { loginAPI } from "@/api/registerOrLogin.js";

const router = useRouter();

const message = ref("");
const userData = ref(null);
const account = ref("");
const password = ref("");
const captcha = ref("");
const realCaptcha = ref("");
const role = ref("USER");

const handleLogin = async (event) => {
  event.preventDefault();

  const account = event.target.account.value;
  const password = event.target.password.value;
  const selectedRole = role.value;
  const captcha = event.target.captcha.value;

  if (!captcha) {
    ElMessage.error("请输入验证码");
    return;
  }

  if (captcha !== realCaptcha.value) {
    ElMessage.error("验证码错误");
    event.target.captcha.value = "";
    return;
  }

  try {
    const response = await loginAPI(account, password, selectedRole);
    const reply = response.data;
    if (reply.code === 200) {
      localStorage.setItem("token", reply.results);
      ElMessage.success("登录成功");
      router.push("/home");
    } else if (reply.code === 500) {
      event.target.password.value = "";
      event.target.captcha.value = "";
      ElMessage.error(reply.results);
    } else {
      ElMessage.error("未知错误，请稍后再试");
    }
  } catch (error) {
    ElMessage.error("网络错误，请稍后再试");
  }
};
</script>

<style scoped lang="scss">
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(rgba(44, 119, 68, 0.1), rgba(44, 119, 68, 0.1)),
    url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1932') center/cover;
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

.login-form {
  width: 450px;
  padding: 40px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  box-shadow: 0 25px 50px rgba(92, 189, 122, 0.15), 0 10px 25px rgba(0, 0, 0, 0.05);
  transition: all 0.4s ease-in-out;
  z-index: 10;
  
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

.form-group {
  margin-bottom: 20px;
}

.input-with-icon {
  position: relative;
  
  i {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #5bbd7a;
    font-size: 18px;
    z-index: 1;
  }
}

.custom-input {
  width: 90%;
  height: 50px;
  padding: 15px 15px 15px 45px;
  border-radius: 10px;
  border: 1px solid #e0e6ed;
  font-size: 16px;
  color: #2c3e50;
  transition: all 0.3s;
  background-color: rgba(255, 255, 255, 0.9);
  
  &:hover {
    border-color: #a1c9a7;
  }
  
  &:focus {
    border-color: #5bbd7a;
    box-shadow: 0 0 0 2px rgba(92, 189, 122, 0.2);
    outline: none;
  }
  
  &::placeholder {
    color: #95a5a6;
  }
}

.role-select {
  width: 100%;
  height: 50px;
  padding: 0 15px 0 45px;
  border-radius: 10px;
  border: 1px solid #e0e6ed;
  font-size: 16px;
  color: #2c3e50;
  appearance: none;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='%235bbd7a'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E") no-repeat right 15px center/16px 16px;
  background-color: rgba(255, 255, 255, 0.9);
  transition: all 0.3s;
  
  &:hover {
    border-color: #a1c9a7;
  }
  
  &:focus {
    border-color: #5bbd7a;
    box-shadow: 0 0 0 2px rgba(92, 189, 122, 0.2);
    outline: none;
  }
}

.captcha-container {
  display: flex;
  align-items: center;
  gap: 10px;
  
  .captcha-component {
    flex: 1;
  }
  
  .input-with-icon {
    flex: 2;
  }
}

.login-btn {
  width: 100%;
  height: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 10px;
  border: none;
  background: linear-gradient(90deg, #2c7744, #5bbd7a);
  color: white;
  box-shadow: 0 8px 20px rgba(92, 189, 122, 0.3);
  transition: all 0.4s;
  margin-top: 10px;
  cursor: pointer;
  
  &:hover {
    background: linear-gradient(90deg, #245d36, #4aa066);
    transform: translateY(-3px);
    box-shadow: 0 12px 25px rgba(92, 189, 122, 0.4);
  }
  
  &:active {
    transform: translateY(1px);
  }
}

.form-footer {
  margin-top: 20px;
  text-align: center;
}

.register-link {
  color: #5a6c72;
  font-size: 0.95rem;
  
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

.error-message {
  color: #e74c3c;
  font-weight: 500;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 15px;
  padding: 10px;
  background-color: rgba(231, 76, 60, 0.1);
  border-radius: 5px;
}

@media (max-width: 768px) {
  .login-form {
    width: 90%;
    padding: 30px;
  }
  
  .form-header .logo-container h2 {
    font-size: 1.5rem;
  }
  
  .welcome-text h3 {
    font-size: 1.5rem;
  }
  
  .login-btn {
    height: 48px;
    font-size: 1rem;
  }
  
  .captcha-container {
    flex-direction: column;
    
    .captcha-component, .input-with-icon {
      width: 100%;
    }
  }
}
</style>