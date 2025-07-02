<template>
  <el-menu
    class="expert-sidebar"
    background-color="#1e293b"
    text-color="#cbd5e1"
    active-text-color="#f97316"
    :default-active="activeIndex"
    router
  >
    <!-- 专家信息管理 -->
    <el-menu-item index="/expert-info">
      <template #title>
        <el-icon class="menu-icon"><Avatar /></el-icon>
        <span class="menu-text">专家信息管理</span>
      </template>
    </el-menu-item>

    <!-- 预约管理 -->
    <el-menu-item index="/expert-appointment">
      <template #title>
        <el-icon class="menu-icon"><Calendar /></el-icon>
        <span class="menu-text">预约管理</span>
      </template>
    </el-menu-item>
    
    <!-- 知识内容管理 -->
    <el-sub-menu index="/knowledge">
      <template #title>
        <el-icon class="menu-icon"><Notebook /></el-icon>
        <span class="menu-text">知识内容管理</span>
      </template>
      <el-menu-item index="/expert-add-knowledge">发布知识</el-menu-item>
      <el-menu-item index="/expert-knowledge-list">我的知识管理</el-menu-item>
    </el-sub-menu>

    <!-- 返回首页 -->
    <el-menu-item index="/home">
      <template #title>
        <el-icon class="menu-icon"><HomeFilled /></el-icon>
        <span class="menu-text">返回首页</span>
      </template>
    </el-menu-item>

    <!-- 退出登录 -->
    <el-menu-item index="logout" @click="logout">
      <template #title>
        <el-icon class="menu-icon"><SwitchButton /></el-icon>
        <span class="menu-text">退出登录</span>
      </template>
    </el-menu-item>
  </el-menu>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { 
  Notebook, 
  Avatar, 
  Calendar, 
  HomeFilled, 
  SwitchButton 
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const route = useRoute();
const router = useRouter();
const activeIndex = ref(route.path);

// 动态更新激活菜单项
watch(() => route.path, (newPath) => {
  activeIndex.value = newPath;
});

// 退出登录功能
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
.expert-sidebar {
  width: 240px;
  min-height: 100vh;
  border-right: none;
  font-size: 16px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
  border-radius: 0 12px 12px 0;
  padding: 24px 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.el-menu-item,
.el-sub-menu__title {
  height: 56px;
  line-height: 56px;
  margin: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.el-menu-item::before,
.el-sub-menu__title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 3px;
  height: 100%;
  background-color: #f97316;
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.el-menu-item:hover,
.el-sub-menu__title:hover {
  background-color: rgba(255, 255, 255, 0.05) !important;
  transform: translateX(4px);
}

.el-menu-item:hover::before,
.el-sub-menu__title:hover::before {
  transform: scaleY(1);
}

.el-menu-item.is-active {
  background: linear-gradient(90deg, rgba(249, 115, 22, 0.15) 0%, rgba(249, 115, 22, 0) 100%) !important;
  transform: translateX(4px);
  color: #f97316 !important;
}

.el-menu-item.is-active::before {
  transform: scaleY(1);
}

.menu-icon {
  margin-right: 12px;
  font-size: 18px;
  transition: all 0.3s ease;
  width: 24px;
  text-align: center;
}

.el-menu-item.is-active .menu-icon {
  transform: scale(1.2);
}

/* 子菜单样式 */
.el-sub-menu .el-menu {
  background-color: rgba(30, 41, 59, 0.8) !important;
  border-radius: 8px;
  margin: 4px 16px;
}

.el-sub-menu .el-menu-item {
  height: 48px;
  line-height: 48px;
  margin: 4px 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .expert-sidebar {
    width: 72px;
    padding: 16px 0;
  }
  
  .menu-text {
    display: none;
  }
  
  .menu-icon {
    margin-right: 0;
    font-size: 22px;
    width: auto;
  }
  
  .el-menu-item,
  .el-sub-menu__title {
    justify-content: center;
  }
  
  .el-sub-menu .el-menu {
    position: fixed !important;
    left: 72px !important;
    margin: 0;
    border-radius: 0 8px 8px 0;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
}
</style>    