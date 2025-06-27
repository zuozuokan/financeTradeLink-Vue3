<template>
  <el-menu
    class="user-sidebar"
    background-color="#2c3e50"
    text-color="#ecf0f1"
    active-text-color="#ffd04b"
    :default-active="activeIndex"
    router
  >
    <!-- 专家指导 -->
    <el-menu-item index="/user/expert-guide">
      <el-icon><Guide /></el-icon>
      <span>专家指导</span>
    </el-menu-item>

    <!-- 个人信息管理 -->
    <el-sub-menu index="1">
      <template #title>
        <el-icon><User /></el-icon>
        <span>个人信息管理</span>
      </template>
      <el-menu-item index="/user/profile/password">修改密码</el-menu-item>
      <el-menu-item index="/user/profile/contact">更新联系方式</el-menu-item>
      <el-menu-item index="/user/profile/nickname">修改昵称</el-menu-item>
      <el-menu-item index="/user/profile/address">添加收货方式</el-menu-item>
    </el-sub-menu>

    <!-- 农产品管理 -->
    <el-sub-menu index="2">
      <template #title>
        <el-icon><ShoppingCart /></el-icon>
        <span>农产品管理</span>
      </template>
      <el-menu-item index="/user/product/publish">发布商品</el-menu-item>
      <el-menu-item index="/user/product/unpublish">下架商品</el-menu-item>
      <el-menu-item index="/user/product/list">商品列表</el-menu-item>
      <el-menu-item index="/user/product/detail">商品详情</el-menu-item>
      <el-menu-item index="/user/product/edit">编辑商品</el-menu-item>
    </el-sub-menu>

    <!-- 融资管理 -->
    <el-sub-menu index="3">
      <template #title>
        <el-icon><Coin /></el-icon>
        <span>融资管理</span>
      </template>
      <el-menu-item index="/user/finance/apply">发起融资</el-menu-item>
      <el-menu-item index="/user/finance/update">更新申请</el-menu-item>
      <el-menu-item index="/user/finance/detail">融资详情</el-menu-item>
    </el-sub-menu>

    <!-- 知识内容管理 -->
    <el-sub-menu index="4">
      <template #title>
        <el-icon><Notebook /></el-icon>
        <span>知识内容管理</span>
      </template>
      <el-menu-item index="/user/knowledge/publish">发布知识</el-menu-item>
      <el-menu-item index="/user/knowledge/list">我的知识</el-menu-item>
      <el-menu-item index="/user/knowledge/delete">删除知识</el-menu-item>
      <el-menu-item index="/user/knowledge/update">更新知识</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import {
  User,
  ShoppingCart,
  Coin,
  Notebook,
  Guide,
} from '@element-plus/icons-vue';

const route = useRoute();
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
  border-radius: 0 12px 12px 0;
  padding-top: 10px;
}

.el-menu-item span,
.el-sub-menu__title span {
  font-weight: 500;
}
</style>
