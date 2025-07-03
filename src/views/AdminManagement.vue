<template>
  <el-container style="height: 100vh; background: linear-gradient(135deg, #e0e7ef 0%, #f5f6fa 100%);">
    <!-- 侧边栏 -->
    <el-aside width="240px" class="admin-aside">
      <div class="logo">后台管理</div>
      <AdminSideBar />
    </el-aside>
    <!-- 主内容区 -->
    <el-container>
      <el-header class="admin-header">
        <span class="admin-title">管理员后台</span>
      </el-header>
      <el-main class="admin-main">
        <div class="admin-main-card">
          <router-view />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import AdminSideBar from '@/components/AdminSideBar.vue';
</script>

<style scoped>
.admin-aside {
  background: linear-gradient(160deg, #2d3a4b 60%, #3e4a5e 100%);
  box-shadow: 2px 0 2px rgba(44,62,80,0.08);
  display: flex;
  flex-direction: column;
}
.logo {
  color: #fff;
  font-size: 28px;
  font-weight: 900;
  text-align: center;
  padding: 40px 0 32px 0;
  letter-spacing: 4px;
  text-shadow: 0 4px 16px rgba(0,0,0,0.12), 0 1px 0 #fff2;
  border-bottom: 1.5px solid rgba(255,255,255,0.08);
  margin-bottom: 18px;
}
.admin-header {
  background: #fff;
  box-shadow: 0 2px 12px rgba(44,62,80,0.06);
  display: flex;
  align-items: center;
  height: 64px;
  padding: 0 32px;
}
.admin-title {
  font-size: 22px;
  font-weight: 700;
  color: #2d3a4b;
  letter-spacing: 2px;
}
.admin-main {
  background: transparent;
  min-height: 0;
  padding: 20px 0 0 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.admin-main-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(44,62,80,0.10);
  padding: 10px;
  min-width: 900px;
  min-height: 600px;
  margin-bottom: 32px;
}
@media (max-width: 1200px) {
  .admin-main-card {
    min-width: 0;
    width: 100%;
    padding: 18px 8px;
  }
  .admin-main {
    padding: 12px 0 0 0;
  }
}
</style>
