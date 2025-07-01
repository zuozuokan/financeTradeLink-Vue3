<template>
  <el-container style="height: 100vh;">
    <!-- 侧边栏 -->
    <el-aside width="220px" style="background: #2d3a4b;">
      <div class="logo">后台管理</div>
      <AdminSideBar />
    </el-aside>
    <!-- 主内容区 -->
    <el-container>
      <el-header style="background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.04);">
        <span style="font-size: 18px; font-weight: bold;">管理员后台</span>
      </el-header>
      <el-main style="background: #f5f6fa;">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import AdminSideBar from '@/components/AdminSideBar.vue';
</script>

<style scoped>
.logo {
  color: #fff;
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  padding: 32px 0 24px 0;
  letter-spacing: 2px;
}
</style>
