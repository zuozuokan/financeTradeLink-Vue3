<template>
  <div class="register-container">
    <el-form
      :model="form"
      :rules="rules"
      ref="registerFormRef"
      label-position="top"
      class="register-form"
    >
      <h2>用户注册</h2>

      <el-form-item label="用户名" prop="userUserName">
        <el-input v-model="form.userUserName" placeholder="请输入用户名" />
      </el-form-item>

      <el-form-item label="密码" prop="userPassword">
        <el-input
          v-model="form.userPassword"
          type="password"
          placeholder="请输入密码"
          show-password
        />
      </el-form-item>

      <el-form-item label="姓名">
        <el-input v-model="form.userName" placeholder="请输入姓名（可选）" />
      </el-form-item>

      <el-form-item label="手机号">
        <el-input
          v-model="form.userPhone"
          placeholder="请输入手机号（可选）"
          maxlength="11"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleRegister" class="submit-btn"
          >注册</el-button
        >
      </el-form-item>

      <div class="login-link">
        已有账号？
        <a @click.prevent="router.push('/user-login')">立即登录</a>
      </div>
    </el-form>
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

<style scoped>
.register-container {
  background-image: url("@/assets/images/register-background.jpg");
  background-size: cover;
  background-position: center;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(6px);
  padding: 20px;
}

.register-form {
  width: 450px;
  height: auto;
  padding: 40px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15), 0 6px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease-in-out;
}

.register-form:hover {
  transform: translateY(-4px);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2), 0 10px 30px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 25px;
  position: relative;
}

h2::after {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: linear-gradient(to right, #3498db, #2ecc71);
  border-radius: 2px;
}

.el-form-item__label {
  font-weight: 600;
  color: #34495e;
}

.submit-btn {
  width: 100%;
  background: linear-gradient(135deg, #3498db, #2ecc71);
  border: none;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  background: linear-gradient(135deg, #2980b9, #27ae60);
  transform: translateY(-2px);
}

.login-link {
  text-align: center;
  margin-top: 18px;
  font-size: 14px;
  color: #7f8c8d;
}

.login-link a {
  color: #3498db;
  margin-left: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.3s ease;
}

.login-link a:hover {
  color: #2980b9;
  text-decoration: underline;
}

@media (max-width: 550px) {
  .register-form {
    width: 90%;
    padding: 30px;
  }

  h2 {
    font-size: 24px;
  }

  .submit-btn {
    font-size: 15px;
  }
}
</style>
