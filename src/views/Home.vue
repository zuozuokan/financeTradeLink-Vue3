<template>
  <h1>欢迎来到首页</h1>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { jwtDecode } from "jwt-decode";
import { userGetCurrentInfoAPI } from "@/api/user";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import SideBar from "@/components/SideBar.vue"; // 引入侧边栏组件


const router = useRouter();
const currentUserInfo = ref("");
// 获取浏览器存储的token值
const token = localStorage.getItem("token");

if (token) {
  const payload = jwtDecode(token);
  const uuid = payload.uuid;
  const role = payload.role;

  onMounted(async () => {
    const res = await userGetCurrentInfoAPI(uuid);
    currentUserInfo.value = res;
  });
} else {
  ElMessage.error("服务器错误,请稍后再试");
  router.push("/");
}
</script>

<style scoped>
</style>