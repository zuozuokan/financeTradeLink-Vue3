<template>
  <div class="login-container">
    <h2>登录</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-item">
        <label for="username">用户名：</label>
        <input v-model="username" id="username" placeholder="请输入用户名" required />
      </div>

      <div class="form-item">
        <label for="password">密码：</label>
        <input v-model="password" id="password" type="password" placeholder="请输入密码" required />
      </div>

      <button type="submit">登录</button>
    </form>

    <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
    <p v-if="successMsg" class="success-msg">{{ successMsg }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { loginAPI } from '@/api/registerOrLogin' // 确保路径正确

const username = ref('')
const password = ref('')
const errorMsg = ref('')
const successMsg = ref('')

const handleLogin = async () => {
  errorMsg.value = ''
  successMsg.value = ''
  try {
    const res = await loginAPI(username.value, password.value, 'USER')
    successMsg.value = '登录成功！'
    console.log('登录响应：', res)
    // 例如：保存token到localStorage
    // localStorage.setItem('token', res.token)
  } catch (error) {
    errorMsg.value = '登录失败，请检查用户名或密码'
    console.error('登录错误：', error)
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 24px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fafafa;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form-item {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 4px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #66b1ff;
}

.error-msg {
  color: red;
  text-align: center;
  margin-top: 12px;
}

.success-msg {
  color: green;
  text-align: center;
  margin-top: 12px;
}
</style>
