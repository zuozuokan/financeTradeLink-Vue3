<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Captcha from "@/components/Captcha.vue"; // 引入验证码组件
import { ElMessage } from "element-plus";
import { loginAPI } from "@/api/registerOrLogin.js";

const router = useRouter();

// 响应状态
const message = ref("");
const userData = ref(null); // 用于保存用户信息

// 表单数据
const account = ref("");
const password = ref("");
const captcha = ref("");
const realCaptcha = ref("");
const role = ref("USER"); // 默认选中普通用户

// 处理登录
const handleLogin = async (event) => {
  event.preventDefault(); // 防止表单默认提交行为

  // 获取表单输入的账户和密码
  const account = event.target.account.value;
  const password = event.target.password.value;
  const selectedRole = role.value;
  const captcha = event.target.captcha.value;

  // 校验验证码是否正确，假设验证码是必填的且不为空
  if (!captcha) {
    ElMessage.error("请输入验证码");
    return;
  }

  // 校验验证码是否正确
  if (captcha !== realCaptcha.value) {
    ElMessage.error("验证码错误");
    event.target.captcha.value = ""; // 清空验证码输入框

    return;
  }

  try {
    // 向后端发送登录请求
    const response = await loginAPI(account, password, selectedRole);
    // 处理响应
    const reply = response.data;
    if (reply.code === 200) {
      // 登录成功时，保存 token到localStorage
      localStorage.setItem("token", reply.results);
      ElMessage.success("登录成功");

      // 登录成功，跳转到首页
      router.push("/home");
    } else if (reply.code === 500) {
      event.target.password.value = "";
      event.target.captcha.value = ""; // 清空验证码输入框
      ElMessage.error(reply.results);
    } else {
      // 登录失败，显示错误信息
      ElMessage.value("未知错误，请稍后再试");
    }
  } catch (error) {
    ElMessage.value("网络错误，请稍后再试");
  }
};
</script>

<template>
  <div id="container">
    <form @submit="handleLogin">
      <div class="container">
        <div class="box">
          <h2>登录</h2>
          <input
            type="text"
            placeholder="Username"
            name="account"
            v-model="account"
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            v-model="password"
            required
          />

          <select name="role" v-model="role" required class="role-select">
            <option value="ADMIN">管理员</option>
            <option value="USER">普通用户</option>
            <option value="EXPERT">专家</option>
            <option value="BANK">银行</option>
          </select>

          <!-- 验证码输入框 -->
          <div class="captcha-container">
            <Captcha v-model="realCaptcha" />
            <!-- 使用v-model绑定 realCaptcha -->
            <input
              type="text"
              placeholder="Enter Captcha"
              name="captcha"
              v-model="captcha"
              required
            />
          </div>

          <button class="log" type="submit">登录</button>

          <div class="register">
            没有账号？
            <a @click.prevent="router.push('/user-register')">立即注册</a>
          </div>

          <br />
          <!-- 错误提示信息 -->
          <div
            id="message"
            v-if="message"
            style="
              color: red;
              font-weight: bold;
              font-size: 20px;
              text-align: center;
            "
          >
            {{ message }}
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* 背景设置 */
#container {
  background-image: url("../assets/images/login_background.jpg");
  background-size: cover;
  background-position: center;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; /* 禁止滚动 */
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Segoe UI", "Microsoft YaHei", sans-serif;
}

body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%);
  padding: 20px;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 420px;
  padding: 40px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 15px 35px rgba(50, 100, 150, 0.15),
    0 5px 15px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.box:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(50, 100, 150, 0.2),
    0 8px 20px rgba(0, 0, 0, 0.08);
}


h2 {
  font-size: 32px;
  color: #2c3e50;
  margin-bottom: 30px;
  font-weight: 700;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.05);
  position: relative;
  padding-bottom: 10px;
}

h2::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: linear-gradient(to right, #3498db, #2ecc71);
  border-radius: 2px;
}

.box input {
  width: 100%;
  padding: 16px 20px;
  margin: 12px 0;
  border-radius: 12px;
  border: 1px solid rgba(200, 200, 200, 0.4);
  font-size: 16px;
  background-color: rgba(245, 248, 250, 0.8);
  color: #34495e;
  box-sizing: border-box;
  transition: all 0.3s ease-in-out;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.03);
}

.box input::placeholder {
  color: #95a5a6;
}

.box input:focus {
  border-color: #3498db;
  outline: none;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

.log {
  width: 100%;
  padding: 16px;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #3498db, #2ecc71);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 6px 15px rgba(52, 152, 219, 0.3);
  transition: all 0.3s ease;
  margin-top: 10px;
}

.log:hover {
  background: linear-gradient(135deg, #2980b9, #27ae60);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(52, 152, 219, 0.4);
}

.log:active {
  transform: translateY(0);
  box-shadow: 0 4px 10px rgba(52, 152, 219, 0.3);
}

.admin-log {
  width: 100%;
  padding: 16px;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #9b59b6, #e74c3c);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  margin-top: 15px;
  box-shadow: 0 6px 15px rgba(155, 89, 182, 0.3);
  transition: all 0.3s ease;
}

.admin-log:hover {
  background: linear-gradient(135deg, #8e44ad, #c0392b);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(155, 89, 182, 0.4);
}

.admin-log:active {
  transform: translateY(0);
  box-shadow: 0 4px 10px rgba(155, 89, 182, 0.3);
}

.captcha-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 15px 0;
}

.captcha-container input {
  width: 80%;
  padding: 20px;
  margin: 10px;
  background: rgba(245, 248, 250, 0.8);
  border-radius: 12px;
  color: #34495e;
  border: 1px solid rgba(200, 200, 200, 0.4);
}

.captcha-container input:focus {
  border-color: #3498db;
}

.captcha-img {
  width: 25%;
  height: 50px;
  background: linear-gradient(135deg, #3498db, #2ecc71);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  font-size: 20px;
  letter-spacing: 3px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease;
}

.captcha-img:hover {
  transform: scale(1.05);
}

.options {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 15px 0;
}

.remember {
  display: flex;
  align-items: center;
}

.remember input {
  margin-right: 8px;
}

.forgot {
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.forgot:hover {
  color: #2980b9;
  text-decoration: underline;
}

.divider {
  width: 100%;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    rgba(200, 200, 200, 0.5),
    transparent
  );
  margin: 20px 0;
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 20px;
  width: 100%;
  margin-top: 15px;
}

.social-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
}

.social-btn:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.social-btn i {
  font-size: 24px;
}

.facebook {
  color: #3b5998;
}
.google {
  color: #dd4b39;
}
.twitter {
  color: #1da1f2;
}

.register {
  margin-top: 20px;
  color: #7f8c8d;
  font-size: 15px;
}

.register a {
  color: #3498db;
  text-decoration: none;
  font-weight: 600;
  margin-left: 5px;
  transition: color 0.3s ease;
}

.register a:hover {
  color: #2980b9;
  text-decoration: underline;
}

.role-select {
  width: 100%;
  padding: 16px 20px;
  margin: 12px 0;
  border-radius: 12px;
  border: 1px solid rgba(200, 200, 200, 0.4);
  font-size: 16px;
  background-color: rgba(245, 248, 250, 0.8);
  color: #34495e;
  box-sizing: border-box;
  transition: all 0.3s ease-in-out;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.03);
}

.role-select:focus {
  border-color: #3498db;
  outline: none;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

.register {
  margin-top: 20px;
  color: #7f8c8d;
  font-size: 15px;
  text-align: center;
}

.register a {
  color: #3498db;
  text-decoration: none;
  font-weight: 600;
  margin-left: 5px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.register a:hover {
  color: #2980b9;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .box {
    width: 90%;
    padding: 30px;
  }

  h2 {
    font-size: 28px;
  }

  .log,
  .admin-log {
    font-size: 16px;
    padding: 14px;
  }

  .captcha-container input {
    width: 55%;
  }
}
</style>

