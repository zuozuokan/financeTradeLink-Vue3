<template>
  <el-menu
    class="user-sidebar"
    background-color="#2c3e50"
    text-color="#ecf0f1"
    active-text-color="#ffd04b"
    :default-active="activeIndex"
  >
    
    <!-- 个人信息管理 -->
    <el-sub-menu index="1">
      <template #title>
        <el-icon><User /></el-icon>
        <span>个人信息管理</span>
      </template>
      <el-menu-item @click="router.push('/user-info-exchange')">修改个人信息</el-menu-item>
    </el-sub-menu>

    <!-- 农产品管理 -->
    <el-sub-menu index="2">
      <template #title>
        <el-icon><ShoppingCart /></el-icon>
        <span>农产品管理</span>
      </template>
      <el-menu-item @click="router.push('/add-product')">发布商品</el-menu-item>
      <el-menu-item @click="router.push('/product-manage')">商品管理</el-menu-item>
    </el-sub-menu>

    <!-- 融资管理 -->
    <el-sub-menu index="3">
      <template #title>
        <el-icon><Coin /></el-icon>
        <span>融资管理</span>
      </template>
      <el-menu-item @click="router.push('/add-financing')">发起融资</el-menu-item>
      <el-menu-item @click="router.push('/financing-list')">融资列表</el-menu-item>
    </el-sub-menu>

    <!-- 知识内容管理 -->
    <el-sub-menu index="4">
      <template #title>
        <el-icon><Notebook /></el-icon>
        <span>知识内容管理</span>
      </template>
      <el-menu-item @click="router.push('/add-knowledge')">发布知识</el-menu-item>
      <el-menu-item @click="router.push('/user-knowledge')">我的知识管理</el-menu-item>
    </el-sub-menu>

    <!-- 专家指导 -->
    <el-menu-item @click="router.push('/expert-guide')">
      <el-icon><Guide /></el-icon>
      <span>专家问答</span>
    </el-menu-item>
    
  </el-menu>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  User,
  ShoppingCart,
  Coin,
  Notebook,
  Guide,
} from '@element-plus/icons-vue';

const route = useRoute();
const router = useRouter();
const activeIndex = ref(route.path);
</script>

<style scoped>
.user-sidebar {
  width: 250px;
  min-height: 100vh;
  border-right: none;
  font-size: 15px;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.1);
  background: linear-gradient(to bottom, #2c3e50, #34495e);
  border-radius: 0 0 0 0;
  padding-top: 10px;
}

.el-menu-item span,
.el-sub-menu__title span {
  font-weight: 500;
}
</style>