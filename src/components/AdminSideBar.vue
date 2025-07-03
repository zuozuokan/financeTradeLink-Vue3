<template>
    <el-menu
      :default-active="activeMenu"
      class="el-menu-vertical-demo"
      background-color="#2d3a4b"
      text-color="#fff"
      active-text-color="#ffd04b"
      router
    >
    <el-menu-item index="/admin-management/user">用户管理</el-menu-item>

      <el-sub-menu index="content">
        <template #title>内容管理</template>
        <el-menu-item index="/admin-management/knowledge">知识内容管理</el-menu-item>
        <el-menu-item index="/admin-management/notice">公告管理</el-menu-item>
      </el-sub-menu>
      <el-menu-item index="/admin-management/product">商品管理</el-menu-item>
      <el-menu-item index="/admin-management/financing">融资申请管理</el-menu-item>
      <el-menu-item index="/home">返回首页</el-menu-item>
      <el-menu-item index="logout" @click="logout">安全退出</el-menu-item>
      <!-- 可扩展更多菜单 -->
    </el-menu>
  </template>
  
  <script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { ElMessage } from 'element-plus';

const route = useRoute();
const router = useRouter();
const activeIndex = ref(route.path);

// 动态更新激活菜单项
watch(() => route.path, (newPath) => {
  activeIndex.value = newPath;
});
  const logout = () => {
  // 清除用户认证信息（根据实际项目调整）
  localStorage.removeItem('expertToken');
  sessionStorage.removeItem('expertSession');
  
  // 跳转到登录页
  router.push('/user-login');
  
  // 提示用户
  ElMessage.success('您已成功退出登录');
};
  </script>
  
  <style scoped>
  .el-menu-vertical-demo {
    border-right: none;
    min-height: 100vh;
  }
  </style>
  