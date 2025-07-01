<template>
  <el-menu
    class="user-dashboard-menu"
    :default-active="activeIndex"
    background-color="#ffffff"
    text-color="#5a5a5a"
    active-text-color="#28a745"
  >
  
    <!-- 农产品管理 -->
    <el-sub-menu index="2">
      <template #title>
        <div class="menu-item-content">
          <el-icon class="menu-icon"><ShoppingCart /></el-icon>
          <span class="menu-text">农产品管理</span>
        </div>
      </template>
      <el-menu-item index="2-1" @click="router.push('/add-product')">
        <div class="submenu-item-content">发布商品</div>
      </el-menu-item>
      <el-menu-item index="2-2" @click="router.push('/product-manage')">
        <div class="submenu-item-content">商品管理</div>
      </el-menu-item>
    </el-sub-menu>

    <!-- 融资管理 -->
    <el-sub-menu index="3">
      <template #title>
        <div class="menu-item-content">
          <el-icon class="menu-icon"><Coin /></el-icon>
          <span class="menu-text">融资管理</span>
        </div>
      </template>
      <el-menu-item index="3-1" @click="router.push('/add-financing')">
        <div class="submenu-item-content">发起融资</div>
      </el-menu-item>
      <el-menu-item index="3-2" @click="router.push('/financing-list')">
        <div class="submenu-item-content">融资列表</div>
      </el-menu-item>
    </el-sub-menu>

    <!-- 知识内容管理 -->
    <el-sub-menu index="4">
      <template #title>
        <div class="menu-item-content">
          <el-icon class="menu-icon"><Notebook /></el-icon>
          <span class="menu-text">知识内容管理</span>
        </div>
      </template>
      <el-menu-item index="4-1" @click="router.push('/add-knowledge')">
        <div class="submenu-item-content">发布知识</div>
      </el-menu-item>
      <el-menu-item index="4-2" @click="router.push('/user-knowledge')">
        <div class="submenu-item-content">我的知识管理</div>
      </el-menu-item>
    </el-sub-menu>

    <!-- 专家指导 -->
    <el-menu-item index="5" @click="router.push('/expert-guide')">
      <div class="menu-item-content">
        <el-icon class="menu-icon"><Guide /></el-icon>
        <span class="menu-text">专家问答</span>
      </div>
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

<style scoped lang="scss">
@import "@/styles/variables.scss";

.user-dashboard-menu {
  width: 260px;
  min-height: 100vh;
  border-right: 1px solid #e8e8e8;
  padding: 20px 0;
  box-shadow: 2px 0 15px rgba(0, 0, 0, 0.03);
  background: linear-gradient(to bottom, #ffffff, #f9f9f9);
  
  .menu-item-content {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0 10px;
    
    .menu-icon {
      font-size: 18px;
      margin-right: 12px;
      color: $agriculture-secondary;
      transition: all 0.2s ease;
    }
    
    .menu-text {
      font-size: 15px;
      font-weight: 500;
      transition: all 0.2s ease;
    }
  }
  
  .submenu-item-content {
    padding-left: 40px;
    font-size: 14px;
    color: #666;
    transition: all 0.2s ease;
  }
  
  .el-menu-item, 
  :deep(.el-sub-menu__title) {
    height: 48px;
    line-height: 48px;
    margin: 4px 10px;
    border-radius: 8px;
    transition: all 0.2s ease;
    
    &:hover {
      background-color: rgba($agriculture-primary, 0.08) !important;
      
      .menu-icon {
        color: $agriculture-primary;
      }
      
      .menu-text, .submenu-item-content {
        color: $agriculture-primary;
      }
    }
  }
  
  .el-menu-item.is-active {
    background-color: rgba($agriculture-primary, 0.1) !important;
    
    .menu-icon {
      color: $agriculture-primary;
    }
    
    .menu-text, .submenu-item-content {
      color: $agriculture-primary;
      font-weight: 500;
    }
  }
  
  :deep(.el-sub-menu) {
    .el-menu {
      background-color: #f5f5f5 !important;
      padding: 5px 0;
      
      .el-menu-item {
        height: 42px;
        line-height: 42px;
        margin: 2px 10px;
        
        &:hover {
          background-color: rgba($agriculture-primary, 0.05) !important;
        }
        
        &.is-active {
          background-color: rgba($agriculture-primary, 0.08) !important;
        }
      }
    }
  }
}
</style>