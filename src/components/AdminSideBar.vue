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
      <!-- 可扩展更多菜单 -->
    </el-menu>
  </template>
  
  <script setup>
  import { useRoute } from 'vue-router';
  import { computed } from 'vue';
  
  const route = useRoute();
  const activeMenu = computed(() => route.path);
  </script>
  
  <style scoped>
  .el-menu-vertical-demo {
    border-right: none;
    min-height: 100vh;
  }
  </style>
  